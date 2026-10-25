import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface FloatingWhatsAppProps {
  language: Language;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ language }) => {
  const t = translations[language];

  const whatsappUrl = `https://wa.me/34661532237?text=${encodeURIComponent(
    t.whatsappMessage
  )}`;

  return (
    <aside
      className="hidden md:flex fixed bottom-4 right-4 z-40"
      data-purpose="floating-whatsapp-widget"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar directamente por WhatsApp con Papá Noel en Calvià"
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl transition duration-300 transform hover:scale-105 group font-bold text-xs sm:text-sm"
      >
        <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition duration-300" />
        <span className="hidden sm:inline">{t.whatsappDirect}</span>
      </a>
    </aside>
  );
};
