// Lazımi modulların idxal edilməsi
const express = require('express');                          // Express framework
const auth = require('../middleware/auth');                  // Autentifikasiya middleware-i
const authController = require('../controllers/authController'); // Autentifikasiya controller-i

// Express Router instansiyasının yaradılması
const router = express.Router();

// Açıq marşrutlar (autentifikasiya tələb olunmur)
router.post('/register', authController.register);  // Qeydiyyat marşrutu
router.post('/login', authController.login);        // Giriş marşrutu

// Qorunan marşrutlar (autentifikasiya tələb olunur)
router.get('/me', auth, authController.getMe);          // İstifadəçi məlumatlarını əldə etmək
router.put('/update', auth, authController.updateUser);  // İstifadəçi məlumatlarını yeniləmək

// Router-in ixrac edilməsi
module.exports = router; 