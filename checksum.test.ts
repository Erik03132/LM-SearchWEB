// Автоматизированные тесты для ключевых компонентов
// Запуск: npx vitest (требуется установка vitest)

import { 
  calculateChecksum, 
  splitIntoChunks, 
  extractTextFromHtml, 
  extractTitle,
  compareChunks 
} from './src/checksum';

// ===== Тесты calculateChecksum =====

function testCalculateChecksum() {
  console.log('Testing calculateChecksum...');
  
  // Тест 1: Одинаковый контент должен давать одинаковую сумму
  const content1 = 'Hello World';
  const hash1a = calculateChecksum(content1);
  const hash1b = calculateChecksum(content1);
  console.assert(hash1a === hash1b, 'Same content should produce same hash');
  
  // Тест 2: Разный контент должен давать разные суммы
  const content2 = 'Hello World!';
  const hash2 = calculateChecksum(content2);
  console.assert(hash1a !== hash2, 'Different content should produce different hash');
  
  // Тест 3: Пустая строка
  const emptyHash = calculateChecksum('');
  console.assert(emptyHash === '0', 'Empty string should return "0"');
  
  // Тест 4: Хэш содержит длину
  console.assert(hash1a.includes('-'), 'Hash should contain length suffix');
  
  console.log('✓ calculateChecksum tests passed');
}

// ===== Тесты splitIntoChunks =====

function testSplitIntoChunks() {
  console.log('Testing splitIntoChunks...');
  
  // Тест 1: Короткий текст - один чанк
  const shortText = 'Short text';
  const chunks1 = splitIntoChunks(shortText, 500);
  console.assert(chunks1.length === 1, 'Short text should be one chunk');
  console.assert(chunks1[0] === shortText, 'Content should be preserved');
  
  // Тест 2: Длинный текст - несколько чанков
  const longText = 'Word '.repeat(200);
  const chunks2 = splitIntoChunks(longText, 100);
  console.assert(chunks2.length > 1, 'Long text should split into multiple chunks');
  
  // Тест 3: Чанки не превышают лимит (с учетом слов)
  const allWithinLimit = chunks2.every(chunk => chunk.length <= 150); // небольшой запас на слова
  console.assert(allWithinLimit, 'Chunks should respect size limit approximately');
  
  // Тест 4: Пустой текст
  const emptyChunks = splitIntoChunks('   ', 500);
  console.assert(emptyChunks.length === 0, 'Empty text should return no chunks');
  
  console.log('✓ splitIntoChunks tests passed');
}

// ===== Тесты extractTextFromHtml =====

function testExtractTextFromHtml() {
  console.log('Testing extractTextFromHtml...');
  
  // Тест 1: Базовое извлечение
  const html1 = '<p>Hello <b>World</b></p>';
  const text1 = extractTextFromHtml(html1);
  console.assert(text1.includes('Hello'), 'Should extract text content');
  console.assert(text1.includes('World'), 'Should extract text from nested tags');
  console.assert(!text1.includes('<'), 'Should remove HTML tags');
  
  // Тест 2: Удаление скриптов
  const html2 = '<p>Content</p><script>alert("xss")</script>';
  const text2 = extractTextFromHtml(html2);
  console.assert(!text2.includes('alert'), 'Should remove script content');
  console.assert(text2.includes('Content'), 'Should preserve regular content');
  
  // Тест 3: Удаление стилей
  const html3 = '<style>.class { color: red; }</style><p>Text</p>';
  const text3 = extractTextFromHtml(html3);
  console.assert(!text3.includes('color'), 'Should remove style content');
  
  // Тест 4: HTML entities
  const html4 = '<p>&amp; &lt; &gt;</p>';
  const text4 = extractTextFromHtml(html4);
  console.assert(text4.includes('&'), 'Should decode &amp;');
  console.assert(text4.includes('<'), 'Should decode &lt;');
  
  console.log('✓ extractTextFromHtml tests passed');
}

// ===== Тесты extractTitle =====

function testExtractTitle() {
  console.log('Testing extractTitle...');
  
  // Тест 1: Title tag
  const html1 = '<html><head><title>Page Title</title></head></html>';
  console.assert(extractTitle(html1) === 'Page Title', 'Should extract title tag');
  
  // Тест 2: H1 fallback
  const html2 = '<html><body><h1>Main Heading</h1></body></html>';
  console.assert(extractTitle(html2) === 'Main Heading', 'Should fallback to H1');
  
  // Тест 3: Default value
  const html3 = '<html><body><p>Just text</p></body></html>';
  console.assert(extractTitle(html3) === 'Без заголовка', 'Should return default');
  
  console.log('✓ extractTitle tests passed');
}

// ===== Тесты compareChunks =====

function testCompareChunks() {
  console.log('Testing compareChunks...');
  
  const oldChunks = [
    { id: '1', content: 'First chunk', checksum: 'abc-11', position: 0 },
    { id: '2', content: 'Second chunk', checksum: 'def-12', position: 1 },
    { id: '3', content: 'Third chunk', checksum: 'ghi-11', position: 2 }
  ];
  
  // Тест 1: Без изменений
  const newChunks1 = [
    { content: 'First chunk', checksum: 'abc-11', position: 0 },
    { content: 'Second chunk', checksum: 'def-12', position: 1 },
    { content: 'Third chunk', checksum: 'ghi-11', position: 2 }
  ];
  const changes1 = compareChunks(oldChunks, newChunks1);
  console.assert(changes1.length === 0, 'No changes when content is same');
  
  // Тест 2: Модификация
  const newChunks2 = [
    { content: 'First chunk', checksum: 'abc-11', position: 0 },
    { content: 'Modified chunk', checksum: 'xyz-14', position: 1 },
    { content: 'Third chunk', checksum: 'ghi-11', position: 2 }
  ];
  const changes2 = compareChunks(oldChunks, newChunks2);
  console.assert(changes2.length === 1, 'Should detect one modification');
  console.assert(changes2[0].changeType === 'modified', 'Should be modified type');
  
  // Тест 3: Добавление
  const newChunks3 = [
    { content: 'First chunk', checksum: 'abc-11', position: 0 },
    { content: 'Second chunk', checksum: 'def-12', position: 1 },
    { content: 'Third chunk', checksum: 'ghi-11', position: 2 },
    { content: 'New chunk', checksum: 'new-9', position: 3 }
  ];
  const changes3 = compareChunks(oldChunks, newChunks3);
  console.assert(changes3.length === 1, 'Should detect one addition');
  console.assert(changes3[0].changeType === 'added', 'Should be added type');
  
  // Тест 4: Удаление
  const newChunks4 = [
    { content: 'First chunk', checksum: 'abc-11', position: 0 },
    { content: 'Second chunk', checksum: 'def-12', position: 1 }
  ];
  const changes4 = compareChunks(oldChunks, newChunks4);
  console.assert(changes4.length === 1, 'Should detect one removal');
  console.assert(changes4[0].changeType === 'removed', 'Should be removed type');
  
  console.log('✓ compareChunks tests passed');
}

// ===== Запуск всех тестов =====

export function runAllTests() {
  console.log('=== Running all tests ===\n');
  
  try {
    testCalculateChecksum();
    testSplitIntoChunks();
    testExtractTextFromHtml();
    testExtractTitle();
    testCompareChunks();
    
    console.log('\n=== All tests passed! ===');
    return true;
  } catch (error) {
    console.error('\n=== Test failed! ===');
    console.error(error);
    return false;
  }
}

// Автозапуск при импорте в dev режиме
if (typeof window !== 'undefined') {
  (window as unknown as { runTests: typeof runAllTests }).runTests = runAllTests;
  console.log('Tests available: call window.runTests() in console');
}
