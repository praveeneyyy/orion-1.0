'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Users, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lock, 
  Unlock, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Mail, 
  Building,
  Radio,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import type { TeamRecord } from '@/types/orion';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard Data State
  const [teams, setTeams] = useState<TeamRecord[]>([]);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    paymentSuccess: 0,
    paymentPending: 0,
    paymentFailed: 0,
    totalRevenue: 0,
    countByTrack: {} as Record<string, number>
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('ALL');
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  // Check saved session in sessionStorage and start live polling
  useEffect(() => {
    const savedKey = sessionStorage.getItem('orion_admin_key');
    if (savedKey) {
      fetchAdminData(savedKey);
    }
  }, []);

  // Live real-time polling every 6 seconds when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      const savedKey = sessionStorage.getItem('orion_admin_key');
      if (savedKey) {
        fetchAdminData(savedKey, true); // silent background refresh
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() })
      });

      const json = await res.json();
      if (res.ok && json.authorized) {
        sessionStorage.setItem('orion_admin_key', passcode.trim());
        setIsAuthenticated(true);
        fetchAdminData(passcode.trim());
      } else {
        setAuthError(json.error || 'Invalid passcode');
      }
    } catch {
      setAuthError('Connection error during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminData = async (key: string, isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const res = await fetch('/api/admin/registrations', {
        headers: { 'x-admin-key': key }
      });

      if (res.status === 401) {
        sessionStorage.removeItem('orion_admin_key');
        setIsAuthenticated(false);
        setAuthError('Session expired. Please enter passcode again.');
        return;
      }

      const json = await res.json();
      if (json.success) {
        setTeams(json.teams || []);
        setStats(json.stats || {
          totalRegistrations: 0,
          paymentSuccess: 0,
          paymentPending: 0,
          paymentFailed: 0,
          totalRevenue: 0,
          countByTrack: {}
        });
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('orion_admin_key');
    setIsAuthenticated(false);
    setTeams([]);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!teams.length) return;

    const headers = [
      'Registration ID',
      'Team Name',
      'Leader Name',
      'Leader Phone',
      'Leader Email',
      'Institution',
      'Problem Statement',
      'Member 1 Name',
      'Member 1 Phone',
      'Member 2 Name',
      'Member 2 Phone',
      'Member 3 Name',
      'Member 3 Phone',
      'Member 4 Name',
      'Member 4 Phone',
      'Payment Status',
      'Amount',
      'Payment ID',
      'Order ID',
      'Registration Date'
    ];

    const rows = teams.map((t) => {
      const m1 = t.members?.find((m) => m.member_number === 1) || { member_name: '', member_phone: '' };
      const m2 = t.members?.find((m) => m.member_number === 2) || { member_name: '', member_phone: '' };
      const m3 = t.members?.find((m) => m.member_number === 3) || { member_name: '', member_phone: '' };
      const m4 = t.members?.find((m) => m.member_number === 4) || { member_name: '', member_phone: '' };

      return [
        `"${t.registration_id}"`,
        `"${t.team_name.replace(/"/g, '""')}"`,
        `"${t.leader_name.replace(/"/g, '""')}"`,
        `"${t.leader_phone}"`,
        `"${t.leader_email}"`,
        `"${t.institution.replace(/"/g, '""')}"`,
        `"${t.problem_statement}"`,
        `"${m1.member_name.replace(/"/g, '""')}"`,
        `"${m1.member_phone}"`,
        `"${m2.member_name.replace(/"/g, '""')}"`,
        `"${m2.member_phone}"`,
        `"${m3.member_name.replace(/"/g, '""')}"`,
        `"${m3.member_phone}"`,
        `"${m4.member_name.replace(/"/g, '""')}"`,
        `"${m4.member_phone}"`,
        `"${t.payment_status}"`,
        `"₹${t.amount || 100}"`,
        `"${t.payment_id || 'N/A'}"`,
        `"${t.order_id || 'N/A'}"`,
        `"${t.created_at ? t.created_at.split('T')[0] : 'N/A'}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ORION_1.0_Registrations_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filtered Teams List
  const filteredTeams = teams.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      t.registration_id.toLowerCase().includes(q) ||
      t.team_name.toLowerCase().includes(q) ||
      t.leader_name.toLowerCase().includes(q) ||
      t.leader_email.toLowerCase().includes(q) ||
      t.institution.toLowerCase().includes(q);

    const matchesTrack =
      selectedTrack === 'ALL' ||
      t.problem_statement.toUpperCase().includes(selectedTrack);

    const matchesPayment =
      selectedPaymentStatus === 'ALL' ||
      t.payment_status === selectedPaymentStatus;

    return matchesSearch && matchesTrack && matchesPayment;
  });

  // =========================================================================
  // Passcode Login Gate
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-[#07193D] border border-[#00BCF2]/40 shadow-2xl relative">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-none bg-[#0B2556] border border-[#00BCF2]/40 flex items-center justify-center text-[#00BCF2] mx-auto mb-3 shadow-[0_0_15px_rgba(0,188,242,0.4)]">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono-hud text-[#00BCF2] tracking-widest font-bold block">
              ORION 1.0 // SECURITY GATEWAY
            </span>
            <h2 className="text-2xl font-display font-black text-white mt-1">
              ORGANIZER COMMAND CENTER
            </h2>
            <p className="text-xs font-sans text-slate-400 mt-1">
              Enter the authorized access passcode to view registrations.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-mono-hud text-[#BAE6FD] block mb-1">
                ADMIN SECURITY PASSCODE
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (default: orion_genesis_2026)"
                className="w-full px-3.5 py-2.5 rounded-none bg-[#040E24] border border-[rgba(212,233,255,0.15)] text-white text-xs font-mono-hud focus:outline-none focus:border-[#00BCF2] transition-colors"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-950/70 border border-red-500/50 text-red-300 text-xs font-mono-hud">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-sheen btn-glow-cyan w-full py-3 px-4 font-display font-bold text-xs tracking-wider text-[#040E24] bg-gradient-to-r from-[#FFFFFF] via-[#BAE6FD] to-[#00BCF2] hover:opacity-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'AUTHENTICATING...' : 'ACCESS COMMAND CONSOLE'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <Link href="/" className="text-xs font-mono-hud text-[#BAE6FD] hover:text-white flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // Main Authenticated Dashboard View
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 sm:p-8 selection:bg-[#00BCF2]/30 selection:text-[#BAE6FD]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Command Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#07193D] border border-[#00BCF2]/40 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono-hud font-bold text-[#00BCF2] tracking-widest">
                LIVE ORION TELEMETRY CONSOLE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white mt-0.5">
              ROUND 1 REGISTRATIONS COMMAND
            </h1>
            <p className="text-xs font-mono-hud text-slate-400">
              5-Member Squad Structure • ₹100 Flat Entry • Verified Telemetry
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link 
              href="/"
              className="py-2 px-3.5 bg-[#040E24] border border-white/15 hover:border-white/40 text-xs font-mono-hud text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Portal
            </Link>

            <button
              onClick={() => {
                const k = sessionStorage.getItem('orion_admin_key') || '';
                fetchAdminData(k);
              }}
              disabled={isLoading}
              className="py-2 px-3.5 bg-[#040E24] border border-[#00BCF2]/40 hover:bg-[#0B2556] text-xs font-mono-hud text-[#00BCF2] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
            </button>

            <button
              onClick={handleExportCSV}
              className="btn-sheen btn-glow-cyan py-2 px-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-[#040E24] font-mono-hud font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer hover:opacity-95"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV ({teams.length})
            </button>

            <button
              onClick={handleLogout}
              className="py-2 px-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono-hud hover:bg-red-900/60 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="p-4 bg-[#07193D] border border-white/10">
            <span className="text-[10px] font-mono-hud text-slate-400 flex items-center gap-1.5 block mb-1">
              <Users className="w-3.5 h-3.5 text-[#00BCF2]" /> TOTAL SQUADS
            </span>
            <div className="text-2xl sm:text-3xl font-mono-hud font-black text-white">
              {stats.totalRegistrations}
            </div>
            <span className="text-[9px] font-mono-hud text-slate-400">
              {stats.totalRegistrations * 5} Participants
            </span>
          </div>

          <div className="p-4 bg-[#07193D] border border-emerald-500/30">
            <span className="text-[10px] font-mono-hud text-emerald-400 flex items-center gap-1.5 block mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> PAYMENT CONFIRMED
            </span>
            <div className="text-2xl sm:text-3xl font-mono-hud font-black text-emerald-400">
              {stats.paymentSuccess}
            </div>
            <span className="text-[9px] font-mono-hud text-emerald-400/80">
              Round 1 Verified
            </span>
          </div>

          <div className="p-4 bg-[#07193D] border border-amber-500/30">
            <span className="text-[10px] font-mono-hud text-amber-400 flex items-center gap-1.5 block mb-1">
              <AlertTriangle className="w-3.5 h-3.5" /> PAYMENT PENDING
            </span>
            <div className="text-2xl sm:text-3xl font-mono-hud font-black text-amber-400">
              {stats.paymentPending}
            </div>
            <span className="text-[9px] font-mono-hud text-slate-400">
              Awaiting Gateway
            </span>
          </div>

          <div className="p-4 bg-[#07193D] border border-red-500/30">
            <span className="text-[10px] font-mono-hud text-red-400 flex items-center gap-1.5 block mb-1">
              <XCircle className="w-3.5 h-3.5" /> PAYMENT FAILED
            </span>
            <div className="text-2xl sm:text-3xl font-mono-hud font-black text-red-400">
              {stats.paymentFailed}
            </div>
            <span className="text-[9px] font-mono-hud text-slate-400">
              Declined / Timed out
            </span>
          </div>

          <div className="p-4 bg-[#07193D] border border-[#00BCF2]/40 col-span-2 lg:col-span-1">
            <span className="text-[10px] font-mono-hud text-[#00BCF2] flex items-center gap-1.5 block mb-1">
              <CreditCard className="w-3.5 h-3.5" /> ROUND 1 REVENUE
            </span>
            <div className="text-2xl sm:text-3xl font-mono-hud font-black text-white">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[9px] font-mono-hud text-[#00BCF2]">
              ₹100 Flat per Squad
            </span>
          </div>
        </div>

        {/* Track Breakdown Pills */}
        <div className="p-4 bg-[#07193D] border border-white/10 flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-mono-hud text-slate-400 font-bold">
            TRACK BREAKDOWN:
          </span>
          {Object.entries(stats.countByTrack).map(([track, count]) => (
            <div key={track} className="px-3 py-1 bg-[#040E24] border border-[#00BCF2]/30 text-xs font-mono-hud">
              <span className="text-slate-300">{track}:</span> <strong className="text-[#00BCF2]">{count}</strong>
            </div>
          ))}
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 bg-[#07193D] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID (ORN-R1-...), team, leader, college..."
              className="w-full pl-9 pr-3.5 py-2 bg-[#040E24] border border-white/15 text-white text-xs font-mono-hud focus:outline-none focus:border-[#00BCF2]"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-1 text-xs font-mono-hud text-slate-400">
              <Filter className="w-3.5 h-3.5 text-[#00BCF2]" />
              <span>Track:</span>
            </div>
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="px-2.5 py-1.5 bg-[#040E24] border border-white/15 text-white text-xs font-mono-hud focus:outline-none focus:border-[#00BCF2]"
            >
              <option value="ALL">All Tracks</option>
              <option value="PS-01">ORION-PS-01 (FloatChat)</option>
              <option value="PS-02">ORION-PS-02 (LexVault)</option>
              <option value="PS-03">ORION-PS-03 (SylvaSense)</option>
              <option value="PS-04">ORION-PS-04 (Open Innovation)</option>
            </select>

            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-[#040E24] border border-white/15 text-white text-xs font-mono-hud focus:outline-none focus:border-[#00BCF2]"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="SUCCESS">Success (Confirmed)</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>

        {/* Squad Registrations Table */}
        <div className="bg-[#07193D] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#040E24] text-[10px] font-mono-hud text-slate-400 uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3.5">Registration ID</th>
                  <th className="p-3.5">Squad / Team</th>
                  <th className="p-3.5">Problem Statement</th>
                  <th className="p-3.5">Team Leader</th>
                  <th className="p-3.5">Institution</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTeams.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 font-mono-hud text-xs">
                      No matching squad registrations found.
                    </td>
                  </tr>
                ) : (
                  filteredTeams.map((team) => {
                    const isExpanded = expandedTeamId === team.id;
                    const isPaid = team.payment_status === 'SUCCESS';
                    return (
                      <React.Fragment key={team.id || team.registration_id}>
                        <tr className={`hover:bg-[#0B2556]/50 transition-colors ${isExpanded ? 'bg-[#0B2556]/40' : ''}`}>
                          <td className="p-3.5 font-mono-hud font-bold text-[#00BCF2]">
                            {team.registration_id}
                          </td>
                          <td className="p-3.5 font-bold text-white">
                            {team.team_name}
                          </td>
                          <td className="p-3.5 font-mono-hud text-slate-300">
                            <span className="px-2 py-0.5 bg-[#040E24] border border-[#00BCF2]/30 text-[#BAE6FD]">
                              {team.problem_statement}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-200">
                            <div>{team.leader_name}</div>
                            <div className="text-[10px] font-mono-hud text-slate-400">{team.leader_phone}</div>
                          </td>
                          <td className="p-3.5 text-slate-300 truncate max-w-[200px]" title={team.institution}>
                            {team.institution}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 text-[10px] font-mono-hud font-bold inline-flex items-center gap-1 ${
                              isPaid 
                                ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-400' 
                                : team.payment_status === 'FAILED'
                                  ? 'bg-red-950/70 border border-red-500/50 text-red-400'
                                  : 'bg-amber-950/70 border border-amber-500/50 text-amber-400'
                            }`}>
                              {isPaid ? '✓ PAID (₹100)' : team.payment_status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
                              className="p-1.5 bg-[#040E24] border border-white/10 hover:border-[#00BCF2] text-[#BAE6FD] hover:text-white transition-colors cursor-pointer"
                              title={isExpanded ? 'Collapse' : 'Expand 5-member roster'}
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded 5-Member Team Roster Drawer */}
                        {isExpanded && (
                          <tr className="bg-[#040E24]/95 border-b border-[#00BCF2]/20">
                            <td colSpan={7} className="p-4 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Leader Contact Details */}
                                <div className="p-3 bg-[#07193D] border border-white/10 space-y-1.5 text-xs">
                                  <div className="text-[10px] font-mono-hud text-[#00BCF2] font-bold border-b border-white/10 pb-1">
                                    LEADER & REGISTRATION DOSSIER
                                  </div>
                                  <div><span className="text-slate-400">Leader Email:</span> <a href={`mailto:${team.leader_email}`} className="text-white hover:underline">{team.leader_email}</a></div>
                                  <div><span className="text-slate-400">Leader WhatsApp:</span> <span className="font-mono-hud text-[#BAE6FD]">{team.leader_phone}</span></div>
                                  <div><span className="text-slate-400">Registered On:</span> <span className="font-mono-hud text-slate-300">{team.created_at ? new Date(team.created_at).toLocaleString('en-IN') : 'N/A'}</span></div>
                                  <div><span className="text-slate-400">Order ID:</span> <span className="font-mono-hud text-xs text-slate-400">{team.order_id || 'N/A'}</span></div>
                                  <div><span className="text-slate-400">Payment ID:</span> <span className="font-mono-hud text-xs text-emerald-400">{team.payment_id || 'N/A'}</span></div>
                                </div>

                                {/* 4 Team Members Roster */}
                                <div className="p-3 bg-[#07193D] border border-white/10 space-y-1.5 text-xs">
                                  <div className="text-[10px] font-mono-hud text-[#00BCF2] font-bold border-b border-white/10 pb-1">
                                    TEAM MEMBERS ROSTER (4 CREW)
                                  </div>
                                  {team.members && team.members.length > 0 ? (
                                    team.members.map((m, mIdx) => (
                                      <div key={mIdx} className="flex items-center justify-between text-[11px] border-b border-white/5 pb-1">
                                        <span className="text-white">0{m.member_number}. {m.member_name}</span>
                                        <span className="font-mono-hud text-[#BAE6FD]">{m.member_phone}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-slate-400 text-xs italic">
                                      Member roster registered during checkout.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
