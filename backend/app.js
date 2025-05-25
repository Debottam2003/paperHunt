import express from 'express';
import cors from 'cors';
import pool from './dbconnect.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:4000',
    method: 'GET, POST, PUT, DELETE, PATCH',
}));

const __filename = fileURLToPath(import.meta.url);
// console.log(import.meta);
console.log(__filename);
const __dirname = path.dirname(__filename);
console.log(__dirname);
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.post('/api/authorRegister', express.json(), async (req, res) => {
    const { email, password, firstname, lastname } = req.body;
    if (!email || !password || !firstname || !lastname) {
        return res.status(400).json({
            message: 'Please provide email and password'
        });
    }
    console.log(email, password);
    try {
        let checkEmail = await pool.query('select email from authors where email = $1', [email]);
        if (checkEmail.rows.length > 0) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }
        let data = await pool.query('insert into authors(email, password, firstname, lastname) values($1, $2, $3, $4) returning email', [email, password, firstname, lastname]);
        console.log(data.rows);
        res.json({
            message: 'Welcome to the paperHunt!',
            email: data.rows[0].email
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Error in Author Registration'
        });
    }
});

app.post("/api/reviewerRegister", express.json(), async (req, res) => {
    let { email, password, firstname, lastname, phonenumber, affiliation, interest1, interest2 } = req.body;
    if (!email || !password || !firstname || !lastname || !phonenumber || !affiliation || !interest1 || !interest2) {
        return res.status(400).json({
            message: 'Please provide all the fields'
        });
    }
    try {
        let checkEmail = await pool.query('select email from reviewers where email = $1', [email]);
        if (checkEmail.rows.length > 0) {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }
        let data = await pool.query('insert into reviewers(email, password, firstname, lastname, phonenumber, affiliation) values($1, $2, $3, $4, $5, $6) returning email', [email, password, firstname, lastname, phonenumber, affiliation]);
        console.log(data.rows);
        let interests = [interest1, interest2];
        for (let interest of interests) {
            if (interest) {
                await pool.query('insert into interest(reviewer_email, topic) values($1, $2)', [email, interest]);
            }
        }
        res.json({
            message: 'Welcome to the paperHunt!',
            email: data.rows[0].email
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Error in Reviewer Registration'
        });
    }
});

app.post("/api/authorLogin", express.json(), async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: 'Please provide email and password'
        });
    }
    console.log(email, password);
    try {
        let data = await pool.query("select email, password from authors where email = $1", [email]);
        if (data.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
        else if (data.rows[0].password !== password) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
        else {
            res.json({
                message: 'Welcome back to the paperHunt again!',
                email: data.rows[0].email
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'Error in Author Login'
        });
    }
});

app.post('/api/reviewerLogin', express.json(), async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: 'Please provide email and password'
        });
    }
    console.log(email, password);
    try {
        let data = await pool.query("select email, password from reviewers where email = $1", [email]);
        console.log(data.rows);
        if (data.rows.length === 0) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
        else if (data.rows[0].password !== password) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
        else {
            res.json({
                message: 'Welcome back to the paperHunt again!',
                email: data.rows[0].email
            });
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'Error in Reviewer Login'
        });
    }
});

app.post('/api/authorPaperSubmit', (req, res) => {
    res.json({
        message: 'Welcome to the author page!'
    });
});

app.post('/api/reviewerReviewSubmit', express.json(), async (req, res) => {
    console.log(req.body);
    let { paper_id, reviewer_email, feedback, comment, technical_merit, readability, originality, relevance } = req.body;
    if (!paper_id || !reviewer_email || !feedback || !comment || !technical_merit || !readability || !originality || !relevance) {
        return res.status(400).json({
            message: 'Please provide all the fields'
        });
    }
    try {
        // Insert ratting data into the rattings table
        let rattingData = await pool.query('insert into rattings(paper_id, reviewer_email, technical_merit, readability, originality, relevance) values($1, $2, $3, $4, $5, $6) returning ratting_id', [paper_id, reviewer_email, technical_merit, readability, originality, relevance]);
        console.log(rattingData.rows[0].ratting_id);
        // Insert review data into the reviews table
        let reviewData = await pool.query('insert into reviews(paper_id, reviewer_email, feedback, comment, ratting_id) values($1, $2, $3, $4, $5) returning *', [paper_id, reviewer_email, feedback, comment, rattingData.rows[0].ratting_id]);
        console.log(reviewData.rows);
        res.json({
            message: 'Thank you for your review submission!',
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error in Reviewer Review Submission'
        });
    }
});

app.get('/api/papers', async (req, res) => {
    try {
        let data = await pool.query('select * from papers');
        console.log(data.rows);
        res.json({
            message: data.rows
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error in getting papers'
        });
    }
});

app.get('/api/reviews/:paper_id', async (req, res) => {
    let paper_id = req.params.paper_id;
    if (!paper_id) {
        return res.status(400).json({
            message: 'Please provide paper id'
        });
    }
    try {
        let data = await pool.query(`select 
        reviews.reviewer_email as reviewer, 
        reviews.paper_id as paper_id,
        reviews.feedback as feedback, 
        reviews.comment as comment, 
        rattings.ratting_id as ratting_id,
        rattings.technical_merit as technical_merit, 
        rattings.readability as readability,
        rattings.originality as originality, 
        rattings.relevance as relevance
        from reviews INNER JOIN rattings 
        on reviews.ratting_id = rattings.ratting_id
        where reviews.paper_id = $1`, [paper_id]);
        console.log(data.rows);
        if (data.rows.length === 0) {
            return res.json({
                message: 'No reviews yet!'
            });
        }
        else {
            res.json({
                message: data.rows
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error in getting reviews'
        });
    }
});

app.get('/api/authors/:email', async (req, res) => {
    console.log(req.params.email);
    if(!req.params.email) {
        return res.status(400).json({
            message: 'Please provide email'
        });
    }
    try {
        let data = await pool.query('select firstname, lastname, email from authors where email = $1', [req.params.email]);
        if (data.rows.length === 0) {
            return res.status(404).json({
                message: 'Author not found'
            });
        }
        console.log(data.rows[0]);
        res.json({
            message: data.rows[0]
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Error in getting author details'
        });
    }
});

app.get('/api/reviewers/:email', async (req, res) => {
    console.log(req.params.email);
    if(!req.params.email) {
        return res.status(400).json({
            message: 'Please provide email'
        });
    }
    try {
        let data = await pool.query('select firstname, lastname, email, phonenumber, affiliation from reviewers where email = $1', [req.params.email]);
        if (data.rows.length === 0) {
            return res.status(404).json({
                message: 'Reviewer not found'
            });
        }
        console.log(data.rows[0]);
        res.json({
            message: data.rows[0]
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Error in getting reviewer details'
        });
    }
});

app.get('/api/papers', async (req, res) => {
    try {
        let data = await pool.query('select * from papers');
        console.log(data.rows);
        res.json({
            message: data.rows
    });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'Error in getting papers'
        });
    }
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
        // let { rows } = await pool.query('select * from movies limit 1');
        // console.log(rows);
    } catch (err) {
        console.error('Error connecting to the database', err);
    }
}

dbconnection();

