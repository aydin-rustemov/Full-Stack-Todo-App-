// Lazımi modulların idxal edilməsi
import React from 'react';                                // React
import { Link, useNavigate } from 'react-router-dom';    // Naviqasiya komponentləri
import { useAuth } from '../context/AuthContext';        // Autentifikasiya konteksti
import { useLanguage } from '../context/LanguageContext'; // Dil konteksti

// Naviqasiya paneli komponenti
const Navbar = () => {
  // Kontekstlərdən lazımi məlumatların və funksiyaların əldə edilməsi
  const { isAuthenticated, user, logout } = useAuth();           // Autentifikasiya məlumatları
  const { t, language, changeLanguage } = useLanguage();        // Dil dəyişdirmə funksiyaları
  const navigate = useNavigate();                               // Səhifələr arası keçid üçün

  // Sistemdən çıxış funksiyası
  const handleLogout = () => {
    logout();                // İstifadəçini sistemdən çıxarırıq
    navigate('/login');      // Giriş səhifəsinə yönləndiririk
  };

  // Dil dəyişdirmə funksiyası
  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);  // Seçilmiş dilə keçid edirik
  };

  return (
    // Naviqasiya panelinin əsas konteynerı
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Ana səhifəyə keçid */}
          <Link to="/" className="text-xl font-bold">
            {t.nav.home}
          </Link>
          
          {/* Sağ tərəfdəki elementlər */}
          <div className="flex gap-4 items-center">
            {/* Dil seçimi */}
            <select
              value={language}
              onChange={handleLanguageChange}
              className="bg-indigo-700 text-white border border-indigo-500 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="en">English</option>
              <option value="tr">Türkçe</option>
              <option value="az">Azərbaycan</option>
              <option value="ru">Русский</option>
            </select>

            {/* İstifadəçi girişli olduqda göstəriləcək elementlər */}
            {isAuthenticated ? (
              <>
                {/* İstifadəçi adı */}
                <span className="text-sm font-medium">
                  {t.nav.welcome}, {user?.name}
                </span>
                {/* Tənzimləmələr səhifəsinə keçid */}
                <Link
                  to="/settings"
                  className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t.nav.settings}
                </Link>
                {/* Çıxış düyməsi */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                {/* Giriş düyməsi */}
                <Link
                  to="/login"
                  className="bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t.nav.login}
                </Link>
                {/* Qeydiyyat düyməsi */}
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Komponentin ixrac edilməsi
export default Navbar; 