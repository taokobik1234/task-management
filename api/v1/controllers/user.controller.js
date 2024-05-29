const md5 = require("md5");
const User = require("../models/user.model");
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