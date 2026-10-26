import React, { useState, useEffect } from 'react';
import { Booking, Language, PackageTier } from './types';
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

const STORAGE_KEY = 'santa_calvia_bookings_v1';

export default function App() {
  const [language, setLanguage] = useState<Language>('es');
  const [snowEnabled, setSnowEnabled] = useState(true);

  // Local storage for user bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
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

  // Check if returning from successful Stripe checkout
  const [paymentSuccessToast, setPaymentSuccessToast] = useState<{ code: string } | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('payment') === 'success') {
        const code = params.get('code') || 'SANTA';
        setPaymentSuccessToast({ code });
        // Clean URL without reloading
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch {
      // ignore
    }
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
    <div id="top" className="min-h-screen flex flex-col pb-20 md:pb-0 bg-[#FCF9F2] text-stone-800 relative selection:bg-amber-300 selection:text-red-950 font-sans">
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
          <div className="max-w-6xl mx-auto flex items-center gap-3 text-xs sm:text-sm">
            <span className="text-xl">🎅</span>
            <div>
              <p className="font-cinzel font-bold text-amber-200">
                {language === 'es'
                  ? '¡Pago de reserva completado con éxito en Stripe!'
                  : 'Booking payment successfully completed on Stripe!'}
              </p>
              <p className="text-emerald-100 text-xs">
                {language === 'es'
                  ? `Solicitud ${paymentSuccessToast.code} confirmada. Nos pondremos en contacto contigo por WhatsApp para coordinar la llegada.`
                  : `Booking ${paymentSuccessToast.code} confirmed. We will reach out via WhatsApp to confirm the arrival.`}
              </p>
            </div>
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

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Interactive Flyer Section (Faithful to provided graphic & hotspots) */}
        <FlyerHero
          language={language}
          onOpenBooking={(trigger) => handleOpenBooking(trigger)}
          onOpenPolaroid={(index) => setPolaroidIndex(index)}
        />

        {/* 4 Core Pillars Breakdown */}
        <ExperiencePillars
          language={language}
          onOpenBooking={(trigger) => handleOpenBooking(trigger)}
        />

        {/* Transparent Packages */}
        <PackagesSection
          language={language}
          onSelectPackage={(pkg) => handleOpenBooking(`Plan ${pkg.name}`, undefined, pkg)}
        />

        {/* Calvià Coverage & Map Explorer */}
        <CalviaZonesExplorer
          language={language}
          onSelectZone={(zoneName) => handleOpenBooking(`Zona ${zoneName}`, zoneName)}
        />

        {/* Santa's Golden Book Interactive Customizer */}
        <SantaBookCustomizer
          language={language}
          onApplyToBooking={handleApplyCustomizerToBooking}
        />

        {/* Reviews from Calvià families */}
        <TestimonialsGallery language={language} />

        {/* FAQs */}
        <FaqSection language={language} />
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onOpenBooking={(trigger) => handleOpenBooking(trigger)}
      />

      {/* Floating & Mobile Navigation Elements */}
      <SocialProofToast language={language} />
      <FloatingWhatsApp language={language} />
      <MobileBottomNav
        language={language}
        onOpenBooking={(trigger) => handleOpenBooking(trigger)}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        hasStoredBookings={bookings.length > 0}
      />

      {/* Modals & Drawers */}
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
          setActiveVoucherBooking(booking);
        }}
      />

      <MagicVoucherModal
        booking={activeVoucherBooking}
        onClose={() => setActiveVoucherBooking(null)}
        language={language}
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
          setActiveVoucherBooking(booking);
        }}
        onDeleteBooking={handleDeleteBooking}
        language={language}
      />
    </div>
  );
}
