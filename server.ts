import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Preconfigured Stripe checkout URLs for Santa visits in Calvià
const DEFAULT_STRIPE_PAYMENT_LINKS: Record<string, string> = {
  'elfo-6dic': 'https://buy.stripe.com/test_4gMfZjefM2Oj4xC6zda7C02',
  'santa-elfo-20-22': 'https://buy.stripe.com/test_eVq5kF5Jg4Wrc04cXBa7C03',
  'santa-elfo-23': 'https://buy.stripe.com/test_6oU00l5Jg88D1lq4r5a7C04',
  'santa-elfo-24': 'https://buy.stripe.com/test_dRm6oJ2x40Gbd48g9Na7C05',
};

// Optional Price IDs mapping from environment variables
const STRIPE_PRICE_IDS: Record<string, string | undefined> = {
  'elfo-6dic': process.env.STRIPE_PRICE_ID_DEC6 || process.env.STRIPE_PRICE_ID,
  'santa-elfo-20-22': process.env.STRIPE_PRICE_ID_DEC20_22 || process.env.STRIPE_PRICE_ID,
  'santa-elfo-23': process.env.STRIPE_PRICE_ID_DEC23 || process.env.STRIPE_PRICE_ID,
  'santa-elfo-24': process.env.STRIPE_PRICE_ID_DEC24 || process.env.STRIPE_PRICE_ID,
};

/**
 * POST /api/create-checkout-session
 * Activates Stripe Checkout Sessions via:
 * curl https://api.stripe.com/v1/checkout/sessions \
 *   -u {{SECRET_KEY}}: \
 *   -H "Stripe-Version: 2025-03-31.basil" \
 *   -d "line_items[0][price]"="{{PRICE_ID}}" \
 *   -d "line_items[0][quantity]"=1 \
 *   -d "managed_payments[enabled]"=true \
 *   -d mode=subscription \
 *   --data-urlencode success_url="..." \
 *   --data-urlencode cancel_url="..."
 */
app.post('/api/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const {
      packageId,
      bookingCode,
      customerEmail,
      customerName,
      dateKey,
      dayLabel,
      amount,
      mode: requestedMode,
      priceId: requestedPriceId,
    } = req.body;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
    const fallbackUrl =
      DEFAULT_STRIPE_PAYMENT_LINKS[packageId] ||
      DEFAULT_STRIPE_PAYMENT_LINKS['santa-elfo-20-22'];

    // If Stripe secret key is not set or is a placeholder, fallback to direct Stripe Payment Link
    if (!stripeSecretKey || stripeSecretKey.includes('{{') || stripeSecretKey.length < 10) {
      return res.json({
        url: fallbackUrl,
        isFallback: true,
        message: 'Using configured Stripe checkout link (Stripe Secret Key not yet set in environment)',
      });
    }

    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;

    const successUrl = `${baseUrl}/?payment=success&code=${encodeURIComponent(bookingCode || 'SANTA')}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/?payment=cancelled`;

    const targetPriceId = requestedPriceId || STRIPE_PRICE_IDS[packageId];
    const mode = requestedMode || process.env.STRIPE_CHECKOUT_MODE || 'payment';

    const buildParams = (includeManagedPayments = true) => {
      const p = new URLSearchParams();
      if (includeManagedPayments) {
        p.append('managed_payments[enabled]', 'true');
      }
      p.append('mode', mode);
      p.append('success_url', successUrl);
      p.append('cancel_url', cancelUrl);
      p.append('line_items[0][quantity]', '1');

      if (targetPriceId) {
        p.append('line_items[0][price]', targetPriceId);
      } else {
        const unitAmountInCents = Math.round((Number(amount) || 79) * 100);
        p.append('line_items[0][price_data][currency]', 'eur');
        p.append('line_items[0][price_data][unit_amount]', String(unitAmountInCents));
        p.append(
          'line_items[0][price_data][product_data][name]',
          `Visita de Santa y su Elfo (${dayLabel || 'Calvià'})`
        );
        p.append(
          'line_items[0][price_data][product_data][description]',
          `Visita privada a domicilio en Calvià & Andratx. Reserva: ${bookingCode || ''}`
        );
      }

      if (customerEmail && customerEmail.includes('@')) {
        p.append('customer_email', customerEmail);
      }

      if (bookingCode) {
        p.append('client_reference_id', bookingCode);
        p.append('metadata[booking_code]', bookingCode);
        p.append('metadata[date_key]', String(dateKey || ''));
        p.append('metadata[package_id]', String(packageId || ''));
        p.append('metadata[customer_name]', String(customerName || ''));
      }

      return p;
    };

    // Official Stripe API call using the exact Stripe Basil version
    let stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${stripeSecretKey}:`).toString('base64')}`,
        'Stripe-Version': '2025-03-31.basil',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: buildParams(true).toString(),
    });

    let sessionData = await stripeResponse.json();

    // If managed_payments is rejected due to product tax code or account eligibility, retry without it
    if (!stripeResponse.ok && sessionData.error?.message?.includes('managed-payments')) {
      console.log('Managed payments requirement encountered, retrying with standard checkout session...');
      stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${stripeSecretKey}:`).toString('base64')}`,
          'Stripe-Version': '2025-03-31.basil',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: buildParams(false).toString(),
      });
      sessionData = await stripeResponse.json();
    }

    if (!stripeResponse.ok || !sessionData.url) {
      console.warn('Stripe checkout session API returned error, falling back to Stripe payment link:', sessionData);
      return res.json({
        url: fallbackUrl,
        isFallback: true,
        stripeError: sessionData.error?.message,
      });
    }

    return res.json({
      url: sessionData.url,
      sessionId: sessionData.id,
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Error handling checkout session creation:', error);
    const fallbackUrl =
      DEFAULT_STRIPE_PAYMENT_LINKS[req.body?.packageId] ||
      DEFAULT_STRIPE_PAYMENT_LINKS['santa-elfo-20-22'];
    return res.json({
      url: fallbackUrl,
      isFallback: true,
      error: error?.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('{{')),
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
