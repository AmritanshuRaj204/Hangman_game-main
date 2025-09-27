const fs = require('fs');
const path = require('path');

function getWordsFromFile() {
    const filePath = path.join(__dirname, 'words.json');
    if (!fs.existsSync(filePath)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function saveWordsToFile(words) {
    fs.writeFileSync(path.join(__dirname, 'words.json'), JSON.stringify(words, null, 2), 'utf-8');
}

module.exports = async (req, res) => {
    if (req.method === 'GET' && req.url === '/api/word') {
        const words = getWordsFromFile();
        if (words.length === 0) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'No words found' }));
            return;
        }
        const randomWord = words[Math.floor(Math.random() * words.length)];
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(randomWord));
    } else if (req.method === 'POST' && req.url === '/api/words') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                const { word, hint, extraHint } = JSON.parse(body);
                if (!word || !hint) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ message: 'Word and hint are required.' }));
                    return;
                }
                const words = getWordsFromFile();
                words.push({ word, hint, extraHint });
                saveWordsToFile(words);
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Word added successfully', word, hint, extraHint }));
            } catch (err) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
            }
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
};
