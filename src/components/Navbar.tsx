import React, { useState } from 'react';
import { Bell, CloudSnow, Globe, Calendar, BookmarkCheck, Menu, X, ArrowRight, FlaskConical } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';
import { playJingleBellChime } from '../utils/audio';

interface NavbarProps {
  language: Language;
  onLanguageToggle: () => void;
  snowEnabled: boolean;
  onToggleSnow: () => void;
  onOpenBooking: (trigger: string) => void;
  onOpenTestBooking?: () => void;
  onOpenMyBookings: () => void;
  hasStoredBookings: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageToggle,
  snowEnabled,
  onToggleSnow,
  onOpenBooking,
  onOpenTestBooking,
  onOpenMyBookings,
  hasStoredBookings,
}) => {
  const t = translations[language];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleChime = () => {
    playJingleBellChime();
  };

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FCF9F2]/95 backdrop-blur-md border-b border-amber-300/60 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-cinzel text-lg sm:text-2xl font-black tracking-tight text-[#8A0F1A] hover:text-[#A61C24] transition-colors whitespace-nowrap py-1"
        >
          {t.brand}
        </a>

        {/* Zone 2: Desktop clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-stone-700">
          <a
            href="#flyer"
            className="hover:text-[#8A0F1A] transition-colors whitespace-nowrap"
          >
            {t.navFlyer}
          </a>
          <a
            href="#experience"
            className="hover:text-[#8A0F1A] transition-colors whitespace-nowrap"
          >
            {t.navExperience}
          </a>
          <a
            href="#zones"
            className="hover:text-[#8A0F1A] transition-colors whitespace-nowrap"
          >
            {t.navZones}
          </a>
          <a
            href="#packages"
            className="hover:text-[#8A0F1A] transition-colors whitespace-nowrap"
          >
            {t.navPackages}
          </a>
          <a
            href="#faq"
            className="hover:text-[#8A0F1A] transition-colors whitespace-nowrap"
          >
            {t.navFaq}
          </a>
        </nav>

        {/* Zone 3: Actions + Mobile Menu Trigger */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          {/* Sound Chime Button (44px touch target) */}
          <button
            type="button"
            onClick={handleChime}
            aria-label={language === 'es' ? 'Tocar campanilla de Navidad' : 'Ring Christmas sleigh bell'}
            title={language === 'es' ? 'Tocar campanilla de Navidad (Jingle Bells)' : 'Ring Christmas sleigh bells (Jingle Bells)'}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-600 hover:text-amber-700 hover:bg-amber-100/60 rounded-full transition cursor-pointer"
          >
            <Bell className="w-4 h-4 text-amber-600" />
          </button>

          {/* Snow Effect Toggle (44px touch target) */}
          <button
            type="button"
            onClick={onToggleSnow}
            aria-label={language === 'es' ? 'Alternar nieve' : 'Toggle snow'}
            title={
              language === 'es'
                ? (snowEnabled ? 'Pausar nieve' : 'Activar nieve')
                : (snowEnabled ? 'Pause snowfall' : 'Start snowfall')
            }
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition cursor-pointer ${
              snowEnabled ? 'text-blue-600 bg-blue-50/80' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <CloudSnow className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={onLanguageToggle}
            className="min-h-[38px] px-2 sm:px-2.5 py-1 flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-100 transition whitespace-nowrap cursor-pointer"
            aria-label={language === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}
            title={language === 'es' ? 'Cambiar a Inglés (EN)' : 'Cambiar a Castellano (ES)'}
          >
            <Globe className="w-3.5 h-3.5 text-stone-500" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Desktop My Bookings button */}
          {hasStoredBookings && (
            <button
              type="button"
              onClick={onOpenMyBookings}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition whitespace-nowrap cursor-pointer min-h-[38px]"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.navMyBookings}</span>
            </button>
          )}

          {/* Temporary Test Button for Stripe Checkout */}
          {onOpenTestBooking && (
            <button
              type="button"
              onClick={onOpenTestBooking}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-indigo-950 bg-indigo-100 hover:bg-indigo-200 border-2 border-indigo-400 rounded-xl transition whitespace-nowrap cursor-pointer shadow-xs min-h-[38px]"
              title={language === 'es' ? 'Botón de prueba temporal para verificar pasarela Stripe' : 'Temporary test button for Stripe checkout'}
            >
              <FlaskConical className="w-3.5 h-3.5 text-indigo-700" />
              <span>{language === 'es' ? '🧪 Test Pasarela' : '🧪 Gateway Test'}</span>
            </button>
          )}

          {/* Desktop Primary Action Button */}
          <button
            type="button"
            onClick={() => onOpenBooking('Navbar Header')}
            className="hidden md:flex items-center gap-1.5 bg-[#8A0F1A] hover:bg-[#A61C24] text-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md transition transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer min-h-[40px]"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.bookCta}</span>
          </button>

          {/* Mobile Hamburger Menu Button (44px touch target) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-700 hover:text-[#8A0F1A] rounded-xl transition cursor-pointer"
            aria-label={
              mobileMenuOpen
                ? (language === 'es' ? 'Cerrar menú' : 'Close menu')
                : (language === 'es' ? 'Abrir menú de navegación' : 'Open navigation menu')
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FCF9F2] border-b-2 border-amber-300 px-4 pt-2 pb-5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1 text-sm font-semibold text-stone-800">
            <a
              href="#flyer"
              onClick={handleNavLinkClick}
              className="py-2.5 px-3 rounded-lg hover:bg-amber-100/60 active:bg-amber-200/60 flex items-center justify-between"
            >
              <span>{t.navFlyer}</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </a>
            <a
              href="#experience"
              onClick={handleNavLinkClick}
              className="py-2.5 px-3 rounded-lg hover:bg-amber-100/60 active:bg-amber-200/60 flex items-center justify-between"
            >
              <span>{t.navExperience}</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </a>
            <a
              href="#zones"
              onClick={handleNavLinkClick}
              className="py-2.5 px-3 rounded-lg hover:bg-amber-100/60 active:bg-amber-200/60 flex items-center justify-between"
            >
              <span>{t.navZones}</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </a>
            <a
              href="#packages"
              onClick={handleNavLinkClick}
              className="py-2.5 px-3 rounded-lg hover:bg-amber-100/60 active:bg-amber-200/60 flex items-center justify-between"
            >
              <span>{t.navPackages}</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </a>
            <a
              href="#faq"
              onClick={handleNavLinkClick}
              className="py-2.5 px-3 rounded-lg hover:bg-amber-100/60 active:bg-amber-200/60 flex items-center justify-between"
            >
              <span>{t.navFaq}</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </a>

            {hasStoredBookings && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMyBookings();
                }}
                className="w-full text-left py-2.5 px-3 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-300 flex items-center justify-between font-bold"
              >
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t.navMyBookings}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </button>
            )}

            {onOpenTestBooking && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTestBooking();
                }}
                className="w-full text-left py-2.5 px-3 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-300 flex items-center justify-between font-bold"
              >
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-indigo-700" />
                  <span>{language === 'es' ? '🧪 Probar Pasarela Stripe (Test)' : '🧪 Test Stripe Gateway'}</span>
                </div>
                <span className="text-[10px] font-mono bg-indigo-200 px-2 py-0.5 rounded text-indigo-900 font-bold">
                  {language === 'es' ? 'Temporal' : 'Temp'}
                </span>
              </button>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking('Menú Móvil Desplegable');
                }}
                className="w-full min-h-[46px] bg-gradient-to-r from-[#8A0F1A] to-[#A61C24] text-white font-extrabold rounded-xl shadow flex items-center justify-center gap-2 text-sm uppercase tracking-wide cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>{t.bookCta}</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
