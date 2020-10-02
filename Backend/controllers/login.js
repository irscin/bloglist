const loginRouter = require('express').Router()
const Author = require('../models/author')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res)=>{
    const author = await Author.findOne({userName: req.body.userName})
    const validPassword = author === null ? false : await bcrypt.compare(req.body.password, author.passwordHash)

    if(!(author && validPassword)){
        return res.status(401).json({error: 'invalid userName or password'})
    }

    const authorForToken = {
        userName: author.userName,
        id: author._id
    }

    const token = jwt.sign(authorForToken, process.env.SECRET)
    res.status(200).send({token, userName: author.userName, name: author.name})
})

module.exports = loginRouter