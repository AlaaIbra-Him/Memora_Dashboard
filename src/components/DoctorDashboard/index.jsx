import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../App';
import { supabase } from '../../supabaseClient';
import Sidebar from './Sidebar';
import Header from './Header';
import AppointmentsPage from './pages/AppointmentsPage';
import PatientsPage from './pages/PatientsPage';
import SettingsPage from './pages/SettingsPage';

export default function DoctorDashboard() {
    const { darkMode } = useContext(AppContext);
    const [activePage, setActivePage] = useState('appointments');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [doctor, setDoctor] = useState({
        name: '',
        phone: '',
        specialty: '',
        description: '',
        email: ''
    });
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [stats, setStats] = useState({
        totalAppointments: 0,
        bookedAppointments: 0,
        cancelledAppointments: 0
    });
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [doctorId, setDoctorId] = useState(null);
    const navigate = useNavigate();

    // const fetchDoctorProfile = async () => {
    //     const { data: { session } } = await supabase.auth.getSession();
    //     if (!session) return navigate('/');

    //     const userId = session.user.id;
    //     setDoctorId(userId);

    //     const { data: profile, error } = await supabase
    //         .from('users')
    //         .select('*')
    //         .eq('id', userId)
    //         .single();

    //     if (error || profile.role !== 'doctor') return navigate('/');
    //     setDoctor(profile);

    //     const { data: appts, error: apptsError } = await supabase
    //         .from('appointments')
    //         .select('*')
    //         .eq('doctor_id', userId)
    //         .order('date', { ascending: true });

    //     if (!apptsError && appts) {
    //         setAppointments(appts);
    //         const booked = appts.filter(a => a.status === 'booked').length;
    //         const cancelled = appts.filter(a => a.status === 'cancelled').length;
    //         setStats({
    //             totalAppointments: appts.length,
    //             bookedAppointments: booked,
    //             cancelledAppointments: cancelled
    //         });

    //         const patientIds = [...new Set(appts.map(a => a.patient_id).filter(Boolean))];
    //         if (patientIds.length > 0) {
    //             const { data: patientsData } = await supabase
    //                 .from('users')
    //                 .select('*')
    //                 .in('id', patientIds);
    //             if (patientsData) setPatients(patientsData);
    //         }
    //     }
    // };


    // src/components/DoctorDashboard/index.jsx - تحديث fetchDoctorProfile

    const fetchDoctorProfile = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return navigate('/');

        const userId = session.user.id;
        setDoctorId(userId);

        const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || profile.role !== 'doctor') return navigate('/');
        setDoctor(profile);

        // fetch appointments
        const { data: appts, error: apptsError } = await supabase
            .from('appointments')
            .select('*')
            .eq('doctor_id', userId)
            .order('date', { ascending: true });

        if (!apptsError && appts) {
            setAppointments(appts);
            const booked = appts.filter(a => a.status === 'booked').length;
            const cancelled = appts.filter(a => a.status === 'cancelled').length;
            setStats({
                totalAppointments: appts.length,
                bookedAppointments: booked,
                cancelledAppointments: cancelled
            });
        }

        // fetch patients from family members table
        const { data: familyMembers, error: familyError } = await supabase
            .from('family_members')
            .select('patient_id')
            .eq('doctor_id', userId);

        if (familyError) {
            console.error('Error fetching family members:', familyError);
            return;
        }

        // patient_id 
        if (familyMembers && familyMembers.length > 0) {
            const patientIds = familyMembers.map(fm => fm.patient_id);

            // patients patients 
            const { data: patientsData, error: patientsError } = await supabase
                .from('patients')
                .select('id, name, age, gender, alzheimer_stage')
                .in('id', patientIds);

            if (patientsError) {
                console.error('Error fetching patients:', patientsError);
                return;
            }

            if (patientsData) {
                console.log('Patients Data:', patientsData);
                setPatients(patientsData);
            }
        } else {
            setPatients([]); 
        }
    };
    useEffect(() => {
        fetchDoctorProfile();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            await supabase
                .from('users')
                .update({
                    name: doctor.name,
                    phone: doctor.phone,
                    specialty: doctor.specialty,
                    description: doctor.description
                })
                .eq('id', doctor.id);

            alert('Profile updated successfully');
            setEditMode(false);
        } catch (err) {
            console.error(err);
            alert('Error updating profile: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!newPassword) return alert('Please enter a new password');
        setLoading(true);
        try {
            await supabase.auth.updateUser({ password: newPassword });
            alert('Password changed successfully');
            setNewPassword('');
            setPasswordMode(false);
        } catch (err) {
            console.error(err);
            alert('Error changing password: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAppointment = async (apptId) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) return;
        try {
            await supabase.from('appointments').delete().eq('id', apptId);
            alert('Appointment deleted successfully');
            // Refresh data
            fetchDoctorProfile(); 
        } catch (err) {
            console.error(err);
            alert('Error deleting appointment: ' + err.message);
        }
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen flex transition-colors`}>
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activePage={activePage}
                setActivePage={setActivePage}
                doctor={doctor}
                handleLogout={handleLogout}
                closeSidebar={closeSidebar}
            />

            <main className="flex-1 overflow-auto w-full">
                <Header activePage={activePage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <div className="p-4 md:p-8 pt-16 md:pt-8">
                    {activePage === 'appointments' && (
                        <AppointmentsPage
                            appointments={appointments}
                            stats={stats}
                            handleDeleteAppointment={handleDeleteAppointment}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            onAppointmentUpdate={fetchDoctorProfile}
                        />
                    )}

                    {activePage === 'patients' && (
                        <PatientsPage
                            patients={patients}
                            appointments={appointments}
                        />
                    )}

                    {activePage === 'settings' && (
                        <SettingsPage
                            doctor={doctor}
                            setDoctor={setDoctor}
                            editMode={editMode}
                            setEditMode={setEditMode}
                            passwordMode={passwordMode}
                            setPasswordMode={setPasswordMode}
                            newPassword={newPassword}
                            setNewPassword={setNewPassword}
                            loading={loading}
                            handleSaveProfile={handleSaveProfile}
                            handleChangePassword={handleChangePassword}
                            doctorId={doctorId}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}