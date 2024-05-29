const md5 = require("md5");
const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model")
const generateHelper = require("../../../helpers/generate")
const sendMailHelper = require("../../../helpers/sendMail")
//[post] /register
module.exports.register = async(req,res) =>{
    
    req.body.password = md5(req.body.password);
    const existEmail = await User.findOne({
        email : req.body.email,
        deleted: false
    })
    if(existEmail){
        res.json({
            code:400,
            message: "Email exist"
        })
    }else {
        const user = new User({
            fullName : req.body.fullName,
            email: req.body.email,
            password: req.body.password
        });
        user.save();
        const token = user.token;
        res.cookie("token",token);
        res.json({
            code:200,
            message: "success",
            token: token
        })
    }
    
}

//[post] /login
module.exports.login = async(req,res) =>{
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        res.json({
            code:400,
            message: "Email does not exist",
            
        })
        return;
    }

    if(md5(password)!= user.password){
        res.json({
            code:400,
            message: "Wrong password",
            
        })
        return;
    }

    const token = user.token;
    res.cookie("token",token);
    res.json({
        code:200,
        message: "Login success",
        token: token
    })
}

//[post] /forgotPassword
module.exports.forgotPassword = async(req,res) =>{
    const email = req.body.email;
    const user = await User.findOne({
        email : email,
        deleted: false
    })
    if(!user){
        res.json({
            code:400,
            message: "Email does not exist"
        })
    }

    const otp = generateHelper.generateRandomNumber(8);


    const objectForgotPassword ={
        email: email,
        otp : otp,
        expireAt: Date.now(),
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();

    // send OTP via email user
    const subject = `OTP to get password`;
    const html = `
        OTP authentication to get password is <b>${otp}</b>.Time to authenticate is 3 minute. Do not share with anyone`;
    sendMailHelper.sendMail(email,subject,html);
    res.json({
        code: 200,
        message : "Send Otp via mail"
    })
}