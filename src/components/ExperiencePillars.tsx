import React from 'react';
import { Home, HeartHandshake, Camera, Gift, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface ExperiencePillarsProps {
  language: Language;
  onOpenBooking: (trigger: string) => void;
}

export const ExperiencePillars: React.FC<ExperiencePillarsProps> = ({
  language,
  onOpenBooking,
}) => {
  const t = translations[language];

  const pillars = [
    {
      num: '01',
      icon: Home,
      title: t.pillar1Title,
      desc: t.pillar1Desc,
      highlight: language === 'es' ? 'Llegada con campanilla y duende' : 'Silver bell doorstep chime',
    },
    {
      num: '02',
      icon: HeartHandshake,
      title: t.pillar2Title,
      desc: t.pillar2Desc,
      highlight: language === 'es' ? 'Lectura del Gran Libro Dorado' : 'Golden book personal secrets',
    },
    {
      num: '03',
      icon: Camera,
      title: t.pillar3Title,
      desc: t.pillar3Desc,
      highlight: language === 'es' ? 'Fotos junto a su propio árbol' : 'Family tree portraits',
    },
    {
      num: '04',
      icon: Gift,
      title: t.pillar4Title,
      desc: t.pillar4Desc,
      highlight: language === 'es' ? 'Entrega desde el saco rojo real' : 'Real presents from giant sack',
    },
  ];

  return (
    <section id="experience" className="py-8 sm:py-12 md:py-16 bg-[#F9F4E8]/60 border-t border-b border-amber-200/70">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest font-bold text-amber-800 font-cinzel mb-1">
            {language === 'es' ? 'LOS 4 PILARES DEL SERVICIO' : 'THE 4 CORE PILLARS'}
          </p>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#8A0F1A]">
            {language === 'es' ? '¿Cómo se Desarrolla la Visita en su Hogar?' : 'How Does The Magical Visit Unfold?'}
          </h2>
          <p className="text-stone-600 text-sm mt-2 font-sans">
            {language === 'es'
              ? 'Un ritual cuidado al milímetro para que los niños crean con más fuerza que nunca en la magia de la Navidad.'
              : 'A meticulously prepared ritual so children experience true holiday wonder without leaving home.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="bg-[#FCF9F2] rounded-2xl p-6 border border-amber-200/90 shadow-sm hover:shadow-md hover:border-amber-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-cinzel text-sm font-bold text-amber-700">
                      {pillar.num}.
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8A0F1A] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-cinzel font-bold text-lg text-stone-900 mb-2">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed font-sans mb-4">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs text-amber-900 font-medium">
                  <span>{pillar.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action anchor */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => onOpenBooking('Sección Experiencia')}
            className="inline-flex items-center gap-2 bg-[#8A0F1A] hover:bg-[#A61C24] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow transition cursor-pointer"
          >
            <span>{language === 'es' ? 'Consultar Horarios para mi Casa' : 'Check Available Slots for My Home'}</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </section>
  );
};
