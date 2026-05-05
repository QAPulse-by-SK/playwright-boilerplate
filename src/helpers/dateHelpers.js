// @ts-check
/**
 * Date Helpers
 * QA Pulse by SK - www.skakarh.com
 */

/** @param {"YYYY-MM-DD" | "DD/MM/YYYY"} format */
function todayFormatted(format = "YYYY-MM-DD") {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return format === "YYYY-MM-DD" ? `${yyyy}-${mm}-${dd}` : `${dd}/${mm}/${yyyy}`;
}

/**
 * @param {Date} date
 * @param {number} days
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

module.exports = { todayFormatted, addDays, timestamp };
