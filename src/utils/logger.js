// @ts-check
/**
 * Logger - Structured test logging utility
 * QA Pulse by SK - www.skakarh.com
 */

const PREFIX = "🎭 [QA Pulse]";

const COLORS = {
  info:    "\x1b[36m",
  warn:    "\x1b[33m",
  error:   "\x1b[31m",
  success: "\x1b[32m",
  debug:   "\x1b[35m",
  step:    "\x1b[34m",
  reset:   "\x1b[0m",
};

const ICONS = {
  info:    "ℹ️ ",
  warn:    "⚠️ ",
  error:   "❌",
  success: "✅",
  debug:   "🔍",
  step:    "▶️ ",
};

function log(level, message, data) {
  const color = COLORS[level];
  const icon = ICONS[level];
  const timestamp = new Date().toISOString().split("T")[1].slice(0, 8);
  const formatted = `${color}${PREFIX} ${icon} [${timestamp}] ${message}${COLORS.reset}`;

  if (level === "error") {
    console.error(formatted, data !== undefined ? data : "");
  } else {
    console.log(formatted, data !== undefined ? data : "");
  }
}

const logger = {
  info:    (msg, data) => log("info", msg, data),
  warn:    (msg, data) => log("warn", msg, data),
  error:   (msg, data) => log("error", msg, data),
  success: (msg, data) => log("success", msg, data),
  debug:   (msg, data) => log("debug", msg, data),
  step:    (msg, data) => log("step", msg, data),
};

module.exports = { logger };
