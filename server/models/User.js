// Lazımi modulların idxal edilməsi
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

// Şifrənin etibarlılığını yoxlayan köməkçi funksiya
const validatePassword = (password) => {
  const minLength = 8;                                        // Minimum şifrə uzunluğu
  const hasUpperCase = /[A-Z]/.test(password);               // Böyük hərf yoxlanışı
  const hasNumber = /[0-9]/.test(password);                  // Rəqəm yoxlanışı
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Xüsusi simvol yoxlanışı

  const errors = [];
  // Şifrə validasiya qaydalarının yoxlanılması
  if (password.length < minLength) {
    errors.push(`Şifrə ən azı ${minLength} simvol uzunluğunda olmalıdır`);
  }
  if (!hasUpperCase) {
    errors.push('Şifrədə ən azı bir böyük hərf olmalıdır');
  }
  if (!hasNumber) {
    errors.push('Şifrədə ən azı bir rəqəm olmalıdır');
  }
  if (!hasSymbol) {
    errors.push('Şifrədə ən azı bir xüsusi simvol olmalıdır');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// İstifadəçi modelinin təyin edilməsi
const User = sequelize.define('User', {
  // Unikal identifikator
  id: {
    type: DataTypes.INTEGER,        // Tam ədəd tipi
    primaryKey: true,               // Əsas açar
    autoIncrement: true,            // Avtomatik artım
    allowNull: false                // Boş qiymət ola bilməz
  },
  // İstifadəçinin adı
  name: {
    type: DataTypes.STRING,         // Mətn tipi
    allowNull: false,               // Boş qiymət ola bilməz
    validate: {
      notEmpty: true                // Boş mətn ola bilməz
    }
  },
  // İstifadəçinin email ünvanı
  email: {
    type: DataTypes.STRING,         // Mətn tipi
    allowNull: false,               // Boş qiymət ola bilməz
    unique: true,                   // Unikal olmalıdır
    validate: {
      isEmail: true,                // Email formatında olmalıdır
      notEmpty: true                // Boş mətn ola bilməz
    }
  },
  // İstifadəçinin şifrəsi
  password: {
    type: DataTypes.STRING,         // Mətn tipi
    allowNull: false,               // Boş qiymət ola bilməz
    validate: {
      notEmpty: true                // Boş mətn ola bilməz
    }
  }
}, {
  tableName: 'Users',               // Verilənlər bazasında cədvəlin adı
  timestamps: true,                 // Yaradılma və yenilənmə tarixlərinin avtomatik əlavə edilməsi
  hooks: {
    // İstifadəçi yaradılmadan əvvəl şifrənin həşlənməsi
    beforeCreate: async (user) => {
      if (user.password) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
      }
    },
    // İstifadəçi məlumatları yenilənərkən şifrənin həşlənməsi
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
      }
    }
  },
  methods: {
    // Şifrənin doğruluğunu yoxlayan metod
    validatePassword: async function(password) {
      return await bcrypt.compare(password, this.password);
    }
  }
});

// İstifadəçi modelinin ixrac edilməsi
module.exports = User; 