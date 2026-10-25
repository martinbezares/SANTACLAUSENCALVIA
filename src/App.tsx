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
