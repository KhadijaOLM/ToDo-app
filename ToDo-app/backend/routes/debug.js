// routes/debug.js
router.get('/debug/boards', async (req, res) => {
    const boards = await mongoose.connection.db.collection('boards').find({}).toArray();
    res.json({
      count: boards.length,
      boards: boards.map(b => ({
        id: b._id,
        title: b.title,
        userId: b.userId,
        userIdType: typeof b.userId
      }))
    });
  });