// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

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

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: GROUP_CHAT_ID,
        text: supportMessageText,
        parse_mode: 'Markdown'
      }
    );

    res.json({ 
      success: true, 
      messageId: response.data.message_id, 
      userId: clientChatId 
    });
  } catch (error) {
    console.error('Erreur Telegram proxy:', error);
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.description || error.message 
    });
  }
});

// ✅ Récupérer les réponses depuis Telegram
router.get('/updates', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Erreur getUpdates:', error);
    res.status(500).json({ 
      ok: false, 
      error: error.message 
    });
  }
});

module.exports = router;
