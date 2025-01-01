// Lazımi modulların idxal edilməsi
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT token yaratmaq üçün köməkçi funksiya
// Bu token istifadəçinin kimliyini təsdiqləmək üçün istifadə olunur
const generateToken = (user) => {
  // jwt.sign() ilə yeni token yaradırıq
  // Birinci parametr: Tokendə saxlanılacaq məlumatlar (payload)
  // İkinci parametr: Gizli açar (JWT_SECRET)
  // Üçüncü parametr: Tokenin etibarlılıq müddəti (24 saat)
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

// Şifrə tələblərini yoxlayan funksiya
const validatePassword = (password) => {
  // Ən azı 8 simvol uzunluğunda olmalıdır
  const minLength = password.length >= 8;
  // Ən azı bir böyük hərf olmalıdır
  const hasUppercase = /[A-Z]/.test(password);
  // Ən azı bir rəqəm olmalıdır
  const hasNumber = /[0-9]/.test(password);
  // Ən azı bir xüsusi simvol olmalıdır
  const hasSpecial = /[!@#$%^&*]/.test(password);

  // Bütün tələblərin yerinə yetirilməsini yoxlayırıq
  return {
    isValid: minLength && hasUppercase && hasNumber && hasSpecial,
    errors: {
      minLength: !minLength ? 'Şifrə ən azı 8 simvol uzunluğunda olmalıdır' : null,
      hasUppercase: !hasUppercase ? 'Şifrədə ən azı bir böyük hərf olmalıdır' : null,
      hasNumber: !hasNumber ? 'Şifrədə ən azı bir rəqəm olmalıdır' : null,
      hasSpecial: !hasSpecial ? 'Şifrədə ən azı bir xüsusi simvol olmalıdır (!@#$%^&*)' : null
    }
  };
};

// İstifadəçi qeydiyyatını həyata keçirən controller funksiyası
const register = async (req, res) => {
  try {
    // Sorğu gövdəsindən istifadəçi məlumatlarını alırıq
    const { name, email, password } = req.body;

    // Şifrə tələblərini yoxlayırıq
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: 'Şifrə tələbləri qarşılanmır',
        errors: passwordValidation.errors 
      });
    }

    // Email ünvanı ilə qeydiyyatdan keçmiş istifadəçi var ya yox yoxlayırıq
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email artıq qeydiyyatdan keçib' });
    }

    // Yeni istifadəçi yaradırıq
    // Şifrə User modelindəki beforeCreate hook-unda avtomatik həşlənir
    const user = await User.create({
      name,
      email,
      password
    });

    // İstifadəçi üçün JWT token yaradırıq
    const token = generateToken(user);

    // Uğurlu cavab qaytarırıq
    // Şifrəni cavabdan çıxarırıq (təhlükəsizlik üçün)
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Qeydiyyat xətası:', err);
    res.status(500).json({ message: 'Qeydiyyat zamanı xəta baş verdi' });
  }
};

// İstifadəçi girişini həyata keçirən controller funksiyası
const login = async (req, res) => {
  try {
    // Sorğu gövdəsindən email və şifrəni alırıq
    const { email, password } = req.body;

    // Email ilə istifadəçini tapırıq
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email və ya şifrə səhvdir' });
    }

    // Şifrəni yoxlayırıq
    // bcrypt.compare() funksiyası ilə həşlənmiş şifrəni müqayisə edirik
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email və ya şifrə səhvdir' });
    }

    // İstifadəçi üçün JWT token yaradırıq
    const token = generateToken(user);

    // Uğurlu cavab qaytarırıq
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Giriş xətası:', err);
    res.status(500).json({ message: 'Giriş zamanı xəta baş verdi' });
  }
};

// İstifadəçi məlumatlarını yeniləyən controller funksiyası
const updateUser = async (req, res) => {
  try {
    // Sorğu gövdəsindən yenilənəcək məlumatları alırıq
    const { name, email, currentPassword, newPassword } = req.body;

    // İstifadəçini verilənlər bazasından tapırıq
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }

    // Şifrə dəyişikliyi varsa yoxlayırıq
    if (newPassword) {
      // Mövcud şifrənin doğruluğunu yoxlayırıq
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Cari şifrə səhvdir' });
      }

      // Yeni şifrə tələblərini yoxlayırıq
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ 
          message: 'Yeni şifrə tələbləri qarşılanmır',
          errors: passwordValidation.errors 
        });
      }

      // Yeni şifrəni həşləyirik
      user.password = newPassword;
    }

    // Digər məlumatları yeniləyirik
    if (name) user.name = name;
    if (email) user.email = email;

    // Dəyişiklikləri yadda saxlayırıq
    await user.save();

    // Uğurlu cavab qaytarırıq
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('İstifadəçi yeniləmə xətası:', err);
    res.status(500).json({ message: 'İstifadəçi məlumatlarının yenilənməsi zamanı xəta baş verdi' });
  }
};

// Controller funksiyalarının ixrac edilməsi
module.exports = {
  register,    // İstifadəçi qeydiyyatı
  login,       // İstifadəçi girişi
  updateUser   // İstifadəçi məlumatlarının yenilənməsi
}; 