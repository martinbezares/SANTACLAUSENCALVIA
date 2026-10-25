import React from 'react';
import { Star, MapPin, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/santaData';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface TestimonialsGalleryProps {
  language: Language;
}

export const TestimonialsGallery: React.FC<TestimonialsGalleryProps> = ({ language }) => {
  const t = translations[language];

  return (
    <section className="py-12 md:py-16 bg-[#F9F4E8]/60 border-t border-amber-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest font-bold text-amber-800 font-cinzel mb-1">
            {language === 'es' ? 'OPINIONES DE VECINOS' : 'NEIGHBOR REVIEWS'}
          </p>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#8A0F1A]">
            {t.testimonialsTitle}
          </h2>
          <p className="text-stone-600 text-sm mt-2 font-sans">
            {t.testimonialsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => {
            const quote = language === 'es' ? item.quote : (item.quoteEn || item.quote);
            const dateStr = language === 'es' ? item.date : (item.dateEn || item.date);

            return (
              <div
                key={idx}
                className="bg-[#FCF9F2] rounded-2xl p-6 border border-amber-200/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <Quote className="w-6 h-6 text-amber-400/40 mb-2" />

                  <p className="text-xs sm:text-sm text-stone-700 font-sans italic leading-relaxed mb-4">
                    «{quote}»
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-stone-900 font-cinzel">{item.author}</p>
                    <p className="text-stone-500 flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-[#8A0F1A]" />
                      <span>{item.location}</span>
                    </p>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {dateStr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
