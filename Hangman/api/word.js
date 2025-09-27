const fs = require('fs');
const path = require('path');

function getWordsFromFile() {
    const filePath = path.join(__dirname, 'assets.json');
    if (!fs.existsSync(filePath)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

module.exports = (req, res) => {
    if (req.method === 'GET') {
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
    } else {
        res.statusCode = 405;
        res.setHeader('Allow', 'GET');
        res.end('Method Not Allowed');
    }
};
