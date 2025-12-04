import { useState, useEffect } from 'react';
import missionService, { type Mission, type SiteDistribution } from '../../services/missionService';

// Icon Components
function AlertIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function MaleIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

// Reusable Confirm Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <h3 className="text-2xl font-black text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-700 mb-8">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-4 font-black rounded-xl shadow-lg transition ${
              isDestructive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MissionManagement() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [distribution, setDistribution] = useState<SiteDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [distributing, setDistributing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    numberOfSites: 5,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [missionsData, activeData] = await Promise.all([
        missionService.getMissions(),
        missionService.getActiveMission(),
      ]);

      setMissions(missionsData);
      setActiveMission(activeData);

      if (activeData?._count?.distributions && activeData._count.distributions > 0) {
        const dist = await missionService.getDistribution(activeData.id);
        setDistribution(dist);
      } else {
        setDistribution([]);
      }
      setError(null);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Unable to load mission data';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates');
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (endDate <= startDate) {
      setError('End date must be after start date');
      return;
    }

    try {
      setError(null);
      await missionService.createMission({
        name: formData.name.trim(),
        location: formData.location.trim(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        numberOfSites: formData.numberOfSites,
      });

      setShowCreateModal(false);
      setFormData({ name: '', location: '', startDate: '', endDate: '', numberOfSites: 5 });
      setUploadSuccess('Mission created successfully');
      loadData();
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Unable to create mission';
      setError(message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeMission || !e.target.files?.[0]) return;

    const file = e.target.files[0];

    try {
      setUploading(true);
      setError(null);
      setUploadSuccess(null);

      const result = await missionService.uploadRegistrations(activeMission.id, file);
      setUploadSuccess(result.message || 'Registrations uploaded successfully');
      loadData();
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Unable to upload file';
      setError(message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDistribute = async () => {
    if (!activeMission) return;

    setConfirmModal({
      isOpen: true,
      title: 'Redistribute All Missionaries? ',
      message: 'This will re-assign every missionary to a new site.  Previous distribution will be lost.',
      confirmText: 'Yes, Redistribute',
      onConfirm: async () => {
        try {
          setDistributing(true);
          setError(null);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          await missionService.distributeMissionaries(activeMission.id);
          setUploadSuccess('Missionaries distributed successfully');
          loadData();
        } catch (err: any) {
          const message = err.response?.data?.message || err.message || 'Unable to distribute missionaries';
          setError(message);
        } finally {
          setDistributing(false);
        }
      },
      isDestructive: false,
    });
  };

  const handleExport = async () => {
    if (!activeMission) return;
    try {
      await missionService.exportDistribution(activeMission.id, activeMission.name);
    } catch (err: any) {
      setError('Unable to export distribution');
    }
  };

  const handleDeleteMission = async (missionId: string, missionName: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Mission Permanently?',
      message: `This will delete "${missionName}" and ALL its data (registrations, distributions).  This action cannot be undone.`,
      confirmText: 'Delete Forever',
      onConfirm: async () => {
        try {
          setError(null);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          await missionService.deleteMission(missionId);
          setUploadSuccess(`Mission "${missionName}" deleted successfully`);
          loadData();
        } catch (err: any) {
          const message = err.response?.data?.message || err.message || 'Unable to delete mission';
          setError(message);
        }
      },
      isDestructive: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading missions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Mission Management</h1>
            <p className="text-gray-600 mt-1">Manage missionary registrations and site distributions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowInstructions(true)}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:border-orange-300 transition-all flex items-center gap-2"
            >
              <InfoIcon />
              Instructions
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <PlusIcon />
              New Mission
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-white border-l-4 border-red-500 shadow-lg rounded-xl mb-6 p-5 flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">
                <AlertIcon />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Error</h4>
                <p className="text-sm text-gray-700">{error}</p>
              </div>
            </div>
            <button onClick={() => setError(null)} className="text-gray-400 hover:text-gray-600 ml-4">
              <CloseIcon />
            </button>
          </div>
        )}

        {uploadSuccess && (
          <div className="bg-white border-l-4 border-green-500 shadow-lg rounded-xl mb-6 p-5 flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                <SuccessIcon />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Success</h4>
                <p className="text-sm text-gray-700">{uploadSuccess}</p>
              </div>
            </div>
            <button onClick={() => setUploadSuccess(null)} className="text-gray-400 hover:text-gray-600 ml-4">
              <CloseIcon />
            </button>
          </div>
        )}

        {/* Active Mission Card */}
        {activeMission && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-orange-100">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <h2 className="text-3xl font-black text-gray-900">{activeMission.name}</h2>
                  <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-sm font-bold rounded-full shadow-md">
                    ACTIVE MISSION
                  </span>
                </div>
                <div className="flex items-center gap-2 text-lg text-gray-700">
                  <div className="text-gray-500">
                    <LocationIcon />
                  </div>
                  <span>{activeMission.location}</span>
                  <span className="mx-2">•</span>
                  <div className="text-gray-500">
                    <CalendarIcon />
                  </div>
                  <span>{new Date(activeMission.startDate).toLocaleDateString('en-GB')} – {new Date(activeMission.endDate).toLocaleDateString('en-GB')}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Sites</p>
                <p className="text-5xl font-black text-orange-600">{activeMission.numberOfSites}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div className="p-5 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-orange-600">
                    <UsersIcon />
                  </div>
                  <p className="text-orange-700 font-semibold">Registrations</p>
                </div>
                <p className="text-3xl font-black text-orange-900">{activeMission._count?.registrations || 0}</p>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-yellow-600">
                    <ClipboardIcon />
                  </div>
                  <p className="text-yellow-700 font-semibold">Distributed</p>
                </div>
                <p className="text-3xl font-black text-yellow-900">{activeMission._count?.distributions || 0}</p>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-green-600">
                    <ChartIcon />
                  </div>
                  <p className="text-green-700 font-semibold">Progress</p>
                </div>
                <p className="text-3xl font-black text-green-900">
                  {activeMission._count?.registrations ? Math.round((activeMission._count.distributions / activeMission._count.registrations) * 100) : 0}%
                </p>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-purple-600">
                    <BuildingIcon />
                  </div>
                  <p className="text-purple-700 font-semibold">Per Site</p>
                </div>
                <p className="text-3xl font-black text-purple-900">
                  {activeMission._count?.distributions ? Math.round(activeMission._count.distributions / activeMission.numberOfSites) : 0}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <label className="cursor-pointer">
                <span className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3">
                  <UploadIcon />
                  {uploading ? 'Uploading...' : 'Upload Registrations'}
                  <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} disabled={uploading} className="hidden" />
                </span>
              </label>

              <button
                onClick={handleDistribute}
                disabled={!activeMission._count?.registrations || distributing}
                className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                <RefreshIcon />
                {distributing ? 'Distributing...' : 'Run Distribution'}
              </button>

              {distribution.length > 0 && (
                <button
                  onClick={handleExport}
                  className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
                >
                  <DownloadIcon />
                  Export to Excel
                </button>
              )}
            </div>
          </div>
        )}

        {/* ✅ Distribution Summary - ADD THIS BACK */}
        {distribution.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Distribution Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {distribution.map((site) => (
                <div key={site.siteNumber} className="border-2 border-orange-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-black text-gray-900">Site {site.siteNumber}</h4>
                    <span className="text-2xl font-black text-orange-600">{site.total || 0}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-blue-500">
                          <MaleIcon />
                        </div>
                        <span className="text-gray-600">Male</span>
                      </div>
                      <span className="font-semibold">{site.male || 0}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-pink-500">
                          <MaleIcon />
                        </div>
                        <span className="text-gray-600">Female</span>
                      </div>
                      <span className="font-semibold">{site.female || 0}</span>
                    </div>

                    <div className="border-t pt-2 mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">First Timers</span>
                        <span className="text-xs font-semibold">{site.firstTimers || 0}</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Experienced</span>
                        <span className="text-xs font-semibold">{site.experienced || 0}</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Veterans</span>
                        <span className="text-xs font-semibold">{site.veterans || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Visitors</span>
                        <span className="text-xs font-semibold">{site.visitors || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <div className="text-blue-600">
                  <InfoIcon />
                </div>
                <span><strong>Export to Excel</strong> to view detailed missionary lists for each site including names, contacts, and campus information.</span>
              </p>
            </div>
          </div>
        )}

        {/* ✅ Mission History - ADD THIS BACK */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Mission History</h3>
          {missions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
                <DocumentIcon />
              </div>
              <p className="text-xl text-gray-600">No missions created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {missions.map((mission) => (
                <div key={mission.id} className="p-6 rounded-xl border-2 border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-bold text-gray-900">{mission.name}</h4>
                        {mission.isActive && (
                          <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs font-bold rounded-full">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mt-2">
                        <div className="text-gray-500">
                          <LocationIcon />
                        </div>
                        <span>{mission.location}</span>
                        <span className="mx-2">•</span>
                        <div className="text-gray-500">
                          <CalendarIcon />
                        </div>
                        <span>{new Date(mission.startDate).toLocaleDateString()} – {new Date(mission.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-6 mt-3 text-sm text-gray-600">
                        <span><strong>{mission.numberOfSites}</strong> sites</span>
                        <span><strong>{mission._count?.registrations || 0}</strong> registered</span>
                        <span><strong>{mission._count?.distributions || 0}</strong> distributed</span>
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteMission(mission.id, mission.name)}
                      className="ml-4 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete mission"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        isDestructive={confirmModal.isDestructive}
      />

      {/* Create Mission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
            <h3 className="text-3xl font-black text-gray-900 mb-6">Create New Mission</h3>
            <form onSubmit={handleCreateMission} className="space-y-5">
              <input
                type="text"
                placeholder="Mission Name (e.g. Easter Mission 2026)"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Location (e.g. Mombasa)"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Number of Sites</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.numberOfSites}
                  onChange={(e) => setFormData({ ...formData, numberOfSites: Number(e.target.value) })}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-black rounded-xl shadow-lg hover:shadow-xl transition"
                >
                  Create Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-black text-gray-900">How to Use Mission Management</h3>
              <button onClick={() => setShowInstructions(false)} className="text-gray-400 hover:text-gray-600">
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Create a New Mission</h4>
                  <p className="text-gray-600 mb-2">Click the "New Mission" button to create a mission for your upcoming outreach. </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                    <li>Enter mission name (e.g., "End Year 2026 Mission")</li>
                    <li>Specify location (e.g., "Kinangop")</li>
                    <li>Set start and end dates</li>
                    <li>Define number of sites (missionary destinations)</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Upload Registrations</h4>
                  <p className="text-gray-600 mb-2">Upload a CSV or Excel file containing missionary registrations.</p>
                  <div className="bg-gray-50 rounded-lg p-4 mt-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Required Columns:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-4">
                      <li><strong>First Name</strong> and <strong>Last Name</strong> OR <strong>Name</strong>/<strong>Full Name</strong></li>
                      <li><strong>Email</strong> (required)</li>
                      <li><strong>Gender</strong> (Male/Female or M/F)</li>
                      <li><strong>Campus</strong> (e.g., Main Campus, Medical School, Kenya Science)</li>
                      <li><strong>Year of Study</strong> (1-6 or Year 1, Year 2, etc.)</li>
                      <li><strong>Previous Missions</strong> (None, 1, More than 1, or numeric)</li>
                      <li><strong>Phone</strong> (optional)</li>
                      <li><strong>Home Church</strong> (for visitors only)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Run Distribution</h4>
                  <p className="text-gray-600 mb-2">Click "Run Distribution" to automatically assign missionaries to sites.</p>
                  <div className="bg-purple-50 rounded-lg p-4 mt-2 border border-purple-200">
                    <p className="text-sm font-semibold text-purple-800 mb-1">The algorithm ensures:</p>
                    <ul className="list-disc list-inside text-sm text-purple-700 space-y-1 ml-4">
                      <li>Equal number of missionaries per site</li>
                      <li>Balanced gender distribution (50/50 split)</li>
                      <li>Mix of experience levels at each site</li>
                      <li>Campus diversity across sites</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Export Results</h4>
                  <p className="text-gray-600 mb-2">Click "Export to Excel" to download a comprehensive report. </p>
                  <div className="bg-green-50 rounded-lg p-4 mt-2 border border-green-200">
                    <p className="text-sm font-semibold text-green-800 mb-1">The Excel file includes:</p>
                    <ul className="list-disc list-inside text-sm text-green-700 space-y-1 ml-4">
                      <li><strong>Summary sheet</strong> - Overview of all sites</li>
                      <li><strong>Individual site sheets</strong> - Complete missionary lists with contact details</li>
                      <li><strong>Alphabetical list</strong> - All missionaries with site assignments</li>
                      <li><strong>Color-coded formatting</strong> - Easy to read and share</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <div className="flex items-start gap-3">
                  <div className="text-yellow-600 flex-shrink-0 mt-0.5">
                    <WarningIcon />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-yellow-900 mb-2">Tips for Best Results</h4>
                    <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1 ml-4">
                      <li>Ensure all missionary data is complete before uploading</li>
                      <li>Use consistent campus names (system will auto-normalize variations)</li>
                      <li>Re-running distribution will overwrite previous assignments</li>
                      <li>Export to Excel before making changes to preserve data</li>
                      <li>Only one mission can be active at a time</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowInstructions(false)}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Got it! 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
