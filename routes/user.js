const express = require('express');
const {body} = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const passportJWT = require('../middleware/passportJWT');


/* GET users listing. */
/*  http://localhost:3000/user/register/ */
router.post('/register',
[ 
body('name').not().isEmpty().withMessage('กรุณาป้อนชื่อสกุลด้วย'),
body('email').not().isEmpty().withMessage('กรุณาป้อนอีเมล์').isEmail().withMessage('อีเมล์ไม่ถูกต้อง'),
body('password').not().isEmpty().withMessage('กรุณาป้อนรหัสผ่าน').isLength({min: 3 }).withMessage('รหัสผ่านไม่น้อยกว่า 3')
],userController.register);

/*  http://localhost:3000/user/ */
router.get('/', userController.index);

/*  http://localhost:3000/user/profile */
router.get('/profile',[passportJWT.isLogin], userController.profile);

/*  http://localhost:3000/user/login */
router.post('/login', userController.login);

module.exports = router;