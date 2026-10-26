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

/**
 * Utility to sanitize environment variables and inputs (strips quotes, whitespace)
 */
function cleanStr(val: unknown): string {
  if (typeof val !== 'string') return '';
  return val.replace(/^["']|["']$/g, '').trim();
}

const STRIPE_SECRET_KEY = cleanStr(process.env.STRIPE_SECRET_KEY);
const STRIPE_CHECKOUT_MODE = cleanStr(process.env.STRIPE_CHECKOUT_MODE).toLowerCase() || 'payment';

// Direct Stripe Payment Links (used as backup if needed)
const DEFAULT_STRIPE_PAYMENT_LINKS: Record<string, string> = {
  'elfo-6dic': 'https://buy.stripe.com/test_4gMfZjefM2Oj4xC6zda7C02',
  'pkg-dec-6': 'https://buy.stripe.com/test_4gMfZjefM2Oj4xC6zda7C02',
  'date-6-dec': 'https://buy.stripe.com/test_4gMfZjefM2Oj4xC6zda7C02',
  '2026-12-06': 'https://buy.stripe.com/test_4gMfZjefM2Oj4xC6zda7C02',

  'santa-elfo-20-22': 'https://buy.stripe.com/test_eVq5kF5Jg4Wrc04cXBa7C03',
  'pkg-dec-20-22': 'https://buy.stripe.com/test_eVq5kF5Jg4Wrc04cXBa7C03',
  'date-20-dec': 'https://buy.stripe.com/test_eVq5kF5Jg4Wrc04cXBa7C03',
  'date-21-dec': 'https://buy.stripe.com/test_eVq5kF5Jg4Wrc04cXBa7C03',
  'date-22-dec': 'https://buy.stripe.com/test_eVq5kF5Jg4Wrc04cXBa7C03',
  '2026-12-20': 'https://buy.stripe.com/test_eVq5kF5Jg4Wrc04cXBa7C03',
  '2026-12-21': 'https://buy.stripe.com/test_eVq5kF5Jg4Wrc04cXBa7C03',
  '2026-12-22': 'https://buy.stripe.com/test_eVq5kF5Jg4Wrc04cXBa7C03',

  'santa-elfo-23': 'https://buy.stripe.com/test_6oU00l5Jg88D1lq4r5a7C04',
  'pkg-dec-23': 'https://buy.stripe.com/test_6oU00l5Jg88D1lq4r5a7C04',
  'date-23-dec': 'https://buy.stripe.com/test_6oU00l5Jg88D1lq4r5a7C04',
  '2026-12-23': 'https://buy.stripe.com/test_6oU00l5Jg88D1lq4r5a7C04',

  'santa-elfo-24': 'https://buy.stripe.com/test_dRm6oJ2x40Gbd48g9Na7C05',
  'pkg-dec-24': 'https://buy.stripe.com/test_dRm6oJ2x40Gbd48g9Na7C05',
  'date-24-dec': 'https://buy.stripe.com/test_dRm6oJ2x40Gbd48g9Na7C05',
  '2026-12-24': 'https://buy.stripe.com/test_dRm6oJ2x40Gbd48g9Na7C05',
};

// Price IDs verified in user's Stripe Account (acct_1UUYs3ATdLCeEq1p)
const STRIPE_PRICE_IDS: Record<string, string> = {
  'elfo-6dic': cleanStr(process.env.STRIPE_PRICE_ID_DEC6) || 'price_1UUvbNATdLCeEq1pUOUQzBu0',
  'pkg-dec-6': cleanStr(process.env.STRIPE_PRICE_ID_DEC6) || 'price_1UUvbNATdLCeEq1pUOUQzBu0',
  'date-6-dec': cleanStr(process.env.STRIPE_PRICE_ID_DEC6) || 'price_1UUvbNATdLCeEq1pUOUQzBu0',
  '2026-12-06': cleanStr(process.env.STRIPE_PRICE_ID_DEC6) || 'price_1UUvbNATdLCeEq1pUOUQzBu0',

  'santa-elfo-20-22': cleanStr(process.env.STRIPE_PRICE_ID_DEC20_22) || 'price_1UUvbNATdLCeEq1pFqt3jgko',
  'pkg-dec-20-22': cleanStr(process.env.STRIPE_PRICE_ID_DEC20_22) || 'price_1UUvbNATdLCeEq1pFqt3jgko',
  'date-20-dec': cleanStr(process.env.STRIPE_PRICE_ID_DEC20_22) || 'price_1UUvbNATdLCeEq1pFqt3jgko',
  'date-21-dec': cleanStr(process.env.STRIPE_PRICE_ID_DEC20_22) || 'price_1UUvbNATdLCeEq1pFqt3jgko',
  'date-22-dec': cleanStr(process.env.STRIPE_PRICE_ID_DEC20_22) || 'price_1UUvbNATdLCeEq1pFqt3jgko',
  '2026-12-20': cleanStr(process.env.STRIPE_PRICE_ID_DEC20_22) || 'price_1UUvbNATdLCeEq1pFqt3jgko',
  '2026-12-21': cleanStr(process.env.STRIPE_PRICE_ID_DEC20_22) || 'price_1UUvbNATdLCeEq1pFqt3jgko',
  '2026-12-22': cleanStr(process.env.STRIPE_PRICE_ID_DEC20_22) || 'price_1UUvbNATdLCeEq1pFqt3jgko',

  'santa-elfo-23': cleanStr(process.env.STRIPE_PRICE_ID_DEC23) || 'price_1UUvbOATdLCeEq1pANdtkNef',
  'pkg-dec-23': cleanStr(process.env.STRIPE_PRICE_ID_DEC23) || 'price_1UUvbOATdLCeEq1pANdtkNef',
  'date-23-dec': cleanStr(process.env.STRIPE_PRICE_ID_DEC23) || 'price_1UUvbOATdLCeEq1pANdtkNef',
  '2026-12-23': cleanStr(process.env.STRIPE_PRICE_ID_DEC23) || 'price_1UUvbOATdLCeEq1pANdtkNef',

  'santa-elfo-24': cleanStr(process.env.STRIPE_PRICE_ID_DEC24) || 'price_1UUvbOATdLCeEq1pU8pAmf81',
  'pkg-dec-24': cleanStr(process.env.STRIPE_PRICE_ID_DEC24) || 'price_1UUvbOATdLCeEq1pU8pAmf81',
  'date-24-dec': cleanStr(process.env.STRIPE_PRICE_ID_DEC24) || 'price_1UUvbOATdLCeEq1pU8pAmf81',
  '2026-12-24': cleanStr(process.env.STRIPE_PRICE_ID_DEC24) || 'price_1UUvbOATdLCeEq1pU8pAmf81',
};

/**
 * Helper to call Stripe Checkout Sessions API
 */
async function createStripeSession({
  secretKey,
  priceId,
  unitAmountInEur,
  productName,
  productDescription,
  successUrl,
  cancelUrl,
  customerEmail,
  metadata = {},
  enableManagedPayments = true,
}: {
  secretKey: string;
  priceId?: string;
  unitAmountInEur?: number;
  productName?: string;
  productDescription?: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
  enableManagedPayments?: boolean;
}) {
  const p = new URLSearchParams();
  if (enableManagedPayments) {
    p.append('managed_payments[enabled]', 'true');
  }
  p.append('mode', 'payment');
  p.append('success_url', successUrl);
  p.append('cancel_url', cancelUrl);
  p.append('line_items[0][quantity]', '1');

  if (priceId) {
    p.append('line_items[0][price]', priceId);
  } else {
    const cents = Math.round((Number(unitAmountInEur) || 79) * 100);
    p.append('line_items[0][price_data][currency]', 'eur');
    p.append('line_items[0][price_data][unit_amount]', String(cents));
    p.append('line_items[0][price_data][product_data][name]', productName || 'Visita Papá Noel Calvià');
    p.append('line_items[0][price_data][product_data][description]', productDescription || 'Visita a domicilio');
  }

  if (customerEmail && customerEmail.includes('@') && !customerEmail.includes('ejemplo.com')) {
    p.append('customer_email', customerEmail);
  }

  for (const [key, val] of Object.entries(metadata)) {
    if (val) p.append(`metadata[${key}]`, String(val));
  }

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
      'Stripe-Version': '2025-03-31.basil',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: p.toString(),
  });

  const data = await response.json();
  return { response, data };
}

/**
 * POST /api/create-checkout-session
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
      priceId: requestedPriceId,
    } = req.body;

    const key = cleanStr(STRIPE_SECRET_KEY);
    const fallbackUrl =
      DEFAULT_STRIPE_PAYMENT_LINKS[packageId] ||
      DEFAULT_STRIPE_PAYMENT_LINKS[dateKey] ||
      DEFAULT_STRIPE_PAYMENT_LINKS['santa-elfo-20-22'];

    if (!key || key.length < 10 || key.includes('{{')) {
      return res.json({
        url: fallbackUrl,
        isFallback: true,
        message: 'Stripe Secret Key not configured in environment',
      });
    }

    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const baseUrl = cleanStr(process.env.APP_URL) || `${protocol}://${host}`;

    const successUrl = `${baseUrl}/?payment=success&code=${encodeURIComponent(bookingCode || 'SANTA')}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/?payment=cancelled`;

    // Resolve price ID by requested ID, or packageId, or dateKey
    const targetPriceId =
      cleanStr(requestedPriceId) ||
      STRIPE_PRICE_IDS[packageId] ||
      STRIPE_PRICE_IDS[dateKey] ||
      'price_1UUvbNATdLCeEq1pFqt3jgko';

    const meta = {
      booking_code: cleanStr(bookingCode) || 'SANTA',
      date_key: cleanStr(dateKey),
      package_id: cleanStr(packageId),
      customer_name: cleanStr(customerName),
    };

    // First attempt: with managed_payments[enabled]=true
    let { response, data } = await createStripeSession({
      secretKey: key,
      priceId: targetPriceId,
      unitAmountInEur: amount,
      productName: `Visita de Santa y su Elfo (${dayLabel || 'Calvià'})`,
      productDescription: `Visita a domicilio en Calvià & Andratx. Reserva: ${bookingCode || ''}`,
      successUrl,
      cancelUrl,
      customerEmail: cleanStr(customerEmail),
      metadata: meta,
      enableManagedPayments: true,
    });

    // If managed_payments is rejected for any reason, retry without it
    if (!response.ok && data.error?.message?.includes('managed-payments')) {
      console.log('Managed payments retry without flag...');
      const retryResult = await createStripeSession({
        secretKey: key,
        priceId: targetPriceId,
        unitAmountInEur: amount,
        productName: `Visita de Santa y su Elfo (${dayLabel || 'Calvià'})`,
        productDescription: `Visita a domicilio en Calvià & Andratx. Reserva: ${bookingCode || ''}`,
        successUrl,
        cancelUrl,
        customerEmail: cleanStr(customerEmail),
        metadata: meta,
        enableManagedPayments: false,
      });
      response = retryResult.response;
      data = retryResult.data;
    }

    if (!response.ok || !data.url) {
      console.warn('Stripe checkout session creation failed, using verified fallback link:', data);
      return res.json({
        url: fallbackUrl,
        isFallback: true,
        stripeError: data.error?.message || 'Error creating checkout session',
      });
    }

    return res.json({
      url: data.url,
      sessionId: data.id,
      isFallback: false,
      amountTotal: data.amount_total,
      currency: data.currency,
      status: 'success',
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

/**
 * Diagnostic & self-check endpoint
 * Tests all configured price IDs and Stripe connection
 */
app.get('/api/check-stripe', async (_req: Request, res: Response) => {
  const key = cleanStr(STRIPE_SECRET_KEY);
  if (!key) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY not set' });
  }

  const testDates = [
    { name: '6 de Diciembre (79€)', pkgId: 'elfo-6dic', priceId: 'price_1UUvbNATdLCeEq1pUOUQzBu0' },
    { name: '20, 21, 22 de Diciembre (79€)', pkgId: 'santa-elfo-20-22', priceId: 'price_1UUvbNATdLCeEq1pFqt3jgko' },
    { name: '23 de Diciembre (89€)', pkgId: 'santa-elfo-23', priceId: 'price_1UUvbOATdLCeEq1pANdtkNef' },
    { name: '24 de Diciembre (109€)', pkgId: 'santa-elfo-24', priceId: 'price_1UUvbOATdLCeEq1pU8pAmf81' },
  ];

  const results = [];

  for (const item of testDates) {
    try {
      const { response, data } = await createStripeSession({
        secretKey: key,
        priceId: item.priceId,
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        metadata: { diagnostic_check: 'true', package: item.pkgId },
        enableManagedPayments: true,
      });

      results.push({
        name: item.name,
        priceId: item.priceId,
        httpStatus: response.status,
        success: response.ok && Boolean(data.url),
        sessionId: data.id || null,
        checkoutUrlPrefix: data.url ? data.url.slice(0, 45) + '...' : null,
        error: data.error?.message || null,
      });
    } catch (err: any) {
      results.push({
        name: item.name,
        priceId: item.priceId,
        success: false,
        error: err?.message,
      });
    }
  }

  const allPassed = results.every((r) => r.success);
  return res.json({
    status: allPassed ? 'all_passed' : 'some_failed',
    timestamp: new Date().toISOString(),
    account: 'PAPA NOEL EN CALVIA (acct_1UUYs3ATdLCeEq1p)',
    stripeVersion: '2025-03-31.basil',
    results,
  });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    stripeConfigured: Boolean(STRIPE_SECRET_KEY && !STRIPE_SECRET_KEY.includes('{{')),
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
