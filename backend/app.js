import express from 'express';
import cors from 'cors';
import pool from './dbconnect.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const app = express();
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
// console.log(import.meta);
console.log(__filename);
const __dirname = path.dirname(__filename);
console.log(__dirname);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'public', 'home.html'));

});

app.get('/api/home', (req, res) => {
    res.json({
        message: 'Welcome to the home page!'
    });
});

app.post("/api/login", (req, res) => {
    res.json({
        message: 'Welcome to the login page!'
    });
});

app.post("/api/register", (req, res) => {
    res.json({
        message: 'Welcome to the register page!'
    });
});

app.get('/api/report', (req, res) => {
    res.json({
        message: 'Welcome to the report page!'
    });
});

app.post('/api/author', (req, res) => {
    res.json({
        message: 'Welcome to the author page!'
    });
});

app.post('/api/reviewer', (req, res) => {
    res.json({
        message: 'Welcome to the reviewer page!'
    });
});

async function dbconnection() {
    try {
        const client = await pool.connect();
        console.log('Connected to the database');
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
            console.log(`http://localhost: ${process.env.PORT}`);
        });
        client.release();
        let {rows} = await pool.query('select * from movies limit 1');
        console.log(rows);
    } catch (err) {
        console.error('Error connecting to the database', err);
    }
}

dbconnection();

