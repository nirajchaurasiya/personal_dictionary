const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const uri = process.env.URI;
try {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, mongoose.set('strictQuery', false))
    console.log("Connection successful")

} catch (error) {
    console.log(err);
}
// Create a word schema
const wordSchema = new mongoose.Schema({
    word: String,
    meaning: String
});

// Create a Word model
const Word = mongoose.model('Word', wordSchema);

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Route for adding a word
app.post('/addWord', (req, res) => {
    const { word, meaning } = req.body;

    // Create a new Word document and save it to the database
    const newWord = new Word({ word, meaning });
    newWord.save()
        .then(() => {
            res.json({ success: true });
        })
        .catch(err => {
            console.error('Failed to save word:', err);
            res.status(500).json({ success: false, error: 'Failed to save word' });
        });
});

// Route for retrieving all words
// Route for retrieving all words
app.get('/words', (req, res) => {
    // Fetch all Word documents from the database
    Word.find({})
        .then(words => {
            res.json({ success: true, words }); // Return words as JSON object
        })
        .catch(err => {
            console.error('Failed to fetch words:', err);
            res.status(500).json({ success: false, error: 'Failed to fetch words' });
        });
});

app.get('/search', (req, res) => {
    const term = req.query.term;
    const regex = new RegExp(term, 'i');

    Word.find({ word: regex })
        .then(words => {
            res.json({ success: true, words });
        })
        .catch(err => {
            console.error('Failed to search words:', err);
            res.status(500).json({ success: false, error: 'Failed to search words' });
        });
});


// Route for deleting a word
app.delete('/deleteWord/:id', (req, res) => {
    const wordId = req.params.id;

    // Find the Word document by ID and remove it from the database
    Word.findByIdAndRemove(wordId)
        .then(() => {
            res.json({ success: true });
        })
        .catch(err => {
            console.error('Failed to delete word:', err);
            res.status(500).json({ success: false, error: 'Failed to delete word' });
        });
});

// Route for updating a word's meaning
app.put('/updateWord/:id', (req, res) => {
    const { id } = req.params;
    const { meaning } = req.body;

    // Find the Word document by id and update its meaning
    Word.findByIdAndUpdate(id, { meaning })
        .then(() => {
            res.json({ success: true });
        })
        .catch(err => {
            console.error('Failed to update word:', err);
            res.status(500).json({ success: false, error: 'Failed to update word' });
        });
});


// Serve static files
app.use(express.static('public'));

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
