import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Copy, Check } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';
import { playSoftSparkleSound } from '../utils/audio';

interface SantaBookCustomizerProps {
  language: Language;
  onApplyToBooking: (notes: string, kids: string) => void;
}

export const SantaBookCustomizer: React.FC<SantaBookCustomizerProps> = ({
  language,
  onApplyToBooking,
}) => {
  const t = translations[language];

  const [childName, setChildName] = useState(language === 'es' ? 'Mateo' : 'Oliver');
  const [childAge, setChildAge] = useState('6');
  const [achievements, setAchievements] = useState(
    language === 'es'
      ? 'Ha aprendido a nadar solo y ayuda a poner la mesa con su hermana Sofía.'
      : 'Learned to swim without floats and always helps set the dinner table with his sister Sophie.'
  );
  const [encouragement, setEncouragement] = useState(
    language === 'es'
      ? 'Recordar recoger los legos de su habitación antes de dormir.'
      : 'Remember to tidy up his Lego blocks before bedtime.'
  );
  const [copied, setCopied] = useState(false);

  // When language switches, if default text is still in use, update to the matching language
  useEffect(() => {
    if (language === 'en') {
      if (childName === 'Mateo') setChildName('Oliver');
      if (achievements.startsWith('Ha aprendido')) {
        setAchievements('Learned to swim without floats and always helps set the dinner table with his sister Sophie.');
      }
      if (encouragement.startsWith('Recordar recoger')) {
        setEncouragement('Remember to tidy up his Lego blocks before bedtime.');
      }
    } else {
      if (childName === 'Oliver') setChildName('Mateo');
      if (achievements.startsWith('Learned to swim')) {
        setAchievements('Ha aprendido a nadar solo y ayuda a poner la mesa con su hermana Sofía.');
      }
      if (encouragement.startsWith('Remember to tidy')) {
        setEncouragement('Recordar recoger los legos de su habitación antes de dormir.');
      }
    }
  }, [language]);

  const handleCopyNotes = () => {
    playSoftSparkleSound();
    const formattedNotes =
      language === 'es'
        ? `Niño: ${childName} (${childAge} años). Logros: ${achievements}. Consejo: ${encouragement}`
        : `Child: ${childName} (${childAge} yrs). Achievements: ${achievements}. Advice: ${encouragement}`;
    navigator.clipboard.writeText(formattedNotes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTransferToBooking = () => {
    playSoftSparkleSound();
    const formattedNotes =
      language === 'es'
        ? `Logros: ${achievements} | Consejo de Santa: ${encouragement}`
        : `Achievements: ${achievements} | Santa's Advice: ${encouragement}`;
    const kidsStr =
      language === 'es'
        ? `${childName} (${childAge} años)`
        : `${childName} (age ${childAge})`;
    onApplyToBooking(formattedNotes, kidsStr);
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-[#FCF9F2]">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest font-bold text-amber-800 font-cinzel mb-1">
            {language === 'es' ? 'PERSONALIZACIÓN SECRETA' : 'SECRET PERSONALIZATION'}
          </p>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#8A0F1A]">
            {t.bookSectionTitle}
          </h2>
          <p className="text-stone-600 text-sm mt-2 font-sans">
            {t.bookSectionDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Form: Inputs */}
          <div className="lg:col-span-6 bg-[#F9F4E8] rounded-2xl p-6 sm:p-7 border border-amber-300 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-amber-200/80">
                <span className="text-xs font-cinzel font-bold text-[#8A0F1A]">
                  {language === 'es' ? 'Ficha Secreta del Libro Dorado' : 'Golden Book Secret Profile'}
                </span>
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300">
                  {language === 'es' ? 'Máximo 3 niños por visita' : 'Max. 3 children per visit'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.childNameLabel}
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full text-base sm:text-xs rounded-xl border border-stone-300 py-2.5 sm:py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]"
                    placeholder={language === 'es' ? 'Ej. Mateo' : 'E.g. Oliver'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {t.childAgeLabel}
                  </label>
                  <input
                    type="text"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full text-base sm:text-xs rounded-xl border border-stone-300 py-2.5 sm:py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 min-h-[44px]"
                    placeholder="6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.achievementsLabel}
                </label>
                <textarea
                  rows={2}
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  className="w-full text-base sm:text-xs rounded-xl border border-stone-300 py-2.5 sm:py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder={language === 'es' ? 'Lo que más le enorgullece...' : 'Proudest achievements this year...'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.encouragementLabel}
                </label>
                <textarea
                  rows={2}
                  value={encouragement}
                  onChange={(e) => setEncouragement(e.target.value)}
                  className="w-full text-base sm:text-xs rounded-xl border border-stone-300 py-2.5 sm:py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder={language === 'es' ? 'Un detalle cariñoso para mejorar...' : 'A gentle encouraging tip for the year ahead...'}
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-200/80 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleTransferToBooking}
                className="flex-1 bg-[#8A0F1A] hover:bg-[#A61C24] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {language === 'es' ? 'Incluir en mi Reserva' : 'Include in My Booking'}
                </span>
              </button>
              <button
                type="button"
                onClick={handleCopyNotes}
                className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-medium py-2.5 px-3 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                <span>{copied ? (language === 'es' ? 'Copiado' : 'Copied') : (language === 'es' ? 'Copiar texto' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Right Preview: The Gilded Ancient Book */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#FDFBF4] via-[#F9F4E8] to-[#f4ecd7] rounded-2xl p-6 sm:p-8 border-4 border-amber-400 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-2 right-2 text-amber-300/30">
              <BookOpen className="w-28 h-28 -rotate-12" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between border-b-2 border-amber-400/60 pb-3 mb-4">
                <span className="font-cinzel text-xs font-bold text-amber-800 tracking-wider">
                  ★ {t.previewBookBadge} ★
                </span>
                <span className="text-[11px] font-mono text-stone-500">
                  {language === 'es' ? 'Polo Norte · Libro Mayor de los Niños' : "North Pole · Children's Master Ledger"}
                </span>
              </div>

              <div className="space-y-4 font-playfair text-stone-800 text-sm sm:text-base leading-relaxed">
                <p className="italic text-stone-900">
                  {language === 'es' ? (
                    <>
                      «¡Ho, Ho, Ho! Querido/a <strong className="text-[#8A0F1A] underline decoration-amber-400 font-bold">{childName || 'pequeño/a'}</strong> de <span className="font-bold">{childAge || 'varios'}</span> años...»
                    </>
                  ) : (
                    <>
                      «Ho, Ho, Ho! Dearest <strong className="text-[#8A0F1A] underline decoration-amber-400 font-bold">{childName || 'little one'}</strong>, aged <span className="font-bold">{childAge || 'young'}</span>...»
                    </>
                  )}
                </p>

                <p className="text-xs sm:text-sm text-stone-700">
                  {language === 'es' ? 'Mis duendes me han contado desde Laponia que este año:' : 'My elves sent word from Lapland that this year:'}
                </p>

                <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200/80 font-handwriting text-base sm:text-lg text-amber-950 shadow-inner">
                  «{achievements || (language === 'es' ? 'Has demostrado un gran corazón con tu familia...' : 'You have shown a big, generous heart with your family...')}»
                </div>

                <p className="text-xs sm:text-sm text-stone-700">
                  {language === 'es' ? 'Y para el próximo año, tengo una misión especial para ti:' : 'And for the coming year, I have an important mission for you:'}
                </p>

                <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200/80 font-handwriting text-base sm:text-lg text-red-950 shadow-inner">
                  «{encouragement || (language === 'es' ? 'Sigue sonriendo y cuidando de quienes te quieren.' : 'Keep smiling and always caring for those who love you.')}»
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 mt-4 border-t border-amber-300/60 flex items-center justify-between text-xs text-stone-500">
              <span className="font-script text-xl text-[#8A0F1A]">Santa & Katy</span>
              <span>{language === 'es' ? 'Calvià & Andratx · Diciembre 2026' : 'Calvià & Andratx · December 2026'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
