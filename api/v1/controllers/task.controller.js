const Task = require("../models/task.model")

const paginationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status;
    }

    // search 
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }

    // Pagination
    let initPagination =   {
        currentPage: 1,
        limitItem: 2 
    } 
    const countTask = await Task.countDocuments(find);
    const objectPagination = paginationHelper(
        initPagination,
        req.query,
        countTask
    );
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    res.json(tasks);
}

module.exports.detail = async (req, res) => {

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

module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(req.body);
        const status = req.body.status;
        await Task.updateOne({
            _id: id
        },{
            status: status
        })
        res.json({
            code:200,
            message:"success"
        })
    } catch (error) {
        res.json({
            code:400,
            message:"not exist"
        })
    }
    
}
