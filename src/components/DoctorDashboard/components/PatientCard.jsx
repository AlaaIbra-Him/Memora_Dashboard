import { useContext } from 'react';
import { AppContext } from '../../../App';
import { User, Calendar, Activity, Heart, Users as UsersIcon } from 'lucide-react';

export default function PatientCard({ patient, appointmentCount }) {
    const { darkMode, t } = useContext(AppContext);

    const getAlzheimerStageText = (stage) => {
        const stages = {
            'early': t.earlyStage,
            'moderate': t.moderateStage,
            'severe': t.severeStage,
            'unknown': t.unknownStage
        };
        return stages[stage] || t.unknownStage;
    };

    const getAlzheimerStageBadgeColor = (stage) => {
        switch (stage) {
            case 'early': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'severe': return 'bg-red-100 text-red-800 border-red-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getGenderText = (gender) => {
        return gender === 'male' ? t.male : gender === 'female' ? t.female : gender;
    };

    return (
        <div className={`${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-xl'
            } rounded-xl shadow-lg border-2 border-l-4 border-[#0B8FAC] transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1`}>

            {/* Header => Patient Name */}
            <div className={`${darkMode ? 'bg-linear-to-r from-gray-700 to-gray-800' : 'bg-linear-to-r from-[#0B8FAC] to-blue-600'
                } p-6 text-white`}>
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-white/20 backdrop-blur-sm'
                        }`}>
                        <User className={`w-6 h-6 ${darkMode ? 'text-[#0B8FAC]' : 'text-white'}`} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold truncate">
                            {patient.name || 'Unknown Patient'}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Body - Patient Info */}
            <div className="p-6 space-y-4">
                {/*  age, gender.. */}
                <div className="grid grid-cols-2 gap-4">
                    {patient.age && (
                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'
                            } p-4 rounded-lg`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-[#0B8FAC]" />
                                <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    {t.age}
                                </span>
                            </div>
                            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                {patient.age}
                            </p>
                        </div>
                    )}

                    {patient.gender && (
                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'
                            } p-4 rounded-lg`}>
                            <div className="flex items-center gap-2 mb-2">
                                <UsersIcon className="w-4 h-4 text-[#0B8FAC]" />
                                <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    {t.gender || 'Gender'}
                                </span>
                            </div>
                            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                {getGenderText(patient.gender)}
                            </p>
                        </div>
                    )}
                </div>

                {/* alzheimer stage */}
                {patient.alzheimer_stage && (
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'
                        } p-4 rounded-lg`}>
                        <div className="flex items-center gap-2 mb-3">
                            <Heart className="w-4 h-4 text-[#0B8FAC]" />
                            <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                {t.alzheimerStage}
                            </span>
                        </div>
                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold border-2 ${getAlzheimerStageBadgeColor(patient.alzheimer_stage)
                            }`}>
                            {getAlzheimerStageText(patient.alzheimer_stage)}
                        </span>
                    </div>
                )}

                {/* number of appointments  */}
                <div className={`${darkMode ? 'bg-linear-to-r from-gray-700 to-gray-800' : 'bg-linear-to-r from-blue-100 to-blue-50'
                    } p-4 rounded-lg border-2 ${darkMode ? 'border-gray-600' : 'border-blue-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'
                                }`}>
                                <Activity className="w-5 h-5 text-[#0B8FAC]" />
                            </div>
                            <div>
                                <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    {t.appointments}
                                </p>
                                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                    {appointmentCount}
                                </p>
                            </div>
                        </div>
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 ${appointmentCount > 5
                            ? darkMode
                                ? 'bg-green-900 text-green-200 border-green-700'
                                : 'bg-green-100 text-green-700 border-green-300'
                            : appointmentCount > 0
                                ? darkMode
                                    ? 'bg-yellow-900 text-yellow-200 border-yellow-700'
                                    : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                : darkMode
                                    ? 'bg-gray-700 text-gray-400 border-gray-600'
                                    : 'bg-gray-100 text-gray-500 border-gray-300'
                            }`}>
                            {appointmentCount}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}