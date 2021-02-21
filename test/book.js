const app      = require('../app')
const request  = require('supertest')
const tester   = require('./testHarness')

// User test
describe('Book', function () {
    describe('GET', function () {

        it('lets you get an existing book', function (done) {
            tester.createBook()
                .then(console.log.apply(this, ['\n\ncreated book:']))
                .then(book => {
                    request(app).get(`/api/book/${book.BookId}`)
                        .expect(200)
                        .expect('Content-Type', /json/, done)
                })
        })
    })

    describe('POST', function () {

        it('creates a book', function (done) {
            let url = '/api/book'
            let name = tester.data.book.name
            let isbn = tester.data.book.isbn
            let lastPg = 1
            request(app).post(url)
                .type('json')
                .send({name, isbn, lastPg})
                .then(() => {
                    const params = {
                        where: {
                            name: this.data.book.name
                        }
                    }
                    return tester.models.Book.find(params)
                })
                .then((book) => {
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
        })
    })

    /*
     */
    describe('DELETE', function () {

        it('successfully removes a book', function (done) {
            const url = `/api/book/${tester.data.book.id}`
            tester.createBook()
                .then(() => {
                    return request(app).delete(url)
                })
                .then(() => {
                    return this.models.Book.findById(1)
                })
                .then((book) => {
                    if (book) {
                        done(new Error('failed to delete book'))
                    } else {
                        done()
                    }
                })
        })

        it('successfully removes a book and child notes', function (done) {
            // extend time to failure
            this.timeout(50000)

            const url = `/api/book/${tester.data.book.id}`
            tester.createBookAndNote()
                .then(() => {
                    return request(app).delete(url)
                })
                .then(({BookId, NoteId}) => {
                    let promises = [
                        this.models.Book.findById(BookId),
                        this.models.Notes.findById(NoteId)
                    ]
                    return Promise.all(promises)
                })
                .then(([book, note]) => {
                    console.log('results: ')
                    console.log(book)
                    console.log(note)
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
