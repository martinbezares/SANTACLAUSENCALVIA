import React from 'react';
import {
  Sparkles,
  Calendar,
  MessageCircle,
  Home,
  HeartHandshake,
  Camera,
  Gift,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface FlyerHeroProps {
  language: Language;
  onOpenBooking: (trigger: string) => void;
  onOpenPolaroid: (index: number) => void;
}

export const FlyerHero: React.FC<FlyerHeroProps> = ({
  language,
  onOpenBooking,
  onOpenPolaroid,
}) => {
  const t = translations[language];

  const HERO_IMAGE_SRC =
    '/assets/aistudio/WhatsApp_Image_2026-10-22_at_10.30.02_bd6d1d26.jpeg';

  const whatsappLink = `https://wa.me/34600000000?text=${encodeURIComponent(
    t.whatsappMessage
  )}`;

  return (
    <section id="flyer" className="w-full py-4 sm:py-8 md:py-10 bg-[#FCF9F2]">
      <div className="max-w-5xl mx-auto px-2.5 sm:px-6">
        {/* Main Poster / Hero Canvas */}
        <article
          className="w-full bg-[#fbf7ee] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 border-amber-400 relative"
          data-purpose="christmas-flyer-poster"
        >
          {/* Integrated Hero Image */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onOpenBooking('Imagen Cabecera Santa y Elfo')}
            onKeyDown={(e) =>
              e.key === 'Enter' && onOpenBooking('Imagen Cabecera Santa y Elfo')
            }
            className="relative w-full overflow-hidden group cursor-pointer border-b-4 border-amber-400/80 bg-stone-900"
            title="Haz clic para reservar tu visita"
          >
            <img
              src={HERO_IMAGE_SRC}
              alt="Private Santa Visit To Your Home · Santa and his Helper come to you"
              className="w-full h-auto block object-cover select-none transition-transform duration-700 group-hover:scale-[1.015]"
              loading="eager"
            />

            {/* Subtle interactive hover cue */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5 sm:pb-8">
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-red-950 font-cinzel font-black text-xs sm:text-sm px-5 py-2 rounded-full shadow-2xl flex items-center gap-2 transform translate-y-3 group-hover:translate-y-0 transition-transform">
                <Sparkles className="w-4 h-4 text-red-900" />
                <span>
                  {language === 'es'
                    ? 'Apartar Visita Privada'
                    : 'Book Private Visit'}
                </span>
                <Calendar className="w-3.5 h-3.5 text-red-900" />
              </span>
            </div>
          </div>

          {/* Location & Dates Strip */}
          <div className="bg-gradient-to-r from-[#700B15] via-[#8A0F1A] to-[#700B15] text-white py-3.5 px-4 sm:px-8 text-center border-b-2 border-amber-300/80">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-semibold max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-amber-200">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {language === 'es'
                    ? 'Municipio de Calvià · Mallorca (0€ suplemento de desplazamiento)'
                    : 'Calvià Municipality · Mallorca (Zero travel surcharge)'}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-white text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {language === 'es'
                    ? '6 Dic y 20 al 24 Dic · Santa y su Elfo en todas las visitas'
                    : 'Dec 6 & Dec 20 to 24 · Santa & his Elf on all visits'}
                </span>
              </div>
            </div>
          </div>

          {/* Service Highlights Section (The 4 iconic pillars from the flyer) */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-[#fbf7ee] via-[#FCF9F2] to-[#F9F4E8]">
            <div className="text-center mb-6">
              <p className="font-cinzel text-xs font-bold text-amber-800 uppercase tracking-widest">
                {language === 'es' ? 'La Magia de la Noche en su Salón' : 'Holiday Magic at Home'}
              </p>
              <h2 className="font-cinzel text-xl sm:text-2xl font-extrabold text-[#8A0F1A]">
                {language === 'es' ? 'Momentos Inolvidables para Toda la Familia' : 'Unforgettable Moments for the Entire Family'}
              </h2>
            </div>

            {/* 4 Interactive Columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
              {/* 1. Santa comes to your home */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => onOpenBooking('Icono 1 - Santa Comes To Your Home')}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  onOpenBooking('Icono 1 - Santa Comes To Your Home')
                }
                className="bg-[#FCF9F2] rounded-xl p-4 border border-amber-300 shadow-sm hover:shadow-md hover:border-amber-500 transition cursor-pointer text-center flex flex-col items-center justify-between group"
              >
                <div className="w-12 h-12 rounded-full bg-red-100 text-[#8A0F1A] flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="font-cinzel font-bold text-xs sm:text-sm text-stone-900 mb-1">
                  {language === 'es' ? '1. A su Casa' : '1. To Your Home'}
                </h3>
                <p className="text-[11px] text-stone-600 leading-tight">
                  {language === 'es'
                    ? 'Llegada con campanilla y duende'
                    : 'Doorstep chime & greeting'}
                </p>
              </div>

              {/* 2. A Personal Meeting */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => onOpenBooking('Icono 2 - A Personal Meeting')}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  onOpenBooking('Icono 2 - A Personal Meeting')
                }
                className="bg-[#FCF9F2] rounded-xl p-4 border border-amber-300 shadow-sm hover:shadow-md hover:border-amber-500 transition cursor-pointer text-center flex flex-col items-center justify-between group"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-cinzel font-bold text-xs sm:text-sm text-stone-900 mb-1">
                  {language === 'es' ? '2. Encuentro Personal' : '2. Personal Meeting'}
                </h3>
                <p className="text-[11px] text-stone-600 leading-tight">
                  {language === 'es'
                    ? 'Lectura del Gran Libro Dorado'
                    : 'Secrets from the Golden Book'}
                </p>
              </div>

              {/* 3. Photos with Santa */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => onOpenBooking('Icono 3 - Photos with Santa')}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  onOpenBooking('Icono 3 - Photos with Santa')
                }
                className="bg-[#FCF9F2] rounded-xl p-4 border border-amber-300 shadow-sm hover:shadow-md hover:border-amber-500 transition cursor-pointer text-center flex flex-col items-center justify-between group"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="font-cinzel font-bold text-xs sm:text-sm text-stone-900 mb-1">
                  {language === 'es' ? '3. Fotos con Santa' : '3. Photos with Santa'}
                </h3>
                <p className="text-[11px] text-stone-600 leading-tight">
                  {language === 'es'
                    ? 'Recuerdos junto a su árbol'
                    : 'Portraits by your own tree'}
                </p>
              </div>

              {/* 4. Santa Gives Your Gifts */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => onOpenBooking('Icono 4 - Santa Gives Your Gifts')}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  onOpenBooking('Icono 4 - Santa Gives Your Gifts')
                }
                className="bg-[#FCF9F2] rounded-xl p-4 border border-amber-300 shadow-sm hover:shadow-md hover:border-amber-500 transition cursor-pointer text-center flex flex-col items-center justify-between group"
              >
                <div className="w-12 h-12 rounded-full bg-red-100 text-[#8A0F1A] flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Gift className="w-6 h-6" />
                </div>
                <h3 className="font-cinzel font-bold text-xs sm:text-sm text-stone-900 mb-1">
                  {language === 'es' ? '4. Entrega de Regalos' : '4. Gives Your Gifts'}
                </h3>
                <p className="text-[11px] text-stone-600 leading-tight">
                  {language === 'es'
                    ? 'Sacados del gran saco mágico'
                    : 'Directly from the magical sack'}
                </p>
              </div>
            </div>

            {/* 3 Polaroid Moments (Clickable to explore) */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Polaroid 1 */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenPolaroid(0)}
                  onKeyDown={(e) => e.key === 'Enter' && onOpenPolaroid(0)}
                  className="bg-white p-3.5 pb-5 rounded-lg shadow-md border border-stone-200 hover:-translate-y-1 hover:shadow-xl transition cursor-pointer flex flex-col items-center"
                >
                  <div className="w-full h-36 rounded bg-gradient-to-br from-[#8A0F1A] to-[#600812] flex flex-col items-center justify-center text-amber-200 p-4 text-center">
                    <Sparkles className="w-8 h-8 text-amber-300 mb-1 animate-pulse" />
                    <span className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">
                      {language === 'es' ? 'Llegada Triunfal' : 'Triumphant Arrival'}
                    </span>
                    <span className="text-[10px] text-amber-200 mt-1">
                      {language === 'es' ? 'Campanilla de plata en la puerta' : 'Silver bell doorstep chime'}
                    </span>
                  </div>
                  <p className="font-handwriting text-base text-stone-700 mt-3 font-bold">
                    {language === 'es' ? '«¡Ha llegado a casa!»' : '«Santa is at our door!»'}
                  </p>
                  <span className="text-[10px] text-amber-800 font-semibold underline mt-0.5">
                    {language === 'es' ? 'Ver detalles' : 'View details'}
                  </span>
                </div>

                {/* Polaroid 2 */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenPolaroid(1)}
                  onKeyDown={(e) => e.key === 'Enter' && onOpenPolaroid(1)}
                  className="bg-white p-3.5 pb-5 rounded-lg shadow-md border border-stone-200 hover:-translate-y-1 hover:shadow-xl transition cursor-pointer flex flex-col items-center"
                >
                  <div className="w-full h-36 rounded bg-gradient-to-br from-[#133E26] to-[#0A2616] flex flex-col items-center justify-center text-amber-200 p-4 text-center">
                    <HeartHandshake className="w-8 h-8 text-amber-300 mb-1 animate-pulse" />
                    <span className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">
                      {language === 'es' ? 'Charla Confidencial' : 'Personal Chat'}
                    </span>
                    <span className="text-[10px] text-amber-200 mt-1">
                      {language === 'es' ? 'Lectura del Gran Libro Dorado' : 'Reading the Golden Book'}
                    </span>
                  </div>
                  <p className="font-handwriting text-base text-stone-700 mt-3 font-bold">
                    {language === 'es' ? '«Conocía todos sus nombres»' : '«He knew all their secrets»'}
                  </p>
                  <span className="text-[10px] text-amber-800 font-semibold underline mt-0.5">
                    {language === 'es' ? 'Ver detalles' : 'View details'}
                  </span>
                </div>

                {/* Polaroid 3 */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenPolaroid(2)}
                  onKeyDown={(e) => e.key === 'Enter' && onOpenPolaroid(2)}
                  className="bg-white p-3.5 pb-5 rounded-lg shadow-md border border-stone-200 hover:-translate-y-1 hover:shadow-xl transition cursor-pointer flex flex-col items-center"
                >
                  <div className="w-full h-36 rounded bg-gradient-to-br from-[#8A0F1A] via-[#A61C24] to-[#700B15] flex flex-col items-center justify-center text-amber-200 p-4 text-center">
                    <Gift className="w-8 h-8 text-amber-300 mb-1 animate-pulse" />
                    <span className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">
                      {language === 'es' ? 'Reparto de Regalos' : 'Giving Presents'}
                    </span>
                    <span className="text-[10px] text-amber-200 mt-1">
                      {language === 'es' ? 'Entrega mágica junto al árbol' : 'Magic unboxing by the tree'}
                    </span>
                  </div>
                  <p className="font-handwriting text-base text-stone-700 mt-3 font-bold">
                    {language === 'es' ? '«Ilusión pura en sus ojos»' : '«Pure wonder in their eyes»'}
                  </p>
                  <span className="text-[10px] text-amber-800 font-semibold underline mt-0.5">
                    {language === 'es' ? 'Ver detalles' : 'View details'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Call to Action Section */}
            <div className="bg-[#FCF9F2] rounded-2xl p-6 border-2 border-amber-300 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="text-center md:text-left space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-[#8A0F1A] uppercase tracking-wide">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Calvià · Santa Ponsa · Portals · Bendinat</span>
                </div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-stone-900">
                  {language === 'es'
                    ? '¡Reserva Ahora Tu Franja Horaria en Calvià!'
                    : 'Book Your Holiday Time Slot in Calvià!'}
                </h3>
                <p className="text-xs text-stone-600">
                  {language === 'es'
                    ? 'Escríbenos por WhatsApp o completa la reserva online inmediata.'
                    : 'Message us via WhatsApp or complete your instant online booking.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => onOpenBooking('Pill BOOK NOW Flyer')}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#8A0F1A] to-[#A61C24] hover:from-[#A61C24] hover:to-[#700B15] text-white font-black px-6 py-3.5 rounded-full shadow-lg shadow-red-950/20 transition transform hover:-translate-y-0.5 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>{language === 'es' ? 'RESERVAR AHORA' : 'BOOK NOW'}</span>
                </button>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3.5 rounded-full shadow transition flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.whatsappDirect}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Action Bar Below Poster */}
          <div className="bg-gradient-to-b from-[#F9F4E8] to-[#f2e7d0] p-4 md:p-5 border-t-2 border-amber-300 text-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="font-cinzel font-bold text-[#A61C24] text-sm md:text-base flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  {language === 'es'
                    ? 'Experiencia Mágica en Familia · Calvià 2026'
                    : 'Magical Family Experience · Calvià 2026'}
                </span>
              </h4>
              <p className="text-xs text-stone-600 font-medium">
                {language === 'es'
                  ? 'Disponible el 6 Dic y del 20 al 24 Dic (hasta las 19:00). Santa y su Elfo en todas las visitas.'
                  : 'Available Dec 6 and Dec 20 to 24 (until 19:00). Santa & his Elf on all visits.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenBooking('Botón Barra Inferior')}
                className="bg-[#8A0F1A] hover:bg-[#A61C24] text-white font-bold px-5 py-2.5 rounded-full shadow text-xs sm:text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'es' ? 'Apartar Plaza' : 'Reserve Slot'}</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
