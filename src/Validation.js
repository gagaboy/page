/**
 * Created by qianqianyi on 15/5/6.
 */
define([], function () {
    var Validation = new Class({
        options: {
            defaultRules:{},//预置规则
            customRules:{},//扩展规则
            onlyError:false,//只返回第一个错误，用于validateValue方法
            errInterval:";"//错误间的分隔符
        },
        initialize: function (opts) {
            this.options.defaultRules = {
                //单值校验
                "regex": {
                    "validateFunc": this._regex,
                    "errMsg": "* 格式必须满足正则表达式"
                },
                "required": {
                    "validateFunc": this._required,
                    "errMsg": "* 非空选项."
                },
                "length": {
                    "validateFunc": this._length,
                    "errMsg": "* 长度必须为 "
                },
                "minLength": {
                    "validateFunc": this._minLength,
                    "errMsg": "* 长度必须大于 "
                },
                "maxLength": {
                    "validateFunc": this._maxLength,
                    "errMsg": "* 长度必须小于 "
                },
                "limit": {
                    "validateFunc": this._limit,
                    "errMsg1": "* 大小必须在 ",
                    "errMsg2": " 至 ",
                    "errMsg3": " 之间."
                },
                "minValue": {
                    "validateFunc": this._minValue,
                    "errMsg": "* 值不小于 "
                },
                "equalsValue": {
                    "validateFunc": this._equalsValue,
                    "errMsg": "* 输入错误,请重新输入."
                },
                "notEqualsValue": {
                    "validateFunc": this._notEqualsValue,
                    "errMsg": "* 输入内容被排除,请重新输入."
                },
                "telephone": {
                    "regex": "/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/",
                    "errMsg": "* 请输入有效的电话号码,如:010-29292929."
                },
                "mobilephone": {
                    "regex": "/(^0?[1][3458][0-9]{9}$)/",
                    "errMsg": "* 请输入有效的手机号码."
                },
                "phone": {
                    "regex": "/^((\\(\\d{2,3}\\))|(\\d{3}\\-))?(\\(0\\d{2,3}\\)|0\\d{2,3}-)?[1-9]\\d{6,7}(\\-\\d{1,4})?$/",
                    "errMsg": "* 请输入有效的联系号码."
                },
                "email": {
                    "regex": "/^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/",
                    "errMsg": "* 请输入有效的邮件地址."
                },
                "date": {
                    "regex": "/^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/",
                    "errMsg": "* 请输入有效的日期,如:2008-08-08."
                },
                "ip": {
                    "regex": "/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/",
                    "errMsg": "* 请输入有效的IP."
                },
                "accept": {
                    "regex": "none",
                    "errMsg": "* 请输入有效的文件格式."
                },
                "chinese": {
                    "regex": "/^[\u4e00-\u9fa5]+$/",
                    "errMsg": "* 请输入中文."
                },//联合校验
                "equalsField": {
                    "validateFunc": this._equalsValue,
                    "errMsg": "* 两次输入不一致,请重新输入."
                }
            };
        },
        getId:function(){
            return String.uniqueID();
        },
        //基本校验工具方法
        checkRequired: function (value) {
            if (!value) {
                return {"result":false,"errorMsg":"不可为空"};
            }else{
                return {"result":true};
            }
        },
        checkLength: function (value,maxLen,minLen) {
            var fieldLength = value?String(value).length:0;
            if ((minLen&&fieldLength < minLen) || (maxLen&&fieldLength > maxLen)) {
                return {"result":false,"errorMsg":"长度不符合要求"};
            }else{
                return {"result":true};
            }
        },
        checkRegex: function(value,regexStr){
            var regPattern = eval(regexStr);
            if (!regPattern.test(value)) {
                return {"result":false,"errorMsg":"格式必须满足正则表达式："+regexStr};
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
            //return ajax返回结果
        },

        /**
         * 校验值＋一组规则
         * valRules:
         * {
            length: {
                maxLen: 10,
                minLen: 2
            },
            regex:{
                regStr:""
            }
         */
        validateValue: function (value,valRules) {
           //if(valRules&& valRules.keyset()){
                //调用各工具方法
                //错误信息组合（；区隔）
           //}
            return {"result":false,"errorMsg":"校验错误测试"};
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
                    regStr:""
                }
            },
            age: {
                limit: {
                    min: 18
                }
            },
            "@obj": [
                 {
                     "ruleId": "equal",
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
            if(valRules&& valRules.keyset()){
                //调用各工具方法
                //错误信息组合（；区隔）
                if(valRules[key]=="@obj"){
                    //联合校验
                }
            }
        },
        /**
         * 扩展校验规则
         * ruleSetting:
         * {
         *  validateFunc:[fun], //校验处理方法
         *  regex:"",   //正则表达式，不配置validateFunc也能自动生效，若配置了validateFunc，则由validateFunc调用
         *  errMsg:[errorMessage] //错误提示
         * }
         */
        addCustomRule: function (ruleName,ruleSetting) {
            if (this.options.defaultRules && this.options.defaultRules[ruleName]) {
                return {"result": false, "errorMsg": "系统预置规则中已有同名规则" + ruleName};
            }else{
                return {"result":true};
            }
        },
        //＝＝＝＝＝＝＝＝＝＝＝＝＝＝以下为私有方法＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

        _getErrMsg:function(){
            //return this.
        }
    });
    Validation.xtype = "validation";
    return Validation;
});