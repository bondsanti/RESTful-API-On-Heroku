const Employee = require('../models/employee');

//get
exports.index = async(req, res, next) => {
    const employee = await Employee.find().sort({ _id: -1 }); //ASC 1 DESC -1
    res.status(200).json({
        data: employee
    });
}

//get by id
exports.show = async(req, res, next) => {
    try {
        const { id } = req.params;
        //const employee = await Employee.findOne({ _id: id });
        const employee = await Employee.findById(id);

        if (!employee) {
            throw new Error('ไม่พบข้อมูลพนักงาน');
        }
        res.status(200).json({
            data: employee
        });

    } catch (error) {
        res.status(400).json({
            error: {
                message: "เกิดข้อผิดพลาด Id ไม่ถูกต้อง " + error.message
            }
        });
    }
}


//insert
exports.insert = async(req, res, next) => {
    const { name, position, salary } = req.body;

    let employee = new Employee({
        name: name,
        position: position,
        salary: salary
    });
    console.log(employee);
    await employee.save();

    res.status(201).json({
        message: 'เพิ่มข้อมูลสำเร็จ'
    });
}



//Update 1
// exports.update = async(req, res, next) => {
//     try {
//         const { id } = req.params;
//         const { name, position, salary } = req.body;
//         const employee = await Employee.findById(id);

//         employee.name = name;
//         employee.position = position;
//         employee.salary = salary;
//         await employee.save();

//         res.status(201).json({
//             message: 'แก้ไขข้อมูลสำเร็จ'
//         });
//     } catch (error) {
//         res.status(400).json({
//             error: {
//                 message: "เกิดข้อผิดพลาด Id ไม่ถูกต้อง " + error.message
//             }
//         });
//     }
// }


//Update 2
// exports.update = async(req, res, next) => {
//     try {
//         const { id } = req.params;
//         const { name, position, salary } = req.body;
//         const employee = await Employee.findByIdAndUpdate(id, {
//             name: name,
//             position: position,
//             salary: salary
//         });

//         res.status(201).json({
//             message: 'แก้ไขข้อมูลสำเร็จ'
//         });
//     } catch (error) {
//         res.status(400).json({
//             error: {
//                 message: "เกิดข้อผิดพลาด Id ไม่ถูกต้อง " + error.message
//             }
//         });
//     }
// }

//update 3
exports.update = async(req, res, next) => {
    try {
        const { id } = req.params;
        const { name, position, salary } = req.body;
        const employee = await Employee.updateOne({ _id: id }, {
            name: name,
            position: position,
            salary: salary
        });

        if (employee.nModified === 0) {
            throw new Error('ไม่สามารถแก้ไขข้อมูลได้');
        } else {
            res.status(200).json({
                message: 'แก้ไขข้อมูลสำเร็จ'
            });
        }

    } catch (error) {
        res.status(400).json({
            error: {
                message: "เกิดข้อผิดพลาด Id ไม่ถูกต้อง " + error.message
            }
        });
    }
}

//Del
exports.delete = async(req, res, next) => {
    try {
        const { id } = req.params;

        //const employee = await Employee.deleteOne({ _id: id });
        const employee = await Employee.findByIdAndDelete({ _id: id });

        if (!employee) {
            throw new Error('ไม่สามารถลบข้อมูลได้');
        }
        res.status(200).json({
            message: 'ลบข้อมูลเรียบร้อย'
        });

    } catch (error) {
        res.status(400).json({
            error: {
                message: "เกิดข้อผิดพลาด Id ไม่ถูกต้อง " + error.message
            }
        });
    }
}