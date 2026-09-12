import React, { useState, useEffect, useRef } from 'react';
import {
  UserPlus,
  Search,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Image,
  Copy,
  Check,
  Key,
  RefreshCw,
  ShieldCheck,
  ExternalLink,
  X,
} from 'lucide-react';
import api from '../../services/api';
import { Worker } from '../../types';
import { Header } from '../../components/Header';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';

export const WorkersMgmt: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Worker@123');
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [designation, setDesignation] = useState('Security Guard');
  const [baseSalary, setBaseSalary] = useState(18000);
  const [allowances, setAllowances] = useState(2000);
  const [deductions, setDeductions] = useState(500);
  const [experience, setExperience] = useState('2 Years');
  const [skills, setSkills] = useState('Access Control, Perimeter Surveillance');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Photo Upload State
  const [photo, setPhoto] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoMode, setPhotoMode] = useState<'upload' | 'url'>('upload');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Post-Registration Credentials State
  const [createdCredentials, setCreatedCredentials] = useState<{
    workerId: string;
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: string;
    designation?: string;
    photo?: string;
  } | null>(null);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [showCredPassword, setShowCredPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchWorkers = async () => {
    try {
      const res = await api.get('/workers');
      setWorkers(res.data.workers || []);
    } catch (err) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  // Handle Image File Selection & Client-Side Compression
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WEBP).');
      return;
    }

    setIsProcessingPhoto(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 400;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setPhoto(compressed);
          setPhotoPreview(compressed);
        } else {
          const raw = event.target?.result as string;
          setPhoto(raw);
          setPhotoPreview(raw);
        }
        setIsProcessingPhoto(false);
      };
      img.onerror = () => {
        setIsProcessingPhoto(false);
        alert('Could not process the selected image.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    setPhoto(photoUrlInput.trim());
    setPhotoPreview(photoUrlInput.trim());
  };

  const clearPhoto = () => {
    setPhoto('');
    setPhotoPreview('');
    setPhotoUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let randomPass = 'Guard@';
    for (let i = 0; i < 4; i++) {
      randomPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    randomPass += '!';
    setPassword(randomPass);
  };

  const handleCreateWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/workers', {
        name,
        email,
        phone,
        password,
        designation,
        baseSalary,
        allowances,
        deductions,
        experience,
        skills,
        address,
        emergencyContact,
        photo: photo || undefined,
        profileImage: photo || undefined,
      });

      setIsAddModalOpen(false);
      fetchWorkers();

      // Display login credentials modal
      if (res.data.credentials) {
        setCreatedCredentials({
          ...res.data.credentials,
          photo: photo || undefined,
        });
        setIsCredentialsModalOpen(true);
      }

      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setPassword('Worker@123');
      clearPhoto();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating worker.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this security worker record?')) return;
    try {
      await api.delete(`/workers/${id}`);
      fetchWorkers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error deleting worker.');
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const copyAllCredentials = () => {
    if (!createdCredentials) return;
    const text = `🛡️ SECURITY AGENCY WORKFORCE ALLOCATION PLATFORM
========================================
WORKER LOGIN CREDENTIALS
========================================
Full Name:        ${createdCredentials.name}
Worker ID:        ${createdCredentials.workerId}
Designation:      ${createdCredentials.designation || 'Security Personnel'}
System Role:      ${createdCredentials.role}
Email / Username: ${createdCredentials.email}
Temporary Password: ${createdCredentials.password}
Login Portal:     ${window.location.origin}/login
========================================
Please change your password upon your first login.`;
    copyToClipboard(text, 'all');
  };

  const filtered = workers.filter((w) => {
    const matchSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.workerId.toLowerCase().includes(search.toLowerCase()) ||
      w.phone.includes(search);
    const matchStatus = !statusFilter || w.employmentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto pb-16 space-y-6">
      <Header title="Security Workers Roster" subtitle="Register, assign, and manage security agency workforce personnel" />

      <div className="px-6 max-w-7xl mx-auto space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search worker by name, ID, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-slate-300 focus:border-amber-500 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="ON_LEAVE">ON_LEAVE</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <UserPlus className="w-4 h-4" /> Register New Worker
          </button>
        </div>

        {/* Workers Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Worker Info</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Current Deployment</th>
                  <th className="p-4">Base Pay</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500">
                      No security workers found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((w) => {
                    const workerImage = w.profileImage || w.photo;
                    return (
                      <tr key={w._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {workerImage ? (
                              <img
                                src={workerImage}
                                alt={w.name}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-sm bg-slate-800"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 font-bold flex items-center justify-center border border-slate-700">
                                {w.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-white block">{w.name}</span>
                              <span className="text-[10px] text-amber-400 font-mono">
                                {w.workerId} • {w.phone}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-200">{w.designation}</td>
                        <td className="p-4">
                          {w.currentAssignment ? (
                            <div>
                              <span className="font-bold text-white block">
                                {(w.currentAssignment.companyId as any)?.name || 'Assigned Site'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {(w.currentAssignment.shiftId as any)?.name || 'Shift'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Unassigned (Pool)</span>
                          )}
                        </td>
                        <td className="p-4 font-bold text-amber-400">
                          ₹{(w.salaryStructure?.baseSalary || 18000).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <Badge status={w.employmentStatus} />
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedWorker(w);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(w._id)}
                              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Worker Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register Security Worker">
        <form onSubmit={handleCreateWorker} className="space-y-4">
          {/* Worker Photo Upload Section */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-amber-400" /> Worker Photo / Avatar
              </label>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => setPhotoMode('upload')}
                  className={`px-2 py-0.5 rounded ${photoMode === 'upload' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode('url')}
                  className={`px-2 py-0.5 rounded ${photoMode === 'url' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Photo URL
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Photo Preview Thumbnail */}
              <div className="relative group shrink-0">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Worker Preview"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md bg-slate-900"
                    />
                    <button
                      type="button"
                      onClick={clearPhoto}
                      className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-400 transition-colors shadow"
                      title="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
                    <Image className="w-6 h-6 text-slate-600 mb-0.5" />
                    <span className="text-[9px]">No Photo</span>
                  </div>
                )}
              </div>

              {/* Photo Input Controls */}
              <div className="flex-1">
                {photoMode === 'upload' ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="worker-photo-input"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="worker-photo-input"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-500/50 cursor-pointer text-xs font-semibold transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      {isProcessingPhoto ? 'Processing Photo...' : photoPreview ? 'Change Photo' : 'Choose Photo File'}
                    </label>
                    <p className="text-[10px] text-slate-500 mt-1">Supports JPG, PNG, WEBP. Automatically optimized for fast loading.</p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/photos/worker.jpg"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      className="flex-1 bg-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPhotoUrl}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="ramesh@securityagency.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 111-2233"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Designation *</label>
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Security Guard">Security Guard</option>
                <option value="Senior Security Guard">Senior Security Guard</option>
                <option value="Security Supervisor">Security Supervisor</option>
                <option value="Armed Security Officer">Armed Security Officer</option>
                <option value="Female Security Officer">Female Security Officer</option>
                <option value="CCTV Surveillance Specialist">CCTV Surveillance Specialist</option>
                <option value="Night Patrol Officer">Night Patrol Officer</option>
              </select>
            </div>
          </div>

          {/* Initial Password Setting */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" /> Initial Login Password *
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Auto-Generate
              </button>
            </div>
            <div className="relative">
              <input
                type={showFormPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Worker@123"
                className="w-full bg-slate-950 text-xs p-3 pr-10 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowFormPassword(!showFormPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">This password and worker credentials will be displayed immediately upon registration.</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Base Salary (₹)</label>
              <input
                type="number"
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Allowances (₹)</label>
              <input
                type="number"
                value={allowances}
                onChange={(e) => setAllowances(Number(e.target.value))}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Deductions (₹)</label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Key Skills & Certifications</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-slate-950 text-xs p-3 rounded-xl border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            Register Security Officer
          </button>
        </form>
      </Modal>

      {/* Post-Registration Credentials Modal */}
      {createdCredentials && (
        <Modal
          isOpen={isCredentialsModalOpen}
          onClose={() => setIsCredentialsModalOpen(false)}
          title="Worker Registration Complete"
        >
          <div className="space-y-5">
            {/* Header Success Banner */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-xs">Security Officer Created Successfully!</p>
                <p className="text-[11px] text-slate-400">
                  Share these login credentials with the worker to grant portal access.
                </p>
              </div>
            </div>

            {/* Officer Profile Summary */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              {createdCredentials.photo ? (
                <img
                  src={createdCredentials.photo}
                  alt={createdCredentials.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-amber-500 shadow-md bg-slate-900"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xl flex items-center justify-center">
                  {createdCredentials.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-white">{createdCredentials.name}</h3>
                <p className="text-xs text-amber-400 font-mono font-semibold">{createdCredentials.workerId}</p>
                <p className="text-[11px] text-slate-400">{createdCredentials.designation || 'Security Guard'}</p>
              </div>
            </div>

            {/* Credentials Card */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" /> Portal Login Credentials
              </h4>

              {/* Portal Role */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">System Role:</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-bold text-[10px] border border-blue-500/30">
                  {createdCredentials.role}
                </span>
              </div>

              {/* Email / Username */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Email / Login Username</span>
                  <span className="font-mono font-bold text-white text-xs">{createdCredentials.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(createdCredentials.email, 'email')}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                  title="Copy email"
                >
                  {copiedField === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Login Password</span>
                  <span className="font-mono font-bold text-amber-400 text-xs">
                    {showCredPassword ? createdCredentials.password : '••••••••••••'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowCredPassword(!showCredPassword)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    title={showCredPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCredPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(createdCredentials.password, 'password')}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                    title="Copy password"
                  >
                    {copiedField === 'password' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Portal Link */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Portal Login URL</span>
                  <span className="font-mono text-slate-300 text-[11px]">{window.location.origin}/login</span>
                </div>
                <a
                  href="/login"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                  title="Open login page in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={copyAllCredentials}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
              >
                {copiedField === 'all' ? (
                  <>
                    <Check className="w-4 h-4" /> Credentials Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy All Credentials
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsCredentialsModalOpen(false)}
                className="py-3 px-5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Detail Worker Modal */}
      {selectedWorker && (
        <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Worker Security Record">
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              {selectedWorker.profileImage || selectedWorker.photo ? (
                <img
                  src={selectedWorker.profileImage || selectedWorker.photo}
                  alt={selectedWorker.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-amber-500 shadow-md bg-slate-900"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xl flex items-center justify-center">
                  {selectedWorker.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{selectedWorker.name}</h3>
                <p className="text-xs text-amber-400 font-mono">
                  {selectedWorker.workerId} • {selectedWorker.designation}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedWorker.email} | {selectedWorker.phone}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Experience</span>
                <span className="font-bold text-white">{selectedWorker.experience || '2 Years'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Employment Status</span>
                <Badge status={selectedWorker.employmentStatus} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-xs text-amber-400 uppercase">Salary Structure Breakdown</h4>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  Basic: <strong className="text-white">₹{selectedWorker.salaryStructure?.baseSalary}</strong>
                </div>
                <div>
                  Allowances: <strong className="text-white">₹{selectedWorker.salaryStructure?.allowances}</strong>
                </div>
                <div>
                  Deductions: <strong className="text-rose-400">₹{selectedWorker.salaryStructure?.deductions}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
              >
                Close Profile
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
