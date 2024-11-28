const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('./'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/index.html`);
    console.log(`Press Ctrl+C to stop the server`);
});

app.get('/*.md', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    process.exit();
});