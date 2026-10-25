import React from 'react';
import { Check, Sparkles, Clock, Calendar, Users, MapPin } from 'lucide-react';
import { PACKAGES } from '../data/santaData';
import { Language, PackageTier } from '../types';
import { translations } from '../utils/i18n';

interface PackagesSectionProps {
  language: Language;
  onSelectPackage: (pkg: PackageTier) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  language,
  onSelectPackage,
}) => {
  const t = translations[language];

  const elfoPackage = PACKAGES.find((p) => p.category === 'elfo') || PACKAGES[0];
  const santaPackages = PACKAGES.filter((p) => p.category === 'santa-elfo');

  return (
    <section id="packages" className="py-8 sm:py-12 md:py-16 bg-[#F9F4E8]/60 border-t border-amber-200/80">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest font-bold text-amber-800 font-cinzel mb-1">
            {language === 'es' ? 'TARIFAS Y FECHAS OFICIALES' : 'OFFICIAL RATES & DATES'}
          </p>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-[#8A0F1A]">
            {t.packagesTitle}
          </h2>
          <p className="text-stone-600 text-sm mt-2 font-sans">
            {t.packagesSubtitle}
          </p>
        </div>

        {/* 1. VISITA MÁGICA DE SANTA Y SU ELFO (6 DICIEMBRE) */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900">
                {language === 'es' ? 'VISITA MÁGICA DE SANTA Y SU ELFO' : 'MAGICAL VISIT OF SANTA AND HIS ELF'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                {language === 'es'
                  ? '6 de Diciembre · Santa Claus y su Elfo acuden juntos a su hogar para recoger las cartas de los niños y comenzar la magia navideña.'
                  : 'December 6th · Santa Claus & his Elf come together to your home to collect children\'s letters and spark holiday joy.'}
              </p>
            </div>
          </div>

          <div className="bg-[#FCF9F2] rounded-2xl border-2 border-emerald-600/60 shadow-lg p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-700 text-white font-cinzel text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-xs">
              ★ {language === 'es' ? '6 DE DICIEMBRE · SANTA Y SU ELFO' : 'DECEMBER 6th · SANTA & HIS ELF'} ★
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'es' ? '6 de Diciembre · Calvià & Andratx' : 'December 6th · Calvià & Andratx'}</span>
                  </div>
                  <h4 className="font-cinzel text-xl sm:text-2xl font-black text-[#8A0F1A]">
                    {language === 'es' ? elfoPackage.name : (elfoPackage.nameEn || elfoPackage.name)}
                  </h4>
                  <p className="text-stone-600 text-xs sm:text-sm font-sans mt-1">
                    {language === 'es'
                      ? 'Santa Claus acompañado de su fiel Elfo oficial llegan a su hogar para recibir en mano la carta de los pequeños, contar anécdotas del taller de Laponia y certificar su buen comportamiento.'
                      : 'Santa Claus accompanied by his official elf helper arrives at your doorstep to personally receive children\'s letters, share stories from the North Pole workshop, and certify their great deeds.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 pt-2 border-t border-stone-200">
                  {(language === 'es' ? elfoPackage.features : (elfoPackage.featuresEn || elfoPackage.features)).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#F9F4E8] rounded-xl p-6 border border-amber-300 text-center flex flex-col justify-between h-full">
                <div>
                  <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
                    {language === 'es' ? 'Tarifa Especial 6 Dic' : 'Special Rate Dec 6'}
                  </p>
                  <div className="my-2">
                    <span className="font-cinzel text-4xl sm:text-5xl font-black text-[#8A0F1A] tabular-nums">
                      79€
                    </span>
                    <span className="text-xs text-stone-500 block mt-1 font-medium">
                      {language === 'es' ? 'por visita · desplazamiento incluido' : 'per visit · travel included'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-stone-600 mb-4">
                    <Users className="w-3.5 h-3.5 text-amber-700" />
                    <span>{language === 'es' ? elfoPackage.cast : (elfoPackage.castEn || elfoPackage.cast)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPackage(elfoPackage)}
                  className="w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm shadow-md bg-emerald-700 hover:bg-emerald-800 text-white transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-300" />
                  <span>
                    {language === 'es' ? 'Reservar 6 de Diciembre (79€)' : 'Book Dec 6th (79€)'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. VISITA MÁGICA DE SANTA Y SU ELFO (20 AL 24 DIC) */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#8A0F1A] text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900">
                {language === 'es' ? 'VISITA MÁGICA DE SANTA Y SU ELFO (20 AL 24 DIC)' : 'MAGICAL VISIT OF SANTA AND HIS ELF (DEC 20 - 24)'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                {language === 'es'
                  ? 'Del 20 al 24 de Diciembre · Santa Claus y su Elfo acuden juntos a su hogar para la gran entrega de regalos.'
                  : 'December 20th to 24th · Santa Claus and his Elf come together to your home for the grand gift delivery.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {santaPackages.map((pkg) => {
              const isPopular = pkg.popular;
              const pkgName = language === 'es' ? pkg.name : (pkg.nameEn || pkg.name);
              const pkgSubtitle = language === 'es' ? pkg.subtitle : (pkg.subtitleEn || pkg.subtitle);
              const pkgDateInfo = language === 'es' ? pkg.dateInfo : (pkg.dateInfoEn || pkg.dateInfo);
              const pkgDuration = language === 'es' ? pkg.duration : (pkg.durationEn || pkg.duration);
              const pkgCast = language === 'es' ? pkg.cast : (pkg.castEn || pkg.cast);
              const pkgFeatures = language === 'es' ? pkg.features : (pkg.featuresEn || pkg.features);

              return (
                <div
                  key={pkg.id}
                  className={`rounded-2xl flex flex-col justify-between transition relative ${
                    isPopular
                      ? 'bg-[#FCF9F2] border-2 border-amber-400 shadow-xl shadow-amber-900/10 md:-translate-y-2'
                      : 'bg-[#FCF9F2] border border-stone-200/90 shadow-sm hover:shadow-md'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#8A0F1A] text-amber-300 text-[11px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full shadow border border-amber-400 whitespace-nowrap">
                      ★ {language === 'es' ? 'NOCHEBUENA · HASTA 19:00' : 'CHRISTMAS EVE · UNTIL 19:00'} ★
                    </div>
                  )}

                  <div className="p-6 sm:p-7">
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>{pkgDateInfo}</span>
                      </div>
                      <h4 className="font-cinzel text-lg sm:text-xl font-bold text-stone-900 mb-1">
                        {pkgName}
                      </h4>
                      <p className="text-xs text-stone-500 font-sans">
                        {pkgSubtitle}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-6 pb-4 border-b border-stone-200/80 flex items-baseline gap-1">
                      <span className="font-cinzel text-4xl font-black text-[#8A0F1A] tabular-nums">
                        {pkg.price}€
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        {language === 'es' ? '/ visita' : '/ visit'}
                      </span>
                    </div>

                    {/* Cast and Duration */}
                    <div className="space-y-1.5 mb-6 text-xs text-stone-700 bg-amber-50/70 p-3 rounded-xl border border-amber-200/70">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-700 shrink-0" />
                        <span className="font-semibold">{pkgCast}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>{pkgDuration}</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-2 text-xs text-stone-700 mb-6">
                      {pkgFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 sm:p-7 pt-0">
                    <button
                      type="button"
                      onClick={() => onSelectPackage(pkg)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow transition flex items-center justify-center gap-2 cursor-pointer ${
                        isPopular
                          ? 'bg-[#8A0F1A] hover:bg-[#A61C24] text-white shadow-red-950/20'
                          : 'bg-stone-900 hover:bg-stone-800 text-white'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>{t.selectPlan} ({pkg.price}€)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>



        {/* Calvià Municipality Guarantee Banner */}
        <div className="mt-12 bg-white rounded-2xl p-5 border border-amber-300/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-stone-800">
                {language === 'es' ? 'Desplazamiento 100% Incluido en Calvià y Andratx' : 'Travel 100% Included Across Calvià & Andratx'}
              </p>
              <p className="text-stone-500">
                Palmanova · Magaluf · El Toro · Santa Ponsa · Peguera · Andratx · Portals Nous · Bendinat
              </p>
            </div>
          </div>
          <span className="text-amber-800 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200 whitespace-nowrap">
            {language === 'es' ? 'Tarifas finales sin sorpresas' : 'Final rates with no extra fees'}
          </span>
        </div>
      </div>
    </section>
  );
};
