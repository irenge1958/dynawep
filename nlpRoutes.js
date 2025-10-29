import express from 'express';
import geminiService from './geminiService.js'; // GeminiService ESM

const router = express.Router();

// Route pour traiter une commande NLP
router.post('/process-command', async (req, res) => {
  try {
    const { command } = req.body;
    if (!command) return res.status(400).json({ success: false, error: 'Donne-moi une commande!' });

    console.log('🎯 Commande reçue:', command);

    const result = await geminiService.parseNLCommand(command);
    console.log('🔹 Operations:', result.operations);

    res.json({
      success: true,
      command,
      operations: result.operations,
      message: 'Commande exécutée avec succès!'
    });
  } catch (err) {
    console.error('💥 Erreur:', err);
    res.status(500).json({ success: false, error: err.message, command: req.body.command });
  }
});

export default router;
