const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');


//Collection Schema
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Please enter a email'],
        unique:true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password:{
        type: String,
        required: [true, 'Please enter a password'],
        minLength: [6, 'Minimum password length is 6 characters']
    },
    role:{
        type:String,
        enum: ['user','admin'],
        default:'user'
    }
})

//fire a function after doc is saved
userSchema.post('save', (doc,next) =>{
    console.log('new user was created & saved',doc);
    next();
})

//fire a funbction before doc saved to db
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//Static methode to login user
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const User = mongoose.model('user', userSchema);
module.exports = User;
