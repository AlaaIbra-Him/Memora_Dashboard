import { useState, useContext } from 'react';
import { X, Mail, Lock, Briefcase, User } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { AppContext } from '../App';

export default function AuthModal({ onClose, onLoginSuccess }) {
    const { darkMode, t } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!role) {
            alert('Please select a role (Doctor or Admin)');
            return;
        }
        setLoading(true);

        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw authError;

            const userId = authData.user?.id;
            if (!userId) throw new Error("User ID missing");

            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('name, specialty, role')
                .eq('id', userId)
                .single();

            if (profileError) throw profileError;

            if (profile.role === role) {
                onLoginSuccess(profile.role);
                onClose();
            } else {
                await supabase.auth.signOut();
                alert(`${t.loginFailed} ${profile.role}, ${t.notA} ${role}.`);
            }

        } catch (err) {
            console.error(err.message);
            alert(`${t.error}: ${t.invalidCredentials}`);
        } finally {
            setLoading(false);
            setPassword('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-8 max-w-md w-full relative transition-colors`}>
                <button onClick={onClose} className={`absolute top-4 right-4 transition ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-900'}`}>
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#0B8FAC] rounded-lg flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-[#0B8FAC] text-xl font-bold mb-2">{t.login}</h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <Mail className="w-4 h-4 inline mr-2" />
                            {t.emailLabel}
                        </label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            placeholder={`${t.emailLabel}...`}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B8FAC] focus:outline-none transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                    </div>
                    <div>
                        <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <Lock className="w-4 h-4 inline mr-2" />
                            {t.passwordLabel}
                        </label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder={`${t.passwordLabel}...`}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B8FAC] focus:outline-none transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                        />
                    </div>

                    <div>
                        <p className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t.selectRole}
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setRole('doctor')}
                                className={`flex-1 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 font-semibold ${
                                    role === 'doctor'
                                        ? 'bg-[#0B8FAC] text-white'
                                        : darkMode
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <User className="w-4 h-4" />
                                {t.doctor}
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`flex-1 px-4 py-2 rounded-lg transition flex items-center justify-center gap-2 font-semibold ${
                                    role === 'admin'
                                        ? 'bg-[#0B8FAC] text-white'
                                        : darkMode
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <Briefcase className="w-4 h-4" />
                                {t.admin}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !role} 
                        className="w-full px-6 py-3 bg-[#0B8FAC] text-white rounded-lg hover:bg-[#0a7a94] transition disabled:opacity-50 font-semibold"
                    >
                        {loading ? t.signingIn : t.signIn}
                    </button>
                </form>
            </div>
        </div>
    );
}