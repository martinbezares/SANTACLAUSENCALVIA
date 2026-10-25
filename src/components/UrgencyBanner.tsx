import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface UrgencyBannerProps {
  language: Language;
  onOpenBooking: (trigger: string) => void;
}

export const UrgencyBanner: React.FC<UrgencyBannerProps> = ({ language, onOpenBooking }) => {
  const t = translations[language];

  return (
    <aside className="bg-gradient-to-r from-red-950 via-[#8A0F1A] to-red-950 text-white py-1.5 sm:py-2 px-3 sm:px-4 border-b border-amber-400/40 shadow-xs relative z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between text-xs sm:text-sm gap-2">
        <div className="flex items-center gap-2 truncate">
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-red-400"></span>
          </span>
          <span className="text-amber-300 font-bold tracking-wider text-[10px] sm:text-[11px] uppercase shrink-0">
            {language === 'es' ? 'EN DIRECTO' : 'LIVE'}
          </span>
          <span className="text-stone-200 text-[11px] sm:text-xs truncate">
            {t.urgencyText}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenBooking('Barra Superior - Urgencia')}
          className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-red-950 font-black px-2.5 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs transition duration-200 shadow flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 min-h-[32px] sm:min-h-[36px]"
        >
          <Sparkles className="w-3 h-3 text-red-900" />
          <span>{t.urgencyCta}</span>
          <ArrowRight className="w-3 h-3 text-red-950" />
        </button>
      </div>
    </aside>
  );
};
