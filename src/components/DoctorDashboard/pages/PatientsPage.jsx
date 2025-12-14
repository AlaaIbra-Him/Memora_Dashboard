import { Users, Calendar, Users2, Heart, MapPin, Phone, Pill, Image as ImageIcon } from 'lucide-react';
import { useContext } from 'react';
import { AppContext } from '../../../App';

export default function PatientsPage({ patients, appointments }) {
    const { darkMode, t } = useContext(AppContext);

    // Enhance patients with appointment counts
    const patientStats = patients.map(patient => ({
        ...patient,
        appointmentCount: appointments.filter(
            a => a.patient_id === patient.id
        ).length
    }));

    // Sort patients by appointment count descending
    const sortedPatients = patientStats.sort(
        (a, b) => b.appointmentCount - a.appointmentCount
    );

    const getGenderText = (gender) => {
        if (!gender) return '-';
        return gender === 'male' ? t.male : gender === 'female' ? t.female : gender;
    };

    const getAlzheimerStageText = (stage) => {
        if (!stage) return t.unknownStage;
        const stages = {
            'early': t.earlyStage,
            'moderate': t.moderateStage,
            'severe': t.severeStage,
        };
        return stages[stage] || t.unknownStage;
    };

    const getAlzheimerStageBadgeColor = (stage) => {
        switch (stage) {
            case 'early': return darkMode 
                ? 'bg-yellow-900 text-yellow-200 border-yellow-700' 
                : 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'moderate': return darkMode 
                ? 'bg-orange-900 text-orange-200 border-orange-700' 
                : 'bg-orange-100 text-orange-800 border-orange-300';
            case 'severe': return darkMode 
                ? 'bg-red-900 text-red-200 border-red-700' 
                : 'bg-red-100 text-red-800 border-red-300';
            default: return darkMode 
                ? 'bg-gray-700 text-gray-300 border-gray-600' 
                : 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transition-colors`}>
            {/* Header */}
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-linear-to-r from-[#0B8FAC] to-blue-600'
                } text-white p-6 flex items-center gap-3 justify-between`}>
                <div className="flex items-center gap-3">
                    <Users className="w-6 h-6" />
                    <h2 className="font-bold text-2xl">
                        {t.patients}
                    </h2>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${darkMode
                        ? 'bg-gray-500 text-gray-200'
                        : 'bg-white/20 text-white'
                    }`}>
                    {patients.length}
                </span>
            </div>

            {/* Content */}
            <div className="p-6">
                {patients.length === 0 ? (
                    <div className={`text-center py-16 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                        <Users className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'
                            }`} />
                        <p className={`text-xl font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            {t.noPatientsYet}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                    <th className={`px-4 py-3 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t.name}
                                    </th>
                                    <th className={`px-4 py-3 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t.age}
                                    </th>
                                    <th className={`px-4 py-3 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t.gender}
                                    </th>
                                    <th className={`px-4 py-3 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t.alzheimerStage}
                                    </th>
                                    <th className={`px-4 py-3 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t.address}
                                    </th>
                                    <th className={`px-4 py-3 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t.emergency}
                                    </th>
                                    <th className={`px-4 py-3 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t.medications}
                                    </th>
                                    <th className={`px-4 py-3 text-left font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {t.appointments}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedPatients.map((patient, index) => (
                                    <tr 
                                        key={patient.id}
                                        className={`${index % 2 === 0 
                                            ? darkMode ? 'bg-gray-800' : 'bg-white' 
                                            : darkMode ? 'bg-gray-750' : 'bg-gray-50'
                                        } border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:${darkMode ? 'bg-gray-700' : 'bg-blue-50'} transition-colors`}
                                    >
                                        {/* Name with Photo */}
                                        <td className={`px-4 py-3 font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            <div className="flex items-center gap-3">
                                                {patient.photo_url ? (
                                                    <img 
                                                        src={patient.photo_url} 
                                                        alt={patient.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-[#0B8FAC] flex items-center justify-center shrink-0">
                                                        <Users className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                                <span className="truncate">{patient.name || '-'}</span>
                                            </div>
                                        </td>

                                        {/* Age */}
                                        <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-[#0B8FAC] shrink-0" />
                                                {patient.age || '-'}
                                            </div>
                                        </td>

                                        {/* Gender */}
                                        <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <div className="flex items-center gap-2">
                                                <Users2 className="w-4 h-4 text-[#0B8FAC] shrink-0" />
                                                {getGenderText(patient.gender)}
                                            </div>
                                        </td>

                                        {/* Alzheimer Stage */}
                                        <td className={`px-4 py-3`}>
                                            <div className="flex items-center gap-2">
                                                <Heart className="w-4 h-4 text-[#0B8FAC] shrink-0" />
                                                {patient.alzheimer_stage ? (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getAlzheimerStageBadgeColor(patient.alzheimer_stage)}`}>
                                                        {getAlzheimerStageText(patient.alzheimer_stage)}
                                                    </span>
                                                ) : (
                                                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>-</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Address */}
                                        <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} max-w-xs truncate`} title={patient.home_address || ''}>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-[#0B8FAC] shrink-0" />
                                                <span className="truncate">{patient.home_address || '-'}</span>
                                            </div>
                                        </td>

                                        {/* Emergency Phone */}
                                        <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-[#0B8FAC] shrink-0" />
                                                {patient.phone_emergency || '-'}
                                            </div>
                                        </td>

                                        {/* Medications */}
                                        <td className={`px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} max-w-xs`}>
                                            <div className="flex items-center gap-2">
                                                <Pill className="w-4 h-4 text-[#0B8FAC] shrink-0" />
                                                <div className="truncate">
                                                    {patient.medications ? (
                                                        typeof patient.medications === 'string' ? (
                                                            <span>{patient.medications}</span>
                                                        ) : Array.isArray(patient.medications) ? (
                                                            <span>{patient.medications.map(m => typeof m === 'string' ? m : m.name).join(', ')}</span>
                                                        ) : (
                                                            <span title={`${patient.medications.name} - ${patient.medications.dose} ${patient.medications.frequency}`}>
                                                                {patient.medications.name}
                                                            </span>
                                                        )
                                                    ) : (
                                                        <span>-</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Appointments Count */}
                                        <td className={`px-4 py-3`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                                                patient.appointmentCount > 5
                                                    ? darkMode
                                                        ? 'bg-green-900 text-green-200'
                                                        : 'bg-green-100 text-green-700'
                                                    : patient.appointmentCount > 0
                                                        ? darkMode
                                                            ? 'bg-yellow-900 text-yellow-200'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        : darkMode
                                                            ? 'bg-gray-700 text-gray-400'
                                                            : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {patient.appointmentCount}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}