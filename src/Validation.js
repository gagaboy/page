/**
 * Created by qianqianyi on 15/5/6.
 */
define([], function () {
    var Validation = new Class({
        Implements: [Options],
        options: {
            defaultRules:{},//预置规则
            customRules:{},//扩展规则
            onlyError:false,//只返回第一个错误，用于validateValue方法和validateObject的每个属性
            errInterval:";"//错误间的分隔符
        },
        allRules:{},//用于存放全部规则的临时变量
        initialize: function (opts) {
            this.setOptions(opts);
            this.options.defaultRules = {
                //单值校验
                "regex": {
                    "validateFunc": "_valRegex",//系统中的方法可以直接传方法名
                    "errorMsg": "格式不符合要求"
                },
                "required": {
                    "validateFunc": "_valRequired",//与this.checkRequired同效
                    "errorMsg": "非空选项"
                },
                "length": {
                    "validateFunc": "_valLength",
                    "errorMsg_min": "长度必须在",
                    "errorMsg_max": "长度必须在",
                    "errorMsg_bt1": "长度必须在 ",
                    "errorMsg_bt2": "－",
                    "errorMsg_bt3": " 之间"
                },
                "lengthFix": {
                    "validateFunc": "_valLengthFix",
                    "errorMsg": "长度必须为"
                },
                "limit": {
                    "validateFunc": "_valLimit",
                    "errorMsg_min": "大小必须在",
                    "errorMsg_max": "大小必须在",
                    "errorMsg_bt1": "大小必须在 ",
                    "errorMsg_bt2": "－",
                    "errorMsg_bt3": " 之间"
                },
                "funCall":{
                    "validateFunc": "_valFunCall",
                    "errorMsg": "前端校验失败"
                },
                "ajax":{
                    "validateFunc": "_valAjax",
                    "errorMsg": "服务端校验失败"
                },
                "equalValue": {
                    "validateFunc": "_valEqualValue",
                    "errorMsg": "必须等于"
                },
                "notEqualValue": {
                    "validateFunc": "_valNotEqualValue",
                    "errorMsg": "不能等于"
                },
                "telephone": {
                    "regex": "/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/",
                    "errorMsg": "非有效的电话号码,如:010-29292929"
                },
                "mobilePhone": {
                    "regex": "/(^0?[1][3458][0-9]{9}$)/",
                    "errorMsg": "非有效的手机号码"
                },
                "phone": {
                    "regex": "/^((\\(\\d{2,3}\\))|(\\d{3}\\-))?(\\(0\\d{2,3}\\)|0\\d{2,3}-)?[1-9]\\d{6,7}(\\-\\d{1,4})?$/",
                    "errorMsg": "非有效的联系号码"
                },
                "email": {
                    "regex": "/^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/",
                    "errorMsg": "非有效的邮件地址"
                },
                "date": {
                    "regex": "/^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/",
                    "errorMsg": "非有效的日期,如:2008-08-08"
                },
                "ip": {
                    "regex": "/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/",
                    "errorMsg": "非有效的IP"
                },
                "accept": {
                    "regex": "none",
                    "errorMsg": "非有效的文件格式"
                },
                "chinese": {
                    "regex": "/^[\u4e00-\u9fa5]+$/",
                    "errorMsg": "必须中文"
                },//联合校验
                "equalField": {
                    "validateFunc": "_valEqualField",
                    "errorMsg": "两次输入不一致"
                },
                "notEqualField": {
                    "validateFunc": "_valNotEqualField",
                    "errorMsg": "两者不能相同"
                }
            };
            jQuery.extend(this.allRules,this.options.defaultRules);
        },
        getId:function(){
            return String.uniqueID();
        },
        //～～～～～～基本校验工具方法～～～～～～
        checkRequired: function (value) {
            if (!value) {
                return {"result":false,"errorMsg":this._getErrMsg("required")};
            }else{
                return {"result":true};
            }
        },
        checkLength: function (value,minLen,maxLen) {
            var fieldLength = value?String(value).length:0;
            var errMsg = "";
            if(minLen||maxLen){
                if(minLen&&typeof(minLen)!="number"){
                    minLen = eval(minLen);
                }
                if(maxLen&&typeof(maxLen)!="number"){
                    maxLen = eval(maxLen);
                }
                if(minLen&&maxLen){
                    if ((minLen&&fieldLength < minLen) || (maxLen&&fieldLength > maxLen)) {
                        errMsg += (this._getErrMsg("length","errorMsg_bt1")+minLen
                        +this._getErrMsg("length","errorMsg_bt2")+maxLen
                        +this._getErrMsg("length","errorMsg_bt3"));
                    }
                }else if(minLen){
                    if (minLen&&fieldLength < minLen) {
                        errMsg += (this._getErrMsg("length","errorMsg_min")+minLen);
                    }
                }else if(maxLen){
                    if (maxLen&&fieldLength > maxLen){
                        errMsg += (this._getErrMsg("length","errorMsg_max")+maxLen);
                    }
                }
            }
            if(errMsg){
                return {"result":false,"errorMsg":errMsg};
            }
            return {"result":true};
        },
        checkLengthFix: function (value,fixLen) {
            var fieldLength = value ? String(value).length : 0;
            if(fixLen&&typeof(fixLen)!="number"){
                fixLen = eval(fixLen);
            }
            if (fixLen&&typeof(fixLen)=="number") {
                if(fixLen!=fieldLength){
                    return {"result":false,"errorMsg":this._getErrMsg("lengthFix")+fixLen};
                }
            }
            return {"result":true};
        },
        checkRegex: function(value,regexStr){
            if(regexStr){
                var regPattern = eval(regexStr);
                if (!regPattern.test(value)) {
                    return {"result":false,"errorMsg":"格式不正确"};
                }
            }
            return {"result":true};
        },
        checkLimit: function(value,min,max){
            var errMsg = "";
            if(value&&typeof(value)=="number"&&(min||max)){
                if(min&&typeof(min)!="number"){
                    min = eval(min);
                }
                if(max&&typeof(max)!="number"){
                    max = eval(max);
                }
                if(min&&max){
                    if ((min&&value < min) || (max&&value > max)) {
                        errMsg += (this._getErrMsg("limit","errorMsg_bt1")+min
                            +this._getErrMsg("limit","errorMsg_bt2")+max
                            +this._getErrMsg("limit","errorMsg_bt3"));
                    }
                }else if(min){
                    if (min&&value < min) {
                        errMsg += (this._getErrMsg("limit","errorMsg_min")+min);
                    }
                }else if(max){
                    if (max&&value > max){
                        errMsg += (this._getErrMsg("limit","errorMsg_max")+max);
                    }
                }
            }
            if(errMsg){
                return {"result":false,"errorMsg":errMsg};
            }
            return {"result":true};
        },
        checkEqualValue: function(value,evalue){
            if(value!=evalue){
                return {"result":false,"errorMsg":this._getErrMsg("equalValue")+evalue};
            }
            return {"result":true};
        },
        checkNotEqualValue: function(value,nqvalue){
            if(value==nqvalue){
                return {"result":false,"errorMsg":this._getErrMsg("notEqualValue")+nqvalue};
            }
            return {"result":true};
        },
        checkFunCall:function(value,fn,params){
            if (typeof(fn) == 'function') {
                //函数返回true则不允许提交，返回false则允许提交
                var fn_result = fn(value,params);
                return fn_result;//要求格式与validation返回一致
            }
            return {"result":true};
        },
        checkAjax:function(value,url,valueKey,params){
            if(url){
                if(!valueKey){
                    valueKey = "value";
                }
                Promise.all($.ajax({
                    url: url,
                    type: params.type||"post",
                    dataType:params.dataType||"json",
                    success: function(res) {
                        return res;
                    }
                })).then(function (element) {
                    return {"result":true};
                });
            }
            //return ajax返回结果
        },
        checkEqualField:function(obj,fieldName1,fieldName2){
            if(obj&&fieldName1&&fieldName2){
                if(obj[fieldName1]&&obj[fieldName1]){
                    //都有值时
                    if((obj[fieldName1]!=obj[fieldName2])){
                        return {"result":false,"errorMsg":this._getErrMsg("equalField")};
                    }
                }else if(obj[fieldName1]||obj[fieldName1]){
                    //有一个为空，则肯定不一致
                    return {"result":false,"errorMsg":this._getErrMsg("equalField")};
                }else{
                    //都为空则默认一致
                }
            }
            return {"result":true};
        },
        checkNotEqualField:function(obj,fieldName1,fieldName2){
            if(obj&&fieldName1&&fieldName2){
                if(obj[fieldName1]&&obj[fieldName1]){
                    //都有值时
                    if((obj[fieldName1]==obj[fieldName2])){
                        return {"result":false,"errorMsg":this._getErrMsg("notEqualField")};
                    }
                }
            }
            return {"result":true};
        },
        /**
         * 校验值＋一组规则
         * valRules:
         * {
         *  required:true,
            length: {
                maxLen: 10,
                minLen: 2
            },
            regex:{
                regexStr:""
            }
         */
        validateValue: function (value,valRules) {
            if(valRules&&typeof(valRules) == "object"){
                var errMsg = "";
                //调用各工具方法
                //错误信息组合（；区隔）
                for(var p in valRules) {
                    var valRes = null;
                    if(valRules[p]&&this.allRules[p]){//valRules[p]为false时直接不处理
                        var valRule = this.allRules[p];
                        if(valRule.validateFunc){
                            if(typeof(valRule.validateFunc) == "string"&&this[valRule.validateFunc]){
                                valRes = this[valRule.validateFunc](value,valRules[p]);
                            }else if(typeof(valRule.validateFunc) == "function"){
                                valRes = valRule.validateFunc(value,valRules[p]);
                            }
                        }else if(valRule.regex){
                            valRes = this.checkRegex(value,valRule.regex);
                        }
                    }
                    if(valRes&&!valRes.result){
                        errMsg += (valRes.errorMsg+(this.options.onlyError?"":this.options.errInterval));
                        if(this.options.onlyError&&errMsg){
                            return {"result":false,"errorMsg":errMsg};
                        }
                    }
                }
                if(errMsg){
                    return {"result":false,"errorMsg":errMsg};
                }
            }
            //return {"result":false,"errorMsg":"校验错误测试"};
            return {"result":true};
        },
        /**
         * 校验对象＋一组规则
         * valRules:
         * {
            username: {
                length: {
                    maxLen: 10,
                    minLen: 2
                },
                regex:{
                    regexStr:""
                }
            },
            age: {
                limit: {
                    min: 18
                }
            },
            "_global": [
                 {
                     "ruleId": "equalField",
                     "fields": [
                         "pass",
                         "repass"
                     ]
                 },
                 {
                     "ruleId": "timeAfter",
                     "field1": "startTime",
                     "field2": "endTime"
                 }
             ]
         }
         */
        validateObject: function (obj,valRules) {
            var errorMsg = null;
            if(obj&&valRules&&typeof(valRules) == "object"){
                //调用各工具方法
                //错误信息组合（；区隔）
                for(var p in valRules) {
                    if(p=="_global"&&valRules[p]){//联合校验
                        var complexErr = this.validateGlobalRules(obj,valRules[p]);
                        if(complexErr&&!complexErr.result){
                            errorMsg._global = complexErr.errorMsg;
                        }
                    }else if(valRules[p]){
                        var fieldValRes = this.validateValue(obj[p],valRules[p]);
                        if(fieldValRes&&!fieldValRes.result){
                            if(!errorMsg){
                                errorMsg = {};
                            }
                            errorMsg[p] = fieldValRes.errorMsg;
                        }
                    }
                }
            }
            if(errorMsg){
                return {"result":false,"errorMsg":errorMsg};
            }else{
                return {"result":true};
            }
        },
        validateGlobalRules:function(obj,complexRules){
            var complexErrMsg = "";
            //var complexRules = valRules[p];
            if(complexRules&&complexRules.length>0) {
                //调用各工具方法
                //错误信息组合（；区隔）
                for(var t=0;t<complexRules.length;t++) {
                    var valRes = null;
                    if (complexRules[t]) {//complexRules[t]为false时直接不处理
                        var ruleName = complexRules[t].ruleId;
                        if(ruleName&& this.allRules[ruleName]){
                            var valRule = this.allRules[ruleName];
                            if (valRule.validateFunc) {//联合校验全部使用函数实现
                                if (typeof(valRule.validateFunc) == "string" && this[valRule.validateFunc]) {
                                    valRes = this[valRule.validateFunc](obj, complexRules[t]);
                                } else if (typeof(valRule.validateFunc) == "function") {
                                    valRes = valRule.validateFunc(obj, complexRules[t]);
                                }
                            }
                        }
                    }
                    if (valRes && !valRes.result) {
                        complexErrMsg += (valRes.errorMsg)+this.options.errInterval;
                    }
                }
            }
            if(complexErrMsg){
                return {"result":false,"errorMsg":complexErrMsg};
            }
            return {"result":true};
        },
        /**
         * 扩展校验规则
         * ruleSetting:
         * {
         *  validateFunc:[fun], //校验处理方法
         *  regex:"",   //正则表达式，不配置validateFunc也能自动生效，若配置了validateFunc，则由validateFunc调用
         *  errorMsg:[error Message] //错误提示
         * }
         */
        addCustomRule: function (ruleName,ruleSetting) {
            if (this.options.defaultRules&& this.options.defaultRules[ruleName]) {
                return {"result": false, "errorMsg": "系统预置规则中已有同名规则" + ruleName};//预置规则不容许重写
            }else{
                this.options.customRules[ruleName] = ruleSetting;//自定义规则可被重写
                this.allRules[ruleName] = ruleSetting;//同样刷新全部集合中的定义
                return {"result":true};
            }
        },
        //获取自定义规则
        getCustomRule:function(ruleName){
            if(ruleName){
                return this.options.customRules[ruleName];
            }
            return this.options.customRules;
        },
        //＝＝＝＝＝＝＝＝＝＝＝＝＝＝以下为私有方法＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
        //～～～～～～d单项校验类～～～～～～
        _valRegex:function(value,params){
            if(value&&params&&params.regexStr){
                return this.checkRegex(value,params.regexStr);
            }
            return {"result":true};
        },
        _valRequired:function(value,isOpen){
            if(isOpen){ //支持关闭，其实在入口时已经屏蔽掉false的情形
                return this.checkRequired(value);
            }
        },
        _valLength:function(value,params){
            if(value&&(params.minLen||params.maxLen)){
                return this.checkLength(value,params.minLen,params.maxLen);
            }
            return {"result":true};
        },
        _valLengthFix:function(value,params){
            if(value&&params.fixLen){
                return this.checkLengthFix(value,params.fixLen);
            }
            return {"result":true};
        },
        _valLimit:function(value,params){
            if(value&&params&&params.regexStr){
                return this.checkLimit(value,params.regexStr);
            }
            return {"result":true};
        },
        _valFunCall:function(value,params){
            if(value&&params&&params.regexStr){
                return this.checkFunCall(value,params.regexStr);
            }
            return {"result":true};
        },
        _valAjax:function(value,params){
            if(value&&params&&params.regexStr){
                return this.checkAjax(value,params.regexStr);
            }
            return {"result":true};
        },
        _valEqualValue:function(value,params){
            if(value&&params&&params.regexStr){
                return this.checkEqualValue(value,params.regexStr);
            }
            return {"result":true};
        },
        _valNotEqualValue:function(value,params){
            if(value&&params&&params.regexStr){
                return this.checkNotEqualValue(value,params.regexStr);
            }
            return {"result":true};
        },
        //～～～～～～联合查询类～～～～～～
        _valEqualField:function(obj,params){
            if(obj&&params&&params.field1&&params.field2){
                return this.checkEqualField(obj,params.field1,params.field2);
            }
            return {"result":true};
        },
        _valNotEqualField:function(obj,params){
            if(obj&&params&&params.field1&&params.field2){
                return this.checkNotEqualField(obj,params.field1,params.field2);//多值
            }
            return {"result":true};
        },
        //～～～～～～工具方法～～～～～～
        _getErrMsg:function(ruleName,errMsgName){
            if(!errMsgName){
                errMsgName = "errorMsg";
            }
            if(this.allRules&&this.allRules[ruleName]){
                return this.allRules[ruleName][errMsgName];
            }
            return null;
        },
        _getRuleSetting:function(ruleName){
            if(this.allRules){
                return this.allRules[ruleName];
            }
            return null;
        }
    });
    Validation.xtype = "validation";
    return Validation;
});