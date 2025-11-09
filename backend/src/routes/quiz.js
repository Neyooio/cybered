import express from 'express';
import QuizQuestion from '../models/QuizQuestion.js';
import Monster from '../models/Monster.js';

const router = express.Router();

// @route   GET /api/quiz/battle/start/:module/:lessonNumber
// @desc    Start a quiz battle - get questions and monster
// @access  Public
router.get('/battle/start/:module/:lessonNumber', async (req, res) => {
  try {
    const { module, lessonNumber } = req.params;
    
    // Get 10 random questions
    const questions = await QuizQuestion.getRandomQuestions(module, parseInt(lessonNumber), 10);
    
    // Get random monster for this module
    const monster = await Monster.getRandomMonster(module);
    
    if (!monster) {
      return res.status(404).json({ message: 'No monsters found for this module' });
    }
    
    // Shuffle choices for each question
    const shuffledQuestions = questions.map(q => ({
      ...q,
      choices: q.choices.sort(() => Math.random() - 0.5)
    }));
    
    res.json({
      questions: shuffledQuestions,
      monster: {
        name: monster.name,
        spriteUrl: monster.spriteUrl,
        audioUrl: monster.audioUrl,
        maxHealth: monster.maxHealth,
        level: monster.level,
        type: monster.type
      },
      totalQuestions: 10
    });
  } catch (error) {
    console.error('Error starting quiz battle:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/quiz/battle/answer
// @desc    Submit an answer and get damage calculation
// @access  Public
router.post('/battle/answer', async (req, res) => {
  try {
    const { questionId, choiceIndex, timeToAnswer } = req.body;
    
    const question = await QuizQuestion.findById(questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    const selectedChoice = question.choices[choiceIndex];
    const isCorrect = selectedChoice.isCorrect;
    
    // Simple damage: 1 HP per answer
    let damage = 0;
    let playerDamage = 0;
    
    if (isCorrect) {
      // 1 damage per correct answer (10 questions = 10 HP monster)
      damage = 1;
    } else {
      // Player takes 1 damage for wrong answer
      playerDamage = 1;
    }
    
    res.json({
      isCorrect,
      damage,
      playerDamage,
      explanation: question.explanation,
      correctAnswer: question.choices.findIndex(c => c.isCorrect)
    });
  } catch (error) {
    console.error('Error processing answer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/quiz/monsters/:module
// @desc    Get all monsters for a module
// @access  Public
router.get('/monsters/:module', async (req, res) => {
  try {
    const monsters = await Monster.find({ module: req.params.module });
    res.json(monsters);
  } catch (error) {
    console.error('Error fetching monsters:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
