const ENV = process.env.NODE_ENV || 'production';
const isDev = ENV === 'development' || ENV === 'dev';

function info(...args) {
  // Always show important info (server start, DB connected, env files)
  console.log(...args);
}

function warn(...args) {
  // Show warnings only in development by default
  if (isDev) console.warn(...args);
}

function error(...args) {
  // Always show errors
  console.error(...args);
}

function debug(...args) {
  if (isDev) console.debug(...args);
}

export default {
  info,
  warn,
  error,
  debug,
};
