// eslint-disable-next-line no-unused-vars
import { useState, useContext } from 'react';
import { LogOut, Sun, Moon, X, Users, Calendar, Settings, Menu } from 'lucide-react';
import { AppContext } from '../../App';
import NavItem from './components/NavItem';

export default function Sidebar({ sidebarOpen, setSidebarOpen, activePage, setActivePage, doctor, handleLogout, closeSidebar }) {
    const { darkMode, toggleDarkMode, language, toggleLanguage, t } = useContext(AppContext);
    // console.log(doctor.profile_image_url, 'imageee');
    // let imageUrl = doctor.profile_image_url;
    console.log(doctor, 'imageee');
    console.log('   Image URL:', doctor.profile_image_url);



    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:relative w-64 h-screen ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-gray-200'} border-r shadow-lg z-40 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                    {/* ================================================================= */}
                    <div className="flex flex-col items-center mt-4">
                    <h1 className="text-[#0B8FAC] font-bold text-2xl">Memora</h1>
                        {doctor.profile_image_url ? (
                            <img
                                src={doctor.profile_image_url}
                                alt="Doctor Profile"
                                className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-[#0B8FAC]"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 border-2 border-[#0B8FAC] ${doctor.profile_image_url ? 'hidden' : ''
                                } ${darkMode ? 'bg-gray-700' : 'bg-blue-200'}`}
                        >
                            <Users className="w-8 h-8 text-[#0B8FAC]" />
                        </div>
                        <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dr. {doctor.name}</p>
                    </div>

                </div>
                <nav className="p-4 space-y-2">
                    <NavItem
                        icon={<Calendar className="w-5 h-5" />}
                        label={t.appointments}
                        active={activePage === 'appointments'}
                        onClick={() => {
                            setActivePage('appointments');
                            closeSidebar();
                        }}
                    />
                    <NavItem
                        icon={<Users className="w-5 h-5" />}
                        label={t.patients}
                        active={activePage === 'patients'}
                        onClick={() => {
                            setActivePage('patients');
                            closeSidebar();
                        }}
                    />
                    <NavItem
                        icon={<Settings className="w-5 h-5" />}
                        label={t.settings}
                        active={activePage === 'settings'}
                        onClick={() => {
                            setActivePage('settings');
                            closeSidebar();
                        }}
                    />
                </nav>

                <div className={`absolute bottom-0 left-0 right-0 w-64 p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-blue-50'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => {
                                toggleLanguage();
                                closeSidebar();
                            }}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100 border border-gray-300'}`}
                        >
                            {language === 'ar' ? 'EN' : 'AR'}
                        </button>
                        <button
                            onClick={toggleDarkMode}
                            className={`px-3 py-2 rounded-lg transition ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100 border border-gray-300'}`}
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                    <button
                        onClick={() => {
                            handleLogout();
                            closeSidebar();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}