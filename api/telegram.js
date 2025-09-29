// api/telegram.js - Quantum Transmission System for Real1Editor
export default async function handler(req, res) {
  // Set CORS headers for cross-domain requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Quantum interference detected. Method not allowed.',
      status: 'error'
    });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const type = payload.type || 'unknown';
    const source = payload.source || 'web';
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Validate environment variables
    if (!botToken || !chatId) {
      console.error('❌ Missing environment variables:', {
        hasToken: !!botToken,
        hasChatId: !!chatId
      });
      
      return res.status(500).json({ 
        error: 'Quantum server misconfigured. Transmission failed.',
        status: 'error',
        details: 'Server configuration incomplete'
      });
    }

    // Create quantum-themed message
    let text = `🌌 *QUANTUM TRANSMISSION INITIATED* 🌌\n`;
    text += `⏰ *Time*: ${new Date().toLocaleString('en-US', { 
      timeZone: 'Africa/Addis_Ababa',
      dateStyle: 'full',
      timeStyle: 'medium'
    })}\n`;
    text += `📡 *Transmission Type*: ${type.toUpperCase()}\n`;
    text += `🚀 *Source*: ${source === 'webapp' ? 'Telegram Mini App' : 'Quantum Web Portal'}\n\n`;

    // Format message based on transmission type
    switch(type) {
      case 'project':
        text += `🎬 *NEW PROJECT REQUEST*\n`;
        text += `├ *Client*: ${payload.name || 'Anonymous Quantum Being'}\n`;
        text += `├ *Email*: ${payload.email || 'Not provided'}\n`;
        text += `├ *Project Details*:\n`;
        text += `└ ${payload.message || payload.project || 'No details provided'}\n`;
        break;

      case 'feedback':
        text += `💬 *CLIENT FEEDBACK*\n`;
        text += `├ *From*: ${payload.name || 'Anonymous'}\n`;
        text += `├ *Message*:\n`;
        text += `└ ${payload.message || 'Empty feedback'}\n`;
        break;

      case 'subscribe':
        text += `📧 *NEWSLETTER SUBSCRIPTION*\n`;
        text += `├ *Email*: ${payload.email || 'Invalid email'}\n`;
        text += `├ *Status*: 🟢 ACTIVE\n`;
        text += `└ *Frequency*: Quantum Updates Enabled\n`;
        break;

      default:
        text += `⚡ *UNKNOWN TRANSMISSION*\n`;
        text += `├ *Data*: ${JSON.stringify(payload).substring(0, 200)}\n`;
        text += `└ *Status*: 🔴 INVESTIGATE\n`;
    }

    text += `\n---\n`;
    text += `⚡ *REAL1EDITOR QUANTUM SYSTEMS* ⚡\n`;
    text += `📍 Neo-Addis | 3045 Era | Video Editing Elite\n`;
    text += `🌐 ${source === 'webapp' ? 'Telegram Mini App' : 'Web Portal'}`;

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
        disable_notification: false
      })
    });

    const result = await response.json();

    if (!result.ok) {
      console.error('❌ Telegram API Error:', {
        error: result.description,
        code: result.error_code,
        payload: { type, source }
      });

      // Specific error handling
      if (result.error_code === 400) {
        return res.status(400).json({
          error: 'Invalid transmission format. Please check your data.',
          status: 'error',
          details: result.description
        });
      } else if (result.error_code === 401) {
        return res.status(500).json({
          error: 'Quantum authentication failed. Invalid bot token.',
          status: 'error',
          details: 'Server configuration error'
        });
      } else if (result.error_code === 403) {
        return res.status(500).json({
          error: 'Transmission blocked. Bot cannot message this chat.',
          status: 'error',
          details: 'Chat ID configuration error'
        });
      } else {
        return res.status(502).json({
          error: 'Quantum gateway error. Transmission failed.',
          status: 'error',
          details: result.description || 'Unknown Telegram API error'
        });
      }
    }

    // Success response
    console.log('✅ Transmission successful:', {
      type,
      source,
      messageId: result.result.message_id,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      status: 'success',
      message: 'Quantum transmission successful! Data received across dimensions.',
      transmissionId: `TX-${Date.now()}`,
      type: type,
      timestamp: new Date().toISOString(),
      telegramMessageId: result.result.message_id
    });

  } catch (error) {
    // Comprehensive error handling
    console.error('❌ Quantum System Failure:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Network errors
    if (error.name === 'FetchError' || error.message.includes('fetch')) {
      return res.status(503).json({
        error: 'Quantum network disruption. Please try again.',
        status: 'error',
        details: 'Network connectivity issue'
      });
    }

    // JSON parsing errors
    if (error.name === 'SyntaxError' || error.message.includes('JSON')) {
      return res.status(400).json({
        error: 'Invalid transmission data format.',
        status: 'error',
        details: 'Data parsing failed'
      });
    }

    // Generic server errors
    return res.status(500).json({
      error: 'Quantum system overload. Transmission failed.',
      status: 'error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

// Additional helper for better error tracking
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '5mb',
    externalResolver: true,
  },
};
