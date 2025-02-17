// Типы логов
export const LogType = {
  INFO: 'info',
  ERROR: 'error',
  WARNING: 'warning',
  ACTION: 'action'
};

// Структура лога
class LogEntry {
  constructor(type, message, details = null) {
    this.id = Date.now() + Math.random();
    this.timestamp = new Date().toISOString();
    this.type = type;
    this.message = message;
    this.details = details;
  }
}

// Хранилище логов
const logs = [];
const maxLogs = 1000; // Максимальное количество хранимых логов

// Основная функция логирования
export const logger = {
  log: (type, message, details = null) => {
    const entry = new LogEntry(type, message, details);
    logs.unshift(entry); // Добавляем в начало массива
    
    // Ограничиваем количество логов
    if (logs.length > maxLogs) {
      logs.pop();
    }
    
    // В разработке также выводим в консоль
    if (import.meta.env.DEV) {
      console.log(`[${type.toUpperCase()}]`, message, details || '');
    }
    
    return entry;
  },
  
  info: (message, details) => logger.log(LogType.INFO, message, details),
  error: (message, details) => logger.log(LogType.ERROR, message, details),
  warning: (message, details) => logger.log(LogType.WARNING, message, details),
  action: (message, details) => logger.log(LogType.ACTION, message, details),
  
  getLogs: () => [...logs],
  clear: () => logs.length = 0
}; 