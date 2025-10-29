import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

class GeminiService {
  constructor() {
    if (process.env.GEMINI_API_KEY?.length > 10) {
      this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      this.useRealAPI = true;
      console.log('🔑 Mode API Gemini activé');
    } else {
      console.log('🔧 Mode simulation activé (pas de clé API)');
      this.useRealAPI = false;
    }
  }

  async parseNLCommand(naturalLanguageCommand) {
    if (!this.useRealAPI) return this.fallback(naturalLanguageCommand);

    const systemPrompt = `You are a web design assistant that converts natural language commands into precise JSON operations for modifying web pages, including user-friendly widget names.

RESPONSE: Return ONLY valid JSON with this exact structure:
{
  "operations": [
    {
      "selector": "css-selector",
      "element": "element-name",
      "limitFirst": number,
      "nthElement": number,
      "style": "css-properties",
      "widget": "user-friendly widget name"
    }
  ]
}

DETAILED EXAMPLES:

Command: "make the header blue"
Response: {"operations": [{"element": "header", "style": "background-color: blue", "widget": "Change header background color"}]}

Command: "increase font size of first paragraph"
Response: {"operations": [{"selector": "p", "limitFirst": 1, "style": "font-size: 20px", "widget": "Increase text size"}]}

Command: "add margin around images"
Response: {"operations": [{"element": "img", "style": "margin: 10px", "widget": "Add spacing around images"}]}

Command: "center the main button"
Response: {"operations": [{"element": "button.primary", "style": "text-align: center", "widget": "Center align button"}]}

Command: "make the second div flexbox"
Response: {"operations": [{"selector": "div", "nthElement": 2, "style": "display: flex; gap: 15px", "widget": "Convert to flex layout"}]}

Command: "add rounded borders to cards"
Response: {"operations": [{"element": "h1", "style": "border-radius: 8px", "widget": "Round corners"}]}

Command: "position button absolutely"
Response: {"operations": [{"element": "button", "style": "position: absolute", "widget": "Set position of the button"}]}

Command: "push button from top"
Response: {"operations": [{"element": "button", "style": "top: 50%", "widget": "Push button from Top"}]}

Command: "add vertical padding to button"
Response: {"operations": [{"element": "button", "style": "padding-top: 10px", "widget": "Push button contents vertically"}]}

Command: "center footer text"
Response: {"operations": [{"element": "footer", "style": "text-align: center", "widget": "Center footer content"}]}

Command: "add shadow to div"
Response: {"operations": [{"element": "div", "style": "box-shadow: 0 4px 6px rgba(0,0,0,0.3)", "widget": "Add shadow effect"}]}

Command: "make image circular"
Response: {"operations": [{"element": "img", "style": "border-radius: 50%", "widget": "Make image circular"}]}

Command: "change body background to dark"
Response: {"element": "body", "style": "background-color: #121212", "widget": "Change page background"}]

WIDGET NAMING GUIDELINES:
- Use action-oriented names: "Change...", "Add...", "Increase...", "Set..."
- Be specific about what is being modified
- Use natural language that users understand
- Keep it concise but descriptive

Current command: "${naturalLanguageCommand}"
`;

    try {
      const contents = [{
        role: 'user',
        parts: [{ text: systemPrompt }]
      }];

      const stream = await this.ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        config: { thinkingConfig: { thinkingBudget: -1 } },
        contents
      });

      let finalText = '';
      for await (const chunk of stream) finalText += chunk.text;
      const cleanText = finalText.replace(/```json|```/g, '').trim();

      return JSON.parse(cleanText);

    } catch (err) {
      console.error('❌ Gemini error, fallback:', err.message);
      return this.fallback(naturalLanguageCommand);
    }
  }

  fallback(command) {
    return {
      operations: [
        { selector: "body", style: "background-color:#f8f9fa", widget: "Default style applied" }
      ]
    };
  }
}

export default new GeminiService();
