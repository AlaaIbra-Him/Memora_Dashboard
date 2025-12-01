import { useState, useContext } from 'react';
import { ChevronLeft, ChevronRight, X, Clock, Phone, Calendar } from 'lucide-react';
import { AppContext } from '../../../App';

export default function WeeklySchedule({ appointments, handleCancelAppointment }) {
    const { darkMode, t, language } = useContext(AppContext);
    const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));

    function getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }

    function getWeekDays(startDate) {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            days.push(day);
        }
        return days;
    }

    function getDayName(dayIndex) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return t[days[dayIndex]];
    }

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function formatDisplayDate(date) {
        return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
            month: 'short',
            day: 'numeric'
        });
    }

    const weekDays = getWeekDays(currentWeekStart);

    const goToPreviousWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() - 7);
        setCurrentWeekStart(newStart);
    };

    const goToNextWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() + 7);
        setCurrentWeekStart(newStart);
    };

    const getAppointmentsForDay = (date) => {
        const dateStr = formatDate(date);
        return appointments.filter(apt => apt.date === dateStr && apt.status === 'booked');
    };

    const isToday = (date) => {
        const today = new Date();
        return formatDate(date) === formatDate(today);
    };

    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transition-colors`}>
            
            {/* Header */}
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-linear-to-r from-[#0B8FAC] to-blue-600'} text-white p-6`}>
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <Calendar size={22} className="text-[#0B8FAC]"/>
                        {t.weeklySchedule}
                    </h3>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={goToPreviousWeek}
                            className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-blue-700'}`}
                            title={t.previousWeek}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-semibold min-w-[120px] text-center">
                            {formatDisplayDate(weekDays[0])} - {formatDisplayDate(weekDays[6])}
                        </span>
                        <button
                            onClick={goToNextWeek}
                            className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-blue-700'}`}
                            title={t.nextWeek}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Week Grid */}
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                    {weekDays.map((day, index) => {
                        const dayAppointments = getAppointmentsForDay(day);
                        const isTodayDay = isToday(day);

                        return (
                            <div
                                key={index}
                                className={`rounded-lg border-2 transition ${isTodayDay
                                    ? 'border-[#8ec5d2]'
                                    : darkMode
                                        ? 'border-gray-700 bg-gray-800'
                                        : 'border-gray-200 bg-gray-50'
                                    }`}
                            >
                                {/* Day Header */}
                                <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <div className={`font-bold text-sm ${isTodayDay ? 'text-[#0B8FAC]' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {getDayName(day.getDay())}
                                    </div>
                                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {formatDisplayDate(day)}
                                    </div>
                                </div>

                                {/* Appointments */}
                                <div className="p-2 space-y-2 min-h-[100px] max-h-[300px] overflow-y-auto">
                                    {dayAppointments.length === 0 ? (
                                        <div className={`text-center text-xs py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {t.noAppointmentsToday}
                                        </div>
                                    ) : (
                                        dayAppointments.map((apt) => (
                                            <div
                                                key={apt.id}
                                                className={`p-2 rounded-lg text-xs ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                                                    } border ${darkMode ? 'border-gray-600' : 'border-gray-200'} transition group`}
                                            >
                                                <div className="flex items-start justify-between gap-1">
                                                    <div className="flex-1 min-w-[70px] ">
                                                        <div className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {apt.patient_name}
                                                        </div>
                                                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 flex items-center gap-1`}>
                                                            <Clock size={14} className="text-[#0B8FAC]"/>
                                                            {apt.time}
                                                        </div>

                                                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-1`}>
                                                            <Phone size={14} className="text-[#0B8FAC]" />
                                                            {apt.phone}
                                                        </div>

                                                    </div>
                                                    <button
                                                        onClick={() => handleCancelAppointment(apt.id)}
                                                        className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
                                                        title={t.cancelAppointment}
                                                    >
                                                        <X className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}