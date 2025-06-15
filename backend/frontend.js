import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 4000;

const __filename = fileURLToPath(import.meta.url);
// console.log(import.meta);
console.log(__filename);
const __dirname = path.dirname(__filename);
console.log(__dirname);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/choose', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'enter.html'));
});

app.get('/authorLogin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'authorLogin.html'));
});

app.get('/authorRegister', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'authorRegister.html'));
});

app.get('/authorDashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'authorDashboard.html'));
});

app.get('/reviewerLogin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reviewerLogin.html'));
});

app.get('/reviewerRegister', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reviewerRegister.html'));
});

app.get('/reviewerDashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'reviewerDashboard.html'));
});

app.get('/papers', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'papers.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});