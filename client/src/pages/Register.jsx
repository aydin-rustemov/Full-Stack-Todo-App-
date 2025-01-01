import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };

    return requirements;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const passwordRequirements = validatePassword(formData.password);
    if (!Object.values(passwordRequirements).every(Boolean)) {
      setError('Password does not meet requirements');
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/auth/register', formData);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  const passwordReqs = validatePassword(formData.password);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-[80vh] flex items-center justify-center py-8"
    >
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-indigo-600">
            {t.auth.register.title}
          </h2>
        </motion.div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
          >
            {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              {t.auth.register.namePlaceholder}
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t.auth.register.emailPlaceholder}
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

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t.auth.register.passwordPlaceholder}
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
            
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <p className="font-medium text-gray-700 mb-2">
                {t.auth.register.passwordRequirements.title}
              </p>
              <ul className="space-y-2">
                <motion.li
                  animate={{ color: passwordReqs.length ? '#059669' : '#DC2626' }}
                  className="flex items-center text-sm"
                >
                  <span className={`mr-2 ${passwordReqs.length ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordReqs.length ? '✓' : '×'}
                  </span>
                  {t.auth.register.passwordRequirements.length}
                </motion.li>
                <motion.li
                  animate={{ color: passwordReqs.uppercase ? '#059669' : '#DC2626' }}
                  className="flex items-center text-sm"
                >
                  <span className={`mr-2 ${passwordReqs.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordReqs.uppercase ? '✓' : '×'}
                  </span>
                  {t.auth.register.passwordRequirements.uppercase}
                </motion.li>
                <motion.li
                  animate={{ color: passwordReqs.number ? '#059669' : '#DC2626' }}
                  className="flex items-center text-sm"
                >
                  <span className={`mr-2 ${passwordReqs.number ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordReqs.number ? '✓' : '×'}
                  </span>
                  {t.auth.register.passwordRequirements.number}
                </motion.li>
                <motion.li
                  animate={{ color: passwordReqs.special ? '#059669' : '#DC2626' }}
                  className="flex items-center text-sm"
                >
                  <span className={`mr-2 ${passwordReqs.special ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordReqs.special ? '✓' : '×'}
                  </span>
                  {t.auth.register.passwordRequirements.special}
                </motion.li>
              </ul>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            {t.auth.register.submitButton}
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            <Link
              to="/login"
              className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline transition-all duration-200"
            >
              {t.auth.register.loginLink}
            </Link>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default Register; 