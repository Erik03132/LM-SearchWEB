// Утилиты для вычисления контрольных сумм и работы с чанками

/**
 * Вычисляет хэш-сумму строки используя простой алгоритм
 * В продакшене рекомендуется использовать crypto API
 */
export function calculateChecksum(content: string): string {
  let hash = 0;
  if (content.length === 0) return hash.toString(16);
  
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Добавляем длину контента для уникальности
  const lengthHash = content.length.toString(16);
  return Math.abs(hash).toString(16) + '-' + lengthHash;
}

/**
 * Разбивает контент на чанки
 */
export function splitIntoChunks(content: string, chunkSize: number = 500): string[] {
  const chunks: string[] = [];
  
  // Нормализуем контент
  const normalized = content
    .replace(/\s+/g, ' ')
    .trim();
  
  // Разбиваем по параграфам сначала
  const paragraphs = normalized.split(/(?:\r?\n){2,}|(?:<\/p>|<\/div>|<\/section>)/gi);
  
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;
    
    if (currentChunk.length + trimmed.length > chunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      
      // Если параграф больше chunkSize, разбиваем его
      if (trimmed.length > chunkSize) {
        const words = trimmed.split(' ');
        currentChunk = '';
        
        for (const word of words) {
          if (currentChunk.length + word.length + 1 > chunkSize) {
            if (currentChunk) {
              chunks.push(currentChunk.trim());
            }
            currentChunk = word;
          } else {
            currentChunk += (currentChunk ? ' ' : '') + word;
          }
        }
      } else {
        currentChunk = trimmed;
      }
    } else {
      currentChunk += (currentChunk ? ' ' : '') + trimmed;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

/**
 * Извлекает текстовый контент из HTML
 */
export function extractTextFromHtml(html: string): string {
  // Удаляем скрипты и стили
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');
  
  // Заменяем блочные элементы на переносы строк
  text = text
    .replace(/<\/?(div|p|br|hr|h[1-6]|ul|ol|li|table|tr|td|th|header|footer|section|article|nav|aside)[^>]*>/gi, '\n');
  
  // Удаляем все остальные HTML теги
  text = text.replace(/<[^>]+>/g, '');
  
  // Декодируем HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // Нормализуем пробелы
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

/**
 * Извлекает заголовок страницы из HTML
 */
export function extractTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  
  const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  if (h1Match) {
    return h1Match[1].trim();
  }
  
  return 'Без заголовка';
}

/**
 * Сравнивает два набора чанков и находит изменения
 */
export function compareChunks(
  oldChunks: { id: string; content: string; checksum: string; position: number }[],
  newChunks: { content: string; checksum: string; position: number }[]
): {
  chunkId: string;
  oldContent: string;
  newContent: string;
  oldChecksum: string;
  newChecksum: string;
  position: number;
  changeType: 'modified' | 'added' | 'removed';
}[] {
  const changes: {
    chunkId: string;
    oldContent: string;
    newContent: string;
    oldChecksum: string;
    newChecksum: string;
    position: number;
    changeType: 'modified' | 'added' | 'removed';
  }[] = [];
  
  const maxLength = Math.max(oldChunks.length, newChunks.length);
  
  for (let i = 0; i < maxLength; i++) {
    const oldChunk = oldChunks[i];
    const newChunk = newChunks[i];
    
    if (oldChunk && newChunk) {
      if (oldChunk.checksum !== newChunk.checksum) {
        changes.push({
          chunkId: oldChunk.id,
          oldContent: oldChunk.content,
          newContent: newChunk.content,
          oldChecksum: oldChunk.checksum,
          newChecksum: newChunk.checksum,
          position: i,
          changeType: 'modified'
        });
      }
    } else if (newChunk && !oldChunk) {
      changes.push({
        chunkId: `new-${i}`,
        oldContent: '',
        newContent: newChunk.content,
        oldChecksum: '',
        newChecksum: newChunk.checksum,
        position: i,
        changeType: 'added'
      });
    } else if (oldChunk && !newChunk) {
      changes.push({
        chunkId: oldChunk.id,
        oldContent: oldChunk.content,
        newContent: '',
        oldChecksum: oldChunk.checksum,
        newChecksum: '',
        position: i,
        changeType: 'removed'
      });
    }
  }
  
  return changes;
}
