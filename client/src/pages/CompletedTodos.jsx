import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const CompletedTodos = () => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCompletedTodos();
  }, [isAuthenticated, navigate]);

  const fetchCompletedTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/todos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(response.data.filter(todo => todo.completed));
    } catch (err) {
      console.error('Error fetching completed todos:', err);
      setError(t.todos.fetchError);
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

  const restoreTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/todos/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error restoring todo:', err);
      setError(t.todos.toggleError);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-600">{t.todos.completedTitle}</h2>
        <Link
          to="/todos"
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
        >
          {t.todos.viewActive}
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

      <AnimatePresence>
        {todos.map(todo => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex items-center justify-between p-4 mb-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <span className="flex-1 text-gray-500 line-through">{todo.title}</span>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => restoreTodo(todo.id)}
                className="p-2 text-blue-600 hover:text-blue-800"
                title={t.todos.restoreButton}
              >
                ↩
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteTodo(todo.id)}
                className="p-2 text-red-600 hover:text-red-800"
                title={t.todos.deleteButton}
              >
                ×
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {todos.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 mt-8"
        >
          {t.todos.noCompletedMessage}
        </motion.p>
      )}
    </motion.div>
  );
};

export default CompletedTodos; 