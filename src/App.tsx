import React, { useState, useEffect } from 'react';
import { Booking, Language, PackageTier } from './types';
import { VISIT_DATE_CHOICES, PACKAGES } from './data/santaData';
import { SnowEffect } from './components/SnowEffect';
import { UrgencyBanner } from './components/UrgencyBanner';
import { Navbar } from './components/Navbar';
import { FlyerHero } from './components/FlyerHero';
import { ExperiencePillars } from './components/ExperiencePillars';
import { CalviaZonesExplorer } from './components/CalviaZonesExplorer';
import { PackagesSection } from './components/PackagesSection';
import { SantaBookCustomizer } from './components/SantaBookCustomizer';
import { TestimonialsGallery } from './components/TestimonialsGallery';
import { FaqSection } from './components/FaqSection';
import { BookingModal } from './components/BookingModal';
import { MagicVoucherModal } from './components/MagicVoucherModal';
import { MyBookingsDrawer } from './components/MyBookingsDrawer';
import { PolaroidZoomModal } from './components/PolaroidZoomModal';
import { SocialProofToast } from './components/SocialProofToast';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

const STORAGE_KEY = 'santa_calvia_bookings_v2';

export default function App() {
  const [language, setLanguage] = useState<Language>('es');
  const [snowEnabled, setSnowEnabled] = useState(true);

  // Local storage for user bookings (v2 resets previous fictitious/test bookings)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      localStorage.removeItem('santa_calvia_bookings_v1');
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingOrigin, setBookingOrigin] = useState('General');
  const [selectedZone, setSelectedZone] = useState<string | undefined>(undefined);
  const [selectedPkg, setSelectedPkg] = useState<PackageTier | null>(null);
  const [secretNotes, setSecretNotes] = useState('');
  const [secretKids, setSecretKids] = useState('');

  const [activeVoucherBooking, setActiveVoucherBooking] = useState<Booking | null>(null);
  const [voucherJustPaid, setVoucherJustPaid] = useState(false);
  const [polaroidIndex, setPolaroidIndex] = useState<number | null>(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);

  // Save bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (e) {
      console.error('Error saving bookings to localStorage', e);
    }
  }, [bookings]);

  // Check if returning from Stripe checkout
  const [paymentSuccessToast, setPaymentSuccessToast] = useState<{ code: string } | null>(null);
  const [paymentCancelledToast, setPaymentCancelledToast] = useState(false);

  useEffect(() => {
    const handleStripeReturn = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const paymentStatus = params.get('payment');

        if (paymentStatus === 'cancelled') {
          setPaymentCancelledToast(true);
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        if (paymentStatus === 'success') {
          const code = params.get('code') || 'SANTA';
          const sessionId = params.get('session_id');
          const urlDateKey = params.get('dateKey') || '';

          setPaymentSuccessToast({ code });
          window.history.replaceState({}, document.title, window.location.pathname);

          // Find existing local booking matching this code synchronously
          let matchedBooking: Booking | null = null;
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const currentList: Booking[] = raw ? JSON.parse(raw) : [];
            const found = currentList.find((b) => b.code === code);
            if (found) {
              matchedBooking = { ...found, status: 'confirmada' };
              setBookings((prev) =>
                prev.map((b) => (b.code === code ? { ...b, status: 'confirmada' } : b))
              );
            }
          } catch {
            // ignore storage parse error
          }

          // Retrieve verified Stripe session details so printable form is always available even across devices/tabs
          if (sessionId && sessionId.startsWith('cs_')) {
            try {
              const res = await fetch(`/api/checkout-session/${encodeURIComponent(sessionId)}`);
              if (res.ok) {
                const sess = await res.json();
                const meta = sess.metadata || {};
                const cust = sess.customerDetails || {};
                const dateChoice =
                  VISIT_DATE_CHOICES.find((d) => d.dateKey === (meta.date_key || urlDateKey)) ||
                  VISIT_DATE_CHOICES[0];
                const pkgObj =
                  PACKAGES.find((p) => p.id === meta.package_id) ||
                  PACKAGES.find((p) => p.id === dateChoice.pkgId) ||
                  PACKAGES[0];

                const resolvedBooking: Booking = {
                  id: matchedBooking?.id || `paid_${Date.now()}`,
                  code: meta.booking_code || code,
                  fullName:
                    matchedBooking?.fullName ||
                    meta.customer_name ||
                    cust.name ||
                    'Familia Calvià',
                  phone: matchedBooking?.phone || meta.phone || cust.phone || '+34 652 390240',
                  email: matchedBooking?.email || cust.email || 'cliente@stripe.com',
                  dateKey: meta.date_key || urlDateKey || dateChoice.dateKey,
                  dateLabel:
                    matchedBooking?.dateLabel ||
                    `${meta.day_label || dateChoice.dayLabelEs} · ${pkgObj.name}`,
                  timeSlot:
                    matchedBooking?.timeSlot ||
                    meta.time_slot ||
                    'Horarios preferidos: 17:00–19:00',
                  preferredTimeWindow: matchedBooking?.preferredTimeWindow || 'early_evening',
                  zone: matchedBooking?.zone || meta.zone || cust.address?.city || 'Calvià',
                  address:
                    matchedBooking?.address ||
                    meta.address ||
                    [cust.address?.line1, cust.address?.line2, cust.address?.postal_code, cust.address?.city]
                      .filter(Boolean)
                      .join(', ') ||
                    'Confirmada por WhatsApp',
                  kidsInfo:
                    matchedBooking?.kidsInfo ||
                    meta.kids_info ||
                    'Los pequeños de la casa (máx. 3 niños)',
                  notes:
                    matchedBooking?.notes ||
                    meta.notes ||
                    'Pago completado mediante Stripe',
                  packageId: pkgObj.id,
                  packageName: pkgObj.name,
                  price: sess.amountTotal || Number(meta.amount_eur) || dateChoice.price,
                  createdAt: matchedBooking?.createdAt || new Date().toISOString(),
                  isExpress: matchedBooking?.isExpress ?? false,
                  status: 'confirmada',
                  routeOrder: matchedBooking?.routeOrder || 1,
                  paymentMethod: 'Stripe (Pagado)',
                };

                setBookings((prev) => {
                  const exists = prev.some((b) => b.code === resolvedBooking.code);
                  if (exists) {
                    return prev.map((b) =>
                      b.code === resolvedBooking.code ? resolvedBooking : b
                    );
                  }
                  return [resolvedBooking, ...prev];
                });

                setVoucherJustPaid(true);
                setActiveVoucherBooking(resolvedBooking);
                return;
              }
            } catch {
              // fallback to matchedBooking below
            }
          }

          if (matchedBooking) {
            setVoucherJustPaid(true);
            setActiveVoucherBooking(matchedBooking);
          } else {
            // Fallback printable booking object if session details couldn't be fetched
            const dateChoice =
              VISIT_DATE_CHOICES.find((d) => d.dateKey === urlDateKey) || VISIT_DATE_CHOICES[0];
            const pkgObj =
              PACKAGES.find((p) => p.id === dateChoice.pkgId) || PACKAGES[0];
            const fallbackBooking: Booking = {
              id: `paid_${Date.now()}`,
              code,
              fullName: 'Familia Calvià (Pago Confirmado)',
              phone: 'Confirmar por WhatsApp',
              email: 'confirmado@stripe.com',
              dateKey: dateChoice.dateKey,
              dateLabel: `${dateChoice.dayLabelEs} · ${pkgObj.name}`,
              timeSlot: 'Franja seleccionada en la reserva',
              preferredTimeWindow: 'early_evening',
              zone: 'Calvià & Andratx',
              address: 'Confirmada por WhatsApp',
              kidsInfo: 'Niños inscritos en la visita',
              notes: 'Reserva pagada en Stripe',
              packageId: pkgObj.id,
              packageName: pkgObj.name,
              price: dateChoice.price,
              createdAt: new Date().toISOString(),
              isExpress: false,
              status: 'confirmada',
              routeOrder: 1,
              paymentMethod: 'Stripe (Pagado)',
            };
            setVoucherJustPaid(true);
            setActiveVoucherBooking(fallbackBooking);
          }
        }
      } catch {
        // ignore URL parsing errors
      }
    };

    handleStripeReturn();
  }, []);

  const handleOpenBooking = (
    trigger: string,
    zone?: string,
    pkg?: PackageTier | null
  ) => {
    setBookingOrigin(trigger);
    if (zone) setSelectedZone(zone);
    if (pkg) setSelectedPkg(pkg);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleDeleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const handleApplyCustomizerToBooking = (notes: string, kids: string) => {
    setSecretNotes(notes);
    setSecretKids(kids);
    handleOpenBooking(language === 'es' ? 'Libro Dorado de Santa' : "Santa's Golden Book");
  };

  return (
    <div id="top" className="min-h-screen flex flex-col pb-20 md:pb-0 bg-[#FCF9F2] text-stone-800 relative selection:bg-amber-300 selection:text-red-950 font-sans print:bg-white print:pb-0">
      {/* Background page wrapper hidden when printing the Santa Visit Form */}
      <div className={activeVoucherBooking ? 'print:hidden flex flex-col flex-1' : 'flex flex-col flex-1'}>
        {/* Falling Snow Canvas */}
        <SnowEffect enabled={snowEnabled} />

        {/* Urgency Live Bar */}
        <UrgencyBanner
          language={language}
          onOpenBooking={(trigger) => handleOpenBooking(trigger)}
        />

        {/* Navigation Bar */}
        <Navbar
          language={language}
          onLanguageToggle={() => setLanguage(language === 'es' ? 'en' : 'es')}
          snowEnabled={snowEnabled}
          onToggleSnow={() => setSnowEnabled(!snowEnabled)}
          onOpenBooking={(trigger) => handleOpenBooking(trigger)}
          onOpenMyBookings={() => setIsMyBookingsOpen(true)}
          hasStoredBookings={bookings.length > 0}
        />

        {/* Stripe Return Success Toast */}
        {paymentSuccessToast && (
          <div className="bg-emerald-700 text-white px-4 py-3 border-b-2 border-emerald-500 shadow-md flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
            <div className="max-w-6xl mx-auto flex items-center gap-3 text-xs sm:text-sm flex-wrap">
              <span className="text-xl">🎅</span>
              <div>
                <p className="font-cinzel font-bold text-amber-200">
                  {language === 'es'
                    ? '¡Pago de reserva completado con éxito en Stripe!'
                    : 'Booking payment successfully completed on Stripe!'}
                </p>
                <p className="text-emerald-100 text-xs">
                  {language === 'es'
                    ? `Solicitud ${paymentSuccessToast.code} confirmada. Tu formulario imprimible está listo.`
                    : `Booking ${paymentSuccessToast.code} confirmed. Your printable visit form is ready.`}
                </p>
              </div>
              {bookings[0] && (
                <button
                  type="button"
                  onClick={() => {
                    setVoucherJustPaid(true);
                    setActiveVoucherBooking(bookings[0]);
                  }}
                  className="bg-amber-400 hover:bg-amber-300 text-red-950 font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer shadow-xs"
                >
                  {language === 'es' ? '🖨️ Ver / Imprimir Formulario' : '🖨️ View / Print Form'}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setPaymentSuccessToast(null)}
              className="text-emerald-200 hover:text-white font-bold text-xs px-2 py-1 bg-emerald-800 rounded-lg cursor-pointer ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stripe Cancelled Toast */}
        {paymentCancelledToast && (
          <div className="bg-amber-100 text-amber-950 px-4 py-2.5 border-b border-amber-300 flex items-center justify-between text-xs sm:text-sm">
            <div className="max-w-6xl mx-auto">
              {language === 'es'
                ? 'Pago cancelado en Stripe. No se ha realizado ningún cargo y puedes intentarlo de nuevo cuando quieras.'
                : 'Payment cancelled on Stripe. No charge was made and you can try again anytime.'}
            </div>
            <button
              type="button"
              onClick={() => setPaymentCancelledToast(false)}
              className="text-amber-800 hover:text-amber-950 font-bold px-2 py-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Content Sections */}
        <main className="flex-1">
          <FlyerHero
            language={language}
            onOpenBooking={(trigger) => handleOpenBooking(trigger)}
            onOpenPolaroid={(index) => setPolaroidIndex(index)}
          />

          <ExperiencePillars
            language={language}
            onOpenBooking={(trigger) => handleOpenBooking(trigger)}
          />

          <PackagesSection
            language={language}
            onSelectPackage={(pkg) => handleOpenBooking(`Plan ${pkg.name}`, undefined, pkg)}
          />

          <CalviaZonesExplorer
            language={language}
            onSelectZone={(zoneName) => handleOpenBooking(`Zona ${zoneName}`, zoneName)}
          />

          <SantaBookCustomizer
            language={language}
            onApplyToBooking={handleApplyCustomizerToBooking}
          />

          <TestimonialsGallery language={language} />

          <FaqSection language={language} />
        </main>

        <Footer
          language={language}
          onOpenBooking={(trigger) => handleOpenBooking(trigger)}
        />

        <SocialProofToast language={language} />
        <FloatingWhatsApp language={language} />
        <MobileBottomNav
          language={language}
          onOpenBooking={(trigger) => handleOpenBooking(trigger)}
          onOpenMyBookings={() => setIsMyBookingsOpen(true)}
          hasStoredBookings={bookings.length > 0}
        />

        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          language={language}
          originTrigger={bookingOrigin}
          preselectedZone={selectedZone}
          preselectedPackage={selectedPkg}
          initialNotes={secretNotes}
          initialKids={secretKids}
          onBookingSuccess={handleBookingSuccess}
          onOpenVoucher={(booking) => {
            setIsBookingOpen(false);
            setVoucherJustPaid(false);
            setActiveVoucherBooking(booking);
          }}
        />

        <PolaroidZoomModal
          photoIndex={polaroidIndex}
          onClose={() => setPolaroidIndex(null)}
          onBook={(trigger) => handleOpenBooking(trigger)}
          language={language}
        />

        <MyBookingsDrawer
          isOpen={isMyBookingsOpen}
          onClose={() => setIsMyBookingsOpen(false)}
          bookings={bookings}
          onOpenVoucher={(booking) => {
            setIsMyBookingsOpen(false);
            setVoucherJustPaid(booking.status === 'confirmada');
            setActiveVoucherBooking(booking);
          }}
          onDeleteBooking={handleDeleteBooking}
          language={language}
        />
      </div>

      {/* Printable Official Santa Visit Form & Certificate */}
      <MagicVoucherModal
        booking={activeVoucherBooking}
        onClose={() => {
          setActiveVoucherBooking(null);
          setVoucherJustPaid(false);
        }}
        language={language}
        justPaid={voucherJustPaid}
      />
    </div>
  );
}
