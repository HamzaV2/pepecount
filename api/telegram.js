// api/telegram.js
const https = require('https');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const email = req.query.Email;
  if (!email) {
    res.status(400).send("Email not specified.");
    return;
  }

  const message = encodeURIComponent(`New submission: ${email}\nДата: ${new Date().toISOString()}`);
  const botToken = process.env.TELEGRAM_BOT_TOKEN; 
  const chatId = process.env.TELEGRAM_CHAT_ID;     

 
  if (!botToken || !chatId) {
    res.status(500).send("Server misconfiguration: missing botToken or chatId.");
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`;

  https.get(url, (telegramRes) => {
    let data = '';
    telegramRes.on('data', chunk => data += chunk);
    telegramRes.on('end', () => {
      res.status(200).send("Your email sent 🎉🥳");
    });
  }).on('error', (err) => {
    console.error("Error sending message:", err);
    res.status(500).send("Error sending message.");
  });
};
