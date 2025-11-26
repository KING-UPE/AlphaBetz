import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Brain, Info, RefreshCw } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home, exact: true },
  { name: 'Learn', path: '/learn', icon: BookOpen, exact: false },
  { name: 'Converter', path: '/converter', icon: RefreshCw, exact: true },
  { name: 'Practice', path: '/practice', icon: Brain, exact: true },
  { name: 'About', path: '/about', icon: Info, exact: true },
];

function NavItem({ item, isActive }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      className={`
        inline-flex flex-col items-center justify-center px-4 md:px-5
        transition-colors duration-200 group
        ${isActive ? 'text-blue-600' : 'text-gray-500 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400'}
      `}
    >
      <Icon className="w-6 h-6 mb-1" />
      <span className="text-xs font-medium">{item.name}</span>
    </Link>
  );
}

export default function BottomNav() {
  const location = useLocation();

  return (
    <div className="fixed z-50 w-full bottom-0 left-0">
      <div className="max-w-xl mx-auto px-2">
        <div className="h-16 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full shadow-xl transition-colors duration-300">
          <div className="grid h-full w-full grid-cols-5">
            {navItems.map(item => {
              const isActive =
                (item.path === '/' && location.pathname === '/') ||
                (item.path === '/learn' && location.pathname.startsWith('/learn')) ||
                (item.path !== '/' && item.path !== '/learn' && location.pathname.startsWith(item.path));
              return <NavItem key={item.name} item={item} isActive={isActive} />;
            })}
          </div>
        </div>
      </div>
      <div className="h-4 bg-gray-50 dark:bg-gray-900 w-full" />
    </div>
  );
}
