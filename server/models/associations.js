// Modellərin idxal edilməsi
const User = require('./User');   // İstifadəçi modeli
const Todo = require('./Todo');   // Tapşırıq modeli

// Model əlaqələrinin təyin edilməsi
const defineAssociations = () => {
  // Bir istifadəçinin bir neçə tapşırığı ola bilər (one-to-many əlaqəsi)
  User.hasMany(Todo, {
    foreignKey: 'userId',         // Tapşırıq modelindəki əlaqə sahəsi
    onDelete: 'CASCADE'           // İstifadəçi silindikdə onun bütün tapşırıqları da silinəcək
  });

  // Hər tapşırıq bir istifadəçiyə məxsusdur (many-to-one əlaqəsi)
  Todo.belongsTo(User, {
    foreignKey: 'userId'          // Tapşırıq modelindəki əlaqə sahəsi
  });
};

// Əlaqələri təyin edən funksiyanın ixrac edilməsi
module.exports = defineAssociations; 