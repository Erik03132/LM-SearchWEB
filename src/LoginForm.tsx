import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Mail, Lock, User, LogIn, UserPlus, Sparkles, Globe, Shield, Zap } from 'lucide-react';
import { ParallaxBackground } from '../UI/ParallaxBackground';

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const { login, register, loading, error, clearError } = useStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (isLogin) {
      await login(email, password);
    } else {
      await register(email, password, displayName);
    }
  };

  const features = [
    { icon: Globe, text: 'Мониторинг любых сайтов', color: 'cyan' },
    { icon: Shield, text: 'Безопасное хранение данных', color: 'purple' },
    { icon: Zap, text: 'Мгновенные уведомления', color: 'pink' },
  ];
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 overflow-hidden relative">
      <ParallaxBackground />
      
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-8 animate-slide-up">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/30">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Новое поколение мониторинга</span>
            </div>
            
            <h1 className="text-5xl font-bold text-white leading-tight">
              <span className="gradient-text">Web Monitor</span>
              <br />
              <span className="text-white/90">Следите за изменениями</span>
            </h1>
            
            <p className="text-white/60 text-lg max-w-md">
              Автоматический мониторинг веб-страниц с умным определением изменений и мгновенными уведомлениями
            </p>
          </div>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl glass card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  feature.color === 'cyan' ? 'bg-cyan-500/20 neon-box-cyan' :
                  feature.color === 'purple' ? 'bg-purple-500/20 neon-box-purple' :
                  'bg-pink-500/20 neon-box-pink'
                }`}>
                  <feature.icon className={`w-6 h-6 ${
                    feature.color === 'cyan' ? 'text-cyan-400' :
                    feature.color === 'purple' ? 'text-purple-400' :
                    'text-pink-400'
                  }`} />
                </div>
                <span className="text-white font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="w-full max-w-md mx-auto animate-bounce-in">
          <div className="glass-strong rounded-3xl p-8 neon-box-cyan">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 mb-4 animate-pulse-glow">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {isLogin ? 'Добро пожаловать!' : 'Создать аккаунт'}
              </h2>
              <p className="text-white/50 mt-2">
                {isLogin ? 'Войдите для продолжения' : 'Зарегистрируйтесь бесплатно'}
              </p>
            </div>
            
            <div className="flex mb-6 p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  isLogin
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Вход
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  !isLogin
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Регистрация
              </button>
            </div>
            
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3 animate-bounce-in">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">!</span>
                </div>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity" />
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="Имя пользователя"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50 transition-all"
                    />
                  </div>
                </div>
              )}
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity" />
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50 transition-all"
                  />
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-0 group-focus-within:opacity-30 transition-opacity" />
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-cyan-400/50 transition-all"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                  isLogin 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isLogin ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    Войти в систему
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Создать аккаунт
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-white/30 text-sm">
                💡 Демо: введите любой email и пароль (мин. 6 символов)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
