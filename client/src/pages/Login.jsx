// Lazımi modulların idxal edilməsi
import React, { useState } from 'react';                  // React və state idarəetməsi üçün
import { Link, useNavigate } from 'react-router-dom';    // Səhifələr arası naviqasiya üçün
import { motion } from 'framer-motion';                   // Animasiyalar üçün
import axios from 'axios';                               // HTTP sorğuları üçün
import { useAuth } from '../context/AuthContext';        // Autentifikasiya konteksti
import { useLanguage } from '../context/LanguageContext'; // Çoxdilli dəstək üçün

// Giriş komponenti
const Login = () => {
  // Form məlumatlarının state-i
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Xəta mesajının state-i
  const [error, setError] = useState('');
  
  // Naviqasiya və kontekst hook-ları
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  // Form sahələrinin dəyişməsini idarə edən funksiya
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Xəta mesajını təmizləyirik
  };

  // Formu göndərmə prosesini idarə edən funksiya
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Backend-ə giriş sorğusu göndəririk
      const response = await axios.post('http://localhost:3001/api/auth/login', formData);
      // Uğurlu giriş - token və istifadəçi məlumatlarını saxlayırıq
      login(response.data.token, response.data.user);
      // İstifadəçini tapşırıqlar səhifəsinə yönləndiririk
      navigate('/todos');
    } catch (err) {
      console.error('Giriş xətası:', err);
      setError(err.response?.data?.message || 'Giriş zamanı xəta baş verdi');
    }
  };

  return (
    // Əsas konteyner - giriş animasiyası ilə
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-[80vh] flex items-center justify-center"
    >
      {/* Giriş formu konteynerı */}
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-2xl">
        {/* Başlıq animasiyası */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600">
            {t.auth.login.title}
          </h2>
        </motion.div>
        
        {/* Xəta mesajı - əgər varsa */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
          >
            {error}
          </motion.div>
        )}

        {/* Giriş formu */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Email sahəsi */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t.auth.login.emailPlaceholder}
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Şifrə sahəsi */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t.auth.login.passwordPlaceholder}
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Giriş düyməsi */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            {t.auth.login.submitButton}
          </motion.button>

          {/* Qeydiyyat linki */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <Link
              to="/register"
              className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline transition-all duration-200"
            >
              {t.auth.login.registerLink}
            </Link>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
};

// Komponentin ixrac edilməsi
export default Login;