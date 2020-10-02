const bcrypt = require('bcrypt')
const Author = require('../models/author')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
jest.setTimeout(30000)

describe('basic handling of authors logic', ()=>{
    beforeEach(async ()=>{
        await Author.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const author = new Author({userName: 'root', passwordHash})
        await author.save()
    })

    test('saving new author', async ()=>{
        const initialAuthors = await Author.find({})

        const newAuthor = {
            userName: 'mulan',
            name: 'Hua Mulan',
            password: 'courage'
        }

        await api.post('/api/authors').send(newAuthor).expect(200).expect('Content-Type', /application\/json/)

        const endAuthors = await Author.find({})
        expect(endAuthors).toHaveLength(initialAuthors.length+1)

        const userNames = endAuthors.map(e=>e.userName)
        expect(userNames).toContain(newAuthor.userName)
    })

    test('cant create user with already registered name', async ()=>{
        const authorsInitial = await Author.find({})

        const newAuthor = ({
            userName: 'root',
            password: 'secret'
        })

        const result = await api.post('/api/authors').send(newAuthor).expect(400).expect('Content-Type', /application\/json/)
        expect(result.body).toContain('`username` to be unique')

        const usersEnd = await Author.find({})
        expect(authorsInitial).toHaveLength(usersEnd.length)
    })
})