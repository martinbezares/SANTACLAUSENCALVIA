import React from 'react';
import { Calendar, MessageCircle, BookmarkCheck, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface MobileBottomNavProps {
  language: Language;
  onOpenBooking: (trigger: string) => void;
  onOpenMyBookings: () => void;
  hasStoredBookings: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  language,
  onOpenBooking,
  onOpenMyBookings,
  hasStoredBookings,
}) => {
  const t = translations[language];

  const whatsappLink = `https://wa.me/34600000000?text=${encodeURIComponent(
    t.whatsappMessage
  )}`;

  return (
    <nav
      aria-label="Navegación móvil inferior"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FCF9F2]/95 backdrop-blur-lg border-t border-amber-300 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3 py-2 pb-safe"
    >
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* WhatsApp Directo (1-tap) */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[46px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition px-2 py-1 shadow-xs active:scale-95"
          aria-label="Abrir WhatsApp directo"
        >
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">WhatsApp</span>
        </a>

        {/* Primary Booking Button (Prominent Center Anchor) */}
        <button
          type="button"
          onClick={() => onOpenBooking('Barra Móvil Inferior')}
          className="flex-1 flex items-center justify-center gap-2 min-h-[46px] bg-gradient-to-r from-[#8A0F1A] via-[#A61C24] to-[#8A0F1A] active:from-[#700B15] active:to-[#8A0F1A] text-white font-extrabold text-xs sm:text-sm px-4 rounded-xl shadow-md transition active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="font-cinzel tracking-wider uppercase">
            {language === 'es' ? 'Reservar Visita' : 'Book Visit'}
          </span>
          <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
        </button>

        {/* My Bookings or Quick Jump to Packages */}
        {hasStoredBookings ? (
          <button
            type="button"
            onClick={onOpenMyBookings}
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[46px] rounded-xl bg-amber-100/90 text-amber-950 border border-amber-300 transition px-2 py-1 active:scale-95 cursor-pointer"
            aria-label="Ver mis reservas guardadas"
          >
            <BookmarkCheck className="w-5 h-5 text-[#8A0F1A]" />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">
              {language === 'es' ? 'Reservas' : 'Bookings'}
            </span>
          </button>
        ) : (
          <a
            href="#packages"
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[46px] rounded-xl bg-amber-100/80 text-amber-900 border border-amber-300/80 transition px-2 py-1 active:scale-95"
            aria-label="Ver tarifas"
          >
            <Calendar className="w-5 h-5 text-amber-700" />
            <span className="text-[10px] font-bold tracking-tight mt-0.5">
              {language === 'es' ? 'Tarifas' : 'Rates'}
            </span>
          </a>
        )}
      </div>
    </nav>
  );
};
