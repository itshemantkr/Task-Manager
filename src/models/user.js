const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task= require('./task')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },email : { 
        type: String,
        required : true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
            throw new Error('Emain is invalid!')

        }
    },password:{ 
        type : String,
        required : true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password'))
            throw new Error('Password can not contain "password')
        }

    },age : {
        type : Number,
        default:0,
        validate(value){
            if(value<0)
            throw new Error('Age must pe Positive')
        }
    },
    tokens :[{
        token :{
            type : String,
            required : true
            }
        }]
})

userSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject =user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user =this

    const token = jwt.sign( {_id : user._id.toString()},'thisismynewcourse' )

    user.tokens = user.tokens.concat({token : token})           //Saving token to DB
    await user.save()

    return token

}

userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email:email})
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password )

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

//Hash the text password before saving
userSchema.pre('save', async function (next) {                      //Middleware custom function to work before save() in DB
    const user = this

    if ( user.isModified('password') ){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

//Delete User tasks when user is deleted

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner : user._id })

    next()
})

const User = mongoose.model('User',userSchema)


module.exports = User