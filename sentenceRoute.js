//routes/sentenceRoute.js
const express = require('express');
const router = express.Router();
const Sentence = require('../models/Sentence');

// 모든 문장 조회
router.get('/', async (req, res) => {
  try {
    const sentences = await Sentence.find().sort({ createdAt: -1 });
    res.json(sentences);
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

// 문장 추가
router.post('/', async (req, res) => {
  const { text } = req.body;
  try {
    const newSentence = new Sentence({ text });
    const saved = await newSentence.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: '저장 실패' });
  }
});

module.exports = router;
