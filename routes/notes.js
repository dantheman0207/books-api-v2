const express = require('express')
const router = express.Router({ mergeParams: true }) // to preserve parent router params
const models = require('../models')

/* Get Note info
 */
router.get('/book/:book_id/note/:note_id', function(req,res) {
    req.note
        .then(note => {
            res.send(note)
        })
})

/* Get all Notes
 */
router.get('/book/:book_id/note', function(req,res) {
    console.log('getting notes for book')
    req.book_id
        .then(BookId => {
            const parameters = {
                where: {
                    BookId
                }
            }
            return models.Notes.findAll(parameters)
        })
        .then((notes) => {
            res.send(notes)
        })
})

/* Create a Note
*/
router.post('/book/:book_id/note', function(req, res) {
    req.book_id
        .then(BookId => {
            const note = {
                title:  req.body.title,
                pg:     req.body.pg,
                content:req.body.content,
                endPg:  req.body.endPg,
                BookId
            }
            return models.Notes.create(note)
        })
        .then(note => {
            res.end(`"${note.id}"`)
        })
})

/* Update a Note
 */
router.put('/book/:book_id/note/:note_id', function(req, res) {
    req.note
        .then(note => {
            note.update(req.body)
        })
        .then(() => {
            res.end()
        })
})

/* Destroy a Note
 */
router.delete('/book/:book_id/note/:note_id', function(req, res) {
    req.note
        .then(note => {
            let params = {cascade: true}
            return note.destroy(params)
        })
        .then(() => {
            res.send()
        })
})

module.exports = router
