/* eslint-disable no-unused-vars */
import { useState, useContext } from 'react';
import { Key, Eye, EyeOff, Check, X } from 'lucide-react';
import { AppContext } from '../../../App';
import { supabase } from '../../../supabaseClient';

export default function PasswordSection({
    passwordMode,
    setPasswordMode,
    loading,
    doctorId
}) {
    const { darkMode, t } = useContext(AppContext);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChanging, setIsChanging] = useState(false);

    // Password strength calculation
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        
        if (password.length >= 8) strength += 20;
        if (password.length >= 12) strength += 10;
        if (/[a-z]/.test(password)) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 15;
        if (/[^A-Za-z0-9]/.test(password)) strength += 15;

        return strength;
    };

    const getPasswordStrengthColor = (strength) => {
        if (strength < 40) return 'bg-red-500';
        if (strength < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = (strength) => {
        if (strength < 40) return t.weak;
        if (strength < 70) return t.medium;
        return t.strong;
    };

    const passwordStrength = calculatePasswordStrength(newPassword);

    // Validation checks
    const validations = {
        minLength: newPassword.length >= 8,
        hasUppercase: /[A-Z]/.test(newPassword),
        hasLowercase: /[a-z]/.test(newPassword),
        hasNumber: /[0-9]/.test(newPassword),
        hasSpecialChar: /[^A-Za-z0-9]/.test(newPassword),
        passwordsMatch: newPassword === confirmPassword && newPassword !== ''
    };

    const allValidationsPassed = Object.values(validations).every(v => v);

    const handleChangePassword = async () => {
        if (!allValidationsPassed) {
            alert(t.passwordRequirements);
            return;
        }

        setIsChanging(true);
        try {
            //  Authenticate old password reset
            const { error: authError } = await supabase.auth.updateUser({ 
                password: newPassword 
            });

            if (authError) throw authError;

            alert(t.passwordChanged);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordMode(false);

        } catch (err) {
            console.error(err);
            alert(`${t.passwordChangeError}: ${err.message}`);
        } finally {
            setIsChanging(false);
        }
    };

    const ValidationItem = ({ isValid, text }) => (
        <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                isValid ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
            }`}>
                {isValid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            </div>
            <span className={`text-sm ${
                darkMode ? (isValid ? 'text-green-400' : 'text-gray-500') : (isValid ? 'text-green-600' : 'text-gray-500')
            }`}>
                {text}
            </span>
        </div>
    );

    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 transition-colors`}>
            <h3 className="text-[#0B8FAC] font-bold text-xl mb-6 flex items-center gap-2">
                <Key className="w-5 h-5" /> {t.changePassword}
            </h3>

            {passwordMode ? (
                <div className="space-y-5">
                    {/* Old Password */}
                    <div>
                        <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t.oldPassword}
                        </label>
                        <div className="relative">
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#0B8FAC] transition ${
                                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                }`}
                                placeholder={t.enterOldPassword}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t.newPassword}
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#0B8FAC] transition ${
                                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                }`}
                                placeholder={t.enterPassword}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Password Strength Bar */}
                        {newPassword && (
                            <div className="mt-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {t.passwordStrength}
                                    </span>
                                    <span className={`text-xs font-bold ${
                                        passwordStrength < 40 ? 'text-red-500' : passwordStrength < 70 ? 'text-yellow-500' : 'text-green-500'
                                    }`}>
                                        {getPasswordStrengthText(passwordStrength)}
                                    </span>
                                </div>
                                <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                                        style={{ width: `${passwordStrength}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t.confirmPassword}
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#0B8FAC] transition ${
                                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                }`}
                                placeholder={t.enterConfirmPassword}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Validation Requirements */}
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-lg space-y-2`}>
                        <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t.passwordRequirements}:
                        </p>
                        <ValidationItem isValid={validations.minLength} text={t.minLength} />
                        <ValidationItem isValid={validations.hasUppercase} text={t.uppercase} />
                        <ValidationItem isValid={validations.hasLowercase} text={t.lowercase} />
                        <ValidationItem isValid={validations.hasNumber} text={t.number} />
                        <ValidationItem isValid={validations.hasSpecialChar} text={t.specialChar} />
                        {confirmPassword && (
                            <ValidationItem 
                                isValid={validations.passwordsMatch} 
                                text={validations.passwordsMatch ? t.passwordsMatch : t.passwordsDontMatch} 
                            />
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            onClick={handleChangePassword}
                            disabled={!allValidationsPassed || isChanging}
                            className="w-full px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                        >
                            {isChanging ? (
                                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <Key className="w-4 h-4" />
                            )}
                            {isChanging ? t.saving : t.change}
                        </button>
                        <button
                            onClick={() => {
                                setPasswordMode(false);
                                setOldPassword('');
                                setNewPassword('');
                                setConfirmPassword('');
                            }}
                            className={`w-full px-4 py-3 rounded-lg transition font-semibold ${
                                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            {t.cancel}
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setPasswordMode(true)}
                    className="w-full px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center justify-center gap-2 font-semibold"
                >
                    <Key className="w-4 h-4" /> {t.changePassword}
                </button>
            )}
        </div>
    );
}