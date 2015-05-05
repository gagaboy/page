/**
 * 获取数据
 *     url | data
 *     list
 *        fields, orders, filters, page
 *     one
 *        fields
 *     parameter
 * 处理数据
 *     if has model -> to map model
 *     扩展：计算属性
 *
 * 返回数据
 *     过滤过，扩展过的数据
 *
 *  哪些组件会用DataSource 例如：grid, form, charts, combobox, tree etc..
 *  可以被扩展
 */
define([], function () {
    var DataSource = new Class({
        Implements: [Events, Options],
        options: {
            schema: {
                fields: [],
                orders: [],
                filters: [],
                groups: [], /** ??? **/
                page: {
                    size: 10,
                    num: 1
                }
            },
            data: {},
            transport: {
                /**
                 * 发出请求
                 */

            }
        },
        initialize: function () {

        },
        fetch: function (callback) {

        }
    });
    return DataSource;
});