import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function buildFallbackCoachReply(
  message: string,
  userContext?: {
    userName?: string;
    habitsSummary?: string;
    moneySaved?: string;
    hoursSaved?: number;
    activeExercisePlan?: string;
    activeEatingPlan?: string;
  }
): { reply: string; suggestedActions: string[] } {
  const lower = message.toLowerCase();
  const name = userContext?.userName?.split(' ')[0] || 'friend';

  if (lower.includes('craving') || lower.includes('urge') || lower.includes('tempt') || lower.includes('relapse')) {
    return {
      reply: `Take one slow breath with me right now, ${name}. A craving is like an ocean wave—it builds up, peaks for about 3 to 5 minutes, and then fades away on its own.\n\nHere is a simple 3-step reset you can do in the next 2 minutes:\n1. Drink one full glass of cold water slowly.\n2. Step away from the room or screen you are looking at right now.\n3. Breathe in through your nose for 4 seconds, and breathe out slowly for 6 seconds.\n\nYou have already saved ${userContext?.moneySaved || '$0'} and reclaimed ${userContext?.hoursSaved ?? 0} hours of your life. Let's just get through the next 5 minutes together.`,
      suggestedActions: [
        'Drink 1 glass of water right now',
        'Do 3 minutes of Calm SOS breathing',
        'Write a quick note about what triggered this feeling',
      ],
    };
  }

  if (lower.includes('workout') || lower.includes('exercise') || lower.includes('stretch') || lower.includes('move')) {
    return {
      reply: `Great idea, ${name}! Moving your body is one of the fastest ways to clear stress and boost your mood.\n\nRight now your active plan is **${userContext?.activeExercisePlan || 'Everyday Strength & Good Posture'}**. If you only have 5 to 10 minutes today, try this simple mini-session:\n• **10 Slow Bodyweight Squats** (sit back like sitting in a chair, keep your chest proud)\n• **10 Wall or Counter Push-Ups** (smooth and steady)\n• **60-Second Chest & Shoulder Opener Stretch**\n\nCheck the **Exercise & Meals** tab anytime to see the step-by-step visual diagrams for each movement!`,
      suggestedActions: [
        'Do 10 slow bodyweight squats',
        'Take a 10-minute phone-free walk outside',
        'Log today’s workout in Notes & Docs',
      ],
    };
  }

  if (lower.includes('eat') || lower.includes('meal') || lower.includes('sugar') || lower.includes('snack') || lower.includes('food')) {
    return {
      reply: `When sugar or snack cravings hit, the secret is **protein + fiber + water first**, ${name}.\n\nYour current meal plan (**${userContext?.activeEatingPlan || 'Steady Energy & Craving Control'}**) focuses on keeping your blood sugar steady so you don't get the 4 PM or late-night crash.\n\n**Easy swap for today:**\n• Have a bowl of Greek yogurt with berries, a handful of almonds, or eggs on whole-grain toast.\n• Brew a warm cup of peppermint or chamomile tea after dinner to signal to your brain that the kitchen is closed for the night.`,
      suggestedActions: [
        'Drink a large glass of water before snacking',
        'Eat 25g–30g of protein at your next meal',
        'Close the kitchen after 8:30 PM with herbal tea',
      ],
    };
  }

  return {
    reply: `Hi ${name}! You are doing wonderfully showing up for yourself today.\n\nHere is a quick snapshot of where you stand:\n• **Active Habits & Trackers:** ${userContext?.habitsSummary || 'Tracking daily habits & recovery'}\n• **Total Saved So Far:** ${userContext?.moneySaved || '$0'} and ${userContext?.hoursSaved ?? 0} hours of free time gained\n• **Active Wellness Guides:** ${userContext?.activeExercisePlan || 'Everyday Strength'} & ${userContext?.activeEatingPlan || 'Steady Energy Meals'}\n\nPick just **one small step** you can finish in the next 5 minutes—and remember you can save any of our chats straight to your **Notes & Docs** tab to keep a record of your journey!`,
    suggestedActions: [
      'Complete 1 easy daily step on Today’s list',
      'Write a 2-sentence reflection in Notes & Docs',
      'Drink a glass of water and stretch your shoulders',
    ],
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Health & Publish-Readiness Check Endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Ascent Habit & Recovery Companion API',
      aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      timestamp: new Date().toISOString(),
    });
  });

  // AI Coach Chat Endpoint
  app.post('/api/ai/chat', async (req, res) => {
    const { message, history = [], userContext = {} } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Please provide a message.' });
    }

    const ai = getAIClient();
    if (!ai) {
      const fallback = buildFallbackCoachReply(message, userContext);
      return res.json({
        reply: fallback.reply,
        suggestedActions: fallback.suggestedActions,
        mode: 'smart-coach',
      });
    }

    try {
      const systemInstruction = `You are the Ascent AI Coach, a warm, encouraging, down-to-earth daily habit and recovery companion.
Always use simple, everyday English words. Avoid complicated medical or clinical jargon.
Keep your answers clear, encouraging, practical, and easy to read with short bullet points when helpful.

User Context:
- Name: ${userContext.userName || 'Friend'}
- Active Habits & Streaks: ${userContext.habitsSummary || 'Building healthy habits and quitting bad habits'}
- Total Money Saved: ${userContext.moneySaved || '$0'}
- Total Hours Reclaimed: ${userContext.hoursSaved ?? 0} hours
- Active Exercise Plan: ${userContext.activeExercisePlan || 'Everyday Strength & Good Posture'}
- Active Meal Plan: ${userContext.activeEatingPlan || 'Steady Energy & Craving Control'}
- Recent Personal Notes: ${userContext.recentNotesSummary || 'None yet'}

Return JSON with:
1. "reply": Your friendly, practical coaching response (use markdown bolding and bullet points for readability).
2. "suggestedActions": An array of 2 to 3 short, concrete action steps (under 10 words each) the user can do today or save to their notes.`;

      const recentHistoryText = Array.isArray(history)
        ? history
            .slice(-6)
            .map((m: { role: string; text: string }) => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.text}`)
            .join('\n')
        : '';

      const prompt = recentHistoryText
        ? `Recent conversation:\n${recentHistoryText}\n\nUser's new message: ${message}`
        : message;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: 'Friendly, simple-language coaching response with practical advice.',
              },
              suggestedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2 to 3 short action steps the user can take right away.',
              },
            },
            required: ['reply', 'suggestedActions'],
          },
        },
      });

      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText);
      return res.json({
        reply: parsed.reply || buildFallbackCoachReply(message, userContext).reply,
        suggestedActions: Array.isArray(parsed.suggestedActions)
          ? parsed.suggestedActions
          : buildFallbackCoachReply(message, userContext).suggestedActions,
        mode: 'gemini-3.8-flash',
      });
    } catch (error) {
      console.error('AI Chat Error, using smart coach fallback:', error);
      const fallback = buildFallbackCoachReply(message, userContext);
      return res.json({
        reply: fallback.reply,
        suggestedActions: fallback.suggestedActions,
        mode: 'smart-coach',
      });
    }
  });

  // AI Documentation Note Polisher & Action Step Generator
  app.post('/api/ai/note-assist', async (req, res) => {
    const { title = '', content = '', category = 'daily_log' } = req.body || {};

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Please write a few words in your note first.' });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.json({
        summary: `Key Takeaway: ${title ? `${title} — ` : ''}${content.slice(0, 140)}${content.length > 140 ? '...' : ''}`,
        actionSteps: [
          'Review this note before starting tomorrow morning',
          'Pick 1 small trigger or habit adjustment to practice today',
          'Celebrate showing up and documenting your progress',
        ],
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Help organize and summarize this user's personal habit/recovery documentation note using simple, everyday words.
Note Title: ${title}
Note Category: ${category}
Note Content: ${content}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'A clear, encouraging 1-2 sentence summary of the note in simple words.',
              },
              actionSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 simple, practical next steps based on the note.',
              },
            },
            required: ['summary', 'actionSteps'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({
        summary: parsed.summary || 'Your note has been organized clearly.',
        actionSteps: Array.isArray(parsed.actionSteps) ? parsed.actionSteps : [],
      });
    } catch (error) {
      console.error('AI Note Assist Error:', error);
      return res.json({
        summary: `Key Takeaway: ${content.slice(0, 140)}${content.length > 140 ? '...' : ''}`,
        actionSteps: [
          'Keep tracking how your energy and cravings feel at this time of day',
          'Follow your next scheduled routine step',
          'Drink a glass of water and take 3 slow breaths',
        ],
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ascent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
