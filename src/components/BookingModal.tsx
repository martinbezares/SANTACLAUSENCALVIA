import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Check,
  ShieldCheck,
  MapPin,
  Clock,
  Send,
  FileText,
  MessageCircle,
  Compass,
  Car,
  Info,
  Loader2,
  ExternalLink,
  AlertTriangle,
  Lock,
  Sliders,
  RefreshCw,
} from 'lucide-react';

const GooglePayIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);
import {
  CALVIA_ZONES,
  PACKAGES,
  VISIT_DATE_CHOICES,
  CALCULATED_SCHEDULE_SLOTS,
  VISIT_DURATION_MIN,
  TRAVEL_BUFFER_MIN,
  SLOT_CYCLE_MIN,
  TIME_WINDOW_OPTIONS,
  STRIPE_CHECKOUT_URLS,
  MAX_VISITS_PER_DAY,
  DEFAULT_BOOKED_COUNTS,
  getStoredDayBookedCounts,
  saveStoredDayBookedCounts,
  FULL_SCHEDULE_MSG_DEC24_ES,
  FULL_SCHEDULE_MSG_DEC24_EN,
  FULL_SCHEDULE_MSG_OTHER_ES,
  FULL_SCHEDULE_MSG_OTHER_EN,
} from '../data/santaData';
import { Booking, Language, PackageTier, PreferredTimeWindow } from '../types';
import { translations } from '../utils/i18n';
import { playSoftSparkleSound } from '../utils/audio';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  originTrigger: string;
  preselectedZone?: string;
  preselectedPackage?: PackageTier | null;
  initialNotes?: string;
  initialKids?: string;
  onBookingSuccess: (booking: Booking) => void;
  onOpenVoucher: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  language,
  originTrigger,
  preselectedZone,
  preselectedPackage,
  initialNotes = '',
  initialKids = '',
  onBookingSuccess,
  onOpenVoucher,
}) => {
  const t = translations[language];

  // Selected date choice
  const [selectedDateId, setSelectedDateId] = useState<string>(VISIT_DATE_CHOICES[5].id);
  // Preferred time window choice (early_evening = 17:00-19:00, evening = 19:00-21:30, flexible)
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<PreferredTimeWindow>('early_evening');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [locationArea, setLocationArea] = useState(preselectedZone || CALVIA_ZONES[0].name);
  const [address, setAddress] = useState('');
  const [kidsInfo, setKidsInfo] = useState(initialKids || '');
  const [specialGiftNotes, setSpecialGiftNotes] = useState(initialNotes || '');

  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isProcessingGPay, setIsProcessingGPay] = useState(false);

  // Quotas state: max 7 visits per day across Calvià
  const [dailyQuotas, setDailyQuotas] = useState<Record<string, number>>(() => getStoredDayBookedCounts());

  // Sync props when opening
  useEffect(() => {
    if (isOpen) {
      setDailyQuotas(getStoredDayBookedCounts());
    }
  }, [isOpen]);

  useEffect(() => {
    if (preselectedZone) {
      setLocationArea(preselectedZone);
    }
  }, [preselectedZone]);

  useEffect(() => {
    if (preselectedPackage) {
      const match = VISIT_DATE_CHOICES.find((d) => d.pkgId === preselectedPackage.id);
      if (match) {
        setSelectedDateId(match.id);
      }
    }
  }, [preselectedPackage]);

  useEffect(() => {
    if (initialNotes) {
      setSpecialGiftNotes(initialNotes);
    }
  }, [initialNotes]);

  useEffect(() => {
    if (initialKids) {
      setKidsInfo(initialKids);
    }
  }, [initialKids]);

  if (!isOpen) return null;

  const selectedDateChoice =
    VISIT_DATE_CHOICES.find((d) => d.id === selectedDateId) || VISIT_DATE_CHOICES[0];
  const is24Dec = !!selectedDateChoice.is24Dec;
  const currentPkg =
    PACKAGES.find((p) => p.id === selectedDateChoice.pkgId) || PACKAGES[0];
  const currentPkgName =
    language === 'es' ? currentPkg.name : (currentPkg.nameEn || currentPkg.name);

  // Capacity calculations for the currently selected date
  const bookedCountForSelectedDate = dailyQuotas[selectedDateChoice.dateKey] ?? 0;
  const isCurrentDateFull = bookedCountForSelectedDate >= MAX_VISITS_PER_DAY;
  const remainingSlotsForSelectedDate = Math.max(0, MAX_VISITS_PER_DAY - bookedCountForSelectedDate);

  const handleDateSelect = (dateId: string) => {
    setSelectedDateId(dateId);
    const match = VISIT_DATE_CHOICES.find((d) => d.id === dateId);
    if (match?.is24Dec && selectedTimeWindow === 'evening') {
      setSelectedTimeWindow('early_evening');
    }
  };

  const handleSimulateFull = (dateId: string) => {
    const target = VISIT_DATE_CHOICES.find((d) => d.id === dateId);
    if (!target) return;
    const updated = {
      ...dailyQuotas,
      [target.dateKey]: MAX_VISITS_PER_DAY,
    };
    setDailyQuotas(updated);
    saveStoredDayBookedCounts(updated);
    setSelectedDateId(target.id);
  };

  const handleResetQuotas = () => {
    setDailyQuotas(DEFAULT_BOOKED_COUNTS);
    saveStoredDayBookedCounts(DEFAULT_BOOKED_COUNTS);
  };

  const getTimeSlotPreferenceText = (windowId: PreferredTimeWindow) => {
    const opt = TIME_WINDOW_OPTIONS.find((o) => o.id === windowId) || TIME_WINDOW_OPTIONS[0];
    return language === 'es' ? opt.labelEs : opt.labelEn;
  };

  const currentStripeUrl =
    (selectedDateChoice as any).stripeCheckoutUrl ||
    STRIPE_CHECKOUT_URLS[currentPkg.id as keyof typeof STRIPE_CHECKOUT_URLS] ||
    'https://buy.stripe.com/test_4gMfZjefM2Oj4xC6zda7C02';

  const handleGPayCheckout = async (fromForm = false) => {
    if (isCurrentDateFull) {
      return;
    }
    setIsProcessingGPay(true);
    playSoftSparkleSound();

    // Increment booked count for this date up to MAX_VISITS_PER_DAY (7)
    const newCount = Math.min(MAX_VISITS_PER_DAY, (dailyQuotas[selectedDateChoice.dateKey] || 0) + 1);
    const newQuotas = {
      ...dailyQuotas,
      [selectedDateChoice.dateKey]: newCount,
    };
    setDailyQuotas(newQuotas);
    saveStoredDayBookedCounts(newQuotas);

    setTimeout(() => {
      setIsProcessingGPay(false);
      const randomNum = Math.floor(100 + Math.random() * 900);
      const code = `SANTA-REQ-#${randomNum}`;
      const zoneObj = CALVIA_ZONES.find((z) => z.name === locationArea);
      const timeLabel = getTimeSlotPreferenceText(selectedTimeWindow);
      const dayLabel = language === 'es' ? selectedDateChoice.dayLabelEs : selectedDateChoice.dayLabelEn;

      const newBooking: Booking = {
        id: `req_${Date.now()}`,
        code,
        fullName: fromForm && fullName.trim() ? fullName.trim() : (language === 'es' ? 'Familia Calvià (Pago Stripe/G-Pay)' : 'Calvià Family (Stripe/G-Pay)'),
        phone: fromForm && phone.trim() ? phone.trim() : '+34 661 532237',
        email: fromForm && email.trim() ? email.trim() : 'solicitud-stripe@cliente.com',
        dateKey: selectedDateChoice.dateKey,
        dateLabel: `${dayLabel} · ${currentPkgName}`,
        timeSlot: timeLabel,
        preferredTimeWindow: selectedTimeWindow,
        zone: locationArea,
        address: fromForm && address.trim() ? address.trim() : (language === 'es' ? 'Dirección confirmada por WhatsApp (Stripe)' : 'Address via WhatsApp (Stripe)'),
        kidsInfo: fromForm && kidsInfo.trim() ? kidsInfo.trim() : (language === 'es' ? 'Los pequeños de la casa (máx. 3 niños)' : 'Children at home (max. 3 kids)'),
        notes: specialGiftNotes || (language === 'es' ? 'Pago tramitado mediante Stripe / G-Pay' : 'Payment processed via Stripe / G-Pay'),
        packageId: currentPkg.id,
        packageName: currentPkgName,
        price: selectedDateChoice.price,
        createdAt: new Date().toISOString(),
        isExpress: !fromForm,
        status: 'solicitud',
        routeOrder: zoneObj?.routeOrder || 99,
        paymentMethod: 'G-Pay (Stripe)',
      };

      setConfirmedBooking(newBooking);
      onBookingSuccess(newBooking);

      // Redirigir directamente al enlace de Stripe del paquete seleccionado
      if (typeof window !== 'undefined') {
        if (window.top && window.top !== window) {
          try {
            window.top.location.href = currentStripeUrl;
          } catch {
            window.location.href = currentStripeUrl;
          }
        } else {
          window.location.href = currentStripeUrl;
        }
      }
    }, 400);
  };

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    handleGPayCheckout(true);
  };

  const resetAndClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = (booking: Booking) => {
    const title = encodeURIComponent(
      language === 'es'
        ? `🎅 Solicitud Visita Santa: ${booking.fullName} (${booking.zone})`
        : `🎅 Santa Visit Request: ${booking.fullName} (${booking.zone})`
    );
    const details = encodeURIComponent(
      language === 'es'
        ? `🎅 Solicitud de Visita de Santa y su Elfo\nCódigo: ${booking.code}\nFecha: ${booking.dateLabel}\nFranja: ${booking.timeSlot}\nDestino: ${booking.address}, ${booking.zone}\n\n${t.timeNoticeImportant}\n${t.timeNoticeRouteDetail}`
        : `🎅 Santa & his Elf Visit Request\nCode: ${booking.code}\nDate: ${booking.dateLabel}\nPreferred slot: ${booking.timeSlot}\nDestination: ${booking.address}, ${booking.zone}\n\n${t.timeNoticeImportant}\n${t.timeNoticeRouteDetail}`
    );
    const location = encodeURIComponent(`${booking.address}, ${booking.zone}, Mallorca`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  // WhatsApp confirmation text
  const getWhatsAppConfirmUrl = (booking: Booking) => {
    const msg = encodeURIComponent(
      language === 'es'
        ? `¡Hola! 🎅 Acabo de enviar mi SOLICITUD DE VISITA DE SANTA Y SU ELFO:\n• Código: ${booking.code}\n• Día: ${booking.dateLabel}\n• ${booking.timeSlot}\n• Zona / Dirección: ${booking.zone} (${booking.address})\n• Tarifa: ${booking.price}€ (desplazamiento incluido)\n• Método de Pago: G-Pay (Google Pay)\n• Niños: ${booking.kidsInfo}\n\n*${t.timeNoticeImportant}*\n${t.timeNoticeRouteDetail}\n\n¡Muchas gracias!`
        : `Hello! 🎅 I have submitted my SANTA & HIS ELF VISIT REQUEST:\n• Code: ${booking.code}\n• Date: ${booking.dateLabel}\n• ${booking.timeSlot}\n• Zone / Address: ${booking.zone} (${booking.address})\n• Price: ${booking.price}€ (travel included)\n• Payment Method: G-Pay (Google Pay)\n• Children: ${booking.kidsInfo}\n\n*${t.timeNoticeImportant}*\n${t.timeNoticeRouteDetail}\n\nThank you!`
    );
    return `https://wa.me/34661532237?text=${msg}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={resetAndClose}
    >
      <div
        className="bg-[#FCF9F2] w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border-t-4 sm:border-4 border-amber-400 overflow-hidden relative flex flex-col max-h-[94vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <header className="bg-gradient-to-r from-[#750A13] via-[#8A0F1A] to-[#750A13] text-white p-3.5 sm:p-5 text-center relative border-b-2 border-amber-400/70 shrink-0">
          <button
            type="button"
            onClick={resetAndClose}
            aria-label={language === 'es' ? 'Cerrar ventana' : 'Close modal'}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 text-amber-200 hover:text-white bg-white/10 hover:bg-white/20 min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <p className="text-[10px] sm:text-[11px] uppercase tracking-widest text-amber-300 font-cinzel font-bold mb-0.5">
            ★ {language === 'es' ? 'EXCLUSIVO EN CALVIÀ & ANDRATX · MALLORCA' : 'EXCLUSIVE IN CALVIÀ & ANDRATX · MALLORCA'} ★
          </p>
          <h2
            id="modalTitle"
            className="text-lg sm:text-2xl font-cinzel font-extrabold text-white text-shadow-red flex items-center justify-center gap-2"
          >
            <span>{t.modalTitle}</span>
          </h2>
          <p className="text-amber-100 text-xs italic font-playfair mt-0.5">
            {language === 'es'
              ? 'Organización de ruta geográfica para máxima puntualidad'
              : 'Geographical route planning for punctual visits'}
          </p>
        </header>

        {/* Modal Body: Switch between Form and Confirmation */}
        {!confirmedBooking ? (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-stone-700 text-sm">
            {/* Exclusive G-PAY Checkout or Full Capacity Banner */}
            {isCurrentDateFull ? (
              <div
                className={`p-4 rounded-2xl border-2 text-center space-y-2 shadow-sm ${
                  is24Dec
                    ? 'bg-gradient-to-r from-[#8A0F1A] via-[#700B15] to-[#8A0F1A] border-amber-400 text-white'
                    : 'bg-amber-50 border-amber-500 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">{is24Dec ? '🎅' : '📅'}</span>
                  <span
                    className={`text-[11px] font-extrabold uppercase tracking-wider font-cinzel ${
                      is24Dec ? 'text-amber-300' : 'text-[#8A0F1A]'
                    }`}
                  >
                    ★ {language === 'es' ? 'CUPO MÁXIMO ALCANZADO (7/7 VISITAS)' : 'MAXIMUM CAPACITY (7/7 VISITS)'} ★
                  </span>
                </div>
                <p
                  className={`font-cinzel text-sm sm:text-base font-black leading-snug ${
                    is24Dec ? 'text-amber-300' : 'text-[#8A0F1A]'
                  }`}
                >
                  {is24Dec
                    ? language === 'es'
                      ? FULL_SCHEDULE_MSG_DEC24_ES
                      : FULL_SCHEDULE_MSG_DEC24_EN
                    : language === 'es'
                    ? FULL_SCHEDULE_MSG_OTHER_ES
                    : FULL_SCHEDULE_MSG_OTHER_EN}
                </p>
                <p className={`text-[11px] font-sans ${is24Dec ? 'text-amber-100' : 'text-stone-600'}`}>
                  {is24Dec
                    ? language === 'es'
                      ? 'Agenda llena para Nochebuena. Elige otra fecha disponible en la lista inferior.'
                      : 'Schedule full for Christmas Eve. Please choose another available date below.'
                    : language === 'es'
                    ? 'Se han cubierto los 7 cupos máximos de visita para este día. Por favor selecciona otra fecha disponible.'
                    : 'All 7 visit slots have been booked for this date. Please select another available date.'}
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-amber-50 to-stone-50 p-3.5 rounded-2xl border-2 border-amber-300 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5 font-cinzel">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {language === 'es' ? 'MÉTODO DE PAGO HABILITADO' : 'ENABLED PAYMENT METHOD'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      <Check className="w-3 h-3 text-emerald-600" />
                      {language === 'es' ? 'G-Pay Habilitado' : 'G-Pay Enabled'}
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-full border border-amber-300">
                      {remainingSlotsForSelectedDate === 1
                        ? (language === 'es' ? '¡Último cupo!' : '1 slot left!')
                        : (language === 'es' ? `${remainingSlotsForSelectedDate} de 7 cupos` : `${remainingSlotsForSelectedDate} of 7 slots`)}
                    </span>
                  </div>
                </div>

                <a
                  href={currentStripeUrl}
                  target="_top"
                  rel="noopener noreferrer"
                  onClick={() => handleGPayCheckout(false)}
                  className="w-full bg-white hover:bg-stone-50 text-stone-900 border-2 border-stone-300 hover:border-amber-400 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-xs transition transform active:scale-[0.99] cursor-pointer text-center"
                >
                  <GooglePayIcon />
                  <span className="font-extrabold text-stone-900 tracking-wide text-sm sm:text-base">G Pay</span>
                  <span className="text-stone-700 font-medium">
                    {language === 'es' ? '· Pago exprés con Stripe / G-Pay' : '· Express Stripe / G-Pay Checkout'} ({selectedDateChoice.price}€)
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
                <p className="text-[10px] text-stone-500 text-center mt-1.5">
                  {language === 'es'
                    ? 'Redirige a la pasarela oficial y segura de Stripe (compatible con G-Pay y tarjeta).'
                    : 'Redirects to the official, secure Stripe checkout (supporting G-Pay and cards).'}
                </p>
              </div>
            )}

            <div className="relative flex items-center justify-center my-1">
              <div className="border-t border-stone-300 w-full"></div>
              <span className="bg-[#FCF9F2] px-3 text-[11px] text-stone-500 font-medium uppercase tracking-wider">
                {language === 'es' ? 'o completa los detalles de tu solicitud' : 'or complete your request details'}
              </span>
            </div>

            {/* Main Booking Form */}
            <form onSubmit={handleFormSubmission} className="space-y-4">
              {/* 1. VISIT DATE: Choose the day */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-800">
                    <Calendar className="w-3.5 h-3.5 inline text-amber-600 mr-1" />
                    {t.preferredDateLabel}
                  </label>
                  <span className="text-[10px] text-stone-500 font-medium">
                    {language === 'es' ? 'Máx. 7 visitas por día' : 'Max. 7 visits per day'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {VISIT_DATE_CHOICES.map((choice) => {
                    const isSelected = selectedDateId === choice.id;
                    const bookedCount = dailyQuotas[choice.dateKey] ?? 0;
                    const isFull = bookedCount >= MAX_VISITS_PER_DAY;
                    const remaining = Math.max(0, MAX_VISITS_PER_DAY - bookedCount);

                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => handleDateSelect(choice.id)}
                        className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between relative ${
                          isFull
                            ? isSelected
                              ? 'bg-red-50/90 border-red-500 ring-2 ring-red-400/30'
                              : 'bg-stone-50 border-stone-300 hover:bg-stone-100'
                            : isSelected
                            ? 'bg-amber-100 border-amber-600 shadow-sm ring-2 ring-amber-500/20'
                            : 'bg-white border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div>
                          <span className="block font-cinzel text-xs font-bold text-stone-900 leading-tight">
                            {language === 'es' ? choice.dayLabelEs : choice.dayLabelEn}
                          </span>
                          <span className="block text-[10px] text-stone-500 mt-0.5">
                            {choice.is24Dec
                              ? (language === 'es' ? 'Hasta las 19:00' : 'Until 19:00')
                              : (language === 'es' ? 'Tarde / Noche' : 'Evening')}
                          </span>
                        </div>
                        <div className="mt-2 pt-1 border-t border-stone-100 flex items-center justify-between">
                          <span
                            className={`font-cinzel text-xs font-black ${
                              isFull ? 'text-stone-400 line-through' : 'text-[#8A0F1A]'
                            }`}
                          >
                            {choice.price}€
                          </span>
                          {isFull ? (
                            <span className="text-[9px] font-bold text-white bg-red-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" />
                              <span>{language === 'es' ? 'Lleno (7/7)' : 'Full (7/7)'}</span>
                            </span>
                          ) : remaining === 1 ? (
                            <span className="text-[9px] font-extrabold text-amber-900 bg-amber-200 px-1.5 py-0.5 rounded-full animate-pulse">
                              {language === 'es' ? '¡1 libre!' : '1 left!'}
                            </span>
                          ) : (
                            <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                              {language === 'es' ? `${remaining} cupos` : `${remaining} slots`}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Highlight banner if the selected day has reached full quota (7/7) */}
                {isCurrentDateFull && (
                  <div
                    className={`mt-3 p-4 sm:p-5 rounded-2xl border-2 shadow-md space-y-2 text-center animate-in fade-in duration-200 ${
                      is24Dec
                        ? 'bg-gradient-to-r from-[#8A0F1A] via-[#700B15] to-[#8A0F1A] text-white border-amber-400'
                        : 'bg-amber-50 border-amber-500 text-amber-950'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 mx-auto rounded-full flex items-center justify-center text-xl shadow-inner ${
                        is24Dec
                          ? 'bg-amber-400/20 border-2 border-amber-300'
                          : 'bg-amber-200 border border-amber-400'
                      }`}
                    >
                      {is24Dec ? '🎅' : '📅'}
                    </div>
                    <div
                      className={`inline-block text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full font-cinzel ${
                        is24Dec
                          ? 'bg-amber-300 text-stone-900'
                          : 'bg-[#8A0F1A] text-amber-200'
                      }`}
                    >
                      ★ {is24Dec ? (language === 'es' ? 'NOCHEBUENA · 7/7 CUPOS CUBIERTOS' : 'CHRISTMAS EVE · 7/7 SLOTS FILLED') : (language === 'es' ? '7 DE 7 VISITAS RESERVADAS' : '7 OF 7 VISITS BOOKED')} ★
                    </div>
                    <h3
                      className={`font-cinzel text-base sm:text-lg font-black leading-snug ${
                        is24Dec ? 'text-amber-300' : 'text-[#8A0F1A]'
                      }`}
                    >
                      {is24Dec
                        ? language === 'es'
                          ? FULL_SCHEDULE_MSG_DEC24_ES
                          : FULL_SCHEDULE_MSG_DEC24_EN
                        : language === 'es'
                        ? FULL_SCHEDULE_MSG_OTHER_ES
                        : FULL_SCHEDULE_MSG_OTHER_EN}
                    </h3>
                    <p
                      className={`text-xs font-sans max-w-md mx-auto ${
                        is24Dec ? 'text-amber-100' : 'text-stone-700'
                      }`}
                    >
                      {is24Dec
                        ? language === 'es'
                          ? 'Se han reservado todas las 7 visitas permitidas para Nochebuena en Calvià y Andratx. Puedes seleccionar otra de las fechas con plazas libres.'
                          : 'All 7 scheduled visits for Christmas Eve have been booked. Please select another date with open slots.'
                        : language === 'es'
                        ? 'Se han cubierto los 7 cupos máximos de visita para este día. Por favor, selecciona otra de las fechas con plazas disponibles en el selector superior.'
                        : 'All 7 visit slots have been booked for this date. Please select another available date with free slots from above.'}
                    </p>
                  </div>
                )}
              </div>

              {/* 2. PREFERRED TIME WINDOW SELECTION */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  <Clock className="w-3.5 h-3.5 inline text-amber-600 mr-1" />
                  {t.preferredTimeLabel}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TIME_WINDOW_OPTIONS.map((opt) => {
                    const isSelected = selectedTimeWindow === opt.id;
                    const isOptionDisabled = is24Dec && opt.disabledOn24Dec;
                    const labelText = language === 'es' ? opt.labelEs : opt.labelEn;
                    const subText = language === 'es' ? opt.subEs : opt.subEn;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isOptionDisabled}
                        onClick={() => !isOptionDisabled && setSelectedTimeWindow(opt.id)}
                        className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between min-h-[76px] ${
                          isOptionDisabled
                            ? 'opacity-40 bg-stone-100 border-stone-200 cursor-not-allowed'
                            : isSelected
                            ? 'bg-amber-100/90 border-amber-600 shadow-sm ring-2 ring-amber-500/20 cursor-pointer'
                            : 'bg-white border-stone-200 hover:bg-stone-50 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-cinzel text-xs font-bold text-stone-900 leading-tight">
                            {labelText}
                          </span>
                          {isSelected && (
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0 mt-0.5"></span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-500 mt-1 leading-tight">
                          {isOptionDisabled
                            ? (language === 'es'
                                ? 'No disponible en Nochebuena (hasta las 19:00)'
                                : 'Not available on Christmas Eve (ends at 19:00)')
                            : subText}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Important notice and small text specified by user */}
                <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3 sm:p-3.5 space-y-1">
                  <p className="font-bold text-amber-950 text-xs sm:text-sm leading-snug">
                    {t.timeNoticeImportant}
                  </p>
                  <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed">
                    {t.timeNoticeRouteDetail}
                  </p>
                </div>

                {/* Route Flow & Specs (25 min visit + 15 min driving buffer) */}
                <div className="pt-2 border-t border-amber-200/80 grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs">
                  <div className="bg-white/90 p-2 rounded-xl border border-amber-200 shadow-2xs">
                    <span className="block font-cinzel font-bold text-[#8A0F1A] text-xs sm:text-sm">25 min</span>
                    <span className="text-stone-500 font-medium">
                      {language === 'es' ? 'Visita en Casa' : 'In-Home Visit'}
                    </span>
                  </div>
                  <div className="bg-white/90 p-2 rounded-xl border border-amber-200 shadow-2xs">
                    <span className="block font-cinzel font-bold text-amber-800 text-xs sm:text-sm">15 min</span>
                    <span className="text-stone-500 font-medium">
                      {language === 'es' ? 'Margen Coche' : 'Driving Buffer'}
                    </span>
                  </div>
                  <div className="bg-emerald-50/90 p-2 rounded-xl border border-emerald-300 shadow-2xs">
                    <span className="block font-cinzel font-bold text-emerald-800 text-xs sm:text-sm">
                      {language === 'es' ? 'Puntual' : 'Punctual'}
                    </span>
                    <span className="text-emerald-700 font-medium">
                      {language === 'es' ? 'Aviso WhatsApp' : 'WhatsApp Notice'}
                    </span>
                  </div>
                </div>

                <div className="bg-amber-100/80 p-2.5 rounded-xl text-[11px] text-amber-950 font-medium flex flex-col gap-1 text-left border border-amber-300/80">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                    <Compass className="w-3.5 h-3.5 text-[#8A0F1A] shrink-0" />
                    <span>{language === 'es' ? 'Itinerario Diario de Santa (25 min visita + 15 min coche):' : "Santa's Daily Itinerary (25 min visit + 15 min drive):"}</span>
                  </div>
                  <div className="text-[10px] space-y-1 text-stone-800 pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-amber-200 text-amber-950 font-bold px-1.5 py-0.5 rounded text-[9px] shrink-0">17:00–19:00</span>
                      <span className="font-semibold text-stone-800">Palmanova → Magaluf → Son Ferrer</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-red-100 text-[#8A0F1A] font-bold px-1.5 py-0.5 rounded text-[9px] shrink-0">{language === 'es' ? 'A partir 19:25' : 'From 19:25'}</span>
                      <span className="font-semibold text-stone-800">Santa Ponsa → Andratx (y Port d’Andratx)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="fullName">
                    {t.fullNameLabel}
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'es' ? 'Ej. Familia Rodríguez Smith' : 'E.g. Smith Family'}
                    className="w-full text-base sm:text-xs rounded-xl border border-stone-300 focus:border-red-600 focus:ring-1 focus:ring-red-200 py-2.5 sm:py-2 px-3 bg-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="phone">
                    {t.phoneLabel}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+34 661 532 237"
                    className="w-full text-base sm:text-xs rounded-xl border border-stone-300 focus:border-red-600 focus:ring-1 focus:ring-red-200 py-2.5 sm:py-2 px-3 bg-white min-h-[44px]"
                  />
                </div>
              </div>

              {/* Email & Location Area (Calvià & Andratx) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="email">
                    {t.emailLabel}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="family@example.com"
                    className="w-full text-base sm:text-xs rounded-xl border border-stone-300 focus:border-red-600 focus:ring-1 focus:ring-red-200 py-2.5 sm:py-2 px-3 bg-white min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="locationArea">
                    {t.locationAreaLabel}
                  </label>
                  <select
                    id="locationArea"
                    value={locationArea}
                    onChange={(e) => setLocationArea(e.target.value)}
                    className="w-full text-base sm:text-xs rounded-xl border border-stone-300 focus:border-red-600 focus:ring-1 focus:ring-red-200 py-2.5 sm:py-2 px-3 bg-white min-h-[44px]"
                  >
                    {CALVIA_ZONES.map((z) => {
                      const block = language === 'es' ? z.routeBlockEs : z.routeBlockEn;
                      return (
                        <option key={z.name} value={z.name}>
                          {z.name} {block ? `· (${block})` : ''}
                        </option>
                      );
                    })}
                    <option value="Otra zona de Calvià o Andratx">
                      {language === 'es' ? 'Otra zona de Calvià o Andratx' : 'Other area in Calvià or Andratx'}
                    </option>
                  </select>
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="address">
                  {t.addressLabel}
                </label>
                <input
                  id="address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={
                    language === 'es'
                      ? 'Calle, número, urbanización o nombre del chalet (ej. Carrer Major 14)'
                      : 'Street address, villa name, or urbanization (e.g. Carrer Major 14)'
                  }
                  className="w-full text-base sm:text-xs rounded-xl border border-stone-300 focus:border-red-600 focus:ring-1 focus:ring-red-200 py-2.5 sm:py-2 px-3 bg-white min-h-[44px]"
                />
              </div>

              {/* Children Information & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-stone-700" htmlFor="kidsInfo">
                      {t.kidsInfoLabel}
                    </label>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
                      {language === 'es' ? 'Máx. 3 niños' : 'Max. 3 kids'}
                    </span>
                  </div>
                  <input
                    id="kidsInfo"
                    type="text"
                    required
                    value={kidsInfo}
                    onChange={(e) => setKidsInfo(e.target.value)}
                    placeholder={language === 'es' ? 'Ej. Leo (5 años), Emma (8 años) — máx. 3' : 'E.g. Leo (5 yrs), Emma (8 yrs) — max. 3'}
                    className="w-full text-base sm:text-xs rounded-xl border border-stone-300 focus:border-red-600 focus:ring-1 focus:ring-red-200 py-2.5 sm:py-2 px-3 bg-white min-h-[44px]"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    {language === 'es'
                      ? 'Máximo 3 niños por visita para garantizar atención personalizada y tiempo de calidad con cada uno.'
                      : 'Maximum 3 children per visit to guarantee personalized attention and quality time with each child.'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1" htmlFor="specialNotes">
                    {t.specialNotesLabel}
                  </label>
                  <input
                    id="specialNotes"
                    type="text"
                    value={specialGiftNotes}
                    onChange={(e) => setSpecialGiftNotes(e.target.value)}
                    placeholder={language === 'es' ? 'Logros, regalos secretos, anécdotas...' : 'Milestones, secret gifts, anecdotes...'}
                    className="w-full text-base sm:text-xs rounded-xl border border-stone-300 focus:border-red-600 focus:ring-1 focus:ring-red-200 py-2.5 sm:py-2 px-3 bg-white min-h-[44px]"
                  />
                </div>
              </div>

              {/* Route Guarantee Badge */}
              <div className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <strong>{language === 'es' ? 'Organización de ruta garantizada:' : 'Guaranteed Route Planning:'}</strong>{' '}
                  {language === 'es'
                    ? 'Trazamos la ruta geográfica de Santa para cumplir cada visita sin retrasos y te confirmamos la hora exacta.'
                    : 'We chart Santa’s geographical route to fulfill each visit without delays and confirm your exact arrival time.'}
                </span>
              </div>

              {/* Payment Method Badge: Stripe & G-PAY */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-stone-50 border-2 border-amber-300 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GooglePayIcon />
                    <span className="font-bold text-xs text-stone-900 font-cinzel">
                      {language === 'es' ? 'Pago Seguro con Stripe (G-Pay y Tarjeta)' : 'Secure Stripe Checkout (G-Pay & Card)'}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <Check className="w-3 h-3 text-emerald-600" />
                    {language === 'es' ? 'Enlace Oficial' : 'Official Link'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-tight">
                  {language === 'es'
                    ? 'Al enviar se guardarán tus datos de visita y serás redirigido a la pasarela cifrada de Stripe para formalizar el abono.'
                    : 'Upon submitting, your visit details will be recorded and you will be directed to Stripe to complete payment.'}
                </p>
              </div>

              {/* Submit Button or Full Agenda Alert Button */}
              {isCurrentDateFull ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled
                    className="w-full bg-stone-300 text-stone-700 font-extrabold py-3.5 px-6 rounded-xl shadow-inner text-xs sm:text-sm uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2 text-center"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-800" />
                    <span>
                      {is24Dec
                        ? language === 'es'
                          ? 'Agenda Llena 24 Dic · ¡Feliz Navidad!'
                          : 'Schedule Full Dec 24 · Merry Christmas!'
                        : language === 'es'
                        ? 'Santa tiene la agenda llena este día'
                        : "Santa's schedule is full for this day"}
                    </span>
                  </button>
                  <p className="text-[11px] text-red-800 text-center font-bold">
                    {is24Dec
                      ? language === 'es'
                        ? FULL_SCHEDULE_MSG_DEC24_ES
                        : FULL_SCHEDULE_MSG_DEC24_EN
                      : language === 'es'
                      ? '⚠️ Santa tiene la agenda llena este día (7 de 7 visitas cubiertas). Por favor, selecciona otra fecha disponible.'
                      : "⚠️ Santa's schedule is full for this day (7 of 7 slots booked). Please select another date."}
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isProcessingGPay}
                  className="w-full bg-gradient-to-r from-[#8A0F1A] via-red-700 to-[#8A0F1A] hover:from-red-700 hover:to-red-800 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg shadow-red-950/20 transition transform active:scale-[0.99] flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
                >
                  {isProcessingGPay ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>{language === 'es' ? 'Redirigiendo a Stripe...' : 'Redirecting to Stripe...'}</span>
                    </>
                  ) : (
                    <>
                      <GooglePayIcon />
                      <span>
                        {language === 'es' ? 'Enviar Solicitud y Pagar en Stripe' : 'Submit & Pay on Stripe'} · {selectedDateChoice.price}€
                      </span>
                      <ExternalLink className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              )}
            </form>

            {/* Quick Testing & Quota Simulator (Max 7 visits per day) */}
            <div className="pt-3 mt-4 border-t border-amber-200/80 bg-amber-50/70 p-3 rounded-2xl">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-stone-900 flex items-center gap-1.5 font-cinzel">
                  <Sliders className="w-3.5 h-3.5 text-amber-700" />
                  {language === 'es' ? 'Simulador de cupos (Máx. 7 visitas)' : 'Slot simulator (Max. 7 visits)'}
                </span>
                <button
                  type="button"
                  onClick={handleResetQuotas}
                  className="text-stone-600 hover:text-stone-900 text-[11px] underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <RefreshCw className="w-3 h-3 text-stone-500" />
                  {language === 'es' ? 'Reiniciar cupos' : 'Reset quotas'}
                </button>
              </div>
              <p className="text-[10px] text-stone-600 mb-2 leading-tight">
                {language === 'es'
                  ? 'Haz clic para simular que un día alcanza sus 7 visitas y comprobar los mensajes de agenda completa:'
                  : 'Click to simulate a day reaching all 7 visits and verify the full schedule messages:'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSimulateFull('date-24-dec')}
                  className="text-[10px] font-bold bg-[#8A0F1A] hover:bg-red-800 text-white rounded-lg px-2.5 py-1 shadow-xs transition cursor-pointer"
                >
                  {language === 'es' ? '⚡ 24 Dic (Llenar 7/7)' : '⚡ Dec 24 (Fill 7/7)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateFull('date-23-dec')}
                  className="text-[10px] font-bold bg-amber-800 hover:bg-amber-900 text-white rounded-lg px-2.5 py-1 shadow-xs transition cursor-pointer"
                >
                  {language === 'es' ? '⚡ 23 Dic (Llenar 7/7)' : '⚡ Dec 23 (Fill 7/7)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateFull('date-6-dec')}
                  className="text-[10px] font-bold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg px-2.5 py-1 shadow-xs transition cursor-pointer"
                >
                  {language === 'es' ? '⚡ 6 Dic (Llenar 7/7)' : '⚡ Dec 6 (Fill 7/7)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateFull('date-21-dec')}
                  className="text-[10px] font-bold bg-stone-800 hover:bg-stone-900 text-white rounded-lg px-2.5 py-1 shadow-xs transition cursor-pointer"
                >
                  {language === 'es' ? '⚡ 21 Dic (Llenar 7/7)' : '⚡ Dec 21 (Fill 7/7)'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateFull('date-22-dec')}
                  className="text-[10px] font-bold bg-stone-800 hover:bg-stone-900 text-white rounded-lg px-2.5 py-1 shadow-xs transition cursor-pointer"
                >
                  {language === 'es' ? '⚡ 22 Dic (Llenar 7/7)' : '⚡ Dec 22 (Fill 7/7)'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Confirmation Success View with EXACT user-requested copy */
          <div className="p-5 sm:p-8 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner animate-bounce">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>

            {/* Exactly as requested by user */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 p-4 sm:p-5 rounded-2xl shadow-sm text-left max-w-md mx-auto space-y-2">
              <p className="font-cinzel font-bold text-sm sm:text-base text-[#8A0F1A] leading-snug">
                {language === 'es'
                  ? '¡Muchas gracias! 🎅 Tu solicitud de visita de Santa ha sido recibida.'
                  : "Thank you! 🎅 Your Santa Visit request has been received."}
              </p>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {language === 'es'
                  ? "Organizamos la ruta de Santa geográficamente para que cada visita sea puntual. Nos pondremos en contacto contigo para confirmar tu hora exacta de llegada."
                  : "We organise Santa's route geographically to keep every visit running on time. We will confirm your exact arrival time with you."}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1.5 text-left max-w-md mx-auto shadow-xs">
              <div className="flex justify-between items-center pb-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-medium">{t.visitCodeLabel}</span>
                <span className="font-mono text-[#8A0F1A] font-bold text-sm">
                  {confirmedBooking.code}
                </span>
              </div>
              <p>
                <strong>{language === 'es' ? 'Familia:' : 'Family:'}</strong>{' '}
                <span className="font-semibold">{confirmedBooking.fullName}</span>
              </p>
              <p>
                <strong>{language === 'es' ? 'Día de la visita:' : 'Visit date:'}</strong>{' '}
                <span className="font-bold text-[#8A0F1A]">{confirmedBooking.dateLabel}</span>
              </p>
              <p>
                <strong>{language === 'es' ? 'Franja horaria preferida:' : 'Preferred time window:'}</strong>{' '}
                <span className="font-semibold text-stone-800">{confirmedBooking.timeSlot}</span>
              </p>
              <p>
                <strong>{language === 'es' ? 'Zona y Dirección:' : 'Zone & Address:'}</strong>{' '}
                <span>{confirmedBooking.zone} · {confirmedBooking.address}</span>
              </p>
              <p>
                <strong>{language === 'es' ? 'Tarifa:' : 'Price:'}</strong>{' '}
                <span className="font-bold text-stone-900">
                  {confirmedBooking.price}€ ({language === 'es' ? 'desplazamiento 100% incluido' : 'travel 100% included'})
                </span>
              </p>
              <div className="flex items-center justify-between pt-1.5 border-t border-stone-100">
                <span className="font-bold text-stone-600">{language === 'es' ? 'Método de Pago:' : 'Payment Method:'}</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Check className="w-3 h-3 text-emerald-600" />
                  Stripe / G-Pay · {language === 'es' ? 'Enlace Oficial' : 'Official Link'}
                </span>
              </div>
            </div>

            {/* Direct Stripe Payment Action */}
            <div className="pt-1">
              <a
                href={currentStripeUrl}
                target="_top"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#8A0F1A] hover:bg-[#A61C24] text-white font-extrabold py-3.5 px-5 rounded-xl text-xs sm:text-sm shadow-md shadow-red-950/20 transition cursor-pointer text-center"
              >
                <GooglePayIcon />
                <span>
                  {language === 'es' ? 'Ir al Pago Seguro en Stripe' : 'Proceed to Secure Stripe Checkout'} ({confirmedBooking.price}€)
                </span>
                <ExternalLink className="w-4 h-4 text-amber-300" />
              </a>
            </div>

            <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3 text-left text-xs max-w-md mx-auto space-y-1">
              <p className="font-bold text-amber-950 text-xs">
                {t.timeNoticeImportant}
              </p>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {t.timeNoticeRouteDetail}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <a
                href={getWhatsAppConfirmUrl(confirmedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.confirmViaWhatsApp}</span>
              </a>

              <a
                href={getGoogleCalendarUrl(confirmedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow transition cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{t.syncCalendar}</span>
              </a>

              <button
                type="button"
                onClick={() => onOpenVoucher(confirmedBooking)}
                className="inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-red-950 font-bold py-2.5 px-4 rounded-xl text-xs shadow transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{t.viewVoucher}</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={resetAndClose}
                className="text-stone-500 hover:text-stone-800 text-xs font-semibold py-1 px-4 cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
