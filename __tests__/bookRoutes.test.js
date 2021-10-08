process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");

//isbn of sample book
let book_isbn;

beforeEach(async () => {
    let result = await db.query(`
        INSER INTO 
        books (isbn, amazon_url, author, language, pages, publisher, title year)
        VALUES(
            '1234321124',
            'http://www.amazon.com',
            'Eragon',
            'Spanish',
            100,
            'A publisher',
            'Test Book',
            2021)
        RETURNING isbn
    `);
    book_isbn = result.rows[0].isbn
});


