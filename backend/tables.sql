-- Active: 1747339302833@@127.0.0.1@3000@Search
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
    phonenumber int,
    affiliation varchar(50)
);

create table interest (
    email varchar(50),
    topic text,
    Foreign Key (email) REFERENCES reviewers (email) ON DELETE CASCADE on update cascade
);

create table reviews (
    email varchar(50) REFERENCES reviewers (email) ON DELETE CASCADE on update cascade,
    paper_id int REFERENCES papers (paper_id) ON DELETE CASCADE on update cascade,
    ratting_id int REFERENCES rattings (ratting_id) ON DELETE CASCADE on update cascade,
    feedback text,
    comment text
);

create table rattings (
    ratting_id serial PRIMARY KEY,
    email varchar(50),
    technical_merit int,
    readibility int,
    originality int,
    relevance varchar(50),
    Foreign Key (email) REFERENCES reviewers (email) ON DELETE CASCADE on update cascade
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

insert into authors 
(email,password,firstname,lastname)
values 
('author1@gmail.com','abcd123','debottam','kar');