// Sequelize ORM-in idxal edilməsi
const { Sequelize } = require('sequelize');

// Yeni Sequelize instansiyasının yaradılması
const sequelize = new Sequelize({
  dialect: 'sqlite',                          // Verilənlər bazası növü
  storage: process.cwd() + '/database.sqlite', // Verilənlər bazası faylının yolu
  logging: false,                             // SQL sorğularının loglanmasının söndürülməsi
  define: {
    freezeTableName: false,                   // Cədvəl adlarının avtomatik cəm formasına çevrilməsinə icazə
    timestamps: true,                         // Yaradılma və yenilənmə tarixlərinin avtomatik əlavə edilməsi
    charset: 'utf8',                          // Simvol kodlaşdırması
    collate: 'utf8_general_ci'                // Müqayisə qaydaları
  }
});

// Verilənlər bazası ilə əlaqənin yoxlanılması
sequelize.authenticate()
  .then(() => {
    console.log('Verilənlər bazası ilə əlaqə uğurla quruldu.');
  })
  .catch(err => {
    console.error('Verilənlər bazası ilə əlaqə qurula bilmədi:', err);
  });

// Sequelize instansiyasının ixrac edilməsi
module.exports = sequelize; 