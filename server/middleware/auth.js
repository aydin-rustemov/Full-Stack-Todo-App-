// Lazımi modulların idxal edilməsi
const jwt = require('jsonwebtoken');        // JWT (JSON Web Token) işləmək üçün
const User = require('../models/User');     // İstifadəçi modeli

// Autentifikasiya middleware funksiyası
// Bu middleware hər qorunan marşrut üçün JWT tokenin mövcudluğunu və etibarlılığını yoxlayır
const auth = (req, res, next) => {
  try {
    // Sorğunun başlığından Authorization tokenini alırıq
    const authHeader = req.header('Authorization');
    
    // Token yoxdursa, xəta qaytarırıq
    if (!authHeader) {
      return res.status(401).json({ message: 'Token yoxdur, giriş qadağandır' });
    }

    // "Bearer " prefiksini tokendan ayırırıq
    const token = authHeader.replace('Bearer ', '');
    
    // Tokenin doğruluğunu yoxlayırıq və deşifrə edirik
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Deşifrə edilmiş istifadəçi məlumatlarını sorğu obyektinə əlavə edirik
    req.user = decoded;
    
    // Növbəti middleware və ya controller-ə keçid edirik
    next();
  } catch (err) {
    // Token etibarsızdırsa və ya başqa xəta baş verərsə
    console.error('Autentifikasiya middleware xətası:', err);
    res.status(401).json({ message: 'Token etibarsızdır' });
  }
};

// Middleware funksiyasının ixrac edilməsi
module.exports = auth; 