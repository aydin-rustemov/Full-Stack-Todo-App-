// Todo modelinin idxal edilməsi
const Todo = require('../models/Todo');

// Bütün tapşırıqları əldə etmək
const getTodos = async (req, res) => {
  try {
    const userId = req.user.id;  // Cari istifadəçinin ID-si

    // İstifadəçinin bütün tapşırıqlarını əldə edirik
    const todos = await Todo.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]  // Yaradılma tarixinə görə azalan sıra ilə
    });

    res.json(todos);
  } catch (err) {
    console.error('Tapşırıqları əldə edərkən xəta:', err);
    res.status(500).json({ message: 'Tapşırıqları əldə edərkən xəta baş verdi' });
  }
};

// Yeni tapşırıq yaratmaq
const createTodo = async (req, res) => {
  try {
    const { title } = req.body;  // Sorğudan başlığı alırıq
    
    // Başlığın boş olub-olmadığını yoxlayırıq
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Başlıq tələb olunur' });
    }

    // Yeni tapşırıq yaradırıq
    const todo = await Todo.create({
      title,
      userId: req.user.id,
      completed: false
    });

    res.status(201).json(todo);
  } catch (err) {
    console.error('Tapşırıq yaradarkən xəta:', err);
    res.status(500).json({ message: 'Tapşırıq yaradarkən xəta baş verdi' });
  }
};

// Tapşırığı yeniləmək
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;                 // URL parametrlərindən ID-ni alırıq
    const { title, completed } = req.body;     // Yenilənəcək məlumatları alırıq

    // Tapşırığı ID-yə görə tapırıq
    const todo = await Todo.findByPk(id);

    // Tapşırıq tapılmadısa
    if (!todo) {
      return res.status(404).json({ message: 'Tapşırıq tapılmadı' });
    }

    // İstifadəçinin bu tapşırığı yeniləməyə icazəsi var mı yoxlayırıq
    if (todo.userId !== req.user.id) {
      return res.status(403).json({ message: 'Bu tapşırığı yeniləməyə icazəniz yoxdur' });
    }

    // Məlumatları yeniləyirik
    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();

    res.json(todo);
  } catch (err) {
    console.error('Tapşırığı yeniləyərkən xəta:', err);
    res.status(500).json({ message: 'Tapşırığı yeniləyərkən xəta baş verdi' });
  }
};

// Tapşırığın statusunu dəyişmək
const toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;  // URL parametrlərindən ID-ni alırıq

    // Tapşırığı ID-yə görə tapırıq
    const todo = await Todo.findByPk(id);

    // Tapşırıq tapılmadısa
    if (!todo) {
      return res.status(404).json({ message: 'Tapşırıq tapılmadı' });
    }

    // İstifadəçinin bu tapşırığı dəyişməyə icazəsi var mı yoxlayırıq
    if (todo.userId !== req.user.id) {
      return res.status(403).json({ message: 'Bu tapşırığın statusunu dəyişməyə icazəniz yoxdur' });
    }

    // Statusu əksinə çeviririk
    todo.completed = !todo.completed;

    await todo.save();

    res.json(todo);
  } catch (err) {
    console.error('Tapşırığın statusunu dəyişərkən xəta:', err);
    res.status(500).json({ message: 'Tapşırığın statusunu dəyişərkən xəta baş verdi' });
  }
};

// Tapşırığı silmək
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;  // URL parametrlərindən ID-ni alırıq

    // Tapşırığı ID-yə görə tapırıq
    const todo = await Todo.findByPk(id);

    // Tapşırıq tapılmadısa
    if (!todo) {
      return res.status(404).json({ message: 'Tapşırıq tapılmadı' });
    }

    // İstifadəçinin bu tapşırığı silməyə icazəsi var mı yoxlayırıq
    if (todo.userId !== req.user.id) {
      return res.status(403).json({ message: 'Bu tapşırığı silməyə icazəniz yoxdur' });
    }

    await todo.destroy();
    res.json({ message: 'Tapşırıq uğurla silindi' });
  } catch (err) {
    console.error('Tapşırığı silməkdə xəta:', err);
    res.status(500).json({ message: 'Tapşırığı silməkdə xəta baş verdi' });
  }
};

// Tamamlanmış tapşırıqları əldə etmək
const getCompletedTodos = async (req, res) => {
  try {
    const userId = req.user.id;  // Cari istifadəçinin ID-si

    // Tamamlanmış tapşırıqları əldə edirik
    const completedTodos = await Todo.findAll({
      where: { 
        userId,
        completed: true 
      },
      order: [['updatedAt', 'DESC']]  // Yenilənmə tarixinə görə azalan sıra ilə
    });

    res.json(completedTodos);
  } catch (err) {
    console.error('Tamamlanmış tapşırıqları əldə edərkən xəta:', err);
    res.status(500).json({ message: 'Tamamlanmış tapşırıqları əldə edərkən xəta baş verdi' });
  }
};

// Controller funksiyalarının ixrac edilməsi
module.exports = {
  getTodos,            // Bütün tapşırıqları əldə etmək
  createTodo,         // Yeni tapşırıq yaratmaq
  updateTodo,         // Tapşırığı yeniləmək
  toggleTodo,         // Tapşırığın statusunu dəyişmək
  deleteTodo,         // Tapşırığı silmək
  getCompletedTodos   // Tamamlanmış tapşırıqları əldə etmək
}; 