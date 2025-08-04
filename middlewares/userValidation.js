const { body } = require("express-validator");

const regsiterValid = (req,res) => {
    return [
      body("username").notEmpty().withMessage('علي الاقل حرفين - وليس اكثر من عشرين حرفا'),
      body("email").isEmail().withMessage('اكتب ايميل بالشكل الصحيح'),
      body("password").notEmpty().isLength({ min: 8 }).withMessage('اكتب الباسورد لا يقل عن 7 احرف او ارقام'),
    ];
}

const loginValid = () => {
    return [
      body("email").isEmail().withMessage('اكتب ايميل بالشكل الصحيح'),
      body("password").notEmpty().isLength({ min: 8 }).withMessage('اكتب الباسورد لا يقل عن 7 احرف او ارقام'),
    ];
}

module.exports = {regsiterValid,loginValid}