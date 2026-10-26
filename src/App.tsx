import React, { useState, useEffect } from 'react';
import { Booking, Language, PackageTier } from './types';
import { TEST_PACKAGE } from './data/santaData';
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

  const handleOpenTestBooking = () => {
    handleOpenBooking(
      language === 'es' ? 'Prueba Pasarela Stripe' : 'Stripe Gateway Test',
      'Palmanova & Son Caliu',
      TEST_PACKAGE
    );
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
        onOpenTestBooking={handleOpenTestBooking}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        hasStoredBookings={bookings.length > 0}
      />

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

      {/* Floating Temporary Test Button for Stripe Checkout */}
      <aside
        aria-label={language === 'es' ? 'Botón de prueba temporal de pasarela Stripe' : 'Temporary Stripe checkout test button'}
        className="fixed bottom-20 md:bottom-6 right-4 z-40"
      >
        <button
          type="button"
          onClick={handleOpenTestBooking}
          className="bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900 text-white font-extrabold text-xs py-2.5 px-3.5 rounded-full shadow-2xl border-2 border-indigo-300 flex items-center gap-2 cursor-pointer transition transform hover:scale-105 active:scale-95"
          title={language === 'es' ? 'Botón de prueba temporal para verificar la pasarela de pago Stripe' : 'Temporary test button to verify Stripe payment gateway'}
        >
          <span className="text-base">🧪</span>
          <span className="hidden sm:inline font-cinzel tracking-wider">
            {language === 'es' ? 'Probar Pasarela Stripe' : 'Test Stripe Gateway'}
          </span>
          <span className="sm:hidden font-bold">
            {language === 'es' ? 'Test Pago' : 'Test Pay'}
          </span>
          <span className="text-[10px] bg-indigo-950/80 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
            TEST
          </span>
        </button>
      </aside>

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
