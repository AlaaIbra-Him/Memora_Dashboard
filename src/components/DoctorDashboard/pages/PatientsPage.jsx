import { Users } from 'lucide-react';
import { useContext } from 'react';
import { AppContext } from '../../../App';
import PatientCard from '../components/PatientCard';

export default function PatientsPage({ patients, appointments }) {
    const { darkMode, t } = useContext(AppContext);

// Enhance patients with appointment counts
    const patientStats = patients.map(patient => ({
        ...patient,
        appointmentCount: appointments.filter(
            a => a.patient_id === patient.id
        ).length
    }));

    //arranger the patients by appointment count descending
    const sortedPatients = patientStats.sort(
        (a, b) => b.appointmentCount - a.appointmentCount
    );

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
                        ? 'bg-gray-500 text-gray-200 border-gray-200'
                        : 'bg-gray-100 text-gray-500 border-gray-500'
                    }`}>
                    {patients.length}
                </span>
            </div>

            {/* card contant */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {sortedPatients.map((patient) => (
                            <PatientCard
                                key={patient.id}
                                patient={patient}
                                appointmentCount={patient.appointmentCount}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}