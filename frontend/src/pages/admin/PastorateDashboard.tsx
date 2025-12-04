import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Icon Components
function GlobeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function CampusIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function AlgorithmIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  );
}

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function PastorateDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/admin/login', { replace: true });
  };

  const adminInitials = admin 
    ? `${admin.firstName.charAt(0)}${admin.lastName.charAt(0)}`.toUpperCase()
    : '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md text-white">
                  <GlobeIcon />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">UONSDA Pastorate</span>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-700">
                  {adminInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {admin?.firstName} {admin?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">Pastorate Elder</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-700">
                  {adminInitials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {admin?.firstName} {admin?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Pastorate Elder</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, Elder {admin?.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            Coordinating missionary activities across all UONSDA campuses
          </p>
        </header>

        {/* Mission Management Hero Card */}
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl shadow-2xl p-8 md:p-12 text-white mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex-1 mb-6 md:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white">
                  <GlobeIcon />
                </div>
                <h2 className="text-4xl font-black">Mission Management</h2>
              </div>
              
              <p className="text-orange-100 text-lg mb-6 max-w-2xl leading-relaxed">
                Upload missionary registrations from all campuses, run intelligent distribution algorithms, 
                and assign teams fairly across sites. Manage December and June mission activities efficiently.
              </p>

              <button
                onClick={() => navigate('/admin/missions')}
                className="group px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all transform hover:scale-105 shadow-xl flex items-center gap-3"
              >
                <span className="text-lg">Go to Mission Management</span>
                <div className="group-hover:translate-x-1 transition-transform">
                  <ArrowRightIcon />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <CampusIcon />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">11</h3>
                <p className="text-sm text-gray-600">UONSDA Campuses</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Main, Medical School, Kikuyu, Kenya Science, Chiromo, Parklands, 
              Upper Kabete, Lower Kabete, PUEA, Associate, Visitors
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <CalendarIcon />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">2×</h3>
                <p className="text-sm text-gray-600">Missions Per Year</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              December & June missionary outreach programs coordinated across all campuses
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <AlgorithmIcon />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Smart</h3>
                <p className="text-sm text-gray-600">Distribution Algorithm</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Balanced by gender, campus, year of study, and mission experience automatically
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="text-orange-600">
              <BoltIcon />
            </div>
            How Mission Management Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-blue-700 text-xl">
                  1
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Create Mission</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Set mission dates, location, and number of sites
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-green-700 text-xl">
                  2
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Upload Data</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Import CSV/Excel with registrations from all campuses
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-purple-700 text-xl">
                  3
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Run Algorithm</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Algorithm distributes missionaries fairly across all sites
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-orange-700 text-xl">
                  4
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Export Results</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Download Excel with complete site assignments
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}