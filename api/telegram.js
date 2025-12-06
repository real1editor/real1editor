// api/telegram.js - Quantum Transmission System v2.0
import { Telegraf, Markup } from 'telegraf';

// Rate limiting store (in-memory for serverless, use Redis in production)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

// User interaction store (in-memory)
const userSessions = new Map();

// Command handlers
const commandHandlers = {
  start: async (ctx) => {
    const userId = ctx.from.id;
    
    // Initialize user session
    if (!userSessions.has(userId)) {
      userSessions.set(userId, {
        id: userId,
        username: ctx.from.username || `user_${userId}`,
        firstInteraction: new Date(),
        lastInteraction: new Date(),
        interests: [],
        queryCount: 0,
        conversation: []
      });
    }

    const welcomeMessage = `🌌 *WELCOME TO REAL1EDITOR QUANTUM SYSTEMS* 🌌

🎬 *Professional Video Editing Services*
• Cinematic Editing & Color Grading
• Motion Graphics & Visual Effects
• 3D Animation & Virtual Production
• Complete Video Production Solutions

🚀 *Quick Actions:*`;

    await ctx.replyWithMarkdown(welcomeMessage, Markup.inlineKeyboard([
      [Markup.button.callback('🎬 View Portfolio', 'portfolio')],
      [Markup.button.callback('💰 Get Pricing', 'pricing')],
      [Markup.button.callback('📅 Book Consultation', 'consultation')],
      [Markup.button.callback('🛠️ Our Services', 'services')]
    ]));
  },

  help: async (ctx) => {
    const helpText = `⚡ *REAL1EDITOR HELP CENTER* ⚡

*Available Commands:*
/start - Start interaction
/help - Show this help message
/portfolio - View our work portfolio
/pricing - Get pricing information
/services - View all services
/contact - Contact information
/book - Schedule a consultation
/status - Check your transmission status

*Interactive Features:*
• Use buttons below for quick actions
• Send project details for instant quote
• Get personalized service recommendations
• Track your project progress`;

    await ctx.replyWithMarkdown(helpText, Markup.inlineKeyboard([
      [Markup.button.callback('Quick Start Guide', 'quickstart')],
      [Markup.button.url('🌐 Visit Website', 'https://yourdomain.com')],
      [Markup.button.callback('📞 Contact Support', 'support')]
    ]));
  },

  portfolio: async (ctx) => {
    const portfolioMessage = `🎬 *PORTFOLIO SHOWCASE*

*Featured Projects:*
• Cinematic Commercials - Brand storytelling
• Social Media Content - Viral campaigns
• Corporate Videos - Professional presentations
• Documentary Edits - Narrative excellence

*Platform Examples:*
YouTube: Cinematic long-form content
TikTok: Viral short-form reels
Instagram: Brand storytelling
Corporate: Professional presentations`;

    await ctx.replyWithMediaGroup([
      {
        type: 'photo',
        media: 'https://via.placeholder.com/1200/00f3ff/050810?text=Cinematic+Commercial',
        caption: 'Professional commercial editing with cinematic color grading'
      },
      {
        type: 'photo',
        media: 'https://via.placeholder.com/1200/b967ff/050810?text=Social+Media+Reel',
        caption: 'Viral social media content with motion graphics'
      }
    ]);

    await ctx.replyWithMarkdown(portfolioMessage, Markup.inlineKeyboard([
      [Markup.button.url('📺 YouTube Channel', 'https://youtube.com/@real1editor')],
      [Markup.button.url('🎵 TikTok Profile', 'https://tiktok.com/@real1editor')],
      [Markup.button.callback('📁 Request Full Portfolio', 'full_portfolio')]
    ]));
  },

  pricing: async (ctx) => {
    const pricingMessage = `💰 *TRANSPARENT PRICING STRUCTURE*

*Standard Packages:*
• Corporate Video: $80+ (5-minute base)
• Commercial Ad: $120+ (30-60 seconds)
• Documentary: $150+ (per project)
• Social Media: $5/minute
• Music Video: $130+

*What's Included:*
✓ Professional editing & color correction
✓ Sound design & basic mixing
✓ 2 rounds of revisions
✓ Multiple format delivery
✓ 5-day standard turnaround

*Premium Add-ons:*
• Motion Graphics: +$30-80
• Advanced Color: +$20-50
• 24-hour Rush: +30% fee
• 3D Animation: Custom quote`;

    await ctx.replyWithMarkdown(pricingMessage, Markup.inlineKeyboard([
      [Markup.button.callback('📊 Use Calculator', 'calculator')],
      [Markup.button.callback('📋 Get Custom Quote', 'custom_quote')],
      [Markup.button.url('🧮 Web Calculator', 'https://yourdomain.com#pricing')]
    ]));
  },

  services: async (ctx) => {
    const servicesMessage = `🛠️ *COMPREHENSIVE SERVICES*

*Core Services:*
🎬 Video Editing
• Commercial, documentary, social media
• Professional pacing and storytelling
• Multi-platform optimization

🎨 Color Grading
• Cinematic color palettes
• Mood enhancement
• Technical correction

🌀 Motion Graphics
• Animated titles and lower thirds
• Visual effects integration
• Infographic animations

*Advanced Services:*
• 3D Animation & Modeling
• Virtual Production
• Audio Enhancement
• Complete Production`;

    await ctx.replyWithMarkdown(servicesMessage, Markup.inlineKeyboard([
      [Markup.button.callback('🎬 Video Editing', 'service_video')],
      [Markup.button.callback('🎨 Color Grading', 'service_color')],
      [Markup.button.callback('🌀 Motion Graphics', 'service_motion')],
      [Markup.button.callback('⚡ Advanced Services', 'service_advanced')]
    ]));
  },

  contact: async (ctx) => {
    const contactMessage = `📞 *CONTACT REAL1EDITOR*

*Direct Channels:*
📱 Phone: +251 777126584
✉️ Email: real1editor@gmail.com
💬 Telegram: @Real1editor
📅 Calendly: Book consultations

*Response Times:*
• Phone/Telegram: 2-6 hours
• Email: Within 12 hours
• Consultations: Within 24 hours

*Location & Availability:*
🌍 Global Remote Services
⏰ Timezone: UTC±3
💼 Available internationally`;

    await ctx.replyWithMarkdown(contactMessage, Markup.inlineKeyboard([
      [Markup.button.url('📅 Book Consultation', 'https://calendly.com/real1editor/30min')],
      [Markup.button.url('📧 Send Email', 'mailto:real1editor@gmail.com')],
      [Markup.button.url('📱 Call/WhatsApp', 'tel:+251777126584')]
    ]));
  },

  book: async (ctx) => {
    await ctx.replyWithMarkdown(
      `📅 *BOOK A FREE CONSULTATION*\n\nSchedule a 30-minute video call to discuss your project:`,
      Markup.inlineKeyboard([
        [Markup.button.url('⏰ Schedule Now', 'https://calendly.com/real1editor/30min')],
        [Markup.button.callback('📋 Prepare for Call', 'consultation_prep')]
      ])
    );
  },

  status: async (ctx) => {
    const userId = ctx.from.id;
    const session = userSessions.get(userId) || {};
    
    const statusMessage = `📊 *YOUR TRANSMISSION STATUS*

*Account Details:*
👤 User: ${session.username || 'New User'}
🆔 ID: ${userId}
📅 First Interaction: ${session.firstInteraction ? session.firstInteraction.toLocaleDateString() : 'N/A'}
💬 Total Queries: ${session.queryCount || 0}

*Active Interests:*
${session.interests?.length > 0 ? session.interests.map(interest => `• ${interest}`).join('\n') : 'No interests recorded yet'}

*Next Steps:*
1. Book a free consultation
2. Submit project details for quote
3. Review portfolio examples
4. Contact for specific questions`;

    await ctx.replyWithMarkdown(statusMessage);
  }
};

// Initialize bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Set up bot handlers
bot.start((ctx) => commandHandlers.start(ctx));
bot.help((ctx) => commandHandlers.help(ctx));
bot.command('portfolio', (ctx) => commandHandlers.portfolio(ctx));
bot.command('pricing', (ctx) => commandHandlers.pricing(ctx));
bot.command('services', (ctx) => commandHandlers.services(ctx));
bot.command('contact', (ctx) => commandHandlers.contact(ctx));
bot.command('book', (ctx) => commandHandlers.book(ctx));
bot.command('status', (ctx) => commandHandlers.status(ctx));

// Callback query handlers
bot.action('portfolio', async (ctx) => {
  await ctx.answerCbQuery();
  await commandHandlers.portfolio(ctx);
});

bot.action('pricing', async (ctx) => {
  await ctx.answerCbQuery();
  await commandHandlers.pricing(ctx);
});

bot.action('services', async (ctx) => {
  await ctx.answerCbQuery();
  await commandHandlers.services(ctx);
});

bot.action('calculator', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(
    `🧮 *PRICING CALCULATOR*\n\nUse our interactive web calculator for instant estimates:`,
    Markup.inlineKeyboard([
      [Markup.button.url('Open Calculator', 'https://yourdomain.com#pricing')]
    ])
  );
});

bot.action('consultation', async (ctx) => {
  await ctx.answerCbQuery();
  await commandHandlers.book(ctx);
});

bot.action('service_video', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(
    `🎬 *VIDEO EDITING DETAILS*\n\n*Services Included:*\n• Commercial editing\n• Documentary storytelling\n• Social media optimization\n• Corporate presentations\n\n*Starting at: $80*`,
    Markup.inlineKeyboard([
      [Markup.button.callback('📋 Get Quote', 'quote_video')],
      [Markup.button.callback('🎬 See Examples', 'examples_video')]
    ])
  );
});

bot.action('service_color', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(
    `🎨 *COLOR GRADING DETAILS*\n\n*Services Included:*\n• Cinematic color palettes\n• Mood enhancement\n• Technical correction\n• Custom LUT creation\n\n*Starting at: $50*`,
    Markup.inlineKeyboard([
      [Markup.button.callback('📋 Get Quote', 'quote_color')],
      [Markup.button.callback('🎨 See Examples', 'examples_color')]
    ])
  );
});

// Handle text messages
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const message = ctx.message.text.toLowerCase();
  
  // Update user session
  let session = userSessions.get(userId);
  if (!session) {
    session = {
      id: userId,
      username: ctx.from.username || `user_${userId}`,
      firstInteraction: new Date(),
      lastInteraction: new Date(),
      interests: [],
      queryCount: 0,
      conversation: []
    };
    userSessions.set(userId, session);
  }
  
  session.lastInteraction = new Date();
  session.queryCount += 1;
  session.conversation.push({
    timestamp: new Date(),
    message: message,
    response: null
  });
  
  // Analyze message for interests
  const interestKeywords = {
    'video': 'Video Editing',
    'edit': 'Video Editing',
    'color': 'Color Grading',
    'grading': 'Color Grading',
    'motion': 'Motion Graphics',
    'graphics': 'Motion Graphics',
    'animation': '3D Animation',
    '3d': '3D Animation',
    'corporate': 'Corporate Videos',
    'social': 'Social Media',
    'commercial': 'Commercial Ads',
    'documentary': 'Documentary'
  };
  
  for (const [keyword, interest] of Object.entries(interestKeywords)) {
    if (message.includes(keyword) && !session.interests.includes(interest)) {
      session.interests.push(interest);
    }
  }
  
  // Handle common questions
  if (message.includes('how much') || message.includes('price') || message.includes('cost')) {
    await commandHandlers.pricing(ctx);
  } else if (message.includes('portfolio') || message.includes('work') || message.includes('example')) {
    await commandHandlers.portfolio(ctx);
  } else if (message.includes('service') || message.includes('what do you do')) {
    await commandHandlers.services(ctx);
  } else if (message.includes('contact') || message.includes('email') || message.includes('phone')) {
    await commandHandlers.contact(ctx);
  } else if (message.includes('book') || message.includes('consultation') || message.includes('meeting')) {
    await commandHandlers.book(ctx);
  } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    await ctx.reply(`👋 Hello ${ctx.from.first_name}! I'm Real1Editor AI Assistant. How can I help you today?`);
  } else if (message.includes('thank')) {
    await ctx.reply(`🙏 You're welcome! Let me know if you need anything else.`);
  } else {
    // Default response
    await ctx.replyWithMarkdown(
      `🤖 *I received your message: "${ctx.message.text}"*\n\nI can help you with:\n• Pricing and quotes\n• Portfolio examples\n• Service details\n• Booking consultations\n\nUse the commands or buttons for specific information.`,
      Markup.inlineKeyboard([
        [Markup.button.callback('🎬 Portfolio', 'portfolio')],
        [Markup.button.callback('💰 Pricing', 'pricing')],
        [Markup.button.callback('📅 Book Now', 'consultation')]
      ])
    );
  }
});

// Rate limiting middleware
const rateLimit = (ctx, next) => {
  const userId = ctx.from?.id || ctx.ip;
  const now = Date.now();
  
  if (rateLimitStore.has(userId)) {
    const userData = rateLimitStore.get(userId);
    const timeSinceFirstRequest = now - userData.firstRequest;
    
    if (timeSinceFirstRequest < RATE_LIMIT_WINDOW) {
      if (userData.requestCount >= RATE_LIMIT_MAX) {
        ctx.reply('⏰ Rate limit exceeded. Please wait a minute before sending more requests.');
        return;
      }
      userData.requestCount += 1;
    } else {
      // Reset counter
      rateLimitStore.set(userId, {
        firstRequest: now,
        requestCount: 1
      });
    }
  } else {
    rateLimitStore.set(userId, {
      firstRequest: now,
      requestCount: 1
    });
  }
  
  return next();
};

bot.use(rateLimit);

// Security middleware
const validateRequest = (ctx, next) => {
  // Add any additional security validation here
  // For example, check for authorized users, etc.
  return next();
};

bot.use(validateRequest);

// Webhook handler for serverless environments
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Security: Validate API token if provided
  if (req.headers['x-api-token'] && req.headers['x-api-token'] !== process.env.API_SECRET_TOKEN) {
    return res.status(403).json({
      error: 'Invalid API token',
      status: 'error'
    });
  }

  try {
    // Check if this is a Telegram update
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    if (body.update_id) {
      // Handle Telegram webhook update
      await bot.handleUpdate(body);
      return res.status(200).json({ status: 'ok' });
    }
    
    // Handle website transmissions (existing functionality)
    const payload = body;
    const type = payload.type || 'unknown';
    const source = payload.source || 'web';
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Validate environment variables
    if (!botToken || !chatId) {
      console.error('❌ Missing environment variables');
      return res.status(500).json({ 
        error: 'Server configuration incomplete',
        status: 'error'
      });
    }

    // Input validation
    if (!['project', 'feedback', 'subscribe'].includes(type)) {
      return res.status(400).json({
        error: 'Invalid transmission type',
        status: 'error'
      });
    }

    if (type === 'project' && (!payload.name || !payload.email || !payload.message)) {
      return res.status(400).json({
        error: 'Missing required fields for project',
        status: 'error'
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
        text += `├ *Client*: ${payload.name || 'Anonymous'}\n`;
        text += `├ *Email*: ${payload.email || 'Not provided'}\n`;
        text += `├ *Project Details*:\n`;
        text += `└ ${payload.message || payload.project || 'No details'}\n`;
        
        // Send with interactive buttons
        await bot.telegram.sendMessage(chatId, text, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '📋 Create Quote', callback_data: `create_quote_${Date.now()}` },
                { text: '📅 Schedule Call', url: 'https://calendly.com/real1editor/30min' }
              ],
              [
                { text: '📞 Contact Client', callback_data: `contact_${payload.email || 'none'}` }
              ]
            ]
          }
        });
        break;

      case 'feedback':
        text += `💬 *CLIENT FEEDBACK*\n`;
        text += `├ *From*: ${payload.name || 'Anonymous'}\n`;
        text += `├ *Message*:\n`;
        text += `└ ${payload.message || 'Empty feedback'}\n`;
        
        await bot.telegram.sendMessage(chatId, text, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '✅ Acknowledge', callback_data: 'ack_feedback' },
                { text: '📝 Respond', callback_data: 'respond_feedback' }
              ]
            ]
          }
        });
        break;

      case 'subscribe':
        text += `📧 *NEWSLETTER SUBSCRIPTION*\n`;
        text += `├ *Email*: ${payload.email || 'Invalid email'}\n`;
        text += `├ *Status*: 🟢 ACTIVE\n`;
        text += `└ *Frequency*: Quantum Updates Enabled\n`;
        
        await bot.telegram.sendMessage(chatId, text, { parse_mode: 'Markdown' });
        break;
    }

    text += `\n---\n`;
    text += `⚡ *REAL1EDITOR QUANTUM SYSTEMS* ⚡\n`;
    text += `📍 Neo-Addis | 3045 Era | Video Editing Elite\n`;
    text += `🌐 ${source === 'webapp' ? 'Telegram Mini App' : 'Web Portal'}`;

    // Success response
    console.log('✅ Transmission successful:', {
      type,
      source,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      status: 'success',
      message: 'Quantum transmission successful!',
      transmissionId: `TX-${Date.now()}`,
      type: type,
      timestamp: new Date().toISOString(),
      features: {
        webhook: true,
        interactiveButtons: true,
        rateLimiting: true,
        userSessions: true,
        richMedia: true
      }
    });

  } catch (error) {
    console.error('❌ System Error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Handle specific errors
    if (error.name === 'FetchError' || error.message.includes('fetch')) {
      return res.status(503).json({
        error: 'Network disruption. Please try again.',
        status: 'error'
      });
    }

    if (error.name === 'SyntaxError' || error.message.includes('JSON')) {
      return res.status(400).json({
        error: 'Invalid data format.',
        status: 'error'
      });
    }

    return res.status(500).json({
      error: 'System overload. Transmission failed.',
      status: 'error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    });
  }
}

// Additional callback query handlers for interactive buttons
bot.action('create_quote', async (ctx) => {
  await ctx.answerCbQuery('Creating quote...');
  await ctx.reply('Please provide project details for a custom quote.');
});

bot.action('ack_feedback', async (ctx) => {
  await ctx.answerCbQuery('✅ Feedback acknowledged');
  await ctx.reply('Thank you for the feedback!');
});

bot.action('quickstart', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(
    `🚀 *QUICK START GUIDE*\n\n1. *Define Goals* - What do you want to achieve?\n2. *Gather Materials* - Collect all source files\n3. *Book Consultation* - 30-minute free call\n4. *Get Quote* - Receive detailed pricing\n5. *Start Project* - We begin editing\n\n*Estimated Timeline:* 5-10 business days`
  );
});

// Clean up old sessions (run periodically)
setInterval(() => {
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;
  
  for (const [userId, session] of userSessions.entries()) {
    if (now - session.lastInteraction.getTime() > 24 * HOUR) {
      userSessions.delete(userId);
    }
  }
  
  // Clean rate limit store
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 60 * 1000); // Run every hour

// Serverless configuration
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increased for media
    },
    responseLimit: '10mb',
    externalResolver: true,
  },
};

// Webhook setup function (call this once to set up webhook)
export async function setupWebhook() {
  const webhookUrl = `${process.env.WEBHOOK_URL}/api/telegram`;
  await bot.telegram.setWebhook(webhookUrl);
  console.log('✅ Webhook set up:', webhookUrl);
                         }
