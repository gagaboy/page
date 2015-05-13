require(["../../../page/src/Bootstrap"], function () {
    var eDataTableAuto = Page.create('eDataTable', {
        $parentId: 'gridContainer',
        $id: "ss1",
        autoTable: true,
        columns: [
            {title: '学号', data: 'FirstName', width: 100},
            {title: '姓名', data: 'LastName', width: 100},
            {title: '性别', data: 'Product', width: 180},
            {title: '院系', data: 'Price', width: 90, align: 'right', cellsAlign: 'right', cellsFormat: 'c2'},
            {title: '年级', data: 'Quantity', width: 80, align: 'right', cellsAlign: 'right'}
        ],
        data: [
            {"FirstName": "A1", "LastName": "A2", "Product": "A3", "Price": "A4", Quantity: "A5"},
            {"FirstName": "B1", "LastName": "B2", "Product": "B3", "Price": "B4", Quantity: "B5"},
            {"FirstName": "C1", "LastName": "C2", "Product": "C3", "Price": "C4", Quantity: "C5"}
        ]
    });
    eDataTableAuto.render();

    var eDataTable = Page.create('eDataTable', {
        $parentId: 'alreadytable',
        $id: "ss2",
        autoTable: false
    });
    eDataTable.render();
    //eDataTableAuto.dataTableObj.fnAddData({});//点用dataTable对象即可
});