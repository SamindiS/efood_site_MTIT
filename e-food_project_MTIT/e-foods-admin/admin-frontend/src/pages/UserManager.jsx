import React, { useEffect, useState } from 'react';
import { orderAPI } from '../utils/api';
import {
    Users,
    Search,
    Trash2,
    ShieldCheck,
    ShieldAlert,
    Mail,
    Phone,
    Calendar,
    Loader2,
    MoreVertical
} from 'lucide-react';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await orderAPI.get('/auth/users');
            setUsers(res.data.success === false ? [] : res.data); // Handle potential error structure
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
        try {
            await orderAPI.delete(`/auth/user/${id}`);
            fetchUsers();
        } catch (err) {
            alert("Failed to delete user");
        }
    };

    const handleRoleToggle = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        try {
            await orderAPI.put(`/auth/user/${user._id}`, { role: newRole });
            fetchUsers();
        } catch (err) {
            alert("Failed to update user role");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Citizen Directory</h1>
                    <p className="text-slate-400 mt-1">Oversee and moderate all registered eFoods accounts.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search users by name, email..."
                        className="w-80 pl-10 pr-4 py-3 bg-[#1e293b] border border-slate-800 rounded-2xl outline-none focus:ring-1 focus:ring-orange-500 text-white text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user._id} className="bg-[#1e293b] border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all group relative overflow-hidden">
                        {/* Background Accent */}
                        <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-10 transition-colors ${user.role === 'admin' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>

                        <div className="flex items-start justify-between mb-6">
                            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-xl font-black text-white border border-slate-700">
                                {(user.firstName?.[0] || 'U') + (user.lastName?.[0] || 'S')}
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleRoleToggle(user)}
                                    className={`p-2 rounded-xl transition-all ${user.role === 'admin' ? 'text-orange-500 bg-orange-500/10' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
                                    title={user.role === 'admin' ? 'Revoke Admin' : 'Promote to Admin'}
                                >
                                    {user.role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                    title="Delete Account"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-black text-white leading-tight">{user.firstName} {user.lastName}</h3>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-orange-500' : 'text-blue-500'}`}>
                                    {user.role || 'Partner'}
                                </span>
                            </div>

                            <div className="space-y-2.5">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Mail className="w-4 h-4 text-slate-600" />
                                    <span className="text-xs font-medium">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Phone className="w-4 h-4 text-slate-600" />
                                    <span className="text-xs font-medium">{user.contact || 'No contact provided'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 pt-2 border-t border-slate-800/50">
                                    <Calendar className="w-4 h-4 text-slate-600" />
                                    <span className="text-[10px] uppercase font-black tracking-tighter">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="col-span-full p-20 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing User Database...</p>
                    </div>
                )}

                {!loading && users.length === 0 && (
                    <div className="col-span-full p-20 text-center">
                        <Users className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-500">No Citizens Registered</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManager;
