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

describe("POST /books", async function () {
    test("Creates a new book", async function () {
        const response = await request(app)
            .post(`/books`)
            .send({
                isbn: '1894542',
                amazon_url: "http;//www.books.com",
                author: "test_author",
                language: "English",
                pages: 250,
                publisher: "SomethingClearingHouse",
                title: "The book of the year",
                year: 2020
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.book).toHaveProperty("isbn");
    });

    test("Prevents creating book without required title", async function() {
        const response = await request(app)
            .post(`/books`)
            .send({year: 2000});
        expect(response.statusCode).toBe(400);
    });
});

describe("GET /books", async function() {
    test("Gets a list of 1 book", async function() {
        const response = await request(app)
            .get(`.books`);
        const books = response.body.books
        expect(books).toHaveLengeth(1);
        expect(books[0]).toHaveProperty("isbn");
        expect(books[0]).toHaveProperty("amazon_url");
    });
});

describe("GET /books/:isbn", async function() {
    test("Gets a single book", async function () {
        const response = await request(app)
            .get(`books/${book_isbn}`)
            expect(response.body.book).toHaveProperty("isbn");
            expect(response.body.book.isbn).toBe(book_isbn);
    });
    test("Responds with 404 if can't find book in question", async function() {
        const response = await request(app)
            .get(`/books/999`)
        expect(response.statusCode).toBe(404);
    });
});
