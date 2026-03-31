import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { User, Bell, Search, Menu } from 'lucide-react';

const AdminLayout = ({ children, handleLogout }) => {
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-[#0f172a] text-slate-200">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <Sidebar handleLogout={handleLogout} isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

            <div className="flex-1 lg:ml-72 flex flex-col w-full min-w-0 transition-all duration-300">
                {/* Top Header */}
                <header className="h-20 bg-[#1e293b]/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4 w-full lg:w-96">
                        <button
                            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="relative flex-1 hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-slate-700 rounded-lg focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-6 ml-auto">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors hidden sm:block">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#1e293b]"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-slate-800 hidden sm:block"></div>
                        <div className="flex items-center gap-3 bg-[#0f172a] p-1.5 pr-2 lg:pr-4 rounded-full border border-slate-800">
                            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-slate-700 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 lg:w-5 lg:h-5 text-slate-300" />
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-bold text-white leading-tight">System Admin</p>
                                <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
