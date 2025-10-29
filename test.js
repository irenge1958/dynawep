require('dotenv').config();
const deepseekService = require('./deepseekService');

async function testDeepSeek() {
  console.log('🧪 Testing DeepSeek Service...\n');
  
  const testCommands = [
    "make the header blue",
    "center the main button", 
    "increase font size of paragraphs",
    "add margin around images"
  ];

  for (const command of testCommands) {
    try {
      console.log(`📝 Testing: "${command}"`);
      
      const result = await deepseekService.parseNLCommand(command);
      
      console.log('✅ Success! Response:');
      console.log(JSON.stringify(result, null, 2));
      console.log('---\n');
      
    } catch (error) {
      console.log('❌ Error:', error.message);
      console.log('---\n');
    }
    
    // Attendre 1 seconde entre les tests pour éviter les rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

testDeepSeek();