require(["../../../page/src/Bootstrap"], function () {

    var form = [];

    var inp = Page.create("input", {
        $parentId: 'input',
        value: '张三',
        required: false,
        glyphicon: 'glyphicon-ok',
        message: '请输入2-5个汉字',
        label: '您的姓名',
        validationRules: {
            required: true,//options中为false时，此处可重开启校验
            length: {
                maxLen: 5,
                minLen: 2
            },
            regex: {
                regexStr: "/^[\u4e00-\u9fa5]+$/"
            }
        },
        showErrorMessage: true,
        $id: 'input'
    });
    inp.render();

    form.push(inp);


    var checkbox = Page.create('checkbox', {
        $parentId: 'checkbox',
        label: '兴趣',
        required: true,
        showErrorMessage: true,
        validationRules: {
            required: true,//options中为false时，此处可重开启校验
            length: {
                maxLen: 3,
                minLen: 2,
                customErrMsg: "请选择2-3个兴趣"
            }
        },
        items: [{
            value: '1',
            display: '足球',
            checked: false
        }, {
            value: '11',
            display: '足球1',
            checked: false
        }, {
            value: '12',
            display: '足球2',
            checked: false
        }, {
            value: '13',
            display: '足球3',
            checked: false
        }]
    });
    checkbox.render();
    form.push(checkbox);
    //datepicker
    var datepicker = Page.create("datepicker", {
        $parentId: 'datepicker',
        value: '2015-05-09',
        watermark: true
    });
    datepicker.render();
    form.push(datepicker);
    //maskedtextbox
    var maskedtextbox = Page.create("maskedtextbox", {
        $parentId: 'maskedtextbox',
        value: '',
        required: true,
        message: '',
        label: '电话',
        validationRules: {
            required: true//options中为false时，此处可重开启校验
        },
        showErrorMessage: true,
        $id: 'username',
        mask: "(000)00000000"
    });
    maskedtextbox.render();
    form.push(maskedtextbox);
    //radio
    var radio = Page.create('radio', {
        $parentId: 'radio',
        label: '性别',
        required: true,
        showErrorMessage: true,
        items: [{
            value: '1',
            display: '男',
            checked: false
        }, {
            value: '11',
            display: '女',
            checked: false
        }, {
            value: '12',
            display: '未知',
            checked: false
        }]
    });
    radio.render();
    form.push(radio);

    //combobox
    var comboDS = Page.create("dataSet", {
        $id: 'comboBoxDS',
        fetchUrl: 'Data.demo.json',
        syncUrl: ''
    });

    var combo1 = Page.create('combobox', {
        $parentId: 'comboMulti',
        $id: 'combo1',
        label: '学院（多选）',
        multi: true,
        value: "1,3",
        display: "计算机学院,经管学院",
        $pageSize: 5,
        dataSetId: "comboBoxDS",
        showErrorMessage:true,
        validationRules: {
            required:true,//options中为false时，此处可重开启校验
            length: {
                maxLen: 4,
                minLen: 2,
                customErrMsg:"请选择2-4个学院"
            }
        },
        beforeSelectEvent: function(value, display, obj) {
//                alert("已选中值为："+obj.getValue()+"\n已选中文本为："+obj.getDisplay()+"\n选择前事件："+value + " " +  display);
        },
        selectedEvent: function(value, display, obj) {
//                alert("已选中值为："+obj.getValue()+"\n已选中文本为："+obj.getDisplay()+"\n选择后事件："+value + " " +  display);
        }
    })
    combo1.render();

    var combo2 = Page.create('combobox', {
        $parentId: 'comboSingleSearchable',
        $id: 'combo2',
        label: '学院（单选可搜索）',
        multi: false,
        searchable: true,
//            $valueField: "id",
//            $textField: "text",
        value: "1",
        display: "计算机学院",
        dataSetId: "comboBoxDS"

    })
    combo2.render();

    var combo3 = Page.create('combobox', {
        $parentId: 'comboSingle',
        $id: 'combo3',
        label: '学院（单选）',
        multi: false,
        searchable: false,
        value: "1",
        $pageSize: 5,
        display: "计算机学院",
        dataSetId: "comboBoxDS",
        beforeOpenEvent: function(a,b,c,d) {
                alert(" 返回false,可以阻止面板打看，要试试吗?");
//                return false;
        }
    })
    combo3.render();
    form.push(combo1);
    form.push(combo2);
    form.push(combo3);
    //textarea
    var textarea = Page.create("textarea", {
        $parentId: 'textarea',
        value: '',
        required: true,
        glyphicon: 'glyphicon-ok',
        message: '请输入文字介绍',
        label: '个人简介',
        validationRules: {
            length: {
                maxLen: 15,
                minLen: 0
            },
            mobilePhone: false
        },
        showErrorMessage: true,
        $id: 'phone'//
    });
    textarea.render();
    form.push(textarea);

    function printFormValue() {

        var values = {};
        form.each(function (c) {
            values[c.getId()] = c.getValue();
        });

        $("#formValue").html(JSON.stringify(values));

    }

    form.each(function (c) {
        c.addEvent("onValueChange", printFormValue)
    });


    $("#openDialog").click(function () {
        Page.create('dialog', {
            $id: "dialog",
            //           url: "www.baidu.com",
            content: "测试一下，哈哈",
            width: "400px",
            height: "200px",
            button: [{
                name: "点击试试",
                callback: function() {
                    Page.dialog.confirm('你确定要删除这掉消息吗？', function () {
                        Page.dialog.tips('执行确定操作');
                    }, function () {
                        Page.dialog.alert('执行取消操作');
                    });
                }
            },{
                name: "测试Prompt",
                callback: function() {
                    Page.dialog.prompt('请输入图片网址', function (val) {
                        Page.dialog.tips(val);
                    }, '默认输入值');
                }
            }]
        }).render();
    });

    $("#getFormData").click(function () {
        var values = {};
        form.each(function (c) {
            values[c.getId()] = c.getValue();
        });
        alert(JSON.stringify(values));
    });

    $("#validateForm").click(function () {
        var valid = true;
        form.each(function (c) {
            var v = c.isValid();
            if (!v) {
                valid = false;
            }
        });
        if (valid) {
            alert("校验成功.");
        } else {
            alert("校验失败.");
        }
    });

    $("#resetForm").click(function(){
        form.each(function (c) {
            var v = c.reset();
        });
    });

    $("#viewForm").click(function(){
        form.each(function (c) {
            var v = c.switchStatus("readonly");
        });
    });

    $("#editForm").click(function(){
        form.each(function (c) {
            var v = c.switchStatus("edit");
        });
    });
});