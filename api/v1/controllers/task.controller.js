const Task = require("../models/task.model")

module.exports.index = async (req,res)=>{
    const find = {
        deleted: false
    }
    if(req.query.status){
        find.status = req.query.status;
    }
    const tasks = await Task.find(find);

    res.json(tasks);
}

module.exports.detail =async (req,res)=>{

    try {
        const id = req.params.id;

        const tasks = await Task.findOne({
            _id: id,
            deleted: false
        });

        res.json(tasks);
    } catch (error) {
        res.json("Not Find");
    }
    
}