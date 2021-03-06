const app = require('../app')
const request = require('supertest')
const tester   = require('./testHarness')

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
// User test
describe('Note', function () {
    beforeEach(function () {
        return tester.clearDB()
            .then(async function () {
                await sleep(800)
            })
            .then(() => {
                tester.createBookAndNote()
                    .then(async function () {
                        await sleep(1500)
                    })
            })
    })

    describe('GET', function () {
        it('lets you get an existing note', function (done) {
            let url = `/api/book/${tester.data.book.id}/note/${tester.data.note.id}`
            request(app)
                .get(url)
                .expect(200)
                .expect('Content-Type', /json/, done)
        })
    })

    describe('POST', function () {
        it('lets you create a note', function (done) {
            let url = `/api/book/${tester.data.book.id}`
            let note = {
                title: tester.data.note.title,
                pg: tester.data.note.pg,
                endPg: tester.data.note.endPg,
                content: tester.data.note.content
            }
            request(app).post(url)
                .type('json')
                .send(note)
                .then(() => {
                    return tester.models.Notes.findByPk(2)
                })
                .then(() => {
                    done()
                })
        })
    })

    describe('DELETE', function () {
        it('lets you remove a note', function (done) {
            this.timeout(5000)
            let url = `/api/book/${tester.data.book.id}/note/${tester.data.note.id}`
            request(app)
                .delete(url)
                .then(async function () {
                    // if you don't sleep the database won't catch up with the test
                    await sleep(2200)
                })
                .then(() => {
                    return tester.models.Notes.findByPk(tester.data.note.id)
                })
                .then(note => {
                    if (note) {
                        done(new Error('failed to delete note'))
                    } else {
                        done()
                    }
                })
                .catch(done)
        })
    })
})
