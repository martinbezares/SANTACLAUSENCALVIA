import React, { useState } from 'react';
import { MapPin, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { CALVIA_ZONES } from '../data/santaData';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface CalviaZonesExplorerProps {
  language: Language;
  onSelectZone: (zoneName: string) => void;
}

export const CalviaZonesExplorer: React.FC<CalviaZonesExplorerProps> = ({
  language,
  onSelectZone,
}) => {
  const t = translations[language];
  const [selectedZoneName, setSelectedZoneName] = useState<string>(CALVIA_ZONES[0].name);

  const currentZone = CALVIA_ZONES.find((z) => z.name === selectedZoneName) || CALVIA_ZONES[0];

  return (
    <section id="zones" className="py-8 sm:py-12 md:py-16 bg-[#FCF9F2]">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest font-bold text-amber-800 font-cinzel mb-1">
            {language === 'es' ? 'COBERTURA TERRITORIAL' : 'TERRITORIAL COVERAGE'}
          </p>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#8A0F1A]">
            {t.zonesTitle}
          </h2>
          <p className="text-stone-600 text-sm mt-2 font-sans">
            {t.zonesSubtitle}
          </p>
        </div>

        {/* Santa's Daily Route Progression Banner */}
        <div className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-[#750A13] via-[#8A0F1A] to-[#750A13] rounded-2xl p-3.5 sm:p-5 text-white shadow-md border-2 border-amber-400">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-400/40">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300 font-cinzel">
                ★ {language === 'es' ? 'HOJA DE RUTA DIARIA GEOGRÁFICA' : 'DAILY GEOGRAPHICAL ROUTE'} ★
              </p>
              <h3 className="text-sm sm:text-base font-cinzel font-bold text-white">
                {language === 'es'
                  ? 'Organización de horarios por zonas para evitar cruzar Calvià sin sentido'
                  : 'Zone-organized schedule to prevent inefficient cross-town travel'}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-black/30 px-3 py-1.5 rounded-xl border border-amber-400/40 shrink-0">
              <span className="text-amber-200">25 min {language === 'es' ? 'visita' : 'visit'}</span>
              <span>+</span>
              <span className="text-amber-200">15 min {language === 'es' ? 'coche' : 'drive'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-3 text-xs">
            <div className="bg-white/10 rounded-xl p-2.5 border border-amber-300/30 flex items-start gap-2.5">
              <div className="bg-amber-400 text-stone-900 font-bold px-2 py-1 rounded-lg text-xs font-cinzel shrink-0">
                17:00 – 19:00
              </div>
              <div>
                <p className="font-bold text-amber-200">
                  Palmanova, Magaluf y Son Ferrer
                </p>
                <p className="text-[11px] text-amber-100/80">
                  {language === 'es'
                    ? '3 pases consecutivos de 25 min + 15 min de trayecto entre hogares.'
                    : '3 consecutive slots of 25 min + 15 min travel buffer between homes.'}
                </p>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 border border-amber-300/30 flex items-start gap-2.5">
              <div className="bg-[#FCF9F2] text-[#8A0F1A] font-bold px-2 py-1 rounded-lg text-xs font-cinzel shrink-0">
                {language === 'es' ? 'A partir 19:25' : 'From 19:25'}
              </div>
              <div>
                <p className="font-bold text-amber-200">
                  Santa Ponsa y Andratx
                </p>
                <p className="text-[11px] text-amber-100/80">
                  {language === 'es'
                    ? 'Pases de tarde-noche (Pase 4 enlace 19:00-19:25, luego Santa Ponsa, Peguera y Andratx).'
                    : 'Late slots (slot 4 link 19:00-19:25, then Santa Ponsa, Peguera & Andratx).'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Zone Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Zone Selection Buttons */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-2 gap-2.5">
            {CALVIA_ZONES.map((zone) => {
              const isSelected = zone.name === selectedZoneName;
              return (
                <button
                  key={zone.name}
                  type="button"
                  onClick={() => setSelectedZoneName(zone.name)}
                  className={`text-left p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-100/70 border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                      : 'bg-[#F9F4E8]/60 border-stone-200/80 hover:bg-stone-100/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#8A0F1A]' : 'text-stone-400'}`} />
                      <span className="font-cinzel text-xs font-bold text-stone-900 truncate">
                        {zone.name}
                      </span>
                    </div>
                    {zone.routeBlockEs && (
                      <span className="block text-[9px] text-amber-900 font-semibold mb-1 line-clamp-1">
                        🚗 {language === 'es' ? zone.routeBlockEs.split('(')[0] : (zone.routeBlockEn ? zone.routeBlockEn.split('(')[0] : '')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-200/60">
                    <span className="text-emerald-700 font-medium text-[10px]">
                      {language === 'es' ? '0€ suplemento' : '0€ extra'}
                    </span>
                    <span className="text-amber-800 font-bold tabular-nums">
                      {zone.slotsRemaining} {t.zoneSlots}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Zone Detail Card */}
          <div className="lg:col-span-7 bg-[#F9F4E8] rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-amber-300 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#8A0F1A] text-amber-300 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-stone-900">
                    {currentZone.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {language === 'es' ? 'Calvià & Andratx · Mallorca' : 'Calvià & Andratx · Mallorca'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-100/80 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.zoneIncludes}</span>
              </div>
            </div>

            {currentZone.routeBlockEs && (
              <div className="bg-amber-100/70 border border-amber-300/80 rounded-xl p-2.5 mb-4 text-xs flex items-center gap-2 text-amber-950 font-medium">
                <Clock className="w-4 h-4 text-amber-800 shrink-0" />
                <span>
                  <strong>{language === 'es' ? 'Franja de ruta de Santa:' : "Santa's route slot:"}</strong>{' '}
                  {language === 'es' ? currentZone.routeBlockEs : currentZone.routeBlockEn}
                </span>
              </div>
            )}

            <p className="text-stone-700 text-sm leading-relaxed mb-6 font-sans">
              {language === 'es'
                ? currentZone.description
                : (currentZone.descriptionEn || currentZone.description)}
            </p>

            {/* Highlighted Urbanizations */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800 font-cinzel mb-2">
                {language === 'es' ? 'Urbanizaciones y Calles Frecuentes:' : 'Frequent Areas & Urbanizations:'}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {currentZone.highlightUrbanizations.map((urb) => (
                  <span
                    key={urb}
                    className="bg-white/90 text-stone-700 border border-stone-300/80 px-2.5 py-1 rounded-lg font-medium"
                  >
                    📍 {urb}
                  </span>
                ))}
              </div>
            </div>

            {/* Real Availability Status */}
            <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5 mb-6 flex items-center justify-between text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {language === 'es'
                    ? `Disponibilidad estimada en ${currentZone.name}:`
                    : `Estimated availability in ${currentZone.name}:`}
                </span>
              </div>
              <span className="font-bold text-[#8A0F1A] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {currentZone.slotsRemaining} {t.zoneSlots}
              </span>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={() => onSelectZone(currentZone.name)}
              className="w-full bg-[#8A0F1A] hover:bg-[#A61C24] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'es'
                  ? `Reservar Visita Privada en ${currentZone.name}`
                  : `Book Private Visit in ${currentZone.name}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
