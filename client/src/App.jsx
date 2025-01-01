// Lazımi React və React Router komponentlərinin idxal edilməsi
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Səhifə və komponent idxalları
import Login from './pages/Login';           // Giriş səhifəsi
import Register from './pages/Register';     // Qeydiyyat səhifəsi
import TodoList from './pages/TodoList';     // Tapşırıqlar siyahısı səhifəsi
import Navbar from './components/Navbar';    // Naviqasiya paneli

// Əsas tətbiq komponenti
function App() {
  // İstifadəçinin autentifikasiya vəziyyətini idarə edən state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    // Router komponenti ilə marşrutlamanın qurulması
    <Router>
      {/* Əsas tətbiq konteynerinin təyin edilməsi */}
      <div className="min-h-screen">
        {/* Naviqasiya panelinin əlavə edilməsi */}
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        
        {/* Əsas məzmun sahəsi */}
        <div className="container mx-auto px-4 py-8">
          {/* Marşrut təyinatları */}
          <Routes>
            {/* Giriş səhifəsi marşrutu */}
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                ) : (
                  <Navigate to="/todos" />
                )
              } 
            />
            
            {/* Qeydiyyat səhifəsi marşrutu */}
            <Route 
              path="/register" 
              element={
                !isAuthenticated ? (
                  <Register setIsAuthenticated={setIsAuthenticated} />
                ) : (
                  <Navigate to="/todos" />
                )
              } 
            />
            
            {/* Tapşırıqlar siyahısı səhifəsi marşrutu */}
            <Route 
              path="/todos" 
              element={
                isAuthenticated ? (
                  <TodoList />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            
            {/* Əsas səhifə yönləndirməsi */}
            <Route path="/" element={<Navigate to="/todos" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Komponentin ixrac edilməsi
export default App;