import { useState } from 'react';
import { useStore } from './useStore';
import { 
  Download, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Plus,
  Minus,
  Edit3,
  Bell,
  Copy,
  Check,
  FileJson,
  Table,
  TrendingUp,
  Clock
} from 'lucide-react';
import type { ChangeRecord } from '../index';

export function ChangesView() {
  const { changes, urls } = useStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [copied, setCopied] = useState(false);
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const getChangeConfig = (type: string) => {
    switch (type) {
      case 'added':
        return { 
          icon: Plus, 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          label: 'Добавлено' 
        };
      case 'removed':
        return { 
          icon: Minus, 
          color: 'text-red-400', 
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          label: 'Удалено' 
        };
      default:
        return { 
          icon: Edit3, 
          color: 'text-amber-400', 
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          label: 'Изменено' 
        };
    }
  };
  
  const exportJson = () => {
    const data = changes.map(change => ({
      url: change.url,
      detectedAt: change.detectedAt,
      changes: change.changes.map(c => ({
        type: c.changeType,
        position: c.position,
        oldContent: c.oldContent,
        newContent: c.newContent
      }))
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `changes-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const copyJson = () => {
    const data = changes.map(change => ({
      url: change.url,
      detectedAt: change.detectedAt,
      changes: change.changes.map(c => ({
        type: c.changeType,
        position: c.position,
        oldContent: c.oldContent,
        newContent: c.newContent
      }))
    }));
    
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const groupedChanges = changes.reduce((acc, change) => {
    const date = new Date(change.detectedAt).toLocaleDateString('ru-RU');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(change);
    return acc;
  }, {} as Record<string, ChangeRecord[]>);

  const totalChangesCount = changes.reduce((sum, c) => sum + c.changes.length, 0);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">История изменений</h2>
          </div>
          <p className="text-white/50">Обнаруженные изменения на отслеживаемых страницах</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Table className="w-4 h-4" />
              Таблица
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                viewMode === 'json'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <FileJson className="w-4 h-4" />
              JSON
            </button>
          </div>
          <button
            onClick={exportJson}
            disabled={changes.length === 0}
            className="px-5 py-3 glass border border-white/10 text-white rounded-xl hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300 disabled:opacity-40 flex items-center gap-2 font-medium"
          >
            <Download className="w-4 h-4" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Stats */}
      {changes.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-5 border border-white/5 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <Bell className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{changes.length}</p>
            <p className="text-white/40 text-sm">Всего записей</p>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/5 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <Edit3 className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-amber-400">{totalChangesCount}</p>
            <p className="text-white/40 text-sm">Всего изменений</p>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/5 card-hover">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <ExternalLink className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-400">{new Set(changes.map(c => c.urlId)).size}</p>
            <p className="text-white/40 text-sm">Уникальных URL</p>
          </div>
        </div>
      )}
      
      {changes.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-white/5">
          <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Bell className="w-10 h-10 text-white/20" />
          </div>
          <p className="text-white/40 text-xl font-medium">Изменений пока не обнаружено</p>
          <p className="text-white/20 text-sm mt-2 max-w-md mx-auto">
            Запустите мониторинг проиндексированных URL для отслеживания изменений
          </p>
        </div>
      ) : viewMode === 'json' ? (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <FileJson className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">JSON представление</span>
            </div>
            <button
              onClick={copyJson}
              className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:border-cyan-500/50 hover:text-cyan-400 transition-all flex items-center gap-2 text-sm font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Скопировано!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Копировать
                </>
              )}
            </button>
          </div>
          <pre className="p-6 text-sm text-white/70 overflow-x-auto max-h-[600px] overflow-y-auto font-mono bg-black/20">
            {JSON.stringify(
              changes.map(change => ({
                url: change.url,
                detectedAt: change.detectedAt,
                changes: change.changes.map(c => ({
                  type: c.changeType,
                  position: c.position,
                  oldContent: c.oldContent.substring(0, 100) + (c.oldContent.length > 100 ? '...' : ''),
                  newContent: c.newContent.substring(0, 100) + (c.newContent.length > 100 ? '...' : '')
                }))
              })),
              null,
              2
            )}
          </pre>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedChanges)
            .sort(([a], [b]) => new Date(b.split('.').reverse().join('-')).getTime() - new Date(a.split('.').reverse().join('-')).getTime())
            .map(([date, dateChanges]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <Clock className="w-4 h-4 text-white/50" />
                  </div>
                  <h3 className="text-white/50 font-medium">{date}</h3>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="space-y-4">
                  {dateChanges.map((change, index) => {
                    const url = urls.find(u => u.id === change.urlId);
                    const isExpanded = expandedId === change.id;
                    
                    return (
                      <div
                        key={change.id}
                        className="glass rounded-2xl border border-amber-500/20 overflow-hidden shadow-lg shadow-amber-500/5 card-hover"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <button
                          onClick={() => toggleExpand(change.id)}
                          className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-all"
                        >
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                              <Edit3 className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-medium">
                                  {url?.title || change.url}
                                </span>
                                <a
                                  href={change.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                              <p className="text-white/40 text-sm">
                                {change.changes.length} изменений • {new Date(change.detectedAt).toLocaleTimeString('ru-RU')}
                              </p>
                            </div>
                          </div>
                          <div className={`p-2 rounded-xl transition-all ${isExpanded ? 'bg-amber-500/20' : 'bg-white/5'}`}>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-amber-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-white/50" />
                            )}
                          </div>
                        </button>
                        
                        {isExpanded && (
                          <div className="border-t border-white/5 bg-black/20">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-white/5">
                                    <th className="px-5 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
                                      Тип
                                    </th>
                                    <th className="px-5 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
                                      Позиция
                                    </th>
                                    <th className="px-5 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
                                      Было
                                    </th>
                                    <th className="px-5 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
                                      Стало
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                  {change.changes.map((c, idx) => {
                                    const config = getChangeConfig(c.changeType);
                                    const ChangeIcon = config.icon;
                                    
                                    return (
                                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                                        <td className="px-5 py-4">
                                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg} border ${config.border}`}>
                                            <ChangeIcon className={`w-3.5 h-3.5 ${config.color}`} />
                                            <span className={`text-xs font-medium ${config.color}`}>
                                              {config.label}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="px-5 py-4">
                                          <span className="text-white/60 text-sm font-mono">
                                            #{c.position + 1}
                                          </span>
                                        </td>
                                        <td className="px-5 py-4">
                                          <div className="max-w-xs">
                                            {c.oldContent ? (
                                              <p className="text-red-400/70 text-sm line-through">
                                                {c.oldContent.substring(0, 100)}
                                                {c.oldContent.length > 100 ? '...' : ''}
                                              </p>
                                            ) : (
                                              <span className="text-white/20 text-sm italic">—</span>
                                            )}
                                          </div>
                                        </td>
                                        <td className="px-5 py-4">
                                          <div className="max-w-xs">
                                            {c.newContent ? (
                                              <p className="text-emerald-400/70 text-sm">
                                                {c.newContent.substring(0, 100)}
                                                {c.newContent.length > 100 ? '...' : ''}
                                              </p>
                                            ) : (
                                              <span className="text-white/20 text-sm italic">—</span>
                                            )}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
