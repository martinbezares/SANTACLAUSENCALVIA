import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Heart } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface FooterProps {
  language: Language;
  onOpenBooking: (trigger: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenBooking }) => {
  const t = translations[language];

  const whatsappLink = `https://wa.me/34661532237?text=${encodeURIComponent(
    t.whatsappMessage
  )}`;

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t-4 border-amber-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Wordmark & Mission */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-cinzel text-xl font-bold text-amber-300 tracking-tight">
              {t.brand}
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              {language === 'es'
                ? 'Llevando la ilusión y el asombro de la Navidad a los hogares y villas de todo el municipio de Calvià. Actores profesionales, trajes de alta costura y respeto absoluto por la magia infantil.'
                : 'Bringing true holiday wonder and childhood enchantment to villas and homes throughout Calvià municipality. Professional actors, bespoke costumes, and genuine festive warmth.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-200/80 pt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Calvià · Santa Ponsa · Portals Nous · Bendinat · Mallorca</span>
            </div>
          </div>

          {/* Col 2: Navigation Mirror */}
          <div>
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider mb-3">
              {language === 'es' ? 'Navegación' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#flyer" className="hover:text-amber-300 transition">
                  {t.navFlyer}
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-amber-300 transition">
                  {t.navExperience}
                </a>
              </li>
              <li>
                <a href="#zones" className="hover:text-amber-300 transition">
                  {t.navZones}
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-amber-300 transition">
                  {t.navPackages}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-300 transition">
                  {t.navFaq}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Direct Booking */}
          <div>
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider mb-3">
              {language === 'es' ? 'Atención al Cliente' : 'Customer Care'}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition"
                >
                  WhatsApp: +34 661 532237
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+34661532237" className="hover:text-amber-300 transition">
                  +34 661 532237
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>info@santacalvia.es</span>
              </li>
            </ul>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => onOpenBooking('Footer CTA')}
                className="w-full bg-[#8A0F1A] hover:bg-[#A61C24] text-white font-bold py-2 px-3 rounded-lg text-xs transition shadow cursor-pointer text-center"
              >
                {t.bookCta}
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Legal */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
          <p>© 2026 {t.brand}. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
          <p className="flex items-center gap-1">
            <span>{language === 'es' ? 'Hecho con' : 'Made with'}</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
            <span>{language === 'es' ? 'para las familias de Calvià y Andratx' : 'for families in Calvià & Andratx'}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
