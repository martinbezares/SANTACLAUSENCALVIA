import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Language } from '../types';

interface SocialProofToastProps {
  language: Language;
}

const NOTIFICATIONS = [
  { nameEs: 'Sofía y Marc', nameEn: 'Sofia & Marc', loc: 'Portals Nous', timeEs: 'hace 2 min', timeEn: '2 min ago' },
  { nameEs: 'Familia Smith', nameEn: 'The Smith Family', loc: 'Nova Santa Ponsa', timeEs: 'hace 7 min', timeEn: '7 min ago' },
  { nameEs: 'Carlos M.', nameEn: 'Charles M.', loc: 'Bendinat', timeEs: 'hace 11 min', timeEn: '11 min ago' },
  { nameEs: 'Elena G.', nameEn: 'Elena G.', loc: 'Port Adriano', timeEs: 'hace 14 min', timeEn: '14 min ago' },
  { nameEs: 'Klaus & Andrea', nameEn: 'Klaus & Andrea', loc: 'Palmanova', timeEs: 'hace 19 min', timeEn: '19 min ago' },
];

const FIVE_MINUTES_MS = 5 * 60 * 1000; // 5 minutos (300.000 ms)
const DISPLAY_DURATION_MS = 7500; // Visible durante 7.5 segundos

export const SocialProofToast: React.FC<SocialProofToastProps> = ({ language }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;

    // Initial appearance after 6 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
      hideTimer = setTimeout(() => {
        setVisible(false);
      }, DISPLAY_DURATION_MS);
    }, 6000);

    // Recurring interval: cada 5 minutos
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % NOTIFICATIONS.length);
      setVisible(true);

      hideTimer = setTimeout(() => {
        setVisible(false);
      }, DISPLAY_DURATION_MS);
    }, FIVE_MINUTES_MS);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, []);

  if (!visible) return null;

  const current = NOTIFICATIONS[index];
  const name = language === 'es' ? current.nameEs : current.nameEn;
  const time = language === 'es' ? current.timeEs : current.timeEn;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-4 left-3 right-3 sm:right-auto sm:left-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-2 border-amber-400 p-3 max-w-sm flex items-center gap-3 transition-all duration-300 transform animate-in slide-in-from-bottom-5"
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-[#8A0F1A]">
          <Bell className="w-5 h-5 text-[#8A0F1A]" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </div>

      <div className="text-xs">
        <p className="font-bold text-stone-800 leading-tight">
          {name}{' '}
          <span className="font-normal">
            {language === 'es' ? 'acaba de solicitar en' : 'just requested in'}{' '}
          </span>
          <span className="text-[#8A0F1A] font-black">{current.loc}</span>{' '}
          <span className="text-stone-400 font-normal">({time})</span>
        </p>
        <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
          🎄{' '}
          {language === 'es'
            ? '¡Últimas plazas para Santa y su Elfo en Calvià & Andratx!'
            : 'Only a few slots left for Santa & his Elf in Calvià & Andratx!'}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label={language === 'es' ? 'Cerrar aviso' : 'Close notification'}
        className="text-stone-400 hover:text-stone-700 p-1 text-xs cursor-pointer ml-auto"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};
