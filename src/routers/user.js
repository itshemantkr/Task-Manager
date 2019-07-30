const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.post('/users', async (req,res) => {

    const user = new User(req.body)
    try{
        
        await user.save()                       //Promise
        const token = await user.generateAuthToken()

        res.status(201).send({user,token})              

    }catch (e) {
        res.status(400).send(e)                
    }
})


router.post('/users/login',async (req,res) =>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user : user,token : token })
        
    }catch(e){
        res.status(400).send()
    }
})


router.post('/users/logout', auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !=req.token                      //return true if the token we are currently looking at is not the one which is use for auth
        })
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutall',auth, async(req,res) => {
    try{
        req.user.tokens=[]
        req.user.save()
        res.send()
    }catch(e){
        resw.status(500).send()
    }
})


router.get('/users/me', auth ,async (req,res) => {                    
                                                                    //Auth(middleware) will be executed before async function
    res.send(req.user)
    
})

router.patch('/users/me', auth, async (req,res) =>{
    const updates = Object.keys(req.body)

    try{
        updates.forEach((update)=>{                                     
            req.user[update] = req.body[update]                         
        })                                                              
        await req.user.save()
        res.send(req.user)

    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req,res) => {
    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router