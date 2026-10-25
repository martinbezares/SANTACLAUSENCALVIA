import React, { useState } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Trash2,
  FileText,
  Clock,
  Compass,
  Navigation,
  Copy,
  MessageSquare,
  Sparkles,
  Car,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  RotateCcw,
} from 'lucide-react';
import { Booking, Language, ScheduleSlot } from '../types';
import {
  CALCULATED_SCHEDULE_SLOTS,
  VISIT_DURATION_MIN,
  TRAVEL_BUFFER_MIN,
  SLOT_CYCLE_MIN,
} from '../data/santaData';

interface MyBookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onOpenVoucher: (booking: Booking) => void;
  onDeleteBooking: (id: string) => void;
  language: Language;
}

export const MyBookingsDrawer: React.FC<MyBookingsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onOpenVoucher,
  onDeleteBooking,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'route'>('requests');
  const [assignedTimes, setAssignedTimes] = useState<Record<string, string>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [autoScheduledMsg, setAutoScheduledMsg] = useState<string | null>(null);
  const [manualOrder, setManualOrder] = useState<string[]>([]);

  if (!isOpen) return null;

  // Sort bookings for the Route Sheet:
  // 1. By Date
  // 2. By manual order if set, or by geographical routeOrder (Palmanova -> Magaluf -> El Toro -> Santa Ponsa -> Andratx, etc.)
  const sortedForRoute = [...bookings].sort((a, b) => {
    if (a.dateKey !== b.dateKey) {
      return a.dateKey.localeCompare(b.dateKey);
    }
    const idxA = manualOrder.indexOf(a.id);
    const idxB = manualOrder.indexOf(b.id);
    if (idxA !== -1 && idxB !== -1) {
      return idxA - idxB;
    }
    const orderA = a.routeOrder ?? 99;
    const orderB = b.routeOrder ?? 99;
    return orderA - orderB;
  });

  const moveStop = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedForRoute.length) return;
    const currentOrderIds = sortedForRoute.map((b) => b.id);
    const temp = currentOrderIds[index];
    currentOrderIds[index] = currentOrderIds[targetIndex];
    currentOrderIds[targetIndex] = temp;
    setManualOrder(currentOrderIds);
  };

  const resetToGeographicalOrder = () => {
    setManualOrder([]);
    setAutoScheduledMsg(
      language === 'es'
        ? 'Restablecido al orden geográfico natural de Santa'
        : "Reset to Santa's natural geographical route order"
    );
    setTimeout(() => setAutoScheduledMsg(null), 3000);
  };

  // Automatic timetable assignment based on 25m visit + 15m travel buffer (40m cycle)
  const handleAutoAssignTimes = () => {
    const newTimes: Record<string, string> = { ...assignedTimes };

    // Group bookings by dateKey
    const byDate: Record<string, Booking[]> = {};
    sortedForRoute.forEach((b) => {
      if (!byDate[b.dateKey]) byDate[b.dateKey] = [];
      byDate[b.dateKey].push(b);
    });

    Object.keys(byDate).forEach((dateKey) => {
      const dateBookings = byDate[dateKey];
      const is24Dec = dateKey.includes('12-24');
      const allowedSlots = CALCULATED_SCHEDULE_SLOTS.filter(
        (s) => !is24Dec || s.isDec24Allowed
      );

      dateBookings.forEach((b, idx) => {
        if (idx < allowedSlots.length) {
          const slot = allowedSlots[idx];
          newTimes[b.id] = `${slot.startTime}–${slot.endTime} (Pase ${slot.slotNumber})`;
        } else {
          // Extra slot outside standard capacity
          const baseMinutes = 17 * 60 + idx * SLOT_CYCLE_MIN;
          const h = Math.floor(baseMinutes / 60);
          const m = baseMinutes % 60;
          const endM = m + VISIT_DURATION_MIN;
          const endH = h + Math.floor(endM / 60);
          const formatTime = (hour: number, min: number) =>
            `${String(hour).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
          newTimes[b.id] = `${formatTime(h, m)}–${formatTime(endH, endM)} (Extra)`;
        }
      });
    });

    setAssignedTimes(newTimes);
    setAutoScheduledMsg(
      language === 'es'
        ? `✅ Horarios auto-asignados (25 min visita + 15 min desplazamiento en coche por parada)`
        : `✅ Times auto-assigned (25 min visit + 15 min driving buffer per stop)`
    );
    setTimeout(() => setAutoScheduledMsg(null), 3500);
  };

  const handleTimeChange = (id: string, time: string) => {
    setAssignedTimes((prev) => ({ ...prev, [id]: time }));
  };

  const copyRouteSummary = () => {
    const lines = sortedForRoute.map((b, idx) => {
      const confirmedTime = assignedTimes[b.id] || (language === 'es' ? '(Hora pendiente de ruta)' : '(Route time pending)');
      const nextBooking = sortedForRoute[idx + 1];
      const nextTransit =
        nextBooking && nextBooking.dateKey === b.dateKey
          ? language === 'es'
            ? ` → 🚗 15 min desplazamiento hacia ${nextBooking.zone}`
            : ` → 🚗 15 min drive to ${nextBooking.zone}`
          : '';
      return `${idx + 1}. [${b.zone}] ${b.address} · ${b.fullName} · Estado: ${b.timeSlot} · ${
        language === 'es' ? 'Horario asignado (25m visita):' : 'Assigned (25m visit):'
      } ${confirmedTime}${nextTransit} · Tel: ${b.phone}`;
    });
    const text =
      language === 'es'
        ? `🎅 HOJA DE RUTA DE SANTA EN CALVIÀ & ANDRATX (25 MIN VISITA + 15 MIN COCHE):\n• 17:00 a 19:00: Palmanova, Magaluf y Son Ferrer\n• A partir del último pase (19:25): Santa Ponsa y Andratx\n\n${lines.join(
            '\n\n'
          )}\n\nOrdenada geográficamente para que el cliente no elija horas arbitrarias y todo funcione sin retrasos.`
        : `🎅 SANTA'S ROUTE SHEET ACROSS CALVIÀ & ANDRATX (25 MIN VISIT + 15 MIN DRIVING BUFFER):\n• 17:00 to 19:00: Palmanova, Magaluf & Son Ferrer\n• From last pass (19:25) onwards: Santa Ponsa & Andratx\n\n${lines.join(
            '\n\n'
          )}\n\nOrganized geographically so clients do not pick arbitrary hours, ensuring zero delays.`;
    navigator.clipboard.writeText(text);
    setCopiedCode('all');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const getWhatsAppRouteConfirmUrl = (booking: Booking, assignedTime?: string) => {
    const timeText = assignedTime
      ? language === 'es'
        ? `a las ${assignedTime}`
        : `at ${assignedTime}`
      : language === 'es'
      ? 'según la ruta geográfica asignada'
      : 'according to the assigned route order';

    const msg = encodeURIComponent(
      language === 'es'
        ? `¡Hola Familia ${booking.fullName}! 🎅🚗\nYa hemos organizado la ruta geográfica de Santa para el ${booking.dateLabel}.\n\nTu visita está programada ${timeText} en ${booking.zone} (${booking.address}).\n\n⏱️ Duración de la visita: 25 minutos con Santa y su Elfo.\n🚗 Desplazamiento en coche: Contamos con 15 minutos de margen para garantizar puntualidad absoluta.\n\nPor favor tened los regalos o cartas listos para entregarlos discretamente cuando lleguemos a la calle. ¡Nos vemos muy pronto!`
        : `Hello ${booking.fullName} Family! 🎅🚗\nWe have organized Santa's geographical route for ${booking.dateLabel}.\n\nYour visit is scheduled ${timeText} at ${booking.zone} (${booking.address}).\n\n⏱️ Visit duration: 25 minutes with Santa and his Elf.\n🚗 Travel buffer: We strictly allocate 15 minutes of car transit to ensure complete punctuality.\n\nPlease have the gifts or letters ready to hand over discreetly when we arrive on your street. See you very soon!`
    );
    return `https://wa.me/${booking.phone.replace(/[^0-9]/g, '') || '34661532237'}?text=${msg}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#FCF9F2] w-full max-w-lg h-full shadow-2xl border-l border-amber-300 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-200 bg-[#F9F4E8] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#8A0F1A] text-amber-300 flex items-center justify-center font-bold">
                🎅
              </div>
              <div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-stone-900 leading-tight">
                  {language === 'es' ? 'Gestión de Visitas de Santa' : 'Santa Visits Management'}
                </h3>
                <p className="text-[11px] text-stone-500 font-sans">
                  {language === 'es'
                    ? '25 min visita + 15 min desplazamiento en coche'
                    : '25 min visit + 15 min car travel buffer'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={language === 'es' ? 'Cerrar' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Switch tabs: Requests vs Route Sheet */}
          <div className="flex bg-stone-200/80 p-1 rounded-xl mt-3 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-1.5 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'requests'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#8A0F1A]" />
              <span>
                {language === 'es' ? 'Mis Solicitudes' : 'My Requests'} ({bookings.length})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('route')}
              className={`flex-1 py-1.5 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'route'
                  ? 'bg-white text-[#8A0F1A] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {language === 'es' ? 'Hoja de Ruta (Ordenada)' : 'Route Sheet (Ordered)'}
              </span>
            </button>
          </div>
        </div>

        {/* Tab 1: Requests list */}
        {activeTab === 'requests' && (
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3.5">
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs sm:text-sm space-y-2">
                <div className="text-3xl">🎅✨</div>
                <p className="font-semibold text-stone-700">
                  {language === 'es'
                    ? 'No hay solicitudes registradas en este dispositivo todavía.'
                    : 'No visit requests recorded on this device yet.'}
                </p>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  {language === 'es'
                    ? 'Envía una solicitud eligiendo tu fecha y franja horaria preferida.'
                    : 'Submit a request choosing your preferred date and time window.'}
                </p>
              </div>
            ) : (
              bookings.map((booking) => {
                const assigned = assignedTimes[booking.id];
                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl p-4 border border-amber-300 shadow-xs space-y-2.5 text-xs text-stone-700 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <span className="font-mono text-[#8A0F1A] font-bold text-xs">
                        {booking.code}
                      </span>
                      <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-300 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {assigned
                          ? `${language === 'es' ? 'Hora asignada:' : 'Assigned:'} ${assigned}`
                          : language === 'es'
                          ? 'Solicitud · Pendiente de ruta'
                          : 'Request · Route pending'}
                      </span>
                    </div>

                    <div>
                      <p className="font-bold text-stone-900 font-cinzel text-sm">
                        {booking.fullName}
                      </p>
                      <p className="text-stone-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>
                          <strong>{booking.zone}</strong> · {booking.address}
                        </span>
                      </p>
                      <p className="text-stone-600 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="font-medium text-stone-800">{booking.dateLabel}</span>
                      </p>
                      <p className="text-stone-600 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>
                          {language === 'es' ? 'Preferencia:' : 'Preference:'}{' '}
                          <strong className="text-blue-900">{booking.timeSlot}</strong>
                        </span>
                      </p>
                    </div>

                    <div className="bg-amber-50/70 p-2.5 rounded-xl text-[11px] text-amber-950 space-y-0.5 border border-amber-100">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{booking.packageName}</span>
                        <span className="font-mono font-bold text-[#8A0F1A]">{booking.price}€</span>
                      </div>
                      <p className="text-stone-600 truncate">
                        {language === 'es' ? 'Niños:' : 'Children:'} {booking.kidsInfo}
                      </p>
                      {booking.notes && (
                        <p className="text-stone-500 italic text-[10px] truncate">
                          {language === 'es' ? 'Nota:' : 'Note:'} {booking.notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-1 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenVoucher(booking)}
                        className="bg-amber-500 hover:bg-amber-600 text-red-950 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition text-xs cursor-pointer shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{language === 'es' ? 'Ver Ficha' : 'View Voucher'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteBooking(booking.id)}
                        className="text-stone-400 hover:text-red-700 p-1.5 rounded-lg transition cursor-pointer"
                        title={language === 'es' ? 'Eliminar solicitud local' : 'Remove local request'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Route Sheet organized by geographical route */}
        {activeTab === 'route' && (
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
            {/* Route explainer badge */}
            <div className="bg-gradient-to-r from-red-900 to-[#750A13] text-amber-100 p-3.5 rounded-2xl text-xs space-y-2 shadow-md">
              <div className="flex items-center gap-1.5 font-cinzel font-bold text-amber-300">
                <Navigation className="w-4 h-4" />
                <span>
                  {language === 'es'
                    ? 'Hoja de Ruta Geográfica de Santa 🚗🎅'
                    : "Santa's Geographical Route Sheet 🚗🎅"}
                </span>
              </div>
              <p className="text-[11px] text-amber-100/90 leading-relaxed">
                {language === 'es'
                  ? 'Planificación diaria: 25 min de visita en casa + 15 min de desplazamiento en carretera (ciclo 40 min):'
                  : 'Daily route: 25 min home visit + 15 min driving buffer (40 min cycle):'}
              </p>
              <div className="bg-black/35 p-2 rounded-lg font-mono text-[10px] text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="bg-amber-400 text-black font-bold px-1.5 py-0.5 rounded text-[9px]">17:00–19:00</span>
                  <span>Palmanova → Magaluf → Son Ferrer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-red-400 text-black font-bold px-1.5 py-0.5 rounded text-[9px]">{language === 'es' ? 'A partir 19:25' : 'From 19:25'}</span>
                  <span>Santa Ponsa → Andratx (& Port d’Andratx)</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-amber-200/90">
                <span className="bg-white/10 px-2 py-0.5 rounded">
                  {language === 'es' ? '🏠 25 min visita' : '🏠 25 min visit'}
                </span>
                <span className="bg-white/10 px-2 py-0.5 rounded">
                  {language === 'es' ? '🚗 15 min coche' : '🚗 15 min driving'}
                </span>
                <span className="bg-white/10 px-2 py-0.5 rounded">
                  {language === 'es' ? '⚡ 7 turnos/día (3 en 24 Dic)' : '⚡ 7 slots/day (3 on Dec 24)'}
                </span>
              </div>
            </div>

            {/* Auto-Schedule Action Button */}
            {sortedForRoute.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleAutoAssignTimes}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-red-950 font-bold py-2.5 px-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-red-950" />
                    <span>
                      {language === 'es'
                        ? 'Auto-Asignar Horarios (25m + 15m Coche)'
                        : 'Auto-Assign Times (25m + 15m Car)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={copyRouteSummary}
                    className="inline-flex items-center justify-center gap-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold py-2 px-3 rounded-xl transition cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-stone-600" />
                    <span>
                      {copiedCode === 'all'
                        ? language === 'es'
                          ? '¡Ruta Copiada!'
                          : 'Copied!'
                        : language === 'es'
                        ? 'Copiar Hoja'
                        : 'Copy Sheet'}
                    </span>
                  </button>

                  {manualOrder.length > 0 && (
                    <button
                      type="button"
                      onClick={resetToGeographicalOrder}
                      className="inline-flex items-center justify-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-semibold py-2 px-3 rounded-xl transition cursor-pointer"
                      title={language === 'es' ? 'Restablecer a orden este → oeste' : 'Reset to east → west route'}
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-800" />
                      <span>{language === 'es' ? 'Restablecer Ruta' : 'Reset Route'}</span>
                    </button>
                  )}
                </div>

                {autoScheduledMsg && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-[11px] font-semibold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{autoScheduledMsg}</span>
                  </div>
                )}
              </div>
            )}

            {sortedForRoute.length === 0 ? (
              <div className="bg-white rounded-2xl p-5 border border-stone-200 text-center space-y-2 text-xs text-stone-600">
                <p className="font-semibold text-stone-800">
                  {language === 'es'
                    ? 'No hay visitas pendientes en la hoja de ruta.'
                    : 'No pending visits in the route sheet.'}
                </p>
                <p className="text-[11px] text-stone-500">
                  {language === 'es'
                    ? 'Cuando las familias envíen su solicitud, aquí se ordenarán automáticamente según su proximidad geográfica.'
                    : 'As requests arrive, they will automatically be arranged here based on geographical proximity.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold text-stone-700">
                    {sortedForRoute.length}{' '}
                    {sortedForRoute.length === 1
                      ? language === 'es'
                        ? 'parada planificada'
                        : 'planned stop'
                      : language === 'es'
                      ? 'paradas planificadas'
                      : 'planned stops'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {language === 'es'
                      ? 'Ordenadas por zona para no saltar entre pueblos'
                      : 'Sorted by zone to eliminate cross-town driving'}
                  </span>
                </div>

                {sortedForRoute.map((booking, index) => {
                  const assigned = assignedTimes[booking.id] || '';
                  const nextBooking = sortedForRoute[index + 1];
                  const hasNextInSameDate = nextBooking && nextBooking.dateKey === booking.dateKey;
                  const is24Dec = booking.dateKey.includes('12-24');
                  const allowedSlots = CALCULATED_SCHEDULE_SLOTS.filter(
                    (s) => !is24Dec || s.isDec24Allowed
                  );

                  return (
                    <React.Fragment key={booking.id}>
                      <div className="bg-white rounded-2xl p-3.5 border-2 border-amber-300/80 shadow-xs space-y-2.5 relative">
                        {/* Stop number badge & Zone */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#8A0F1A] text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>
                            <span className="font-bold text-stone-900 text-xs font-cinzel">
                              {booking.zone}
                            </span>
                            {/* Reorder stop buttons */}
                            <div className="flex items-center gap-0.5 ml-1">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => moveStop(index, 'up')}
                                className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-20 disabled:cursor-not-allowed rounded hover:bg-stone-100 transition cursor-pointer"
                                title={language === 'es' ? 'Mover parada antes' : 'Move stop earlier'}
                                aria-label={language === 'es' ? 'Mover parada antes' : 'Move stop earlier'}
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={index === sortedForRoute.length - 1}
                                onClick={() => moveStop(index, 'down')}
                                className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-20 disabled:cursor-not-allowed rounded hover:bg-stone-100 transition cursor-pointer"
                                title={language === 'es' ? 'Mover parada después' : 'Move stop later'}
                                aria-label={language === 'es' ? 'Mover parada después' : 'Move stop later'}
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <span className="text-[10px] bg-stone-100 text-stone-600 font-mono px-2 py-0.5 rounded">
                            {booking.dateLabel.split('·')[0]}
                          </span>
                        </div>

                        {/* Family & Contact details */}
                        <div className="text-xs text-stone-700 space-y-0.5 pl-8">
                          <p className="font-semibold text-stone-900">
                            {booking.fullName} · {booking.address}
                          </p>
                          <p className="text-stone-500 text-[11px]">
                            {language === 'es' ? 'Preferencia cliente:' : 'Client preference:'}{' '}
                            <strong className="text-blue-900">{booking.timeSlot}</strong>
                          </p>
                          <p className="text-stone-500 text-[11px]">
                            {language === 'es' ? 'Contacto:' : 'Contact:'}{' '}
                            <a href={`tel:${booking.phone}`} className="text-blue-700 underline font-mono">
                              {booking.phone}
                            </a>
                          </p>
                        </div>

                        {/* Quick timetable selector & custom input */}
                        <div className="pt-2 border-t border-stone-100 pl-8 space-y-2">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="flex items-center gap-1.5 flex-1">
                              <label className="text-[11px] font-bold text-stone-700 shrink-0">
                                {language === 'es' ? 'Turno asignado:' : 'Assigned slot:'}
                              </label>
                              <select
                                value={assigned}
                                onChange={(e) => handleTimeChange(booking.id, e.target.value)}
                                className="text-xs border border-stone-300 rounded-lg px-2 py-1.5 bg-stone-50 font-semibold text-stone-900 flex-1 min-h-[36px]"
                              >
                                <option value="">
                                  {language === 'es' ? '-- Seleccionar pase --' : '-- Choose slot --'}
                                </option>
                                {allowedSlots.map((s) => (
                                  <option
                                    key={s.id}
                                    value={`${s.startTime}–${s.endTime} (Pase ${s.slotNumber})`}
                                  >
                                    Pase {s.slotNumber}: {s.startTime}–{s.endTime} (25 min)
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Direct WhatsApp button to confirm time to customer */}
                            <a
                              href={getWhatsAppRouteConfirmUrl(booking, assigned)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-2 px-3 rounded-lg shadow-xs transition cursor-pointer whitespace-nowrap"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>
                                {language === 'es' ? 'Confirmar a Cliente' : 'Confirm to Family'}
                              </span>
                            </a>
                          </div>

                          {/* 25 min + 15 min buffer summary badge */}
                          <div className="flex items-center gap-2 text-[10px] text-stone-500 bg-stone-50 p-1.5 rounded-lg border border-stone-100">
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>
                              {language === 'es'
                                ? '⏱️ 25 min en hogar + 15 min margen coche para salida puntual'
                                : '⏱️ 25 min in home + 15 min transit buffer for punctual departure'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Travel Buffer Connector Ribbon between Stop N and Stop N+1 */}
                      {hasNextInSameDate && (
                        <div className="flex items-center justify-center my-1 pl-8">
                          <div className="w-full bg-amber-100/80 border border-amber-300/80 rounded-xl px-3 py-1.5 flex items-center justify-between text-[10px] text-amber-900 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Car className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                              <span>
                                {language === 'es'
                                  ? `15 min en coche hacia ${nextBooking.zone}`
                                  : `15 min drive towards ${nextBooking.zone}`}
                              </span>
                            </span>
                            <span className="font-semibold text-amber-800">
                              {language === 'es' ? 'Margen en carretera' : 'Driving buffer'}
                            </span>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-amber-200 bg-[#F9F4E8] text-center shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
          >
            {language === 'es' ? 'Cerrar Panel' : 'Close Panel'}
          </button>
        </div>
      </div>
    </div>
  );
};
