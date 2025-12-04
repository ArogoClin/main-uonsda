import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

type AdminRole = 'PASTORATE' | 'ELDER' | 'CLERK';

interface RoleConfig {
  code: string;
  max: number;
  label: string;
  description: string;
  color: string;
}

const ROLE_CONFIGS: Record<AdminRole, RoleConfig> = {
  PASTORATE: {
    code: 'UONSDAMISSIONS2025',
    max: 3,
    label: 'PASTORATE',
    description: 'Full system access, manage missions',
    color: 'purple',
  },
  ELDER: {
    code: 'UONSDA-ELDER-2025',
    max: 5,
    label: 'ELDER',
    description: 'Manage members, attendance, communion',
    color: 'blue',
  },
  CLERK: {
    code: 'UONSDA-CLERK-2025',
    max: 10,
    label: 'CLERK',
    description: 'View-only access, record keeping',
    color: 'green',
  },
};

export default function AdminRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'role' | 'code' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);
  const [roleCounts, setRoleCounts] = useState<Record<AdminRole, number | null>>({
    PASTORATE: null,
    ELDER: null,
    CLERK: null,
  });
  
  const [registrationCode, setRegistrationCode] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Fetch counts for all roles
  useEffect(() => {
    const fetchCounts = async () => {
      const roles: AdminRole[] = ['PASTORATE', 'ELDER', 'CLERK'];
      
      for (const role of roles) {
        try {
          const res = await api.get(`/api/auth/admin/count/${role}`);
          if (res.data.success) {
            setRoleCounts(prev => ({ ...prev, [role]: res.data.count }));
          }
        } catch (err) {
          console.error(`Failed to fetch ${role} count:`, err);
        }
      }
    };
    fetchCounts();
  }, []);

  const handleRoleSelect = (role: AdminRole) => {
    const count = roleCounts[role];
    const max = ROLE_CONFIGS[role].max;
    
    if (count !== null && count >= max) {
      setError(`All ${max} ${ROLE_CONFIGS[role].label} slots are filled. Contact existing administrators. `);
      return;
    }
    
    setSelectedRole(role);
    setStep('code');
    setError(null);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (! selectedRole) return;
    
    const config = ROLE_CONFIGS[selectedRole];
    
    if (registrationCode === config.code) {
      setStep('form');
      setError(null);
    } else {
      setError(`Invalid registration code for ${config.label} role`);
    }
  };

  const handleFormSubmit = async (e: React. FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api. post('/api/auth/admin/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        password: formData.password,
        role: selectedRole,
        registrationCode,
      });

      if (response.data.success && response.data.data) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('admin', JSON.stringify(response.data.data.admin));
        
        // Redirect based on role
        if (selectedRole === 'PASTORATE') {
          navigate('/admin/pastorate', { replace: true });
        } else {
          navigate('/admin/dashboard', { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.response?.data?. message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const config = selectedRole ? ROLE_CONFIGS[selectedRole] : null;
  const count = selectedRole ? roleCounts[selectedRole] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 rounded-2xl overflow-hidden shadow-2xl ring-8 ring-white/50 bg-white">
            <img 
              src="/logo2.png"
              alt="UONSDA Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Admin Registration</h1>
          <p className="text-gray-600 mt-1">Create your administrative account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500" />

          {step === 'role' ?  (
            // ✅ STEP 1: SELECT ROLE
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Select Your Role</h2>
              
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200 mb-6">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {(Object.keys(ROLE_CONFIGS) as AdminRole[]).map((role) => {
                  const cfg = ROLE_CONFIGS[role];
                  const roleCount = roleCounts[role];
                  const isFull = roleCount !== null && roleCount >= cfg.max;
                  
                  return (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      disabled={isFull}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                        isFull
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                          : `border-${cfg.color}-200 hover:border-${cfg.color}-400 hover:shadow-lg cursor-pointer`
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{cfg.label}</h3>
                          <p className="text-sm text-gray-600 mb-3">{cfg.description}</p>
                          
                          {/* Slot indicator */}
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              {[...Array(cfg.max)]. map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    roleCount !== null && i < roleCount
                                      ?  `bg-${cfg.color}-500`
                                      : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={`text-xs font-semibold ${
                              isFull ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {roleCount !== null ?  `${roleCount}/${cfg.max}` : 'Loading...'}
                              {isFull && ' (FULL)'}
                            </span>
                          </div>
                        </div>
                        
                        {! isFull && (
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 text-center">
                <a href="/admin/login" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  ← Already have an account?  Login
                </a>
              </div>
            </div>
          ) : step === 'code' ? (
            // ✅ STEP 2: REGISTRATION CODE
            <form onSubmit={handleCodeSubmit} className="p-8 space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => { setStep('role'); setRegistrationCode(''); setError(null); }}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium mb-4"
                >
                  ← Change role
                </button>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-blue-900">{config?.label}</h3>
                    {count !== null && (
                      <span className="text-xs font-semibold text-blue-700">
                        Slot {count + 1} of {config?.max}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-blue-800">
                    Enter the registration code for {config?.label} role provided by your system administrator. 
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {config?.label} Registration Code
                </label>
                <input
                  type="text"
                  value={registrationCode}
                  onChange={(e) => setRegistrationCode(e.target. value. toUpperCase())}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 outline-none font-mono text-center text-lg tracking-wider"
                  placeholder="XXXX-XXXX-XXXX"
                  maxLength={20}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Verify Code
              </button>
            </form>
          ) : (
            // ✅ STEP 3: REGISTRATION FORM
            <form onSubmit={handleFormSubmit} className="p-8 space-y-5">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-green-800">
                  ✓ Code verified!  Complete your {config?.label} account setup.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData. firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e. target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e. target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone (optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 outline-none"
                  placeholder="Min 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
              >
                {loading ? 'Creating Account...' : `Create ${config?.label} Account`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}