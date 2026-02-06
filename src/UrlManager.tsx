import { useState } from 'react';
import { useStore } from './useStore';
import { 
  Plus, 
  Search, 
  Play, 
  RefreshCw, 
  Trash2, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  Globe,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export function UrlManager() {
  const { 
    urls, 
    addUrls, 
    removeUrl, 
    indexUrl, 
    indexAllUrls, 
    monitorUrl, 
    monitorAllUrls,
    loading 
  } = useStore();
  
  const [newUrls, setNewUrls] = useState('');
  const [filter, setFilter] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const handleAddUrls = () => {
    const urlList = newUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url && (url.startsWith('http://') || url.startsWith('https://')));
    
    if (urlList.length > 0) {
      addUrls(urlList);
      setNewUrls('');
    }
  };
  
  const handleIndexUrl = async (id: string) => {
    setProcessingId(id);
    await indexUrl(id);
    setProcessingId(null);
  };
  
  const handleMonitorUrl = async (id: string) => {
    setProcessingId(id);
    await monitorUrl(id);
    setProcessingId(null);
  };
  
  const filteredUrls = urls.filter(url => 
    url.url.toLowerCase().includes(filter.toLowerCase()) ||
    url.title.toLowerCase().includes(filter.toLowerCase())
  );
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'indexed':
        return { 
          icon: CheckCircle, 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          label: 'Проиндексирован',
          glow: 'shadow-emerald-500/20'
        };
      case 'changed':
        return { 
          icon: AlertCircle, 
          color: 'text-amber-400', 
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          label: 'Есть изменения',
          glow: 'shadow-amber-500/20'
        };
      case 'error':
        return { 
          icon: AlertCircle, 
          color: 'text-red-400', 
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          label: 'Ошибка',
          glow: 'shadow-red-500/20'
        };
      default:
        return { 
          icon: Clock, 
          color: 'text-white/40', 
          bg: 'bg-white/5',
          border: 'border-white/10',
          label: 'Ожидает',
          glow: ''
        };
    }
  };

  const stats = [
    { label: 'Всего URL', value: urls.length, color: 'from-cyan-500 to-blue-500', icon: Globe },
    { label: 'Проиндексировано', value: urls.filter(u => u.status === 'indexed' || u.status === 'changed').length, color: 'from-emerald-500 to-teal-500', icon: CheckCircle },
    { label: 'С изменениями', value: urls.filter(u => u.status === 'changed').length, color: 'from-amber-500 to-orange-500', icon: TrendingUp },
    { label: 'Ошибки', value: urls.filter(u => u.status === 'error').length, color: 'from-red-500 to-pink-500', icon: AlertCircle },
  ];
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
              <Globe className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">URL адреса</h2>
          </div>
          <p className="text-white/50">Управление списком отслеживаемых страниц</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={indexAllUrls}
            disabled={loading || urls.filter(u => u.status === 'pending').length === 0}
            className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4" />
            Индексировать все
          </button>
          <button
            onClick={monitorAllUrls}
            disabled={loading || urls.filter(u => u.status === 'indexed' || u.status === 'changed').length === 0}
            className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-400 hover:to-pink-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5"
          >
            <RefreshCw className="w-4 h-4" />
            Проверить все
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      {urls.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="glass rounded-2xl p-5 border border-white/5 card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-white/40 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Add URLs */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <Plus className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Добавить URL</h3>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={newUrls}
              onChange={(e) => setNewUrls(e.target.value)}
              placeholder="Введите URL адреса (каждый с новой строки)&#10;https://example.com&#10;https://another-site.com"
              className="w-full h-36 px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 resize-none transition-all"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white/30 text-sm">
              <Sparkles className="w-4 h-4" />
              {newUrls.split('\n').filter(u => u.trim()).length} URL
            </div>
          </div>
          <button
            onClick={handleAddUrls}
            disabled={!newUrls.trim()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg shadow-emerald-500/25"
          >
            <Plus className="w-4 h-4" />
            Добавить URL
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder="Поиск по URL или заголовку..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
      </div>
      
      {/* URL List */}
      <div className="space-y-4">
        {filteredUrls.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl border border-white/5">
            <Globe className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-lg">
              {urls.length === 0 ? 'Нет добавленных URL' : 'Ничего не найдено'}
            </p>
            <p className="text-white/20 text-sm mt-2">
              Добавьте адреса для мониторинга выше
            </p>
          </div>
        ) : (
          filteredUrls.map((url, index) => {
            const status = getStatusConfig(url.status);
            const StatusIcon = status.icon;
            
            return (
              <div
                key={url.id}
                className={`glass rounded-2xl p-5 border transition-all duration-300 card-hover ${status.border} ${status.glow && `shadow-lg ${status.glow}`}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`p-3 rounded-xl ${status.bg} border ${status.border}`}>
                      <StatusIcon className={`w-5 h-5 ${status.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <a
                          href={url.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-cyan-400 font-medium truncate flex items-center gap-2 transition-colors"
                        >
                          {url.title || url.url}
                          <ExternalLink className="w-4 h-4 flex-shrink-0 opacity-50" />
                        </a>
                      </div>
                      <p className="text-white/40 text-sm truncate mb-3">{url.url}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${status.bg} ${status.color} border ${status.border}`}>
                          {status.label}
                        </span>
                        {url.chunks.length > 0 && (
                          <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/50 border border-white/10">
                            📦 {url.chunks.length} чанков
                          </span>
                        )}
                        {url.lastChecked && (
                          <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/50 border border-white/10">
                            🕐 {new Date(url.lastChecked).toLocaleString('ru-RU')}
                          </span>
                        )}
                      </div>
                      {url.errorMessage && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {url.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 lg:flex-shrink-0">
                    <button
                      onClick={() => handleIndexUrl(url.id)}
                      disabled={loading || processingId === url.id}
                      className="flex-1 lg:flex-none px-4 py-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/20 transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2 font-medium"
                      title="Индексировать"
                    >
                      {processingId === url.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">Индекс</span>
                    </button>
                    <button
                      onClick={() => handleMonitorUrl(url.id)}
                      disabled={loading || processingId === url.id || (url.status !== 'indexed' && url.status !== 'changed')}
                      className="flex-1 lg:flex-none px-4 py-2.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2 font-medium"
                      title="Проверить изменения"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span className="hidden sm:inline">Проверить</span>
                    </button>
                    <button
                      onClick={() => removeUrl(url.id)}
                      className="px-4 py-2.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-all duration-300 flex items-center justify-center"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
