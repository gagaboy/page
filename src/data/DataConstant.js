define([], function (Constant) {
    var constant = {
        status: "$status$",
        notModify: "$notModify$",
        add: "$add$",
        update: "$update$",
        remove: "$remove$",
        //pageSize:'pageSize',
        //pageNo:'pageNo',
        //totalSize:'totalSize',
        //data:'data'
        pageSize:'pageSize',
        pageNo:'pageNumber',
        totalSize:'totalCount',
        data:'datas',
        rows:'rows'
    }
    //sync data send ds1={name:xxx}
    /*
    {
        result:{
            datas:{
                ds1:{
                    name:'',
                        age:'',
                        $status$:''
                },
                ds2:{
                    rows:[],
                    pageSize:1,
                    pageNumber:1,
                    totalCount:1000
                }
            }
        }
    }
    */
    return constant;
})