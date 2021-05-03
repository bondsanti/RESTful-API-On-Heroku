const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const passportJWT = require('../middleware/passportJWT');


/*  http://localhost:3000/employee/ */
router.get('/',[passportJWT.isLogin], employeeController.index);

/* get by id */
router.get('/:id', employeeController.show);

/*  http://localhost:3000/employee/ */
router.post('/', employeeController.insert);

/* update */
router.put('/:id', employeeController.update);

/* delete by id */
router.delete('/:id', employeeController.delete);

module.exports = router;