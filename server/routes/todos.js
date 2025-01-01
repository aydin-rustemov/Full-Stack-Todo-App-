// Lazımi modulların idxal edilməsi
const express = require('express');                          // Express framework
const auth = require('../middleware/auth');                  // Autentifikasiya middleware-i
const todoController = require('../controllers/todoController'); // Tapşırıqlar controller-i

// Express Router instansiyasının yaradılması
const router = express.Router();

// Bütün tapşırıqları əldə etmək marşrutu
// GET /api/todos
router.get('/', auth, todoController.getTodos);

// Tamamlanmış tapşırıqları əldə etmək marşrutu
// GET /api/todos/completed
router.get('/completed', auth, todoController.getCompletedTodos);

// Yeni tapşırıq yaratmaq marşrutu
// POST /api/todos
router.post('/', auth, todoController.createTodo);

// Tapşırığı yeniləmək marşrutu
// PUT /api/todos/:id
router.put('/:id', auth, todoController.updateTodo);

// Tapşırığı silmək marşrutu
// DELETE /api/todos/:id
router.delete('/:id', auth, todoController.deleteTodo);

// Tapşırığın statusunu dəyişmək marşrutu
// PATCH /api/todos/:id/toggle
router.patch('/:id/toggle', auth, todoController.toggleTodo);

// Router-in ixrac edilməsi
module.exports = router; 