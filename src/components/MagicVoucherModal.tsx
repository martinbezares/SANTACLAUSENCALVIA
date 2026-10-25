import React from 'react';
import { X, Printer } from 'lucide-react';
import { Booking, Language } from '../types';

interface MagicVoucherModalProps {
  booking: Booking | null;
  onClose: () => void;
  language: Language;
}

export const MagicVoucherModal: React.FC<MagicVoucherModalProps> = ({
  booking,
  onClose,
  language,
}) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFDF7] w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-amber-400 overflow-hidden relative flex flex-col max-h-[95vh] text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 text-stone-500 hover:text-stone-800 bg-white/90 p-2 rounded-full border border-stone-200 transition cursor-pointer print:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={language === 'es' ? 'Cerrar' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Printable Body */}
        <div className="p-3 sm:p-8 md:p-10 overflow-y-auto">
          <div className="border-2 sm:border-4 border-double border-amber-500/80 p-3.5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 text-center relative">
            {/* Corner Stars */}
            <div className="absolute top-3 left-3 text-amber-500 text-sm">★</div>
            <div className="absolute top-3 right-3 text-amber-500 text-sm">★</div>
            <div className="absolute bottom-3 left-3 text-amber-500 text-sm">★</div>
            <div className="absolute bottom-3 right-3 text-amber-500 text-sm">★</div>

            <p className="text-[11px] font-cinzel font-bold text-amber-800 uppercase tracking-widest mb-1">
              {language === 'es'
                ? '★ CERTIFICADO OFICIAL DEL POLO NORTE ★'
                : '★ OFFICIAL NORTH POLE ACCREDITATION ★'}
            </p>

            <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-[#8A0F1A] mb-1">
              {language === 'es' ? 'Orden de Visita a Domicilio' : 'Home Visit Order of Passage'}
            </h2>

            <p className="font-playfair italic text-xs sm:text-sm text-stone-600 mb-6">
              {language === 'es'
                ? 'Expedido por la Oficina Postal Secreta de Santa Claus para Calvià & Andratx'
                : 'Issued by the Secret Post Office of Santa Claus for Calvià & Andratx'}
            </p>

            <div className="bg-amber-100/50 border border-amber-300 rounded-xl p-4 mb-6 text-left space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-baseline border-b border-amber-200/80 pb-1.5">
                <span className="font-bold text-stone-600">
                  {language === 'es' ? 'Familia Asignada:' : 'Assigned Family:'}
                </span>
                <span className="font-cinzel font-black text-stone-900 text-sm sm:text-base">
                  {booking.fullName}
                </span>
              </div>
              <div className="flex justify-between items-baseline border-b border-amber-200/80 pb-1.5">
                <span className="font-bold text-stone-600">
                  {language === 'es' ? 'Zona y Destino:' : 'Zone & Destination:'}
                </span>
                <span className="font-medium text-stone-900">
                  {booking.zone} · {booking.address}
                </span>
              </div>
              <div className="flex justify-between items-baseline border-b border-amber-200/80 pb-1.5">
                <span className="font-bold text-stone-600">
                  {language === 'es' ? 'Fecha y Preferencia:' : 'Date & Preference:'}
                </span>
                <span className="font-bold text-[#8A0F1A] text-right">
                  {booking.dateLabel} · {booking.timeSlot}
                </span>
              </div>
              <div className="flex justify-between items-baseline border-b border-amber-200/80 pb-1.5">
                <span className="font-bold text-stone-600">
                  {language === 'es' ? 'Niños Inscritos:' : 'Enrolled Children:'}
                </span>
                <span className="font-medium text-stone-900">
                  {booking.kidsInfo}
                </span>
              </div>
              <div className="flex justify-between items-baseline border-b border-amber-200/80 pb-1.5">
                <span className="font-bold text-stone-600">
                  {language === 'es' ? 'Plan Seleccionado:' : 'Selected Plan:'}
                </span>
                <span className="font-bold text-amber-900">
                  {booking.packageName} ({booking.price}€)
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-stone-600">
                  {language === 'es' ? 'Método de Pago:' : 'Payment Method:'}
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded text-[11px] border border-emerald-300">
                  G-Pay (Google Pay) ✓ {language === 'es' ? 'Habilitado' : 'Enabled'}
                </span>
              </div>
              <p className="text-[10px] text-stone-500 italic mt-2 text-center">
                {language === 'es'
                  ? 'Planificamos la ruta de Papá Noel por ubicación para minimizar el tiempo de viaje. La hora exacta de llegada se confirmará tras recibir su solicitud.'
                  : 'We plan Santa’s route by location to minimise travel time. Exact arrival time will be confirmed upon receiving your request.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-amber-200 text-xs">
              <div className="text-left font-mono text-[11px] text-stone-500">
                <p>
                  REF: <strong className="text-stone-900">{booking.code}</strong>
                </p>
                <p>
                  {language === 'es' ? 'ESTADO:' : 'STATUS:'}{' '}
                  <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                    {language === 'es'
                      ? 'SOLICITUD REGISTRADA · RUTA EN ORGANIZACIÓN'
                      : 'REQUEST RECORDED · ROUTE IN PROGRESS'}
                  </span>
                </p>
              </div>

              {/* Sello de Lacre */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8A0F1A] to-red-950 text-amber-200 border-2 border-amber-400 flex flex-col items-center justify-center text-[9px] font-bold shadow">
                  <span>{language === 'es' ? 'POLO' : 'NORTH'}</span>
                  <span className="text-[11px]">{language === 'es' ? 'NORTE' : 'POLE'}</span>
                </div>
                <div className="text-left font-script text-2xl text-[#8A0F1A]">
                  Santa Claus
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons (hidden when printing) */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'es' ? 'Imprimir Certificado' : 'Print Certificate'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm cursor-pointer"
            >
              {language === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
