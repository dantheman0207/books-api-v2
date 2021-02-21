const express = require('express')
const router = express.Router({ mergeParams: true }) // to preserve parent router params
const models = require('../models')

// Get all Books
router.get('/book', function (req, res) {
    return models.Book.findAll()
        .then(books => {
            res.send(books)
        })
        .catch(handleError('GET /api/book'))
})

// Get Book info
router.get('/book/:book_id', function (req, res) {
    req.book
        .then(book => {
            res.send(book)
        })
        .catch(handleError('GET /api/book/book_id'))
})

// Create a Book
router.post('/book', function (req, res) {
    models.Book.create(req.body)
        .then(book => {
            res.end(`"${book.id}"`)
        })
        .catch(handleError('POST /api/book'))
})

// Update a Book
router.put('/book/:book_id', function (req, res) {
    req.book
        .then(book => {
            book = Object.assign(book, req.body)
            return book.save()
        })
        .then(() => {
            res.end()
        })
        .catch(handleError('PUT /api/book/book_id'))
})

// Destroy a Book
router.delete('/book/:book_id', function (req, res) {
    req.book
        .then(book => {
            let params = { cascade: true }
            // @TODO: pass params
            return book.destroy()
        })
        .then(() => {
            res.end()
        })
        .catch(handleError('DELETE /api/book/book_id'))
})

const handleError = (msg) => {
    return err => {
        console.error(`${msg}: ${err}`)
        res.status(500).send(`Error: ${msg}`)
    }
}

module.exports = router
