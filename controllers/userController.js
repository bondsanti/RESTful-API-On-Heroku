const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../config/index');


//Register
exports.register = async(req, res, next) => {
 try {
    const { name, email, password } = req.body
//Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('ข้อมูลที่รับมาไม่ถูกต้อง');
        error.statusCode = 422;
        error.validation = errors.array();
        throw error;
    }

    const checkEmail = await User.findOne({email : email});
       if(checkEmail){//check email ซ้ำ
          const error = new Error('อีเมล์ซ้ำ มีผู้ใช้งานแล้ว');
          error.statusCode = 400;
          throw error;
       }

   let user = new User();
       user.name = name;
       user.email = email;
       user.password = await user.enctyPassword(password);

   await user.save();
   res.status(201).json({ message: 'บันทึกข้อมูลสำเร็จ' })

 } catch (error) {
    next(error); 
 }
}

//get
exports.index = async(req, res, next) => {
    const user = await User.find().sort({ _id: -1 }); //ASC 1 DESC -1
    res.status(200).json({
        data: user
    });
}

//profile
exports.profile = async(req, res, next) => {
    const {_id, name, email, role} = req.user;


    res.status(200).json({
        data: {
            id: _id,
            name: name,
            email: email,
            role: role
        }
    });
}

//login
exports.login = async(req, res, next) => {
    try {
        const { email, password } = req.body

        //check email ว่ามีในระบบหรือไม่
        const checkLogin = await User.findOne({email : email});
           if(!checkLogin){
              const error = new Error('ไม่พบผู้ใช้งานระบบ');
              error.statusCode = 404;
              throw error;
           }
    
        //ตรวจสอบรหัสผ่านว่าตรงกันหรือไม่
        const isValid = await checkLogin.checkPassword(password);
        if(!isValid){
            const error = new Error('รหัสผ่านไม่ถูกต้อง');
            error.statusCode = 401;
            throw error;  
        }
        //console.log(checkLogin);
        //sent token to frontend
        const token = await jwt.sign({
            id: checkLogin._id,
            role: checkLogin.role
        },config.JSON_TOKEN_SECRET,{expiresIn: '3 days' }); //หากเกิน 3 วัน ให้ทำการ Login ใหม่

        //decode วันหมดอายุ
        const expires_in = jwt.decode(token);

       res.status(200).json({
           access_token: token,
           expires_in: expires_in.exp,
           token_type: 'Bearar',
            message: 'เข้าสู่ระบบสำเร็จ' 
        })
    
     } catch (error) {
        next(error); 
     }
}