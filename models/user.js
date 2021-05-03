const mongoose = require('mongoose');
const bcrypt =require('bcryptjs');
//const { checkSchema } = require('express-validator');
//const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    name: { type: String, require: true, trim: true },
    email: { type: String, require: true, trim: true, unique: true,index: true },
    password: {type: String, require: true, trim: true,minlength: 3 },
    role: { type: String,default:'member' }
}, {
    collection: 'users' //ชื่อ collection
});

//แปลงรหัสผ่าน
userSchema.methods.enctyPassword = async function(password){
    const salt = await bcrypt.genSalt(5);
    const hashPassword = await bcrypt.hash(password,salt);
    return hashPassword;
}

//check login
userSchema.methods.checkPassword = async function(password){
    const isValid = await bcrypt.compare(password,this.password);
    return isValid;

}

const user = mongoose.model('User', userSchema);
module.exports = user