import { useContext } from 'react';
import { Calendar, User, TrendingUp, Trash2, X, PhoneCall, Clock, Calendar1, Mail } from 'lucide-react';
import { AppContext } from '../../App';

const StatBlock = ({ label, value, color, icon, darkMode }) => (
    <div className={`flex items-center gap-3 p-3 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-100'
        }`}>
        <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : color.replace('text-', 'bg-') + '-100'}`}>
            <div className={color}>{icon}</div>
        </div>
        <div>
            <p className={`text-xs font-medium uppercase ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{label}</p>
            <p className={`text-xl font-bold ${color}`}>{value}</p>
        </div>
    </div>
);

export default function DoctorDetailsPanel({
    selectedDoctor,
    doctors,
    doctorAppointments,
    handleDeleteDoctor,
    handleDeleteAppointment,
    handleCancelAppointment,
    loading
}) {
    const { darkMode, t } = useContext(AppContext);
    const doctor = doctors.find(d => d.id === selectedDoctor);

    if (!selectedDoctor || !doctor) {
        return (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-16 text-center h-full flex flex-col justify-center items-center lg:col-span-2 transition-colors`}>
                <Calendar className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.doctorAppointments}</p>
            </div>
        );
    }

    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden lg:col-span-2 transition-colors`}>

            {/* DOCTOR HEADER  */}

            <div className={`bg-linear-to-r from-[#0B8FAC] to-blue-600 text-white p-6`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-extrabold">{doctor.name}</h2>
                        <p className="text-blue-100 mt-1 text-lg">{doctor.specialty}</p>
                        <p className="text-blue-200 text-sm mt-2 flex items-center gap-1">
                            <Mail size={18} />
                            <span>{doctor.email}</span>
                        </p>

                    </div>
                    <button
                        onClick={() => handleDeleteDoctor(selectedDoctor, doctor.email)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-500 rounded-full text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        <Trash2 className="w-4 h-4" /> {loading ? t.deleting : t.deleteDoctor}
                    </button>
                </div>
            </div>


            {/* STATUS BAR */}
            <div className={`grid grid-cols-3 gap-4 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                <StatBlock
                    label={t.totalAppts}
                    value={doctorAppointments.length}
                    color="text-[#0B8FAC]"
                    icon={<Calendar className="w-5 h-5" />}
                    darkMode={darkMode}
                />
                <StatBlock
                    label={t.bookedAppts}
                    value={doctorAppointments.filter(a => a.status === 'booked').length}
                    color="text-green-600"
                    icon={<TrendingUp className="w-5 h-5" />}
                    darkMode={darkMode}
                />
                <StatBlock
                    label={t.cancelledAppointments}
                    value={doctorAppointments.filter(a => a.status === 'cancelled').length}
                    color="text-red-600"
                    icon={<Trash2 className="w-5 h-5" />}
                    darkMode={darkMode}
                />
            </div>

            <div className="p-6">
                <h3 className="font-bold text-xl mb-4">{t.allAppointments} ({doctorAppointments.length})</h3>
                <div className={`space-y-4 max-h-[450px] overflow-y-auto`}>
                    {doctorAppointments.length === 0 ? (
                        <p className={`text-center p-8 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                            {t.noAppointmentsToday}
                        </p>
                    ) : (
                        doctorAppointments.map((appt) => (
                            <div
                                key={appt.id}
                                className={`p-4 rounded-xl shadow-sm border-l-4 flex justify-between items-center transition ${appt.status === 'booked'
                                    ? `${darkMode ? 'border-green-600 bg-gray-700' : 'border-green-500 bg-green-50'}`
                                    : `${darkMode ? 'border-red-600 bg-gray-700' : 'border-red-500 bg-red-50'}`
                                    }`}   >


                                {/* FIRST COULMN */}
                                <div className="flex-1 space-y-1">
                                    <p className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <User className="w-4 h-4 text-[#0B8FAC]" />
                                        <span>{appt.patient_name}</span>
                                    </p>

                                    <p className={`text-sm flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <Calendar1 size={18} className="text-[#0B8FAC]" />
                                        <span>{appt.date}</span>
                                        <Clock size={18} className="text-[#0B8FAC]" />
                                        <span>{appt.time}</span>
                                    </p>

                                    <p className={`text-sm flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <PhoneCall size={18} className="text-[#0B8FAC]" />
                                        <span>{appt.phone}</span>
                                        <span>• {t.ageHeader}: {appt.age}</span>
                                    </p>

                                    <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-semibold ${appt.status === 'booked'
                                        ? 'bg-green-200 text-green-800'
                                        : 'bg-red-200 text-red-800'
                                        }`}>
                                        {appt.status === 'booked' ? t.confirmed : t.cancelled}
                                    </span>
                                </div>


                                {/* BTNS */}
                                <div className="flex flex-col gap-2">
                                    {appt.status === 'booked' && handleCancelAppointment && (
                                        <button
                                            onClick={() => handleCancelAppointment(appt.id)}
                                            className="px-3 py-1 bg-yellow-600 text-white rounded-full text-xs font-semibold hover:bg-yellow-600 transition shadow-md inline-flex items-center gap-1"
                                        >
                                            <X className="w-3 h-3" /> <span>{t.cancel}</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteAppointment(appt.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-semibold hover:bg-red-600 transition shadow-md inline-flex items-center gap-1"
                                    >
                                        <Trash2 className="w-3 h-3" /> <span>{t.delete}</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}