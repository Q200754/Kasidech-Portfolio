const db = require('../db');

/**
 * Logs an administrative action to the database
 * @param {string} action Description of the action (e.g. "Create Project", "Admin Login")
 * @param {string} userEmail Email of the administrator performing the action
 */
async function logAction(action, userEmail) {
  try {
    const dateTime = new Date().toISOString();
    await db.query(
      'INSERT INTO activity_logs (action, user_email, date_time) VALUES (?, ?, ?)',
      [action, userEmail || 'system', dateTime]
    );
    console.log(`[LOG] Action: "${action}" by ${userEmail || 'system'} at ${dateTime}`);
  } catch (err) {
    console.error('Failed to write action log to database:', err);
  }
}

module.exports = { logAction };
