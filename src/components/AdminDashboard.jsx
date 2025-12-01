import { useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import AdminHeader from './AdminDashboard/AdminHeader';
import AdminStats from './AdminDashboard/AdminStats';
import DoctorsPanel from './AdminDashboard/DoctorsPanel';
import DoctorDetailsPanel from './AdminDashboard/DoctorDetailsPanel';

export default function AdminDashboard() {
    const { darkMode, language, t } = useContext(AppContext);
    const [adminName, setAdminName] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorAppointments, setDoctorAppointments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalAppointments: 0,
        bookedAppointments: 0,
        cancelledAppointments: 0
    });
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        specialty: ''
    });
    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const navigate = useNavigate();

    // Authentication Check
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    navigate('/');
                    return;
                }

                const userId = session.user.id;
                const { data, error } = await supabase
                    .from('users')
                    .select('name, role')
                    .eq('id', userId)
                    .single();

                if (error || data?.role !== 'admin') {
                    console.error('Access Denied or Profile Error:', error);
                    navigate('/');
                } else {
                    setAdminName(data.name || 'Admin');
                }
            } catch (err) {
                console.error('Auth check error:', err);
                navigate('/');
            } finally {
                setAuthLoading(false);
            }
        };

        checkAdmin();
        fetchDoctorsAndStats();
    }, [navigate]);

    // Fetch Doctors and Stats
    const fetchDoctorsAndStats = async () => {
        try {
            const { data: doctorsData, error: doctorsError } = await supabase
                .from('users')
                .select('*')
                .eq('role', 'doctor');

            if (doctorsError) throw doctorsError;

            if (doctorsData) {
                setDoctors(doctorsData);
                setStats(prev => ({ ...prev, totalDoctors: doctorsData.length }));
            }

            const { data: appointmentsData, error: appointmentsError } = await supabase
                .from('appointments')
                .select('*');

            if (appointmentsError) throw appointmentsError;

            if (appointmentsData) {
                const booked = appointmentsData.filter(a => a.status === 'booked').length;
                const cancelled = appointmentsData.filter(a => a.status === 'cancelled').length;

                setStats(prev => ({
                    ...prev,
                    totalAppointments: appointmentsData.length,
                    bookedAppointments: booked,
                    cancelledAppointments: cancelled
                }));
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    // Fetch Doctor Appointments
    const fetchDoctorAppointments = async (doctorId) => {
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('doctor_id', doctorId)
                .order('date', { ascending: false });

            if (error) throw error;
            if (data) {
                setDoctorAppointments(data);
                setSelectedDoctor(doctorId);
            }
        } catch (err) {
            console.error('Error fetching appointments:', err);
            window.alert(`${t.error}: ${err.message}`);
        }
    };

    // Create Doctor
    const handleCreateDoctor = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/createDoctor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `HTTP ${res.status}`);
            }

            const data = await res.json();

            if (!data.success || !data.userId) {
                throw new Error("Invalid response from server");
            }

            alert(`${t.doctorCreatedDetails} ${data.userId}\n${t.name} ${data.fullName}\n${t.email}: ${data.email}`);

            setFormData({ email: "", password: "", fullName: "", specialty: "" });
            setShowForm(false);
            fetchDoctorsAndStats();

        } catch (err) {
            console.error("Error:", err);
            alert(`${t.error}: ${err.message}\n\n${t.makesSure}:\n1. ${t.serverRunning}\n2. ${t.envVariablesSet}\n3. ${t.npmStart}`);
        } finally {
            setLoading(false);
        }
    };

    // Delete Doctor
    const handleDeleteDoctor = async (doctorId, doctorEmail) => {
        if (!window.confirm(`${t.confirmDeleteDoctor} ${doctorEmail} ${t.andAllAppointments}`))
            return;

        try {
            setLoading(true);

            const res = await fetch(`http://localhost:3000/deleteDoctor/${doctorId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `HTTP ${res.status}`);
            }

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Delete failed");
            }

            alert(t.doctorDeleted);
            setSelectedDoctor(null);
            setDoctorAppointments([]);
            fetchDoctorsAndStats();

        } catch (err) {
            console.error('Error deleting doctor:', err);
            alert(`${t.error}: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Delete Appointment
    const handleDeleteAppointment = async (appointmentId) => {
        if (!window.confirm(t.confirmDeleteAppointment)) return;

        try {
            await supabase.from('appointments').delete().eq('id', appointmentId);
            alert(t.successDelete);
            fetchDoctorAppointments(selectedDoctor);
            fetchDoctorsAndStats();
        } catch (err) {
            console.error('Error deleting appointment:', err);
            alert(`${t.error}: ${err.message}`);
        }
    };

    // Cancel Appointment
    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm(t.confirmCancelAppointment)) return;

        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: 'cancelled' })
                .eq('id', appointmentId);

            if (error) throw error;

            alert(t.appointmentCancelled);
            fetchDoctorAppointments(selectedDoctor);
            fetchDoctorsAndStats();
        } catch (err) {
            console.error('Error cancelling appointment:', err);
            alert(`${t.errorCancellingAppointment}: ${err.message}`);
        }
    };

    // Logout
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    // Loading UI
    if (authLoading) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B8FAC]"></div>
                    <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.loading}</p>
                </div>
            </div>
        );
    }

    // Main Dashboard
    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${
            darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
        } ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            {/* Header */}
            <AdminHeader adminName={adminName} handleLogout={handleLogout} />

            <main className="max-w-7xl mx-auto p-6">
                {/* Stats */}
                <AdminStats stats={stats} />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Doctors List */}
                    <DoctorsPanel 
                        doctors={doctors}
                        selectedDoctor={selectedDoctor}
                        showForm={showForm}
                        setShowForm={setShowForm}
                        formData={formData}
                        setFormData={setFormData}
                        loading={loading}
                        handleCreateDoctor={handleCreateDoctor}
                        fetchDoctorAppointments={fetchDoctorAppointments}
                    />

                    {/* Doctor Details */}
                    <DoctorDetailsPanel
                        selectedDoctor={selectedDoctor}
                        doctors={doctors}
                        doctorAppointments={doctorAppointments}
                        handleDeleteDoctor={handleDeleteDoctor}
                        handleDeleteAppointment={handleDeleteAppointment}
                        handleCancelAppointment={handleCancelAppointment}
                        loading={loading}
                    />
                </div>
            </main>
        </div>
    );
}