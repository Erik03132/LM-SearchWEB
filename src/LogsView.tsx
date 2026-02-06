import { useStore } from './useStore';
import { 
  FileText, 
  Search, 
  Trash2,
  Play,
  RefreshCw,
  Bell,
  AlertTriangle,
  Send,
  ExternalLink,
  Filter,
  Clock
} from 'lucide-react';
import { useState } from 'react';

export function LogsView() {
  const { logs, clearLogs } = useStore();
  const [filter, setFilter] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  
  const getActionConfig = (action: string) => {
    switch (action) {
      case 'index':
        return { 
          icon: Play, 
          color: 'text-cyan-400', 
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
          label: 'Индексация' 
        };
      case 'monitor':
        return { 
          icon: RefreshCw, 
          color: 'text-purple-400', 
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          label: 'Мониторинг' 
        };
      case 'change_detected':
        return { 
          icon: Bell, 
          color: 'text-amber-400', 
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          label: 'Изменение' 
        };
      case 'notification_sent':
        return { 
          icon: Send, 
          color: 'text-emerald-400', 
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          label: 'Уведомление' 
        };
      case 'error':
        return { 
          icon: AlertTriangle, 
          color: 'text-red-400', 
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          label: 'Ошибка' 
        };
      default:
        return { 
          icon: FileText, 
          color: 'text-white/50', 
          bg: 'bg-white/5',
          border: 'border-white/10',
          label: action 
        };
    }
  };
  
  const filteredLogs = logs.filter(log => {
    const matchesText = 
      log.message.toLowerCase().includes(filter.toLowerCase()) ||
      (log.url?.toLowerCase().includes(filter.toLowerCase()) ?? false);
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesText && matchesAction;
  });
  
  const actionCounts = logs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Логи активности</h2>
          </div>
          <p className="text-white/50">История всех операций системы</p>
        </div>
        <button
          onClick={clearLogs}
          disabled={logs.length === 0}
          className="px-5 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-all duration-300 disabled:opacity-40 flex items-center gap-2 font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Очистить логи
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              placeholder="Поиск в логах..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="pl-12 pr-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer min-w-[180px]"
          >
            <option value="all">Все действия</option>
            <option value="index">Индексация</option>
            <option value="monitor">Мониторинг</option>
            <option value="change_detected">Изменения</option>
            <option value="notification_sent">Уведомления</option>
            <option value="error">Ошибки</option>
          </select>
        </div>
      </div>
      
      {/* Action Filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(actionCounts).map(([action, count]) => {
          const config = getActionConfig(action);
          const ActionIcon = config.icon;
          
          return (
            <button
              key={action}
              onClick={() => setActionFilter(actionFilter === action ? 'all' : action)}
              className={`px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all duration-300 font-medium border ${
                actionFilter === action
                  ? `${config.bg} ${config.color} ${config.border}`
                  : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ActionIcon className="w-4 h-4" />
              {config.label}
              <span className={`px-2 py-0.5 rounded-md text-xs ${
                actionFilter === action ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-white/5">
          <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-white/20" />
          </div>
          <p className="text-white/40 text-xl font-medium">
            {logs.length === 0 ? 'Логов пока нет' : 'Ничего не найдено'}
          </p>
          <p className="text-white/20 text-sm mt-2">
            Действия будут записываться автоматически
          </p>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Время
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Действие
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Сообщение
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">
                    URL
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((log, index) => {
                  const config = getActionConfig(log.action);
                  const ActionIcon = config.icon;
                  
                  return (
                    <tr 
                      key={log.id} 
                      className="hover:bg-white/5 transition-colors"
                      style={{ animationDelay: `${index * 0.02}s` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-white/40 text-sm font-mono">
                          {new Date(log.timestamp).toLocaleTimeString('ru-RU')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${config.bg} ${config.color} border ${config.border}`}>
                          <ActionIcon className="w-3.5 h-3.5" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm max-w-md truncate">
                          {log.message}
                        </p>
                        {log.details && (
                          <p className="text-white/30 text-xs mt-1 font-mono">
                            {JSON.stringify(log.details)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {log.url && (
                          <a
                            href={log.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 max-w-xs truncate transition-colors"
                          >
                            {new URL(log.url).hostname}
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="text-center">
        <p className="text-white/30 text-sm">
          Показано {filteredLogs.length} из {logs.length} записей (макс. 100)
        </p>
      </div>
    </div>
  );
}
