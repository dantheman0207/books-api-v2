const app      = require('../app')
const request  = require('supertest')
const tester   = require('./testHarness')

// User test
describe('Book', function () {
    beforeEach(function () {
        tester.clearDB()
    })

    describe('GET', function () {
        it('lets you get an existing book', function (done) {
            // extend time to failure
            this.timeout(5000)

            tester.createBook()
                .then(book => {
                    request(app)
                        .get(`/api/book/${book.BookId}`)
                        .expect(200)
                        .expect('Content-Type', /json/, done)
                })
        })
    })

    describe('POST', function () {
        it('lets  you create a book', function (done) {
            const url = '/api/book'
            const name = tester.data.book.name
            const isbn = tester.data.book.isbn
            const lastPg = 1
            request(app)
                .post(url)
                .type('json')
                .send({ name, isbn, lastPg })
                .then(() => {
                    const params = {
                        where: {
                            name: tester.data.book.name
                        }
                    }
                    return tester.models.Book.findAll(params)
                })
                .then(books => {
                    const book = books.pop()
                    if (book) {
                        // check attributes of newly created book
                        if (book.name   !== name)   done(new Error('name not correct'))
                        if (book.isbn   !== isbn)   done(new Error('isbn not correct'))
                        if (book.lastPg !== lastPg) done(new Error('lastPg incorrect'))
                        // else: no problems
                        done()
                    } else {
                        done(new Error('created book not found in db'))
                    }
                })
                .catch(err => {
                    console.error('[tests:Book:POST:creates a book]: failed to create book')
                    console.error(err)
                })
        })
    })

    describe('DELETE', function () {
        it('lets you remove a book', function (done) {
            const url = `/api/book/${tester.data.book.id}`
            tester.createBook()
                .then(() => {
                    return request(app).delete(url)
                })
                .then(() => {
                    return tester.models.Book.findByPk(1)
                })
                .then((book) => {
                    if (book) {
                        done(new Error('failed to delete book'))
                    } else {
                        done()
                    }
                })
        })

        it('lets you remove a book and child notes', function (done) {
            const url = `/api/book/${tester.data.book.id}`
            tester.createBookAndNote()
                .then(() => {
                    return request(app).delete(url)
                })
                .then(({BookId, NoteId}) => {
                    let promises = [
                        tester.models.Book.findByPk(BookId),
                        tester.models.Notes.findByPk(NoteId)
                    ]
                    return Promise.all(promises)
                })
                .then(([book, note]) => {
                    if (book) {
                        done(new Error('failed to delete book'))
                    } else if (note) {
                        done(new Error('failed to delete note'))
                    } else {
                        done()
                    }
                })
        })
    })
})
