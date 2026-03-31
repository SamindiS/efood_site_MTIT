import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Utensils,
    Users,
    ShoppingBag,
    CreditCard,
    Truck,
    LogOut,
    ChevronRight,
    X
} from 'lucide-react';

const Sidebar = ({ handleLogout, isOpen, setIsOpen }) => {
    // Standard menu items. In a larger app, you might only show relevant items
    const menuItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Restaurants', path: '/restaurants', icon: Utensils },
        { name: 'Users', path: '/users', icon: Users },
        { name: 'Orders', path: '/orders', icon: ShoppingBag },
        { name: 'Payments', path: '/payments', icon: CreditCard },
        { name: 'Delivery', path: '/delivery', icon: Truck },
    ];

    return (
        <div className={`fixed left-0 top-0 h-screen w-72 bg-[#1e293b] border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="p-8 border-b border-slate-800 flex justify-between items-center relative">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-black text-white tracking-tight">eFoods <span className="text-orange-500">Admin</span></span>
                </div>
                {/* Close Button on Mobile */}
                <button
                    className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)} // Close menu on click for mobile
                        className={({ isActive }) => `
              flex items-center justify-between p-4 rounded-xl transition-all group
              ${isActive
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
            `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className="flex items-center gap-4">
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-semibold">{item.name}</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full p-4 text-slate-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold">Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
