/**
 * Created by G@mOBEP
 *
 * Date: 21.04.13
 * Time: 11:37
 */

var $util = require('util');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function SwiftUtilsError (message, details)
{
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    this.name    = 'swift.utils SwiftUtilsError';
    this.message = 'swift.utils ' + message;
    this.details = details || null;
    this.code    = null;
}
$util.inherits(SwiftUtilsError, Error);

/**
 * Задание сообщения об ошибке
 *
 * @param {String} message сообщение об ошибке
 *
 * @returns {SwiftUtilsError}
 */
SwiftUtilsError.prototype.setMessage = function setMessage (message)
{
    this.message = message;
    return this;
};

/**
 * Задание деталей
 *
 * @param {*} details детали
 *
 * @returns {SwiftUtilsError}
 */
SwiftUtilsError.prototype.setDetails = function setMessage (details)
{
    this.details = details;
    return this;
};

/**
 * Задание кода ошибки
 *
 * @param {String} code код ошибки
 *
 * @returns {SwiftUtilsError}
 */
SwiftUtilsError.prototype.setCode = function setCode (code)
{
    this.code = code;
    return this;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.SwiftUtilsError = SwiftUtilsError;
exports.DBuilderError   = require('./dBuilderError').DBuilderError;
