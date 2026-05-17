import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../hooks/useToast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register, error, clearError, isAuthenticated } = useAuth();
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email required';
    }

    if (!formData.password?.trim()) {
      newErrors.password = 'Password required';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password mismatch';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (res.success) {
        showToast.success('Account created 🎉');
        navigate('/dashboard');
      } else {
        showToast.error(res.error || 'Registration failed');
      }
    } catch (err) {
      showToast.error('Something went wrong');
      console.error(err);
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
            Register
          </h2>

          <p className="text-gray-500 mt-2 text-sm">
            Create your account 🚀
          </p>
        </div>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          autoComplete="name"
          className="w-full px-4 py-3 mb-2 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          value={formData.name || ''}
          onChange={handleChange}
        />

        {errors.name && (
          <p className="text-red-500 text-sm mb-2">
            {errors.name}
          </p>
        )}

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="username"
          className="w-full px-4 py-3 mb-2 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
          value={formData.email || ''}
          onChange={handleChange}
        />

        {errors.email && (
          <p className="text-red-500 text-sm mb-2">
            {errors.email}
          </p>
        )}

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          className="w-full px-4 py-3 mb-2 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          value={formData.password || ''}
          onChange={handleChange}
        />

        {errors.password && (
          <p className="text-red-500 text-sm mb-2">
            {errors.password}
          </p>
        )}

        {/* Confirm Password */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          autoComplete="new-password"
          className="w-full px-4 py-3 mb-2 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
          value={formData.confirmPassword || ''}
          onChange={handleChange}
        />

        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-2">
            {errors.confirmPassword}
          </p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
        >
          {loading ? 'Creating...' : 'Register'}
        </button>

        {/* Footer */}
        <p className="text-center mt-5 text-gray-600 text-sm">
          Already have account?{' '}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:text-pink-500 transition-colors"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;