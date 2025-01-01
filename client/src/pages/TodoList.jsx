// Lazımi modulların idxal edilməsi
import { useState, useEffect } from 'react';                                           // React hook-ları
import axios from 'axios';                                                             // HTTP sorğuları üçün
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'; // İkonlar

// Tapşırıqlar siyahısı komponenti
function TodoList() {
  // State-lərin təyin edilməsi
  const [todos, setTodos] = useState([]);                  // Tapşırıqlar siyahısı
  const [newTodo, setNewTodo] = useState('');              // Yeni tapşırıq mətni
  const [editingTodo, setEditingTodo] = useState(null);    // Redaktə olunan tapşırığın ID-si
  const [editText, setEditText] = useState('');            // Redaktə olunan mətn
  const [error, setError] = useState('');                  // Xəta mesajı

  // Komponent yükləndikdə tapşırıqları gətirmək
  useEffect(() => {
    fetchTodos();
  }, []);

  // Tapşırıqları serverdən gətirən funksiya
  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data);
    } catch (err) {
      setError('Tapşırıqları yükləmək mümkün olmadı');
    }
  };

  // Yeni tapşırıq əlavə edən funksiya
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/api/todos',
        { text: newTodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (err) {
      setError('Tapşırıq əlavə etmək mümkün olmadı');
    }
  };

  // Tapşırığı yeniləyən funksiya
  const handleUpdateTodo = async (id) => {
    if (!editText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:3001/api/todos/${id}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
      setEditingTodo(null);
    } catch (err) {
      setError('Tapşırığı yeniləmək mümkün olmadı');
    }
  };

  // Tapşırığı silən funksiya
  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError('Tapşırığı silmək mümkün olmadı');
    }
  };

  // Tapşırığın redaktəsini başladan funksiya
  const startEditing = (todo) => {
    setEditingTodo(todo.id);
    setEditText(todo.text);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Səhifə başlığı */}
      <h2 className="text-3xl font-bold text-center mb-8">Mənim Tapşırıqlarım</h2>
      
      {/* Xəta mesajı - əgər varsa */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Yeni tapşırıq əlavə etmə formu */}
      <form onSubmit={handleAddTodo} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Yeni tapşırıq əlavə et..."
            className="input flex-grow"
          />
          <button type="submit" className="btn btn-primary">
            Əlavə et
          </button>
        </div>
      </form>

      {/* Tapşırıqlar siyahısı */}
      <div className="space-y-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
          >
            {/* Redaktə rejimi */}
            {editingTodo === todo.id ? (
              <div className="flex items-center gap-2 flex-grow">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="input flex-grow"
                />
                {/* Yadda saxla düyməsi */}
                <button
                  onClick={() => handleUpdateTodo(todo.id)}
                  className="btn btn-primary p-2"
                >
                  <CheckIcon className="h-5 w-5" />
                </button>
                {/* Ləğv et düyməsi */}
                <button
                  onClick={() => setEditingTodo(null)}
                  className="btn btn-secondary p-2"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                {/* Tapşırıq mətni */}
                <span className="text-gray-800">{todo.text}</span>
                {/* Düymələr */}
                <div className="flex items-center gap-2">
                  {/* Redaktə düyməsi */}
                  <button
                    onClick={() => startEditing(todo)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  {/* Silmə düyməsi */}
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Komponentin ixrac edilməsi
export default TodoList; 