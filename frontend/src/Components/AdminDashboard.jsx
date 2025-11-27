import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  Clock,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Menu,
  LayoutDashboard,
  LogOut,
  Loader2,
  Eye
} from "lucide-react";
import API from "../api/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview"); // overview, pending, all
  const [pendingProfiles, setPendingProfiles] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });

  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [interestLoading, setInterestLoading] = useState(false);
  const [interestProfiles, setInterestProfiles] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserClientId, setSelectedUserClientId] = useState("");

  const navigate = useNavigate();

  // ⛔ Only Admin Access
  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (!stored) return navigate("/");
    try {
      const user = JSON.parse(stored);
      if (user?.user?.role !== "admin" && user?.role !== "admin") navigate("/");
    } catch {
      navigate("/");
    }
  }, [navigate]);

  // Fetch Dashboard Data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [pendingRes, allRes] = await Promise.all([
        API.get("/profile/pending"),
        API.get("/profile/all")
      ]);

      setPendingProfiles(pendingRes.data || []);
      setAllProfiles(allRes.data || []);

      setStats({
        total: allRes.data.length,
        pending: pendingRes.data.length,
        approved: allRes.data.filter(p => p.approvalStatus === "approved").length
      });
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // ----- ACTIONS -----

const handleApprove = async (id) => {
  try {
    console.log("🟡 Frontend: Attempting to approve profile ID:", id);
    
    // Check if ID is valid
    if (!id || id === 'undefined' || id === 'null') {
      toast.error("Invalid profile ID");
      return;
    }

    const response = await API.patch(`/profile/approve/${id}`);
    console.log("✅ Frontend: Approval successful:", response.data);
    
    toast.success("User approved successfully");
    fetchDashboardData();
  } catch (error) {
    console.error("❌ Frontend: Approval failed:", error);
    console.error("❌ Error response:", error.response?.data);
    console.error("❌ Error status:", error.response?.status);
    
    if (error.response?.status === 500) {
      toast.error(`Server error: ${error.response?.data?.message || 'Check backend logs'}`);
    } else if (error.response?.status === 404) {
      toast.error("Profile not found");
    } else {
      toast.error("Approval failed");
    }
  }
};

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this profile?")) return;
    try {
      await API.patch(`/profile/reject/${id}`);
      toast.success("User rejected");
      fetchDashboardData();
    } catch {
      toast.error("Rejection failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠ This will permanently delete the user. Continue?")) return;
    try {
      await API.delete(`/profile/delete/${id}`);
      toast.success("Client deleted");
      fetchDashboardData();
    } catch {
      toast.error("Deletion failed");
    }
  };

  // 💙 View "Whom the user has shown interest in"
  const handleViewInterests = async (profile) => {
    try {
      const userId = profile.user?._id;
      if (!userId) return toast.error("User ID missing");

      setSelectedUserName(profile.name);
      setSelectedUserClientId(profile.user?.clientId);
      setInterestLoading(true);
      setInterestModalOpen(true);

      const res = await API.get(`/profile/interests/${userId}`);
      setInterestProfiles(res.data || []);
    } catch {
      toast.error("Failed to load interest list");
    } finally {
      setInterestLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const filteredProfiles = allProfiles.filter((profile) =>
    profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.user?.clientId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* SIDEBAR ------------- */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Admin Panel
          </h1>
          <p className="text-slate-400 text-xs mt-1">Matrimony Management</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <SidebarItem
            icon={<Clock size={20} />}
            label="Pending Approvals"
            badge={pendingProfiles.length}
            active={activeTab === "pending"}
            onClick={() => setActiveTab("pending")}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="All Users"
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-400 hover:text-red-400 px-4 py-2 w-full"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT -------- */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center">
          <h1 className="font-bold text-gray-800">Admin Panel</h1>
          <Menu size={20} />
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* -------- OVERVIEW -------- */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Users" value={stats.total} icon={<Users className="text-blue-600" />} color="bg-blue-50" />
                <StatCard title="Pending Approval" value={stats.pending} icon={<Clock className="text-orange-600" />} color="bg-orange-50" />
                <StatCard title="Approved Users" value={stats.approved} icon={<UserCheck className="text-green-600" />} color="bg-green-50" />
              </div>
            </div>
          )}

          {/* -------- PENDING PROFILES -------- */}
          {activeTab === "pending" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Pending Approvals</h2>

              {pendingProfiles.length === 0 ? (
                <p className="text-center py-20 text-gray-500">✔ No pending approvals.</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingProfiles.map((profile) => (
                    <div key={profile._id} className="bg-white p-6 rounded-xl shadow border flex gap-6">
                      <div className="w-32 h-32 bg-gray-100 rounded overflow-hidden">
                        {profile.profileImages?.[0] ? (
                          <img src={`http://localhost:4000/${profile.profileImages[0]}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="bg-gray-200 text-gray-400 flex items-center justify-center h-full text-xs">No Image</div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{profile.name}</h3>
                        <p className="text-sm text-gray-500">{profile.gender}, {profile.age} yrs</p>
                        <p className="text-sm text-gray-500">{profile.city}, {profile.country}</p>

                        <div className="mt-4 flex gap-3">
                          <button onClick={() => handleApprove(profile._id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                            <CheckCircle size={16} /> Approve
                          </button>
                          <button onClick={() => handleReject(profile._id)} className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                            <XCircle size={16} /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* -------- ALL USERS -------- */}
          {activeTab === "all" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search by name or ID..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow border overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 border-b">Client ID</th>
                      <th className="p-4 border-b">Name</th>
                      <th className="p-4 border-b">Status</th>
                      <th className="p-4 border-b">Gender</th>
                      <th className="p-4 border-b">Joined</th>
                      <th className="p-4 border-b text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {filteredProfiles.map((profile) => (
                      <tr key={profile._id} className="hover:bg-blue-50/30">
                        <td className="p-4 text-gray-500 font-mono">{profile.user?.clientId}</td>
                        <td className="p-4 font-medium">{profile.name}</td>
                        <td className="p-4"><StatusBadge status={profile.approvalStatus} /></td>
                        <td className="p-4 capitalize">{profile.gender}</td>
                        <td className="p-4 text-gray-500">{new Date(profile.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right space-x-2">
                          
                          {/* 👇 NEW BUTTON */}
                          <button
                            onClick={() => navigate(`/admin/user/${profile.user?.clientId}`)}
                            className="text-indigo-600 hover:text-indigo-800 px-2 py-1 text-xs font-semibold rounded-full hover:bg-indigo-50 inline-flex items-center gap-1"
                          >
                            <Eye size={14} /> View
                          </button>

                          <button
                            onClick={() => handleViewInterests(profile)}
                            className="text-blue-600 hover:text-blue-800 px-2 py-1 text-xs font-semibold rounded-full hover:bg-blue-50 inline-flex items-center gap-1"
                          >
                            <Eye size={14} /> Interests
                          </button>

                          <button
                            onClick={() => handleDelete(profile._id)}
                            className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredProfiles.length === 0 && (
                  <p className="text-center text-gray-500 py-10">No matching results</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* -------- INTEREST MODAL -------- */}
      {interestModalOpen && (
        <InterestModal
          loading={interestLoading}
          list={interestProfiles}
          name={selectedUserName}
          clientId={selectedUserClientId}
          onClose={() => setInterestModalOpen(false)}
        />
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function SidebarItem({ icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex justify-between px-4 py-3 rounded-lg text-sm
        ${active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
    >
      <span className="flex items-center gap-3">{icon} {label}</span>
      {badge > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>}
    </button>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow border flex items-center gap-4">
      <div className={`p-4 rounded-full ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const style = {
    approved: "bg-green-100 text-green-700 border border-green-200",
    pending: "bg-orange-100 text-orange-700 border border-orange-200",
    rejected: "bg-red-100 text-red-700 border border-red-200"
  };
  return <span className={`px-2 py-1 rounded-full text-xs uppercase font-semibold ${style[status]}`}>{status}</span>;
}

function InterestModal({ loading, list, name, clientId, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">Interested Profiles</h3>
            <p className="text-xs text-gray-500 mt-1">
              User: <span className="font-semibold">{name}</span> ({clientId})
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            </div>
          ) : list.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No interests found</div>
          ) : (
            <ul className="divide-y">
              {list.map((p) => (
                <li key={p._id} className="p-4 flex items-center gap-4">
                  <img
                    src={`http://localhost:4000/${p.profileImages?.[0]}`}
                    className="w-14 h-14 rounded-full object-cover bg-gray-200"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{p.name} ({p.user?.clientId})</p>
                    <p className="text-xs text-gray-500">
                      {p.gender}, {p.age} yrs • {p.city}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="py-3 px-5 bg-gray-50 border-t text-right">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm hover:bg-gray-200">Close</button>
        </div>
      </div>
    </div>
  );
}
