import { useContext } from 'react';
import { TrendingUp } from 'lucide-react';
import { AppContext } from '../../App';

const StatCard = ({ label, value, color, textColor, darkMode }) => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg border-l-4 ${color} hover:shadow-xl transition transform hover:-translate-y-0.5`}>
        <p className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
        <p className={`text-4xl font-bold ${textColor} mt-2`}>{value}</p>
    </div>
);

export default function AdminStats({ stats }) {
    const { darkMode, t } = useContext(AppContext);

    const appointmentPercentage = stats.totalAppointments > 0
        ? Math.round((stats.bookedAppointments / stats.totalAppointments) * 100)
        : 0;

    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    label={t.totalDoctors} 
                    value={stats.totalDoctors} 
                    color="border-blue-500" 
                    textColor="text-[#0B8FAC]" 
                    darkMode={darkMode} 
                />
                <StatCard 
                    label={t.totalAppointments} 
                    value={stats.totalAppointments} 
                    color="border-green-500" 
                    textColor="text-green-600" 
                    darkMode={darkMode} 
                />
                <StatCard 
                    label={t.bookedAppointments} 
                    value={stats.bookedAppointments} 
                    color="border-yellow-500" 
                    textColor="text-yellow-600" 
                    darkMode={darkMode} 
                />
                <StatCard 
                    label={t.cancelledAppointments} 
                    value={stats.cancelledAppointments} 
                    color="border-red-500" 
                    textColor="text-red-600" 
                    darkMode={darkMode} 
                />
            </div>

            {/* Fill Rate Bar */}
            {stats.totalAppointments > 0 && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg mb-8 transition-colors`}>
                    <h3 className="text-[#0B8FAC] font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" /> {t.appointmentFillRate}
                    </h3>
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
        </>
    );
}