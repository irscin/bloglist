const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/posts')
//Wrapping app in superagent object
const api = supertest(app)
//Setting timeout because of remote connection to DB
jest.setTimeout(30000);
const initialBlogs = [
    {
        title: 'First post',
        author: 'Italo Soares',
        url: 'jfiefeij.com',
        likes: 5
    },
    {
        title: 'Second post',
        author: 'Walquiria',
        url: 'iefwi.com',
        likes: 3
    }
]

beforeEach(async ()=>{
    await Blog.deleteMany({})

    let blog = new Blog(initialBlogs[0])
    await blog.save()

    blog = new Blog(initialBlogs[1])
    await blog.save()
})
test('all blogs are being returned', async ()=>{
    const response = await api.get('/api/blogs/')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('specific blog post in on the DB', async ()=>{
    const response = await api.get('/api/blogs')
    const contents = response.body.map(e=>e.title)
    expect(contents).toContain('Second post')
})

test('can add new blog post', async ()=>{
    const newBlogPost = {
        title: 'Third post',
        author: 'Alguém',
        url: 'fweuib.com',
        likes: 3
    }
    await api.post('/api/blogs').send(newBlogPost).expect(201).expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(e=>e.title)
    expect(response.body).toHaveLength(initialBlogs.length+1)
    expect(contents).toContain('Third post')
})

test('can get specific post by id', async ()=>{
    const postsFromDB = await Blog.find({})
    const postToGet = postsFromDB[0].id
    const resultPost = await api.get(`/api/blogs/${postToGet}`).expect(200).expect('Content-Type', /application\/json/)
    expect(resultPost.body).toEqual(JSON.parse(JSON.stringify(postsFromDB[0])))
})

test('can delete post by id', async ()=>{
    const postsFromDBAtStart = await Blog.find({})
    await api.delete(`/api/blogs/${postsFromDBAtStart[0].id}`).expect(204)
    const postsFromDBAtEnd = await Blog.find({})
    expect(postsFromDBAtEnd).toHaveLength(postsFromDBAtStart.length-1)
    const content = postsFromDBAtEnd.map(e=>e.title)
    expect(content).not.toContain(postsFromDBAtStart[0].title)
})

test('toJSON method', async ()=>{
    const responseFromDB = await api.get('/api/blogs')
    const allPostsFromAPI = responseFromDB.body
    const allPostsFromDB = await Blog.find({})
    expect(allPostsFromAPI[0]).toEqual(JSON.parse(JSON.stringify(allPostsFromDB[0])))
})

test('missing likes defaults to zero', async ()=>{
    const newBlogPost = {
        title: 'Third post',
        author: 'Alguém',
        url: 'fweuib.com'
    }
    const result = await api.post('/api/blogs').send(newBlogPost).expect(201).expect('Content-Type', /application\/json/)
    expect(result.body.likes).toBe(0)
})

test('missing title or url return bad request', async ()=>{
    let newBlogPost = {
        title: 'Third post',
        author: 'Alguém',
        likes: 3
    }
    await api.post('/api/blogs').send(newBlogPost).expect(400)
    newBlogPost = {
        author: 'Alguém',
        url: 'fweuib.com',
        likes: 3
    }
    await api.post('/api/blogs').send(newBlogPost).expect(400)
})

test('updating content of a specific post', async()=>{
    const allPostsFromAPI = await api.get('/api/blogs')
    const newBlogPost = {
        title: 'Modified post',
        author: 'Alguém',
        url: 'fweuib.com'
    }
    const result = await api.put(`/api/blogs/${allPostsFromAPI.body[0].id}`).send(newBlogPost).expect(200)
    const searchNote = await api.get(`/api/blogs/${result.body.id}`)
    expect(searchNote.body).toEqual(result.body)
})

afterAll(()=>{
    mongoose.connection.close()
})