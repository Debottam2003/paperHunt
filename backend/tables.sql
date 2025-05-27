-- Active: 1747339302833@@127.0.0.1@3000@Search

-- 1. authors

--     Attributes:
--     id, email, password, firstname, lastname

--     Primary Key:
--     email

-- 2. reviewers

--     Attributes:
--     id, email, password, firstname, lastname, phonenumber, affiliation

--     Primary Key:
--     email

-- 3. interest

--     Attributes:
--     reviewer_email, topic

--     Foreign Key:
--     reviewer_email → reviewers(email)
--     (with ON DELETE CASCADE ON UPDATE CASCADE)

-- 4. papers

--     Attributes:
--     paper_id, contact_author, name, title, abstract, filename

--     Primary Key:
--     paper_id

--     Foreign Key:
--     contact_author → authors(email)
--     (with ON DELETE CASCADE ON UPDATE CASCADE)

-- 5. rattings

--     Attributes:
--     ratting_id, reviewer_email, paper_id, technical_merit, readibility, originality, relevance

--     Primary Key:
--     ratting_id

--     Foreign Keys:

--         reviewer_email → reviewers(email)

--         paper_id → papers(paper_id)
--         (Both with ON DELETE CASCADE ON UPDATE CASCADE)

-- 6. reviews

--     Attributes:
--     reviewer_email, paper_id, ratting_id, feedback, comment

--     Foreign Keys:

--         reviewer_email → reviewers(email)

--         paper_id → papers(paper_id)

--         ratting_id → rattings(ratting_id)
--         (All with ON DELETE CASCADE ON UPDATE CASCADE)

-- 7. papers_assigned

--     Attributes:
--     reviewer_email, paper_id

--     Foreign Keys:

--         reviewer_email → reviewers(email)

--         paper_id → papers(paper_id)
--         (Both with ON DELETE CASCADE ON UPDATE CASCADE)

-- 8. papers_authors

--     Attributes:
--     paper_id, author_email

--     Foreign Keys:

--         author_email → authors(email)

--         paper_id → papers(paper_id)
--         (Both with ON DELETE CASCADE ON UPDATE CASCADE)

-- 9. admins
--    id, email, password, firstname, lastname

--Table Creation--

create table admins (
    id serial,
    email varchar(50) PRIMARY KEY,
    password varchar(30) not null,
    firstname varchar(30),
    lastname varchar(30)
);

create table authors (
    id serial,
    email varchar(50) PRIMARY KEY,
    password varchar(30) not null,
    firstname varchar(30),
    lastname varchar(30)
);

create table reviewers (
    id serial,
    email varchar(50) PRIMARY KEY,
    password varchar(30) not null,
    firstname varchar(30),
    lastname varchar(30),
    phonenumber BIGINT,
    affiliation varchar(50)
);

create table interest (
    reviewer_email varchar(50),
    topic text,
    Foreign Key (reviewer_email) REFERENCES reviewers (email) ON DELETE CASCADE on update cascade
);

create table reviews (
    reviewer_email varchar(50) REFERENCES reviewers (email) ON DELETE CASCADE on update cascade,
    paper_id int REFERENCES papers (paper_id) ON DELETE CASCADE on update cascade,
    ratting_id int REFERENCES rattings (ratting_id) ON DELETE CASCADE on update cascade,
    feedback text,
    comment text
);

create table rattings (
    ratting_id serial PRIMARY KEY,
    reviewer_email varchar(50),
    paper_id int,
    technical_merit decimal,
    readibility decimal,
    originality decimal,
    relevance decimal,
    Foreign Key (reviewer_email) REFERENCES reviewers (email) ON DELETE CASCADE on update cascade,
    Foreign Key (paper_id) REFERENCES papers (paper_id) ON DELETE CASCADE on update cascade
);

create table papers (
    paper_id serial PRIMARY KEY,
    contact_author varchar(50),
    name varchar(30),
    title varchar(50),
    abstract text,
    filename varchar(50),
    Foreign Key (contact_author) REFERENCES authors (email) ON DELETE CASCADE on update cascade
);

create table papers_authors (
    author_email varchar(50),
    paper_id int,
    Foreign Key (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE on update cascade
);

create table papers_assigned (
    reviewer_email varchar(50),
    paper_id int,
    PRIMARY KEY (reviewer_email, paper_id),
    Foreign Key (reviewer_email) REFERENCES reviewers(email) ON DELETE CASCADE on update cascade,
    Foreign Key (paper_id) REFERENCES papers(paper_id) ON DELETE CASCADE on update cascade
);

--Data insertion in tables--

insert into admins 
(email, password, firstname, lastname)
values 
('debottamkar2003@gmail.com','okudera2003','Rupan','Kar');

insert into authors 
(email,password,firstname,lastname)
values 
('author1@gmail.com','abcd123','debottam','kar'),
('author2@gmail.com','goutam','soma','kar'),
('author3@gmail.com','debangsu1998','sritama','karsaha'),
('author4@gmail.com','soma','goutam','kar');

INSERT INTO reviewers (email, password, firstname, lastname, phonenumber, affiliation)
VALUES
('alice.smith@example.com', 'alice123', 'Alice', 'Smith', 1234567890, 'Stanford University'),
('john.doe@example.com', 'johnpwd456', 'John', 'Doe', 9876543210, 'Google'),
('maria.lee@example.com', 'maria789', 'Maria', 'Lee', 5551234567, 'MIT Media Lab'),
('rahul.kumar@example.com', 'rahulpass', 'Rahul', 'Kumar', 9988776655, 'IIT Delhi'),
('emily.jones@example.com', 'emily@321', 'Emily', 'Jones', 1122334455, 'Independent'),
('mark.taylor@example.com', 'markpass1', 'Mark', 'Taylor', 1010101010, 'Independent'),
('sara.connor@example.com', 'sara7890', 'Sara', 'Connor', 2020202020, 'Independent'),
('david.lee@example.com', 'davidlee99', 'David', 'Lee', 3030303030, 'Independent'),
('nina.brown@example.com', 'nina1234', 'Nina', 'Brown', 4040404040, 'Independent'),
('jake.white@example.com', 'jakepw22', 'Jake', 'White', 5050505050, 'Independent');

insert into interest(reviewer_email, topic) 
values
('alice.smith@example.com', 'arts'),
('john.doe@example.com', 'cs'),
('john.doe@example.com', 'math'),
('rahul.kumar@example.com', 'math'),
('nina.brown@example.com', 'philosophy'),
('jake.white@example.com', 'physics');

INSERT INTO papers (contact_author, name, title, abstract, filename) VALUES
('author1@gmail.com', 'golang', 'the complete golang', 'An extensive guide to Go programming language fundamentals and advanced concepts.', 'golang.txt'),
('author1@gmail.com', 'go routines', 'concurrency in Go', 'A detailed explanation of concurrency patterns using goroutines in Go.', 'goroutines.txt'),
('author2@gmail.com', 'desh bhag', 'war of 1947', 'An analysis of the socio-political impact of the 1947 war.', 'war1947.txt'),
('author2@gmail.com', 'freedom fighters', 'struggles of independence', 'Biographies and stories of key freedom fighters during the independence movement.', 'freedom.txt'),
('author3@gmail.com', 'machine learning', 'ML basics', 'Introduction to machine learning concepts, algorithms, and applications.', 'ml.txt'),
('author4@gmail.com', 'blockchain', 'intro to blockchain', 'An overview of blockchain technology and its potential applications.', 'blockchain.txt'),
('author4@gmail.com', 'smart contracts', 'ethereum explained', 'Explaining smart contracts on the Ethereum platform with real-world examples.', 'smartcontracts.txt');

insert into papers_authors(paper_id, author_email) 
values
(1, 'deb123@gmail.com'),
(1, 'sri@gmail.com'),
(2, 'author5@gmail.com');

insert into papers_assigned(reviewer_email, paper_id)
values
('alice.smith@example.com', 1),
('john.doe@example.com', 2),
('rahul.kumar@example.com', 3),
('nina.brown@example.com', 4),
('jake.white@example.com', 1);

insert into papers_assigned(reviewer_email, paper_id)
values
('alice.smith@example.com', 3);

insert into rattings(reviewer_email, paper_id, technical_merit, readability, originality, relevance)
VALUES
('alice.smith@example.com', 1, 3.5, 4.2, 4, 4),
('john.doe@example.com', 2, 3, 4, 3, 4),
('rahul.kumar@example.com', 3, 4, 4, 4, 4),
('nina.brown@example.com', 4, 4.3, 3.9, 4.1, 3.5);

insert into reviews(reviewer_email, paper_id, ratting_id, feedback, comment)
VALUES
('alice.smith@example.com', 1, 1, 'very nice paper', 'good job'),
('john.doe@example.com', 2, 2, 'nice paper', 'could be better'),
('rahul.kumar@example.com', 3, 3, 'awesome writing and concepts', 'great job'),
('nina.brown@example.com', 4, 4, 'so lively writing', 'want more papers like this one');

--Select queries for testing--
-- Review report of the current papers that are given for reviewing
select 
reviews.reviewer_email as reviewer, 
reviews.paper_id as paper_id,
reviews.feedback as feedback, 
reviews.comment as comment, 
rattings.ratting_id as ratting_id,
rattings.technical_merit as technical_mertit, 
rattings.readability as readability,
rattings.originality as originality, 
rattings.relevance as relevance
from reviews INNER JOIN rattings 
on reviews.ratting_id = rattings.ratting_id;

-- All the rettings of the paper_id 4
select * from rattings where paper_id = 4;

-- All data about the contact author of the 
select firstname, lastname 
from authors 
where email = (
    select contact_author 
    from papers 
    where paper_id = 4
    );

-- Interest in topic of the paper_id 4's reviewer
select * 
from interest 
where reviewer_email in 
(select reviewer_email 
from reviews 
where paper_id = 4
);

-- Reviewers who have the paper_id 4 for reviewing
select * from papers_assigned where paper_id = 4;

-- All admins
select * from admins;

-- All the papers that are gievn to the reviewers
select * from papers_assigned;

-- Such reviewers who haven't get any papers for reviewing 
select * 
from reviewers 
where email not in(
    select reviewer_email 
    from papers_assigned
);

-- Such Authors who have not submit any papers
select * 
from authors 
where email not in (
    select contact_author 
    from papers
);

-- Such reviewers who have not given any reviews but have papers assigened
select email 
from reviewers
where email not in (
    select reviewer_email
    from reviews
) 
except
(select email
from reviewers 
where email not in(
    select reviewer_email 
    from papers_assigned
));

-- Total ratting of the papers
select paper_id, (technical_merit + readability + originality + relevance) as Total_Ratting
from rattings ORDER BY Total_Ratting;

-- Total no of authors registered in paperHunt
select count(email) as Total_no_of_authors from authors;

-- Total no of reviewers registered in paperHunt    
select count(email) as Total_no_of_reviewers from reviewers;

-- Total no of papers submitted in paperHunt
select count(paper_id) as Total_no_of_papers from papers;

-- Total no of papers assigned to reviewers
select count(paper_id) as Total_no_of_papers_assigned from papers_assigned;


