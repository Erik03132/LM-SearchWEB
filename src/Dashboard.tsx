import { useStore } from './useStore';import { Sidebar } from './Sidebar';
import { UrlManager } from './UrlManager';
import { ChangesView } from './ChangesView';
import { LogsView } from './LogsView';
import { SettingsView } from './SettingsView';
import { ParallaxBackground } from '../UI/ParallaxBackground';
import { Loader2 } from 'lucide-react';

export function Dashboard() {
  const { activeTab, loading } = useStore();
  
  const renderContent = () => {
    switch (activeTab) {
      case 'urls':
        return <UrlManager />;
      case 'changes':
        return <ChangesView />;
      case 'logs':
        return <LogsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <UrlManager />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-950 flex overflow-hidden relative">
      <ParallaxBackground />
      
      <Sidebar />
      
      <main className="flex-1 lg:ml-0 p-4 lg:p-8 pt-20 lg:pt-8 overflow-y-auto relative z-10">
        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-md flex items-center justify-center z-50">
            <div className="glass-strong rounded-2xl p-8 flex flex-col items-center gap-6 animate-bounce-in neon-box-cyan">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cyan-500/20 rounded-full" />
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" />
                <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-medium">Обработка данных...</p>
                <p className="text-white/40 text-sm mt-1">Пожалуйста, подождите</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto animate-slide-up">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
