//server.js
app.post('/api/sentences', async (req, res) => {
  const { text } = req.body;
  try {
    const newSentence = new Sentence({ text });
    const saved = await newSentence.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save sentence' });
  }
});

// DELETE /api/sentences/:id
app.delete('/api/sentences/:id', async (req, res) => {
  try {
    await Sentence.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete sentence' });
  }
});


