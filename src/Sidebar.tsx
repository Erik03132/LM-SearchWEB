import { useStore } from './useStore';
import { 
  Link2, 
  Bell, 
  FileText, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Globe,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

export function Sidebar() {
  const { user, logout, activeTab, setActiveTab, urls, changes } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const menuItems = [
    { id: 'urls' as const, label: 'URL адреса', icon: Link2, badge: urls.length, color: 'cyan' },
    { id: 'changes' as const, label: 'Изменения', icon: Bell, badge: changes.length, color: 'yellow' },
    { id: 'logs' as const, label: 'Логи', icon: FileText, color: 'purple' },
    { id: 'settings' as const, label: 'Настройки', icon: Settings, color: 'pink' },
  ];

  const getActiveStyles = (color: string) => {
    switch (color) {
      case 'cyan':
        return 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 neon-box-cyan';
      case 'yellow':
        return 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400';
      case 'purple':
        return 'bg-purple-500/10 border-purple-500/50 text-purple-400 neon-box-purple';
      case 'pink':
        return 'bg-pink-500/10 border-pink-500/50 text-pink-400 neon-box-pink';
      default:
        return 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400';
    }
  };
  
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 flex items-center justify-center animate-pulse-glow">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Web Monitor</h1>
            <div className="flex items-center gap-1 text-white/40 text-xs">
              <Sparkles className="w-3 h-3" />
              <span>Pro Edition</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* User info */}
      <div className="p-4 mx-4 mt-4 rounded-xl glass border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.displayName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate text-sm">{user?.displayName}</p>
            <p className="text-white/40 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 border group ${
              activeTab === item.id
                ? getActiveStyles(item.color)
                : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
            }`}
            style={{ 
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <div className={`p-2 rounded-lg transition-all ${
              activeTab === item.id 
                ? 'bg-white/10' 
                : 'bg-white/5 group-hover:bg-white/10'
            }`}>
              <item.icon className="w-4 h-4" />
            </div>
            <span className="flex-1 text-left font-medium">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                activeTab === item.id
                  ? 'bg-white/20'
                  : 'bg-white/10'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      
      {/* Stats card */}
      <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50">Всего URL</span>
          <span className="text-cyan-400 font-bold">{urls.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-white/50">Изменений</span>
          <span className="text-yellow-400 font-bold">{changes.length}</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
            style={{ width: `${Math.min((urls.filter(u => u.status === 'indexed').length / Math.max(urls.length, 1)) * 100, 100)}%` }}
          />
        </div>
        <p className="text-white/30 text-xs mt-2">
          {urls.filter(u => u.status === 'indexed' || u.status === 'changed').length} проиндексировано
        </p>
      </div>
      
      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
        >
          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-red-500/20 transition-all">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="font-medium">Выйти</span>
        </button>
      </div>
    </div>
  );
  
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 glass-strong rounded-xl text-white hover:text-cyan-400 transition-colors"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-gray-950/95 backdrop-blur-xl border-r border-white/5
        transform transition-transform duration-300 lg:transform-none
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <SidebarContent />
      </aside>
    </>
  );
}
