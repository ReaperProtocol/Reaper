const ts = () => new Date().toISOString().slice(11, 23);
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

export const log = {
  info: (...a: unknown[]) => console.log(`[${ts()}] INFO `, ...a),
  warn: (...a: unknown[]) => console.warn(`[${ts()}] ${YELLOW}WARN${RESET} `, ...a),
  error: (...a: unknown[]) => console.error(`[${ts()}] ${RED}ERROR${RESET}`, ...a),
  debug: (...a: unknown[]) => process.env.DEBUG && console.log(`[${ts()}] DEBUG`, ...a),
};
