import express from 'express';
import cors from 'cors';
import pool from './dbconnect.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
            console.log('Server is running on port 5000');
            console.log('http://localhost:5000');
        });
        client.release();
        let {rows} = await pool.query('select * from movies limit 1');
        console.log(rows);
    } catch (err) {
        console.error('Error connecting to the database', err);
    }
}

dbconnection();

