import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class DeepSeekService {
  constructor() {
    console.log('🔧 Initializing DeepSeek Service...');
    
    if (process.env.DEEPSEEK_API_KEY?.length > 10) {
      console.log(process.env.DEEPSEEK_API_KEY)
      this.apiKey = process.env.DEEPSEEK_API_KEY;
      this.apiUrl = 'https://api.deepseek.com/v1/chat/completions';
      this.useRealAPI = true;
      console.log('✅ Mode API DeepSeek activé');
    } else {
      console.log('⚠️ Mode simulation activé');
      this.useRealAPI = false;
    }
  }

  async parseNLCommand(naturalLanguageCommand) {
    console.log(`📝 Commande reçue: ${naturalLanguageCommand}`);
    
    if (!this.useRealAPI) {
      console.log('⚠️ Using fallback (no API key)');
      return this.fallback(naturalLanguageCommand);
    }

    const commandInput = Array.isArray(naturalLanguageCommand)
    ? naturalLanguageCommand.join(" ")
    : naturalLanguageCommand ?? "";
  
  const cleanedCommand = commandInput
    .toString()
    .replace(/nthelement/gi, "nthElement")
    .trim();
    
    console.log(`🧹 Cleaned command: ${cleanedCommand}`);

    const systemPrompt = `You are a web design assistant that converts natural language commands into precise JSON operations.

IMPORTANT: Return ONLY valid JSON with this exact structure:
{
  "operations": [
    {
      "selector": "css-selector (e.g., 'div','p' '.class', '#id')",
      "element": "element-name (optional)",
      "limitFirst": number (optional),
      "nthElement": number (optional if not provided),
      "style": "css-properties",
      "widget": "user-friendly widget name",
      "newtext": "text content (optional)"
      "createflex":"true" (optional),
      "selectors":[{ element: "img", nthElement: 0 },{ element: "img", nthElement: 1 }](optional),
      "id":"resize_1741365532133"(mandatory if provided)
    }
  ]
}

CRITICAL RULES:
1. When command has "selector:div,nthElement:3" → use selector:"div" and nthElement:3
2. Always extract the selector from the command
3. For positioning: use "position: relative" or "position: absolute" but most of the time absolute to ensure the change with appropriate top/left values and should always have a unit(px,s,%,etc...)
4. When it is color ,just put one style describing the color
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
5.

RESPONSE EXAMPLE FOR YOUR COMMAND:
{
  "operations": [
    {
      "element": "body" in case selector was not given
      "selectors":if instruction is has to do with the display,alignement of many elements [{ element: "img", position: 0 },{ element: "img", position: 1 }]
      "selector": "div",
      "nthElement": 3,
      "style": "position: absolute; top: 0px",
      "widget": "Move element to top",
      "id":"resize_1741365532133"(mandatory if provided)
    }
  ]
}
6.never return with out putting the unit even if it 0 example:instead of top: 0,return more top:0px
OTHER EXAMPLES:
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
Command: "selector:img,"nthElement": 1,current style:{width:50%},reduce this image resize_1741365532123"
Response: {"operations": [{"selector": "img","nthElement": 1, "style":"height: auto,width: 25%", "widget": "reduce image","id":"resize_1741365532123"}]}
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
  "widget": "Push button from Top",
  
}]}
Command: "selector:div,nthelement:1,current style:{ "color": "rgb(68, 68, 68)", "background-color": "rgb(204, 204, 204)", "font-size": "14px", "font-family": "Arial, sans-serif", "font-weight": "400" },selector:div,nthelement:6,current style:{ "color": "rgb(68, 68, 68)", "background-color": "rgb(204, 204, 204)", "font-size": "14px", "font-family": "Arial, sans-serif", "font-weight": "400", },give them size 300px",resize_1741365532123
Response: {
  "operations": [
    {
      "selector": "div",
      "nthElement": 1,
      "id": "resize_1741365532123",
      "style": "width: 300px",
      "widget": "Resize selected elements"
    },
    {
      "selector": "div",
      "nthElement": 6,
      "id": "resize_1741365532123",
      "style": "height: auto; width: 300px",
      "widget": "Resize selected elements"
    }
  ]
}
command:"selector:img,nthelement:1,current style:{"color":"rgb(68, 68, 68)","background-color":"rgba(0, 0, 0, 0)","font-size":"14px","font-family":"Arial, sans-serif","font-weight":"400"},selector:img,nthelement:2,current style:{"color":"rgb(68, 68, 68)","background-color":"rgb(204, 204, 204)","font-size":"14px","font-family":"Arial, sans-serif"},selector:img,nthelement:4,current style:{"color":"rgb(68, 68, 68)","background-color":"rgb(204, 204, 204)","font-size":"14px","font-family":"Arial, sans-serif","font-weight":"400"},selector:p,nthelement:3,current style:{"color":"rgb(0, 0, 0)","background-color":"rgba(0, 0, 0, 0)","font-size":"16px","font-family":"Arial, sans-serif","font-weight":"400"},put them on the same line",resize_1741365532123
Response:{"operations": [{
  "selectors": [
    { element: "img", nthElement:1 },
    { element: "img", nthElement:2 },
    { element: "img", nthElement:4 },
    { element: "p", nthelEment:3 }
  ],
  "selector":"div",
  "style":"display: flex; gap: 3px;align-items: flex-start",
  "createflex":"true" ,
  "widget": "add space between images",
  "id":"resize_1741365532123"
}]}

Command: "put the first 2 images on the same line "
Response: {"operations": [{

  "selector": "img",
  "style":"display: flex; gap: 3px;align-items: flex-start",
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
Command: "selector:p,nthelemnt:1,style:{font-size:10px},increase the size of the text "resize_1741365532123
Response: {"operations": [ {
  "selector": "p",
  "nthElement": 1,
  "style": "font-size: 20px",
  "widget": "increase text",
  "id":"resize_1741365532123"
}]}

Command: "selector:h1,nthElement:3,change this text into welcome to my page" 
Response: {"operations": [ { 
  "selector": "h2",
  "nthElement": 3, 
  "newtext": "welcome to my page",
  "style":"none:none".
  "widget": "none"
}]}
Current command to process: "${cleanedCommand}"

Return ONLY the JSON object, no explanations.`;

    try {
      console.log('🔄 Calling DeepSeek API...');
      
      const requestData = {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a JSON generator. Return ONLY valid JSON with no additional text.'
          },
          {
            role: 'user',
            content: systemPrompt
          }
        ],
        temperature: 0.1,
        max_tokens: 500,
        response_format: { type: "json_object" }
      };

      console.log('📤 Sending request to DeepSeek...');
      
      const response = await axios.post(
        this.apiUrl,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      console.log('✅ API Response status:', response.status);
      
      if (!response.data.choices || !response.data.choices[0]) {
        throw new Error('Invalid response structure from API');
      }
      
      const content = response.data.choices[0].message.content;
      console.log('📄 Raw API response content:', content);
      
      // Try multiple cleanup strategies
      let cleanText = content.trim();
      
      // Remove markdown code blocks
      cleanText = cleanText.replace(/```json\s*/g, '');
      cleanText = cleanText.replace(/```\s*/g, '');
      cleanText = cleanText.trim();
      
      console.log('🧹 Cleaned text for parsing:', cleanText);
      
      // Try to parse
      let parsed;
      try {
        parsed = JSON.parse(cleanText);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError.message);
        
        // Try to extract JSON from text
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          console.log('🔄 Attempting to extract JSON from text...');
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch (extractError) {
            console.error('❌ Failed to extract JSON');
            throw parseError;
          }
        } else {
          throw parseError;
        }
      }
      
      console.log('✅ Successfully parsed response:', JSON.stringify(parsed, null, 2));
      
      // Validate structure
      if (!parsed.operations || !Array.isArray(parsed.operations)) {
        console.error('❌ Invalid response structure: missing operations array');
        throw new Error('Invalid response structure');
      }
      
      return parsed;

    } catch (err) {
      console.error('❌ DeepSeek API error:');
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      
      if (err.response) {
        console.error('Response status:', err.response.status);
        if (err.response.data) {
          console.error('Response data:', JSON.stringify(err.response.data, null, 2));
        }
      } else if (err.code === 'ECONNABORTED') {
        console.error('❌ Request timeout');
      } else if (err.code === 'ENOTFOUND') {
        console.error('❌ Network error: Cannot resolve API host');
      }
      
      console.log('🔄 Using fallback with enhanced parsing...');
      return this.enhancedFallback(cleanedCommand);
    }
  }

  enhancedFallback(command) {
    console.log('🔧 Enhanced fallback for:', command);
    
    // Parse command patterns
    let selector = 'div';
    let nthElement = null;
    let style = '';
    let widget = 'Default adjustment';
    
    // Extract selector
    const selectorMatch = command.match(/selector:(\w+)/i);
    if (selectorMatch) {
      selector = selectorMatch[1];
    }
    
    // Extract nthElement (handle both spellings)
    const nthMatch = command.match(/nthElement[:\s]*(\d+)/i) || command.match(/nthelement[:\s]*(\d+)/i);
    if (nthMatch) {
      nthElement = parseInt(nthMatch[1], 10);
    }
    
    // Determine action based on keywords
    if (command.includes('push it on top') || command.includes('push on top')) {
      style = 'position: relative; top: 0; z-index: 10';
      widget = 'Push element to top';
    } else if (command.includes('push') && command.includes('top')) {
      style = 'position: relative; top: 0';
      widget = 'Move element upward';
    } else if (command.includes('center')) {
      style = 'text-align: center; margin: 0 auto';
      widget = 'Center element';
    } else if (command.includes('bigger') || command.includes('larger')) {
      style = 'transform: scale(1.2); padding: 15px';
      widget = 'Enlarge element';
    } else if (command.includes('smaller')) {
      style = 'transform: scale(0.8); padding: 8px';
      widget = 'Reduce element size';
    } else {
      style = 'background-color: #f8f9fa';
      widget = 'Default style applied';
    }
    
    const operation = {
      selector: selector,
      style: style,
      widget: widget
    };
    
    if (nthElement) {
      operation.nthElement = nthElement;
    }
    
    // Check for limitFirst pattern
    if (command.includes('first')) {
      const firstMatch = command.match(/first\s+(\d+)/);
      if (firstMatch) {
        operation.limitFirst = parseInt(firstMatch[1], 10);
      } else {
        operation.limitFirst = 1;
      }
    }
    
    console.log('🔧 Generated fallback operation:', operation);
    
    return {
      operations: [operation]
    };
  }

  fallback(command) {
    console.log('🔧 Basic fallback for:', command);
    return {
      operations: [
        { selector: "body", style: "background-color:#f8f9fa", widget: "Default style applied" }
      ]
    };
  }
}

export default new DeepSeekService();
