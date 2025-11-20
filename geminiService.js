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
      "widget": "user-friendly widget name",
      "newtext": "welcome to my page"
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
Command: "selector:img,"nthElement": 1,current style:{width:50%},reduce this image"
Response: {"operations": [{"selector": "img","nthElement": 1, "style":"height: auto,width: 25%", "widget": "reduce image"}]}
Command: "change body background to dark"
Response: {"operations": [{element": "body", "style": "background-color: #121212", "widget": "Change page background"}]}
Command: " "selector": "img","nthElement": 1, ,put this image in the middle"
Response: {"operations": [{"selector": "img","nthElement": 1, "style": "position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%)", "widget": "push from left"}]}
Command: "put the first three button in absolute position"
Response: {"operations": [{ "selector": "button", "limitFirst": 3,"style": "position: absolute","widget": "set Position of the button"}]}

Command: "I want these 3 first button to be right in the middle of their container"
Response: {"operations": [{
  "selector": "button",
  "limitFirst": 3,
  "style": "top: 50%; left: 50%; transform: translate(-50%, -50%)",
  "widget": "Push button from left"
}]}
Command: "push the 3 first button from top"
Response: {"operations": [{
  "selector": "button",
  "limitFirst": 3,
  "style": "top: 10%",
  "widget": "Push button from Top"
}]}
Command: "put the first 2 images on the same line "
Response: {"operations": [{
  "selector": "img",
  "limitFirst": 2,
  "style":"display: flex; gap: 3px;align-items: baseline",
  "createflex":"true" ,
  "widget": "add space between images"
}]}
Command: "put on the same line the 3 paragraph from the third"
Response: {"operations": [{
  "selector": "p",
  "limitStart": 3,
  "limitFirst": 3,
  "style":"display: flex; gap: 3px;align-items: baseline",
  "createflex":"true" ,
  "widget": "add space between p"
}]}
Command: "selector:div,nthelemnt:3,put the content on the same line"
Response: {"operations": [ {
  "selector": "div",
  "nthElement": 3,
  "style": "gap: 20px",
  "widget": "add space between contents"
}]}
Command: "selector:p,nthelemnt:1,make it bold"
Response: {"operations": [ {
  "selector": "p",
  "nthElement": 1,
  "style": "font-weight:bold",
  "widget": "change the boldeness"
}]}
Command: "selector:p,nthelemnt:1,change the style of text"
Response: {"operations": [ {
  "selector": "p",
  "nthElement": 1,
  "style": "font-family:sans-serif",
  "widget": "change style"
}]}
Command: "selector:p,nthelemnt:1,style:{font-size:10px},increase the size of the text "
Response: {"operations": [ {
  "selector": "p",
  "nthElement": 1,
  "style": "font-size: 20px",
  "widget": "increase text"
}]}

Command: "selector:h1,nthElement:3,change this text into welcome to my page" 
Response: {"operations": [ { 
  "selector": "h2",
  "nthElement": 3, 
  "newtext": "welcome to my page",
  "style":"none:none".
  "widget": "none"
}]}
Style Ordering Rule:
_When an element has multiple CSS properties in a single style string, always place metric properties (e.g., width, height, margin, padding,gap) in the second position;example(height: auto; width: 300px instead of width: 300px; height: auto),and if you have many metrics put the most important to the second position associated as well with the widget
_for images when increasing or decreasing,if i have specified to reduce height or width,set one of the two auto and the other property on the second position give it the numeric value
Metric rule:
_When assigning such as width:10px if user want to increase double it width:20px if decrease divide by 2 it: width:5px but if not given in the command assign based on standard css size
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
