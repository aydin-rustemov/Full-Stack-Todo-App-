import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchTodos();
  }, [isAuthenticated, navigate]);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/todos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(response.data.filter(todo => !todo.completed));
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError(t.todos.fetchError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/api/todos', 
        { title: newTodo },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (err) {
      console.error('Error adding todo:', err);
      setError(t.todos.addError);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/todos/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error toggling todo:', err);
      setError(t.todos.toggleError);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/todos/${id}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError(t.todos.deleteError);
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo.id);
    setEditText(todo.title);
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3001/api/todos/${editingTodo}`,
        { title: editText },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTodos(todos.map(todo => 
        todo.id === editingTodo ? { ...todo, title: editText } : todo
      ));
      setEditingTodo(null);
      setEditText('');
    } catch (err) {
      console.error('Error updating todo:', err);
      setError(t.todos.updateError);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-600">{t.todos.activeTitle}</h2>
        <Link
          to="/completed-todos"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          {t.todos.viewCompleted}
        </Link>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder={t.todos.inputPlaceholder}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {t.todos.addButton}
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {todos.map(todo => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex items-center justify-between p-4 mb-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            {editingTodo === todo.id ? (
              <div className="flex-1 flex gap-4">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveEdit}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  {t.todos.saveButton}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditingTodo(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  {t.todos.cancelButton}
                </motion.button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-gray-800">{todo.title}</span>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startEditing(todo)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    ✎
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleTodo(todo.id)}
                    className="p-2 text-green-600 hover:text-green-800"
                  >
                    ✓
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {todos.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 mt-8"
        >
          {t.todos.emptyMessage}
        </motion.p>
      )}
    </motion.div>
  );
};

export default Todos; 