const fs = require('fs');
const path = require('path');

function getWordsFromFile() {
    const filePath = path.join(__dirname, 'assets.json');
    if (!fs.existsSync(filePath)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function saveWordsToFile(words) {
    fs.writeFileSync(path.join(__dirname, 'assets.json'), JSON.stringify(words, null, 2), 'utf-8');
}

module.exports = (req, res) => {
    if (req.method === 'POST') {
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
        res.statusCode = 405;
        res.setHeader('Allow', 'POST');
        res.end('Method Not Allowed');
    }
};
