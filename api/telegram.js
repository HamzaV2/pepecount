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

  
  const message = encodeURIComponent(`Нова заявка: ${email}\nДата: ${new Date().toISOString()}`);
  const botToken = process.env.7927667369:AAHQgB1GzChyg1Lgm2hY_1VrbaULosNz8CQ; 
  const chatId = process.env.56774676; 

  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`;

  https.get(url, (telegramRes) => {
    let data = '';
    telegramRes.on('data', chunk => data += chunk);
    telegramRes.on('end', () => {
      res.status(200).send("Your email sent 🎉🥳");
    });
  }).on('error', (err) => {
    console.error("Error sending message:", err);
    res.status(500).send("Error sending message:");
  });
};

