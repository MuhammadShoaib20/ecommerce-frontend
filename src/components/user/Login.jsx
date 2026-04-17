import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import { loginAPI } from '../../services/api';
import { FaEnvelope, FaLock, FaStore } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data } = await loginAPI(formData);
      localStorage.setItem('token', data.token);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      toast.success(data.message);
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(message));
      toast.error(message);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all";

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
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  required autoComplete="email" placeholder="you@example.com" className={inputClass} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <input type="password" name="password" value={formData.password} onChange={handleChange}
                  required autoComplete="current-password" placeholder="••••••••" className={inputClass} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[.98] shadow-lg shadow-blue-500/20 disabled:opacity-60 text-sm flex items-center justify-center gap-2 mt-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                : 'Sign In'
              }
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400 font-bold uppercase tracking-widest">or</span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            New here?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">Create account</Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Secured with 256-bit SSL encryption
        </p>
      </div>
    </div>
  );
};

export default Login;