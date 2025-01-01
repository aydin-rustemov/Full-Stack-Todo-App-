// Lazımi modulların idxal edilməsi
const express = require('express');           // Web server yaratmaq üçün Express framework-ü
const cors = require('cors');                 // Cross-Origin Resource Sharing (CORS) siyasətini idarə etmək üçün
const sequelize = require('../config/database'); // Verilənlər bazası əlaqəsi üçün Sequelize ORM
const defineAssociations = require('../models/associations'); // Model əlaqələrinin təyin edilməsi

// Marşrutların (route) idxal edilməsi
const authRoutes = require('../routes/auth'); // Autentifikasiya marşrutları
const todoRoutes = require('../routes/todos'); // Todo əməliyyatları üçün marşrutlar

// Express tətbiqinin yaradılması
const app = express();

// Middleware-lərin quraşdırılması
app.use(cors());                  // CORS siyasətinin aktivləşdirilməsi - frontend ilə əlaqə üçün
app.use(express.json());          // JSON formatında olan sorğuların emal edilməsi

// API marşrutlarının təyin edilməsi
app.use('/api/auth', authRoutes); // Autentifikasiya marşrutlarının qeydiyyatı
app.use('/api/todos', todoRoutes); // Todo marşrutlarının qeydiyyatı

// Əsas marşrut - API-nin işləməsini yoxlamaq üçün
app.get('/', (req, res) => {
  res.json({ message: 'Todo API işləyir' });
});

// Model əlaqələrinin qurulması
defineAssociations();

// Verilənlər bazasının sinxronizasiyası
// alter: true -> Cədvəlləri yeniləyir, amma silmir
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Verilənlər bazası sinxronizasiya edildi');
    
    // Serverin başladılması
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda işləyir`);
    });
  })
  .catch(err => {
    console.error('Verilənlər bazasının sinxronizasiyasında xəta:', err);
  });

// Xətaların tutulması - Gözlənilməz xətalar üçün
process.on('unhandledRejection', (err) => {
  console.error('İdarə olunmayan rejection:', err);
});

// Express tətbiqinin ixrac edilməsi
// Bu, test ssenarilərində istifadə üçün lazımdır
module.exports = app; 