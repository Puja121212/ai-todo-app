import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../hooks/useToast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const { login, error, clearError, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      });

      if (res.success) {
        showToast.success('Login success 🎉');
        navigate('/dashboard');
      } else {
        showToast.error(res.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      showToast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-50 to-purple-100 px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm backdrop-blur-xl bg-white/70 border border-white/30 shadow-2xl rounded-3xl p-8"
      >

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
            Welcome Back
          </h2>

          <p className="text-gray-500 mt-2 text-sm">
            Login to continue 🚀
          </p>
        </div>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="username"
          className="w-full px-4 py-3 mb-4 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          value={formData.email || ''}
          onChange={handleChange}
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          className="w-full px-4 py-3 mb-4 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
          value={formData.password || ''}
          onChange={handleChange}
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Footer */}
        <p className="text-center mt-5 text-gray-600 text-sm">
          New user?{' '}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:text-pink-500 transition-colors"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;