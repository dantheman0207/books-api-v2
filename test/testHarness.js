const models = require('../models')

class Tester {
    constructor() {
        this.data = {
            book: { name: 'Zen and the Art of Motorcycle Maintenance', isbn: '9780688002305', id: 1 },
            note: { title: 'Yet another note...', pg: 8, endPg: 12, content: 'This is all the content in this note.', id: 1, BookId: 1 }
        }
        this.models = models
        this.models.sequelize.sync() // set up db
    }
    // Returns a Promise which resolves to a book : Sequelize object
    createBook () {
        return this.models.Book.create(this.data.book)
            .then(book => {
                return { BookId: book.id }
            })
    }

    createBookAndNote () {
        return this.models.Book.create(this.data.book)
            .then(book => {
                return book.id
            })
            .then((BookId) => {
                let foreign_key = { BookId }
                let note = Object.assign(this.data.note, foreign_key)
                return Promise.all([BookId, this.models.Notes.create(note)])
            })
            .then(([BookId, note]) => {
                return {BookId, NoteId : note.id}
            })
    }

    createBooks (amt) {
        return this.duplicateData(amt, this.data)
                    .then(books => {
                        books.forEach(book => {
                            this.createBook(this.model, book)
                        })
                    })
    }

    duplicateData (amt, data) {
        let promises = []
        for (let i = 0; i < amt; i++) {
            const promise = this.increaseIDsBy(i, data)
            promises.push(promise)
        }
        return Promise.all(promises)
    }

    increaseIDsBy (amt, givenData) {
        const data = JSON.parse(JSON.stringify(givenData)) // deep copy object
        const newID = givenData.book.id + amt
        data.book.id = newID
        data.note.id = newID
        data.note.BookId = newID

        return new Promise(resolve => {
            resolve(data)
        })
    }

    clearDB () {
        const params = {restartIdentity: true, cascade: true}
        const promises = [
            this.models.Notes.truncate(params),
            this.models.Book.truncate(params),
        ]
        return Promise.all(promises)
    }
}

const tester = new Tester()
module.exports = tester
