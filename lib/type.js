/**
 * Created by G@mOBEP
 *
 * Date: 20.03.13
 * Time: 11:18
 */

var $util = require('util');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function isObject (obj) { return (Object.prototype.toString.call(obj) === '[object Object]'); }
function isArray (obj) { return $util.isArray(obj); }
function isRegExp (obj) { return $util.isRegExp(obj); }
function isDate (obj) { return $util.isDate(obj); }
function isError (obj) { return $util.isError(obj); }

function getType (data)
{
    if (isArray(data))            return 'array';
    if (isDate(data))             return 'date';
    if (isError(data))            return 'error';
    if (isObject(data))           return 'object';
    if (isRegExp(data))           return 'regexp';
    if (typeof data === 'object') return 'objectInastance';

    return typeof data;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.isObject = isObject;
exports.isArray  = isArray;
exports.isRegExp = isRegExp;
exports.isDate   = isDate;
exports.isError  = isError;
exports.getType  = getType;