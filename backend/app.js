import express from 'express';
import cors from 'cors';
import pool from './dbconnect.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Load environment variables from .env file
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

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/papers'); // Folder to save files
  },
  filename: (req, file, cb) => {
    console.log(file);
    console.log(req.body);
    cb(null, req.body.contact_author + file.originalname); // filename
  }
});

const upload = multer({storage: storage});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

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

app.post('/api/authorPaperSubmit', upload.single("paper"), async (req, res) => {
    let { title, abstract, contact_author, name } = req.body;
    if (!title || !abstract || !contact_author || !req.file) {
        return res.status(400).json({
            message: 'Please provide all the fields'
        });
    }
    else {
        console.log(req.body);
        try{
            let data = await pool.query('insert into papers(title, abstract, contact_author, filename, name) values($1, $2, $3, $4, $5) returning paper_id', [title, abstract, contact_author, contact_author + req.file.originalname, name]);
            console.log(data.rows[0].paper_id);
            res.json({ message: "Paper submitted successfully" });
        }
        catch(err) {
            console.log(err);
            res.status(500).json({
                message: 'Internal Server Error in Paper Submission!'
            });
        }
    }
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
            return res.status(200).json({
                message: 'No reviews yet!'
            });
        }
        else {
            res.status(200).json({
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

app.get('/api/authorsPapers/:email', async (req, res) => {
    let email = req.params.email;
    if (!email) {
        return res.status(400).json({
            message: 'Please provide email'
        });
    }
    try {
        let data = await pool.query('select * from papers where contact_author = $1', [email]);
        if (data.rows.length === 0) {
            return res.status(201).json({
                message: 'You have not submitted any papers yet!'
            });
        }
        console.log(data.rows);
        res.status(200).json({
            message: data.rows
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error in getting author papers'
        });
    }
});

app.get('/api/reviewersPapers/:email', async (req, res) => {
    let email = req.params.email;
    if (!email) {
        return res.status(400).json({
            message: 'Please provide email'
        });
    }
    try {
        let data = await pool.query('select papers.paper_id as paper_id, papers.title as title, papers.abstract  from papers, papers_assigned where papers.paper_id = papers_assigned.paper_id and reviewer_email = $1', [email]);
        if (data.rows.length === 0) {
            return res.status(201).json({
                message: 'You have not been assigned any papers yet!'
            });
        }
        console.log(data.rows);
        res.status(200).json({
            message: data.rows
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error in getting reviewer papers'
        });
    }
});

app.get('/api/checkuser/:email', async (req, res) => {

});

app.post('/api/assignPaper', express.json(), async (req, res) => {
    let { paper_id, reviewer_email } = req.body;
    if (!paper_id || !reviewer_email) {
        return res.status(400).json({
            message: 'Please provide paper id and reviewer email'
        });
    }
    try {
        
        let check = await pool.query('select * from papers_assigned where paper_id = $1 and reviewer_email = $2', [paper_id, reviewer_email]);
        if (check.rows.length > 0) {
            console.log('Paper already assigned to this reviewer');
            return res.status(400).json({
                message: 'Paper already assigned to this reviewer'  
            });
        }
        let data = await pool.query('insert into papers_assigned(paper_id, reviewer_email) values($1, $2)', [paper_id, reviewer_email]);
        console.log(data);
        res.json({
            message: 'Paper assigned successfully'
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error in assigning paper'
        });
    }
});

app.delete("/api/assignPaperDelete", express.json(), async (req, res) => {
    let { paper_id, reviewer_email } = req.body;
    if (!paper_id || !reviewer_email) {
        return res.status(400).json({
            message: 'Please provide paper id and reviewer email'
        });
    }
    try {
        await pool.query('delete from papers_assigned where paper_id = $1 and reviewer_email = $2', [paper_id, reviewer_email]);
        res.json({
            message: 'Paper assignment deleted successfully'
        });
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({
            message: 'Error in deleting paper assignment'
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

