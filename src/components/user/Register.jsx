import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import { registerAPI } from '../../services/api';
import { FaUser, FaEnvelope, FaLock, FaStore } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    dispatch(loginStart());
    try {
      const { data } = await registerAPI({ name: formData.name, email: formData.email, password: formData.password });
      localStorage.setItem('token', data.token);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      toast.success(data.message);
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch(loginFailure(message));
      toast.error(message);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all";

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', icon: <FaUser size={12} />, placeholder: 'John Doe', autoComplete: 'name' },
    { name: 'email', label: 'Email Address', type: 'email', icon: <FaEnvelope size={12} />, placeholder: 'you@example.com', autoComplete: 'email' },
    { name: 'password', label: 'Password', type: 'password', icon: <FaLock size={12} />, placeholder: 'Min. 6 characters', autoComplete: 'new-password', minLength: 6 },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: <FaLock size={12} />, placeholder: 'Repeat password', autoComplete: 'new-password' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm shadow-blue-500/20">
              <FaStore className="text-white text-sm" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">Shop<span className="text-blue-600">Hub</span></span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Create account</h1>
          <p className="text-gray-500 text-sm mt-1">Join thousands of happy shoppers</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{f.icon}</span>
                  <input type={f.type} name={f.name} value={formData[f.name]} onChange={handleChange}
                    required autoComplete={f.autoComplete} placeholder={f.placeholder}
                    minLength={f.minLength} className={inputClass} />
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[.98] shadow-lg shadow-blue-500/20 disabled:opacity-60 text-sm flex items-center justify-center gap-2 mt-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                : 'Create Account'
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">Sign in</Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          100% secure & encrypted registration
        </p>
      </div>
    </div>
  );
};

export default Register;