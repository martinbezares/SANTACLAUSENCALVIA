import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { FAQS } from '../data/santaData';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface FaqSectionProps {
  language: Language;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ language }) => {
  const t = translations[language];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const whatsappLink = `https://wa.me/34661532237?text=${encodeURIComponent(
    language === 'es'
      ? '¡Hola! Tengo una duda sobre la visita de Santa y su Elfo en Calvià.'
      : 'Hello! I have a question regarding the Santa & his Elf visit in Calvià.'
  )}`;

  return (
    <section id="faq" className="py-12 md:py-16 bg-[#FCF9F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest font-bold text-amber-800 font-cinzel mb-1">
            {language === 'es' ? 'RESOLVEMOS TUS DUDAS' : 'CLEAR ANSWERS'}
          </p>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#8A0F1A]">
            {t.faqTitle}
          </h2>
          <p className="text-stone-600 text-sm mt-2 font-sans">
            {t.faqSubtitle}
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const question = language === 'es' ? faq.question : (faq.questionEn || faq.question);
            const answer = language === 'es' ? faq.answer : (faq.answerEn || faq.answer);

            return (
              <div
                key={index}
                className="bg-[#F9F4E8] rounded-xl border border-amber-200/90 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-cinzel font-bold text-stone-900 text-sm sm:text-base hover:text-[#8A0F1A] transition cursor-pointer"
                >
                  <span>{question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-700 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#8A0F1A]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans border-t border-amber-200/60 pt-3">
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help prompt */}
        <div className="mt-8 text-center bg-amber-50 rounded-2xl p-4 sm:p-6 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-cinzel font-bold text-stone-900 text-sm sm:text-base">
              {language === 'es'
                ? '¿Tienes alguna duda o petición especial?'
                : 'Do you have a special inquiry or custom setup?'}
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              {language === 'es'
                ? 'Respondemos en pocos minutos vía WhatsApp todos los días.'
                : 'Our Calvià holiday coordinator replies within minutes.'}
            </p>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow transition flex items-center gap-2 whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.whatsappDirect}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
