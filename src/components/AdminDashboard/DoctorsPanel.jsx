import { useContext } from 'react';
import { Mail, Plus, Stethoscope } from 'lucide-react';
import { AppContext } from '../../App';

export default function DoctorsPanel({
    doctors,
    selectedDoctor,
    showForm,
    setShowForm,
    formData,
    setFormData,
    loading,
    handleCreateDoctor,
    fetchDoctorAppointments
}) {
    const { darkMode, t } = useContext(AppContext);

    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden lg:col-span-1`}>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-[#0B8FAC]'} text-white p-4 flex justify-between items-center transition-colors`}>
                <h2 className="font-bold text-lg flex items-center gap-2">
                    <Stethoscope size={20} />
                    {t.registeredDoctors} {doctors.length}
                </h2>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold transition ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white text-[#0B8FAC] hover:bg-gray-100'
                        }`}
                >
                    <Plus className="w-4 h-4" />
                    {showForm ? t.close : t.add}
                </button>
            </div>

            {showForm && (
                <div className={`p-4 border-b ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-gray-200'}`}>
                    <form onSubmit={handleCreateDoctor} className="space-y-3">
                        <input
                            type="email"
                            placeholder={t.emailLoginId}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className={`w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-[#0B8FAC] transition ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                                }`}
                        />
                        <input
                            type="password"
                            placeholder={t.passwordInitialLogin}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            className={`w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-[#0B8FAC] transition ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                                }`}
                        />
                        <input
                            type="text"
                            placeholder={t.drName}
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                            className={`w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-[#0B8FAC] transition ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                                }`}
                        />
                        <input
                            type="text"
                            placeholder={t.specialtyExample}
                            value={formData.specialty}
                            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                            required
                            className={`w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-[#0B8FAC] transition ${darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                                }`}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            {loading ? t.adding : t.addDoctor}
                        </button>
                    </form>
                </div>
            )}

            <div className={`divide-y max-h-[600px] overflow-y-auto ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {doctors.length === 0 ? (
                    <p className={`p-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.addDoctor}</p>
                ) : (
                    doctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            onClick={() => fetchDoctorAppointments(doctor.id)}
                            className={`p-4  cursor-pointer border-l-4 transition ${selectedDoctor === doctor.id
                                ? `${darkMode ? 'border-[#0B8FAC] bg-gray-700' : 'border-[#0B8FAC] bg-blue-50'}`
                                : `${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                {doctor.profile_image_url ? (
                                    <img
                                        src={doctor.profile_image_url}
                                        alt={doctor.name}
                                        className="w-10 h-10 rounded-full object-cover shrink-0"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#0B8FAC] flex items-center justify-center shrink-0">
                                        <span className="text-white font-bold text-sm">{doctor.name.charAt(0)}</span>
                                    </div>
                                )}
                                <h3 className={`font-bold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>{doctor.name}</h3>
                            </div>
                            <p className="text-[#0B8FAC] my-1 text-xs font-medium">{doctor.specialty}</p>
                            <p className={`text-xs truncate flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <Mail size={16} />
                                <span>{doctor.email}</span>
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}