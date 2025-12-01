import { useContext } from 'react';
import { LogOut, Sun, Moon, TrendingUp } from 'lucide-react';
import { AppContext } from '../../App';

export default function AdminHeader({ adminName, handleLogout }) {
    const { darkMode, toggleDarkMode, language, toggleLanguage, t } = useContext(AppContext);

    return (
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#0B8FAC] text-white'} p-6 shadow-xl sticky top-0 z-10 border-b transition-colors`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div>
                    <h1 className={`text-3xl font-extrabold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-white'}`}>
                        <TrendingUp className="w-7 h-7" /> {t.adminInsights}
                    </h1>
                    <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-blue-100'}`}>
                        {t.welcome}, <span className="font-semibold">{adminName}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white text-[#0B8FAC] hover:bg-gray-100'
                        }`}
                    >
                        {language === 'ar' ? 'EN' : 'AR'}
                    </button>

                    <button
                        onClick={toggleDarkMode}
                        className={`p-2 rounded-lg transition ${
                            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white text-[#0B8FAC] hover:bg-gray-100'
                        }`}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition ${
                            darkMode ? 'bg-red-900 hover:bg-red-800 text-white' : 'bg-white text-[#0B8FAC] hover:bg-gray-100'
                        }`}
                    >
                        <LogOut className="w-5 h-5" />
                        {t.logout}
                    </button>
                </div>
            </div>
        </header>
    );
}