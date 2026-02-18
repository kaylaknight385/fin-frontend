import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signup as signupService } from '../services/authService';
import { THEMES } from '../utils/constants';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    theme: 'cosmic'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get current theme preview
  const currentThemePreview = THEMES.find(t => t.id === formData.theme);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await signupService(signupData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* vid for background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/src/assets/RizeUp-bg.mp4" type="video/mp4" />
      </video>
      
      {/* little overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
      
      {/* da form */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative z-10">
        {/* form header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-purple-600 mb-2 font-play-pretend">Rize Up</h1>
          <p className="text-gray-600">
            {step === 1 ? 'Create your account' : `Pick your theme and finance buddy - Meet ${currentThemePreview.agent}`}
          </p>
        </div>

        {/* signup step progress*/}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            {step > 1 ? '✓' : '1'}
          </div>
          <div className={`w-20 h-1 transition-all duration-500 ${step === 2 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            step === 2 ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
        </div>

        {/* errors */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* step 1: Account Info */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Name here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="user@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 active:scale-95 transition-all mt-2"
            >
              Next
            </button>
          </form>
        )}

        {/* step 2: PICK THAT THEME */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* theme preview  */}
            <div className={`bg-gradient-to-br ${currentThemePreview.gradient} text-white rounded-xl p-6 mb-4 transition-all duration-500`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">{currentThemePreview.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{currentThemePreview.agent}</p>
                  <p className="text-sm opacity-90">Your AI Money Buddy</p>
                </div>
              </div>
              
              {/* lil AI message */}
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
                <p className="text-sm font-medium">
                  {currentThemePreview.id === 'cosmic' && "yo star child! ready to make your money orbit perfectly? let's get this cosmic cash flowing!"}
                  {currentThemePreview.id === 'garden' && "hey sprout! let's grow your money tree together. time to plant some financial seeds!"}
                  {currentThemePreview.id === 'neon' && "what's up player! ready to level up your finances? let's unlock those money achievements!"}
                </p>
              </div>

              {/* preview stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20 text-center">
                  <p className="text-xs opacity-75">Balance</p>
                  <p className="text-lg font-bold">$2,847</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20 text-center">
                  <p className="text-xs opacity-75">Budget</p>
                  <p className="text-lg font-bold">85%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20 text-center">
                  <p className="text-xs opacity-75">Saved</p>
                  <p className="text-lg font-bold">$24</p>
                </div>
              </div>
            </div>

            {/* theme selector bttons */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">Choose Your Theme:</p>
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, theme: theme.id })}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                    formData.theme === theme.id
                      ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white font-bold shadow-md`}>
                        {theme.name.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{theme.name}</p>
                        <p className="text-sm text-gray-500">{theme.description}</p>
                      </div>
                    </div>
                    {formData.theme === theme.id && (
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* action buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating...' : "Let's Rize Up"}
              </button>
            </div>
          </form>
        )}

        {/* login link */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;