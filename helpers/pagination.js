module.exports =(objectPagination,query,countRecord) =>{
    if(query.page){
        objectPagination.currentPage = parseInt(query.page);
    }

    if(query.limit){
        objectPagination.limitItem = parseInt(query.limit);
    }
    objectPagination.skip = (objectPagination.currentPage -1) * objectPagination.limitItem;

   
    const totalPage = Math.ceil(countRecord/objectPagination.limitItem);
    objectPagination.totalPage = totalPage;

    return objectPagination;
}