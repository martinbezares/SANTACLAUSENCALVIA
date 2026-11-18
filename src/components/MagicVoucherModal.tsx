import React from 'react';
import { X, Printer, CheckCircle2, MessageCircle } from 'lucide-react';
import { Booking, Language } from '../types';

interface MagicVoucherModalProps {
  booking: Booking | null;
  onClose: () => void;
  language: Language;
  justPaid?: boolean;
}

export const MagicVoucherModal: React.FC<MagicVoucherModalProps> = ({
  booking,
  onClose,
  language,
  justPaid = false,
}) => {
  if (!booking) return null;

  const isPaid = justPaid || booking.status === 'confirmada';

  const handlePrint = () => {
    window.print();
  };

  const whatsappConfirmUrl = (() => {
    const text =
      language === 'es'
        ? `🎅 ¡Hola! Acabo de realizar el pago de mi visita de Santa Claus.\n\n*Código:* ${booking.code}\n*Familia:* ${booking.fullName}\n*Teléfono:* ${booking.phone}\n*Fecha:* ${booking.dateLabel}\n*Franja:* ${booking.timeSlot}\n*Zona / Dirección:* ${booking.zone} · ${booking.address}\n*Niños:* ${booking.kidsInfo}\n*Notas / Regalos:* ${booking.notes}`
        : `🎅 Hello! I just completed payment for our Santa Claus visit.\n\n*Code:* ${booking.code}\n*Family:* ${booking.fullName}\n*Phone:* ${booking.phone}\n*Date:* ${booking.dateLabel}\n*Window:* ${booking.timeSlot}\n*Zone / Address:* ${booking.zone} · ${booking.address}\n*Children:* ${booking.kidsInfo}\n*Notes / Gifts:* ${booking.notes}`;
    return `https://wa.me/34652390240?text=${encodeURIComponent(text)}`;
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 print:static print:bg-white print:p-0 print:block"
      onClick={onClose}
    >
      <div
        id="printable-santa-voucher"
        className="bg-[#FFFDF7] w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-amber-400 overflow-hidden relative flex flex-col max-h-[95vh] text-stone-800 print:max-h-none print:shadow-none print:rounded-none print:border-4 print:border-amber-500 print:w-full print:max-w-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 text-stone-500 hover:text-stone-800 bg-white/90 p-2 rounded-full border border-stone-200 transition cursor-pointer print:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={language === 'es' ? 'Cerrar' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Paid Celebration Banner (visible on screen after Stripe return, hidden when printing) */}
        {isPaid && (
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white px-4 py-3 flex items-center justify-center gap-2.5 text-center border-b-2 border-amber-400 print:hidden">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <p className="text-xs sm:text-sm font-bold">
              {language === 'es'
                ? '¡Pago confirmado con éxito! Ya puedes imprimir o guardar tu formulario oficial para la visita de Santa.'
                : 'Payment successfully confirmed! You can now print or save your official Santa visit form.'}
            </p>
          </div>
        )}

        {/* Certificate & Printable Visit Form Body */}
        <div className="p-3 sm:p-8 md:p-10 overflow-y-auto print:overflow-visible print:p-6">
          <div className="border-2 sm:border-4 border-double border-amber-500/80 p-3.5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 text-center relative">
            {/* Corner Stars */}
            <div className="absolute top-3 left-3 text-amber-500 text-sm">★</div>
            <div className="absolute top-3 right-3 text-amber-500 text-sm">★</div>
            <div className="absolute bottom-3 left-3 text-amber-500 text-sm">★</div>
            <div className="absolute bottom-3 right-3 text-amber-500 text-sm">★</div>

            <p className="text-[11px] font-cinzel font-bold text-amber-800 uppercase tracking-widest mb-1">
              {language === 'es'
                ? '★ FORMULARIO OFICIAL DE VISITA · POLO NORTE ★'
                : '★ OFFICIAL NORTH POLE VISIT FORM & CERTIFICATE ★'}
            </p>

            <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-[#8A0F1A] mb-1">
              {language === 'es' ? 'Orden de Visita a Domicilio' : 'Home Visit Order of Passage'}
            </h2>

            <p className="font-playfair italic text-xs sm:text-sm text-stone-600 mb-5">
              {language === 'es'
                ? 'Comprobante de reserva e instrucciones para Santa Claus y su Elfo en Calvià & Andratx'
                : 'Booking receipt & visit instructions for Santa Claus and his Elf in Calvià & Andratx'}
            </p>

            <div className="bg-amber-100/50 border border-amber-300 rounded-xl p-4 mb-5 text-left space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-baseline gap-2 border-b border-amber-200/80 pb-1.5">
                <span className="font-bold text-stone-600 shrink-0">
                  {language === 'es' ? 'Familia Asignada:' : 'Assigned Family:'}
                </span>
                <span className="font-cinzel font-black text-stone-900 text-sm sm:text-base text-right">
                  {booking.fullName}
                </span>
              </div>

              <div className="flex justify-between items-baseline gap-2 border-b border-amber-200/80 pb-1.5">
                <span className="font-bold text-stone-600 shrink-0">
                  {language === 'es' ? 'Teléfono / WhatsApp:' : 'Phone / WhatsApp:'}
                </span>
                <span className="font-semibold text-stone-900 text-right">
                  {booking.phone}
                </span>
              </div>

              <div className="flex justify-between items-baseline gap-2 border-b border-amber-200/80 pb-1.5">
                <span className="font-bold text-stone-600 shrink-0">
                  {language === 'es' ? 'Zona y Dirección:' : 'Zone & Address:'}
                </span>
                <span className="font-medium text-stone-900 text-right">
                  {booking.zone} · {booking.address}
                </span>
              </div>

              <div className="flex justify-between items-baseline gap-2 border-b border-amber-200/80 pb-1.5">
                <span className="font-bold text-stone-600 shrink-0">
                  {language === 'es' ? 'Fecha y Horario:' : 'Date & Schedule:'}
                </span>
                <span className="font-bold text-[#8A0F1A] text-right">
                  {booking.dateLabel} · {booking.timeSlot}
                </span>
              </div>

              <div className="flex justify-between items-baseline gap-2 border-b border-amber-200/80 pb-1.5">
                <span className="font-bold text-stone-600 shrink-0">
                  {language === 'es' ? 'Niños Inscritos:' : 'Enrolled Children:'}
                </span>
                <span className="font-medium text-stone-900 text-right">
                  {booking.kidsInfo}
                </span>
              </div>

              {booking.notes && (
                <div className="border-b border-amber-200/80 pb-2 pt-0.5">
                  <span className="font-bold text-stone-600 block mb-0.5">
                    {language === 'es'
                      ? 'Notas para el Gran Libro y Regalos Secretos:'
                      : 'Golden Book Notes & Secret Gifts:'}
                  </span>
                  <p className="text-stone-800 bg-white/75 border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs">
                    {booking.notes}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-baseline gap-2 border-b border-amber-200/80 pb-1.5">
                <span className="font-bold text-stone-600 shrink-0">
                  {language === 'es' ? 'Tarifa Contratada:' : 'Selected Plan:'}
                </span>
                <span className="font-bold text-amber-900 text-right">
                  {booking.packageName} ({booking.price}€ · {language === 'es' ? 'Desplazamiento incluido' : 'Travel included'})
                </span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <span className="font-bold text-stone-600 shrink-0">
                  {language === 'es' ? 'Pago en Stripe:' : 'Stripe Payment:'}
                </span>
                <span className="font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded text-[11px] border border-emerald-300">
                  {isPaid
                    ? language === 'es'
                      ? '✓ PAGADO Y CONFIRMADO (Stripe)'
                      : '✓ PAID & CONFIRMED (Stripe)'
                    : language === 'es'
                    ? 'Stripe / Google Pay / Tarjeta'
                    : 'Stripe / Google Pay / Card'}
                </span>
              </div>

              <p className="text-[10px] text-stone-500 italic mt-2 text-center pt-1">
                {language === 'es'
                  ? 'Planificamos la ruta de Papá Noel por ubicación para minimizar el tiempo de viaje. Nos pondremos en contacto contigo por WhatsApp para confirmar la hora exacta de llegada.'
                  : 'We plan Santa’s route by location to minimise travel time. We will contact you via WhatsApp to confirm your exact arrival time.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-amber-200 text-xs">
              <div className="text-left font-mono text-[11px] text-stone-500">
                <p>
                  REF: <strong className="text-stone-900">{booking.code}</strong>
                </p>
                <p>
                  {language === 'es' ? 'ESTADO:' : 'STATUS:'}{' '}
                  <span
                    className={`font-bold px-2 py-0.5 rounded ${
                      isPaid
                        ? 'text-emerald-900 bg-emerald-100 border border-emerald-300'
                        : 'text-amber-800 bg-amber-100'
                    }`}
                  >
                    {isPaid
                      ? language === 'es'
                        ? 'RESERVA PAGADA · RUTA EN ORGANIZACIÓN'
                        : 'PAID BOOKING · ROUTE IN PROGRESS'
                      : language === 'es'
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
              className="bg-[#8A0F1A] hover:bg-[#A61C24] text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>
                {language === 'es'
                  ? 'Imprimir Formulario / Certificado'
                  : 'Print Visit Form / Certificate'}
              </span>
            </button>
            <a
              href={whatsappConfirmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'es' ? 'Enviar por WhatsApp' : 'Send via WhatsApp'}</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-3 px-5 rounded-xl text-xs sm:text-sm cursor-pointer"
            >
              {language === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
