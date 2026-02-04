// Zustand store для управления состоянием приложения

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { User, MonitoredUrl, ChangeRecord, LogEntry, Chunk, ChunkChange } from '../types';
import { calculateChecksum, splitIntoChunks, extractTextFromXml, extractTitle, compareChunks } from '../checksum';
interface StoreState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  
  // Data
  urls: MonitoredUrl[];
  changes: ChangeRecord[];
  logs: LogEntry[];
  
  // UI state
  loading: boolean;
  error: string | null;
  activeTab: 'urls' | 'changes' | 'logs' | 'settings';
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  
  addUrls: (urls: string[]) => void;
  removeUrl: (urlId: string) => void;
  indexUrl: (urlId: string) => Promise<void>;
  indexAllUrls: () => Promise<void>;
  monitorUrl: (urlId: string) => Promise<void>;
  monitorAllUrls: () => Promise<void>;
  
  addLog: (action: LogEntry['action'], message: string, urlId?: string, url?: string, details?: Record<string, unknown>) => void;
  clearLogs: () => void;
  
  setActiveTab: (tab: 'urls' | 'changes' | 'logs' | 'settings') => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Демо данные для симуляции
const demoHtmlResponses: Record<string, string> = {
  'https://example.com': `
    <!DOCTYPE html>
    <html>
    <head><title>Example Domain</title></head>
    <body>
      <h1>Example Domain</h1>
      <p>This domain is for use in illustrative examples in documents.</p>
      <p>You may use this domain in literature without prior coordination.</p>
      <p>More information available at IANA.</p>
    </body>
    </html>
  `,
  'default': `
    <!DOCTYPE html>
    <html>
    <head><title>Web Page</title></head>
    <body>
      <h1>Welcome to this website</h1>
      <p>This is the main content of the page. It contains various information that might change over time.</p>
      <p>Section 2: Additional content here with more details about the topic at hand.</p>
      <p>Section 3: Final section with concluding remarks and contact information.</p>
    </body>
    </html>
  `
};

// Симуляция изменений для демо
let simulationCounter = 0;

function simulateFetch(url: string): string {
  simulationCounter++;
  const baseHtml = demoHtmlResponses[url] || demoHtmlResponses['default'];
  
  // Каждый третий запрос симулирует изменение
  if (simulationCounter % 3 === 0) {
    return baseHtml.replace(
      'main content',
      `updated content (version ${Math.floor(simulationCounter / 3)})`
    );
  }
  
  return baseHtml;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  urls: [],
  changes: [],
  logs: [],
  loading: false,
  error: null,
  activeTab: 'urls',
  
  // Auth actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    
    try {
      // Симуляция входа (в продакшене использовать Firebase Auth)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password.length >= 6) {
        const user: User = {
          uid: uuidv4(),
          email,
          displayName: email.split('@')[0],
          createdAt: new Date()
        };
        set({ user, isAuthenticated: true, loading: false });
        get().addLog('index', `Пользователь ${email} вошел в систему`);
      } else {
        throw new Error('Неверный email или пароль');
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  register: async (email: string, password: string, displayName: string) => {
    set({ loading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password.length >= 6) {
        const user: User = {
          uid: uuidv4(),
          email,
          displayName: displayName || email.split('@')[0],
          createdAt: new Date()
        };
        set({ user, isAuthenticated: true, loading: false });
        get().addLog('index', `Пользователь ${email} зарегистрировался`);
      } else {
        throw new Error('Пароль должен содержать минимум 6 символов');
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  logout: () => {
    const email = get().user?.email;
    set({
      user: null,
      isAuthenticated: false,
      urls: [],
      changes: [],
      logs: []
    });
    if (email) {
      console.log(`Пользователь ${email} вышел из системы`);
    }
  },
  
  // URL management
  addUrls: (urls: string[]) => {
    const { user } = get();
    if (!user) return;
    
    const newUrls: MonitoredUrl[] = urls
      .filter(url => url.trim())
      .map(url => ({
        id: uuidv4(),
        url: url.trim(),
        userId: user.uid,
        createdAt: new Date(),
        lastChecked: null,
        status: 'pending' as const,
        chunks: [],
        title: ''
      }));
    
    set(state => ({ urls: [...state.urls, ...newUrls] }));
    get().addLog('index', `Добавлено ${newUrls.length} URL для мониторинга`);
  },
  
  removeUrl: (urlId: string) => {
    const url = get().urls.find(u => u.id === urlId);
    set(state => ({
      urls: state.urls.filter(u => u.id !== urlId),
      changes: state.changes.filter(c => c.urlId !== urlId)
    }));
    if (url) {
      get().addLog('index', `Удален URL: ${url.url}`, urlId, url.url);
    }
  },
  
  indexUrl: async (urlId: string) => {
    const { urls, user } = get();
    if (!user) return;
    
    const urlIndex = urls.findIndex(u => u.id === urlId);
    if (urlIndex === -1) return;
    
    const url = urls[urlIndex];
    
    set({ loading: true });
    get().addLog('index', `Начата индексация: ${url.url}`, urlId, url.url);
    
    try {
      // Симуляция загрузки страницы
      await new Promise(resolve => setTimeout(resolve, 1500));
      const html = simulateFetch(url.url);
      
      // Извлечение текста и заголовка
      const text = extractTextFromHtml(html);
      const title = extractTitle(html);
      
      // Разбиение на чанки
      const textChunks = splitIntoChunks(text);
      const chunks: Chunk[] = textChunks.map((content, index) => ({
        id: uuidv4(),
        content,
        checksum: calculateChecksum(content),
        position: index
      }));
      
      // Обновление URL
      const updatedUrls = [...urls];
      updatedUrls[urlIndex] = {
        ...url,
        status: 'indexed',
        lastChecked: new Date(),
        title,
        chunks
      };
      
      set({ urls: updatedUrls, loading: false });
      get().addLog('index', `Индексация завершена: ${url.url} (${chunks.length} чанков)`, urlId, url.url, {
        chunksCount: chunks.length,
        title
      });
    } catch (error) {
      const updatedUrls = [...urls];
      updatedUrls[urlIndex] = {
        ...url,
        status: 'error',
        errorMessage: (error as Error).message
      };
      set({ urls: updatedUrls, loading: false });
      get().addLog('error', `Ошибка индексации: ${url.url} - ${(error as Error).message}`, urlId, url.url);
    }
  },
  
  indexAllUrls: async () => {
    const { urls } = get();
    const pendingUrls = urls.filter(u => u.status === 'pending');
    
    get().addLog('index', `Запуск индексации всех URL (${pendingUrls.length})`);
    
    for (const url of pendingUrls) {
      await get().indexUrl(url.id);
    }
    
    get().addLog('index', 'Индексация всех URL завершена');
  },
  
  monitorUrl: async (urlId: string) => {
    const { urls, user } = get();
    if (!user) return;
    
    const urlIndex = urls.findIndex(u => u.id === urlId);
    if (urlIndex === -1) return;
    
    const url = urls[urlIndex];
    if (url.status !== 'indexed' && url.status !== 'changed') {
      get().addLog('error', `URL не проиндексирован: ${url.url}`, urlId, url.url);
      return;
    }
    
    set({ loading: true });
    get().addLog('monitor', `Начат мониторинг: ${url.url}`, urlId, url.url);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const html = simulateFetch(url.url);
      
      const text = extractTextFromHtml(html);
      const textChunks = splitIntoChunks(text);
      const newChunks = textChunks.map((content, index) => ({
        content,
        checksum: calculateChecksum(content),
        position: index
      }));
      
      // Сравнение чанков
      const chunkChanges = compareChunks(url.chunks, newChunks);
      
      if (chunkChanges.length > 0) {
        // Создание записи об изменениях
        const changeRecord: ChangeRecord = {
          id: uuidv4(),
          urlId: url.id,
          url: url.url,
          userId: user.uid,
          detectedAt: new Date(),
          changes: chunkChanges as ChunkChange[],
          notified: false
        };
        
        // Обновление чанков
        const updatedChunks: Chunk[] = newChunks.map((chunk, index) => ({
          id: url.chunks[index]?.id || uuidv4(),
          ...chunk
        }));
        
        const updatedUrls = [...urls];
        updatedUrls[urlIndex] = {
          ...url,
          status: 'changed',
          lastChecked: new Date(),
          chunks: updatedChunks
        };
        
        set(state => ({
          urls: updatedUrls,
          changes: [...state.changes, changeRecord],
          loading: false
        }));
        
        get().addLog('change_detected', `Обнаружены изменения: ${url.url} (${chunkChanges.length} изменений)`, urlId, url.url, {
          changesCount: chunkChanges.length
        });
      } else {
        const updatedUrls = [...urls];
        updatedUrls[urlIndex] = {
          ...url,
          lastChecked: new Date()
        };
        
        set({ urls: updatedUrls, loading: false });
        get().addLog('monitor', `Изменений не обнаружено: ${url.url}`, urlId, url.url);
      }
    } catch (error) {
      set({ loading: false });
      get().addLog('error', `Ошибка мониторинга: ${url.url} - ${(error as Error).message}`, urlId, url.url);
    }
  },
  
  monitorAllUrls: async () => {
    const { urls } = get();
    const indexedUrls = urls.filter(u => u.status === 'indexed' || u.status === 'changed');
    
    get().addLog('monitor', `Запуск мониторинга всех URL (${indexedUrls.length})`);
    
    for (const url of indexedUrls) {
      await get().monitorUrl(url.id);
    }
    
    get().addLog('monitor', 'Мониторинг всех URL завершен');
  },
  
  // Logging
  addLog: (action, message, urlId, url, details) => {
    const { user } = get();
    if (!user) return;
    
    const log: LogEntry = {
      id: uuidv4(),
      userId: user.uid,
      action,
      urlId,
      url,
      message,
      timestamp: new Date(),
      details
    };
    
    set(state => ({ logs: [log, ...state.logs].slice(0, 100) })); // Keep last 100 logs
  },
  
  clearLogs: () => set({ logs: [] }),
  
  // UI
  setActiveTab: (tab) => set({ activeTab: tab }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));
