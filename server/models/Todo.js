// Sequelize-dən DataTypes obyektinin idxal edilməsi
const { DataTypes } = require('sequelize');
// Verilənlər bazası konfiqurasiyasının idxal edilməsi
const sequelize = require('../config/database');

// Todo modelinin təyin edilməsi
const Todo = sequelize.define('Todo', {
  // Unikal identifikator
  id: {
    type: DataTypes.INTEGER,        // Tam ədəd tipi
    primaryKey: true,               // Əsas açar
    autoIncrement: true,            // Avtomatik artım
    allowNull: false                // Boş qiymət ola bilməz
  },
  // Tapşırığın başlığı
  title: {
    type: DataTypes.STRING,         // Mətn tipi
    allowNull: false,               // Boş qiymət ola bilməz
    validate: {
      notEmpty: true                // Boş mətn ola bilməz
    }
  },
  // Tapşırığın tamamlanma statusu
  completed: {
    type: DataTypes.BOOLEAN,        // Məntiqi tip
    allowNull: false,               // Boş qiymət ola bilməz
    defaultValue: false             // Standart qiymət: tamamlanmayıb
  },
  // İstifadəçi identifikatoru - əlaqə üçün
  userId: {
    type: DataTypes.INTEGER,        // Tam ədəd tipi
    allowNull: false,               // Boş qiymət ola bilməz
    references: {
      model: 'Users',               // Əlaqəli model
      key: 'id'                     // Əlaqəli modelin açarı
    }
  }
}, {
  tableName: 'Todos',               // Verilənlər bazasında cədvəlin adı
  timestamps: true                  // Yaradılma və yenilənmə tarixlərinin avtomatik əlavə edilməsi
});

// Todo modelinin ixrac edilməsi
module.exports = Todo; 