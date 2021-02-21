const express = require('express')

// This is the main parent router
const router = express.Router({ mergeParams: true })
const models = require('../models')

// We match all routes in API in order to trigger calls to this router object
const middleware = (_res, _req, next) => next()
router.all('/api/book/', middleware)
router.all('/api/book/:book_id/', middleware)
router.all('/api/book/:book_id/note', middleware)
router.all('/api/book/:book_id/note/:note_id/', middleware)
// Use child routers for individual APIs
router.use('/api', require('./books'))
router.use('/api', require('./notes'))
// router.use('/api', require('./notes'))
router.get('/', function(req, res) {
    res.status(200).send('Books API V2')
})

/*
 * Sets req.book as the book (as a Sequelize DB object)
 * Sets req.book_id as the book id
 */
router.param('book_id', function(req, res, next, id) {
    req.book = models.Book.findByPk(id)
                .then(errorChecker(res, id, 'book'))
    req.book_id = req.book
        .then(function(book) {
            return book.id
        })
    next()
})

/*
 * Sets req.note as the note (as a Sequelize DB object)
 * Sets req.note_id as the note id
 */
router.param('note_id', function(req, res, next, id) {
    req.note = models.Notes.findByPk(id)
                .then(errorChecker(res, id, 'note'))
    req.note_id = req.note
        .then(function(note) {
            return note.id
        })
    next()
})

// Check whether a db object was successfully resolved. If not respond with error
function errorChecker(res, id, type) {
    return (object) => {
        return new Promise((resolve, reject) => {
            if (object) {
                resolve(object)
            } else {
                res.status(500).send(`No ${type} with ID ${id} found.`)
                reject(`NULL object means no ${type} with ID ${id} found.`)
            }
        })
    }
}

module.exports = router