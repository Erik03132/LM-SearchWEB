/**
 * Пример Cloud Functions для Firebase
 * 
 * Установка:
 * 1. firebase init functions
 * 2. Скопировать этот код в functions/src/index.ts
 * 3. npm install node-fetch crypto
 * 4. firebase deploy --only functions
 */

/*
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';
import * as crypto from 'crypto';

admin.initializeApp();
const db = admin.firestore();

// Интерфейсы
interface Chunk {
  id: string;
  content: string;
  checksum: string;
  position: number;
}

interface MonitoredUrl {
  id: string;
  url: string;
  userId: string;
  status: string;
  chunks: Chunk[];
}

interface ChunkChange {
  chunkId: string;
  oldContent: string;
  newContent: string;
  oldChecksum: string;
  newChecksum: string;
  position: number;
  changeType: 'modified' | 'added' | 'removed';
}

// Утилиты
function calculateChecksum(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex');
}

function splitIntoChunks(content: string, chunkSize = 500): string[] {
  const chunks: string[] = [];
  const normalized = content.replace(/\s+/g, ' ').trim();
  
  for (let i = 0; i < normalized.length; i += chunkSize) {
    chunks.push(normalized.substring(i, i + chunkSize).trim());
  }
  
  return chunks.filter(c => c.length > 0);
}

function extractTextFromHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

// ===== Планировщик автоматического мониторинга =====
export const scheduledMonitoring = functions.pubsub
  .schedule('every 60 minutes')
  .timeZone('Europe/Moscow')
  .onRun(async (context) => {
    console.log('Starting scheduled monitoring...');
    
    try {
      // Получаем все проиндексированные URL
      const urlsSnapshot = await db.collection('urls')
        .where('status', 'in', ['indexed', 'changed'])
        .get();
      
      console.log(`Found ${urlsSnapshot.size} URLs to monitor`);
      
      for (const doc of urlsSnapshot.docs) {
        const urlData = doc.data() as MonitoredUrl;
        
        try {
          // Загружаем страницу
          const response = await fetch(urlData.url, {
            headers: {
              'User-Agent': 'WebMonitor/1.0'
            },
            timeout: 30000
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const html = await response.text();
          const text = extractTextFromHtml(html);
          const textChunks = splitIntoChunks(text);
          
          // Создаем новые чанки с чексуммами
          const newChunks = textChunks.map((content, index) => ({
            content,
            checksum: calculateChecksum(content),
            position: index
          }));
          
          // Сравниваем с существующими
          const changes: ChunkChange[] = [];
          const maxLen = Math.max(urlData.chunks.length, newChunks.length);
          
          for (let i = 0; i < maxLen; i++) {
            const oldChunk = urlData.chunks[i];
            const newChunk = newChunks[i];
            
            if (oldChunk && newChunk && oldChunk.checksum !== newChunk.checksum) {
              changes.push({
                chunkId: oldChunk.id,
                oldContent: oldChunk.content,
                newContent: newChunk.content,
                oldChecksum: oldChunk.checksum,
                newChecksum: newChunk.checksum,
                position: i,
                changeType: 'modified'
              });
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
          
          if (changes.length > 0) {
            // Сохраняем изменения
            await db.collection('changes').add({
              urlId: doc.id,
              url: urlData.url,
              userId: urlData.userId,
              detectedAt: admin.firestore.FieldValue.serverTimestamp(),
              changes: changes,
              notified: false
            });
            
            // Обновляем URL
            const updatedChunks = newChunks.map((chunk, index) => ({
              id: urlData.chunks[index]?.id || admin.firestore().collection('_').doc().id,
              ...chunk
            }));
            
            await doc.ref.update({
              status: 'changed',
              lastChecked: admin.firestore.FieldValue.serverTimestamp(),
              chunks: updatedChunks
            });
            
            // Логируем
            await db.collection('logs').add({
              userId: urlData.userId,
              action: 'change_detected',
              urlId: doc.id,
              url: urlData.url,
              message: `Обнаружено ${changes.length} изменений`,
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
              details: { changesCount: changes.length }
            });
            
            console.log(`Changes detected for ${urlData.url}: ${changes.length}`);
          } else {
            await doc.ref.update({
              lastChecked: admin.firestore.FieldValue.serverTimestamp()
            });
          }
        } catch (error) {
          console.error(`Error monitoring ${urlData.url}:`, error);
          
          await db.collection('logs').add({
            userId: urlData.userId,
            action: 'error',
            urlId: doc.id,
            url: urlData.url,
            message: `Ошибка мониторинга: ${(error as Error).message}`,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }
      
      console.log('Scheduled monitoring completed');
      return null;
    } catch (error) {
      console.error('Scheduled monitoring failed:', error);
      throw error;
    }
  });

// ===== Отправка уведомлений при обнаружении изменений =====
export const sendNotificationOnChange = functions.firestore
  .document('changes/{changeId}')
  .onCreate(async (snap, context) => {
    const change = snap.data();
    
    try {
      // Получаем настройки уведомлений пользователя
      const notificationDoc = await db.collection('notifications')
        .doc(change.userId)
        .get();
      
      if (!notificationDoc.exists) return null;
      
      const settings = notificationDoc.data();
      
      // Email уведомление
      if (settings?.emailEnabled && settings?.email) {
        // Интеграция с SendGrid, Mailgun или Firebase Extensions
        console.log(`Sending email to ${settings.email} about changes on ${change.url}`);
        
        // Пример с SendGrid:
        // await sgMail.send({
        //   to: settings.email,
        //   from: 'noreply@webmonitor.app',
        //   subject: `Изменения обнаружены: ${change.url}`,
        //   html: `<p>Обнаружено ${change.changes.length} изменений</p>`
        // });
      }
      
      // Webhook уведомление (Telegram, Slack, etc.)
      if (settings?.webhookEnabled && settings?.webhookUrl) {
        console.log(`Sending webhook to ${settings.webhookUrl}`);
        
        await fetch(settings.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🔔 Изменения обнаружены!\n\nURL: ${change.url}\nИзменений: ${change.changes.length}\nВремя: ${new Date().toLocaleString('ru-RU')}`
          })
        });
      }
      
      // Отмечаем уведомление как отправленное
      await snap.ref.update({ notified: true });
      
      // Логируем
      await db.collection('logs').add({
        userId: change.userId,
        action: 'notification_sent',
        urlId: change.urlId,
        url: change.url,
        message: 'Уведомление отправлено',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return null;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  });

// ===== HTTP API для внешних интеграций =====
export const api = functions.https.onRequest(async (req, res) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.status(204).send('');
    return;
  }
  
  // Проверка токена
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  try {
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    
    if (req.method === 'GET' && req.path === '/urls') {
      const urls = await db.collection('urls')
        .where('userId', '==', userId)
        .get();
      
      res.json({
        urls: urls.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      });
    } else if (req.method === 'GET' && req.path === '/changes') {
      const changes = await db.collection('changes')
        .where('userId', '==', userId)
        .orderBy('detectedAt', 'desc')
        .limit(100)
        .get();
      
      res.json({
        changes: changes.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== Очистка старых логов (раз в неделю) =====
export const cleanupOldLogs = functions.pubsub
  .schedule('every sunday 03:00')
  .timeZone('Europe/Moscow')
  .onRun(async (context) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const oldLogs = await db.collection('logs')
      .where('timestamp', '<', thirtyDaysAgo)
      .limit(500)
      .get();
    
    const batch = db.batch();
    oldLogs.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    
    console.log(`Deleted ${oldLogs.size} old log entries`);
    return null;
  });
*/

// Экспорт пустого объекта для TypeScript
export {};
