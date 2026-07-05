// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Configuration Telegram
const TELEGRAM_BOT_TOKEN = '8570394266:AAE1_Az0Hzot09m8u3s4Ml-EUMHQjgqunwY';
const GROUP_CHAT_ID = '-5293060257';

// ✅ Envoyer un message à Telegram
router.post('/send', async (req, res) => {
  try {
    const { name, email, message, userId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message vide' });
    }

    const clientChatId = userId || 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    const supportMessageText = `📩 NOUVEAU MESSAGE (Chat Widget)
━━━━━━━━━━━━━━━━━━
🆔 ID: ${clientChatId}
👤 Nom: ${name || 'Non renseigné'}
📧 Email: ${email || 'Non renseigné'}
💬 Message: ${message}

📅 ${new Date().toLocaleString('fr-FR')}

⚠️ POUR RÉPONDRE, TAPEZ:
/reply_${clientChatId} Votre message ici`;

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: GROUP_CHAT_ID,
        text: supportMessageText,
        parse_mode: 'Markdown'
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.json({ 
        success: true, 
        messageId: data.message_id, 
        userId: clientChatId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: data.description || 'Erreur Telegram' 
      });
    }
  } catch (error) {
    console.error('Erreur Telegram proxy:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ✅ Récupérer les réponses depuis Telegram
router.get('/updates', async (req, res) => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur getUpdates:', error);
    res.status(500).json({ 
      ok: false, 
      error: error.message 
    });
  }
});

module.exports = router;
