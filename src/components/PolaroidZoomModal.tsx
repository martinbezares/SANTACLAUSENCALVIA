import React from 'react';
import { X, Sparkles, Calendar } from 'lucide-react';
import { Language } from '../types';

interface PolaroidZoomModalProps {
  photoIndex: number | null;
  onClose: () => void;
  onBook: (trigger: string) => void;
  language: Language;
}

const PHOTO_DETAILS = [
  {
    titleEs: '1. Llegada Triunfal a Domicilio',
    titleEn: '1. Triumphant Doorstep Arrival',
    descEs: 'Papá Noel y su duende tocan la campanilla de plata y llaman suavemente a su puerta. La cara de asombro de los niños al abrir la puerta y ver a Papá Noel en persona es irrepetible.',
    descEn: 'Santa and his cheerful elf helper ring the silver sleigh bells outside your door. The look of pure wonder when children open and see Santa right on their doorstep is magical.',
    tagEs: 'Campanilla de plata · Saludo personalizado',
    tagEn: 'Silver sleigh bells · Personal greeting',
  },
  {
    titleEs: '2. Charla Confidencial y Gran Libro',
    titleEn: '2. Personal Chat & The Golden Book',
    descEs: 'Sentados junto a la chimenea o el árbol, Papá Noel abre su gran libro encuadernado y menciona detalles que solo él podría saber: el nuevo deporte, el cole, o sus buenos actos del año.',
    descEn: 'Gathered by your Christmas tree or fireplace, Santa opens his golden bound book and mentions secrets only he could know: sports tournaments, kind deeds, and gentle encouragement.',
    tagEs: 'Lectura del Gran Libro · Confidencias',
    tagEn: 'Golden Book Reading · Heartfelt Moments',
  },
  {
    titleEs: '3. Reparto de Regalos del Saco Mágico',
    titleEn: '3. Handing Out Gifts from the Saco',
    descEs: 'Papá Noel saca los regalos verdaderos que los padres entregaron discretamente minutos antes. Cada paquete se entrega con solemnidad, emoción y tiempo para fotos familiares.',
    descEn: 'Santa unloads the real family presents from his giant velvet sack. Each gift is handed over with ceremony, smiles, and plenty of time for timeless family portraits.',
    tagEs: 'Saco rojo gigante · Sesión de fotos familiares',
    tagEn: 'Giant velvet sack · Family holiday portraits',
  },
];

export const PolaroidZoomModal: React.FC<PolaroidZoomModalProps> = ({
  photoIndex,
  onClose,
  onBook,
  language,
}) => {
  if (photoIndex === null || photoIndex < 0 || photoIndex >= PHOTO_DETAILS.length) return null;

  const detail = PHOTO_DETAILS[photoIndex];
  const title = language === 'es' ? detail.titleEs : detail.titleEn;
  const desc = language === 'es' ? detail.descEs : detail.descEn;
  const tag = language === 'es' ? detail.tagEs : detail.tagEn;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#FCF9F2] w-full max-w-lg rounded-2xl shadow-2xl border-2 border-amber-400 overflow-hidden relative p-6 text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition cursor-pointer"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest mb-2 font-cinzel">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{tag}</span>
        </div>

        <h3 className="font-cinzel text-xl font-bold text-[#8A0F1A] mb-3">
          {title}
        </h3>

        <p className="text-sm text-stone-600 leading-relaxed mb-6 font-sans">
          {desc}
        </p>

        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 mb-6 text-xs text-amber-900 flex items-center gap-2.5">
          <span className="text-xl">🎄</span>
          <span>
            {language === 'es'
              ? 'Disponible en Calvià: 6 Dic y del 20 al 24 Dic (Santa y su Elfo en todas las visitas).'
              : 'Available in Calvià: Dec 6 & Dec 20 to 24 (Santa & his Elf on all visits).'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onBook(`Foto Polaroid ${photoIndex + 1}`);
            }}
            className="flex-1 bg-gradient-to-r from-[#8A0F1A] to-[#A61C24] hover:from-[#A61C24] hover:to-[#700B15] text-white font-extrabold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-amber-300" />
            <span>
              {language === 'es' ? 'Apartar Esta Experiencia' : 'Book This Experience'}
            </span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
          >
            {language === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
