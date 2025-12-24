// eslint-disable-next-line no-unused-vars
import { useState, useContext } from 'react';
import { AppContext } from '../../../App';
import { supabase } from '../../../supabaseClient';
import { useDialog } from '../../../hooks/useDialog';
import StatCard from '../components/StatCard';
import AppointmentsTable from '../components/AppointmentsTable';
import WeeklySchedule from '../components/WeeklySchedule';

export default function AppointmentsPage({ appointments, stats, handleDeleteAppointment, selectedDate, onAppointmentUpdate }) {
    const { darkMode, t } = useContext(AppContext);
    const { showDialog } = useDialog();

    const appointmentPercentage = stats.totalAppointments > 0
        ? Math.round((stats.bookedAppointments / stats.totalAppointments) * 100)
        : 0;

    const selectedDateAppointments = appointments.filter(a => a.date === selectedDate);

    const handleCancelAppointment = async (apptId) => {
        showDialog({
            type: 'warning',
            title: t.dialogWarningTitle,
            message: t.confirmCancelAppointment,
            confirmText: t.cancel,
            cancelText: t.dialogCancel,
            onConfirm: async () => {
                try {
                    const { error } = await supabase
                        .from('appointments')
                        .update({ status: 'cancelled' })
                        .eq('id', apptId);

                    if (error) throw error;

                    //  cancelled successfully
                    showDialog({
                        type: 'success',
                        title: t.dialogSuccessTitle,
                        message: t.appointmentCancelled,
                        confirmText: t.dialogSuccessClose,
                        onConfirm: () => {
                            if (onAppointmentUpdate) onAppointmentUpdate();
                        }
                    });

                } catch (err) {
                    console.error(err);

                    // error cancelling appointment
                    showDialog({
                        type: 'error',
                        title: t.dialogErrorTitle,
                        message: `${t.errorCancellingAppointment}:\n${err.message}`,
                        confirmText: t.dialogErrorClose,
                        onConfirm: () => { }
                    });
                }
            },
            onCancel: () => { }
        });
    };

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard label={t.totalAppts} value={stats.totalAppointments} color="border-blue-500" textColor="text-[#0B8FAC]" />
                <StatCard label={t.bookedAppts} value={stats.bookedAppointments} color="border-green-500" textColor="text-green-600" />
                <StatCard label={t.cancelledAppointments} value={stats.cancelledAppointments} color="border-red-500" textColor="text-red-600" />
            </div>

            {/* Appointment Fill Rate */}
            {stats.totalAppointments > 0 && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg transition-colors`}>
                    <h3 className="text-[#0B8FAC] font-bold mb-4">{t.appointmentFillRate}</h3>
                    <div className="flex items-center gap-4">
                        <div className={`flex-1 rounded-full h-5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div
                                className="bg-linear-to-r from-blue-500 to-[#0B8FAC] h-full rounded-full transition-all duration-700"
                                style={{ width: `${appointmentPercentage}%` }}
                            />
                        </div>
                        <span className="text-2xl font-bold text-[#0B8FAC]">{appointmentPercentage}%</span>
                    </div>
                </div>
            )}

            {/* Selected Day Appointments */}
            <AppointmentsTable
                appointments={selectedDateAppointments}
                title={`${t.todayAppointments} (${new Date(selectedDate).toLocaleDateString()})`}
                handleDeleteAppointment={handleDeleteAppointment}
                handleCancelAppointment={handleCancelAppointment}
                isDaily={true}
            />

            {/* Weekly Schedule */}
            <WeeklySchedule
                appointments={appointments}
                handleCancelAppointment={handleCancelAppointment}
            />

            {/* All Appointments */}
            <AppointmentsTable
                appointments={appointments}
                title={`${t.allAppointments} (${appointments.length})`}
                handleDeleteAppointment={handleDeleteAppointment}
                handleCancelAppointment={handleCancelAppointment}
                isDaily={false}
            />
        </div>
    );
}