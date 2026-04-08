// test-api.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testAPI() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  console.log('API Key:', apiKey ? 'Present' : 'Missing');
  console.log('Length:', apiKey?.length);
  
  try {
    const response = await axios.get('https://api.deepseek.com/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    console.log('✅ API works! Available models:', response.data.data.map(m => m.id));
  } catch (err) {
    console.error('❌ API test failed:', err.response?.status, err.response?.data);
  }
}

testAPI();

