import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shirt, Box, Image as ImageIcon, Settings as SettingsIcon, Home } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/tryon', label: 'Try-On', icon: <Shirt size={18} /> },
    { path: '/live', label: 'Live AR', icon: <div className="relative"><Shirt size={18} /><span className="absolute -top-1 -right-1 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span></div> },
    { path: '/furniture', label: 'Furniture', icon: <Box size={18} /> },
    { path: '/gallery', label: 'Gallery', icon: <ImageIcon size={18} /> },
    { path: '/pose-test', label: 'Debug', icon: <div className="font-mono text-xs border border-black px-1">DEV</div> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-surface border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary border-2 border-black p-2 shadow-brutal-sm group-hover:shadow-brutal transition-all group-active:translate-x-[2px] group-active:translate-y-[2px] group-active:shadow-none">
              <Shirt className="text-black h-6 w-6" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter transform group-hover:-skew-x-6 transition-transform">
              VogueAI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 font-bold border-2 border-black transition-all ${
                  isActive(link.path)
                    ? 'bg-accent shadow-brutal -translate-y-1'
                    : 'bg-white hover:bg-gray-100 hover:shadow-brutal hover:-translate-y-1 active:shadow-none active:translate-y-0 active:translate-x-0'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            <Link
              to="/settings"
              className="p-2 border-2 border-black bg-white hover:bg-gray-100 hover:shadow-brutal transition-all active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"
            >
              <SettingsIcon size={20} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border-2 border-black bg-white active:bg-accent"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-surface border-b-4 border-black p-4">
          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 font-bold border-2 border-black bg-white hover:bg-accent shadow-brutal-sm active:shadow-none active:translate-y-[2px]"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 font-bold border-2 border-black shadow-brutal-sm active:shadow-none active:translate-y-[2px] ${
                  isActive(link.path)
                    ? 'bg-accent'
                    : 'bg-white'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 font-bold border-2 border-black bg-white hover:bg-gray-100 shadow-brutal-sm active:shadow-none active:translate-y-[2px]"
            >
              <SettingsIcon size={20} />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};