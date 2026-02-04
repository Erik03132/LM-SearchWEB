import { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Webhook, 
  Clock, 
  Save,
  Check,
  Shield,
  Database,
  Code,
  Sparkles,
  Settings,
  Zap,
  Lock,
  Server
} from 'lucide-react';

export function SettingsView() {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [email, setEmail] = useState('');
  const [webhookEnabled, setWebhookEnabled] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [intervalMinutes, setIntervalMinutes] = useState(60);
  const [saved, setSaved] = useState(false);
  
  const handleSave = () => {
    console.log('Settings saved:', {
      emailEnabled,
      email,
      webhookEnabled,
      webhookUrl,
      intervalMinutes
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const securityFeatures = [
    { text: 'Данные пользователей изолированы', icon: Lock },
    { text: 'Аутентификация через Firebase', icon: Shield },
    { text: 'Firestore Security Rules', icon: Database },
    { text: 'HTTPS шифрование', icon: Server },
  ];

  const integrations = [
    { name: 'Firebase Firestore', desc: 'Хранение данных', icon: Database, color: 'cyan' },
    { name: 'Cloud Functions', desc: 'Серверные операции', icon: Zap, color: 'purple' },
    { name: 'REST API', desc: 'Внешние интеграции', icon: Webhook, color: 'pink' },
  ];
  
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30">
            <Settings className="w-6 h-6 text-pink-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">Настройки</h2>
        </div>
        <p className="text-white/50">Конфигурация уведомлений и планировщика</p>
      </div>
      
      {/* Notifications */}
      <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
            <Bell className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Уведомления</h3>
            <p className="text-white/40 text-sm">Настройка оповещений об изменениях</p>
          </div>
        </div>
        
        {/* Email */}
        <div className="space-y-4 pl-4 border-l-2 border-white/10 ml-7">
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className={`relative w-12 h-6 rounded-full transition-all ${emailEnabled ? 'bg-cyan-500' : 'bg-white/10'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${emailEnabled ? 'left-7' : 'left-1'}`} />
            </div>
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={(e) => setEmailEnabled(e.target.checked)}
              className="sr-only"
            />
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <Mail className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-white font-medium">Email уведомления</span>
                <p className="text-white/40 text-sm">Получайте отчеты на почту</p>
              </div>
            </div>
          </label>
          
          {emailEnabled && (
            <div className="relative group ml-8">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>
          )}
        </div>
        
        {/* Webhook */}
        <div className="space-y-4 pl-4 border-l-2 border-white/10 ml-7">
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className={`relative w-12 h-6 rounded-full transition-all ${webhookEnabled ? 'bg-purple-500' : 'bg-white/10'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${webhookEnabled ? 'left-7' : 'left-1'}`} />
            </div>
            <input
              type="checkbox"
              checked={webhookEnabled}
              onChange={(e) => setWebhookEnabled(e.target.checked)}
              className="sr-only"
            />
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <Webhook className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <span className="text-white font-medium">Webhook интеграция</span>
                <p className="text-white/40 text-sm">Telegram, Slack, Discord и др.</p>
              </div>
            </div>
          </label>
          
          {webhookEnabled && (
            <div className="relative group ml-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <input
                type="url"
                placeholder="https://hooks.slack.com/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="relative w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Schedule */}
      <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
            <Clock className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Планировщик</h3>
            <p className="text-white/40 text-sm">Автоматическая проверка изменений</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <label className="text-white/60 text-sm font-medium">Интервал проверки</label>
          <select
            value={intervalMinutes}
            onChange={(e) => setIntervalMinutes(Number(e.target.value))}
            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer"
          >
            <option value={15}>⚡ Каждые 15 минут</option>
            <option value={30}>🔄 Каждые 30 минут</option>
            <option value={60}>⏰ Каждый час</option>
            <option value={180}>🕐 Каждые 3 часа</option>
            <option value={360}>🕕 Каждые 6 часов</option>
            <option value={720}>🌙 Каждые 12 часов</option>
            <option value={1440}>📅 Раз в день</option>
          </select>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-white/40 text-sm">
              В продакшене требуется настройка Cloud Functions для автоматического выполнения задач по расписанию
            </p>
          </div>
        </div>
      </div>
      
      {/* Security */}
      <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Shield className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Безопасность</h3>
            <p className="text-white/40 text-sm">Правила защиты данных</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {securityFeatures.map((feature, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-white/70 text-sm">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Integrations */}
      <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Code className="w-7 h-7 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">API интеграции</h3>
            <p className="text-white/40 text-sm">Готовность к расширению</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {integrations.map((integration, index) => (
            <div 
              key={index}
              className={`p-5 rounded-xl border card-hover ${
                integration.color === 'cyan' ? 'bg-cyan-500/5 border-cyan-500/20' :
                integration.color === 'purple' ? 'bg-purple-500/5 border-purple-500/20' :
                'bg-pink-500/5 border-pink-500/20'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                integration.color === 'cyan' ? 'bg-cyan-500/20' :
                integration.color === 'purple' ? 'bg-purple-500/20' :
                'bg-pink-500/20'
              }`}>
                <integration.icon className={`w-5 h-5 ${
                  integration.color === 'cyan' ? 'text-cyan-400' :
                  integration.color === 'purple' ? 'text-purple-400' :
                  'text-pink-400'
                }`} />
              </div>
              <h4 className="text-white font-medium">{integration.name}</h4>
              <p className="text-white/40 text-sm">{integration.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
          saved 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25'
            : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
        }`}
      >
        {saved ? (
          <>
            <Check className="w-5 h-5" />
            Настройки сохранены!
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Сохранить настройки
          </>
        )}
      </button>
      
      {/* Code Example */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-white/5">
          <Code className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Пример Cloud Function</h3>
        </div>
        <pre className="p-6 text-sm text-white/60 overflow-x-auto font-mono bg-black/30">
{`// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const scheduledMonitoring = functions.pubsub
  .schedule('every ${intervalMinutes} minutes')
  .onRun(async (context) => {
    const db = admin.firestore();
    const urls = await db.collection('urls')
      .where('status', 'in', ['indexed', 'changed'])
      .get();
    
    for (const doc of urls.docs) {
      console.log('Checking:', doc.data().url);
      // Fetch and compare logic...
    }
    
    return null;
  });`}
        </pre>
      </div>
    </div>
  );
}
