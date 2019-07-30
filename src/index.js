const express =require('express')
require('./db/mongoose')                                    //it  ensures that this file runs 
const userRouter = require('./routers/user')                   //seperate route pages
const taskRouter = require('./routers/task')

const app=express()
const port = process.env.PORT || 3000                       //for heroku

// app.use( (req,res, next) =>{                        //With middleware:  new request --> do something --> run route handler
//     if( req.method=='GET' ){
//         res.send('GET Request are disabled')
//     }else{
//         next()
//     }
// } )


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, ()=>{
    console.log('Server is n port '+port)
})