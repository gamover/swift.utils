/**
 * Created by G@mOBEP
 *
 * Date: 21.04.13
 * Time: 11:58
 */

var $util = require('util'),

    SwiftUtilsError = require('./swiftUtilsError').SwiftUtilsError;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function DBuilderError (message, details)
{
    SwiftUtilsError.call(this, 'DBuilder: ' + message, details);
    Error.captureStackTrace(this, arguments.callee);

    this.name = 'swift.db:DBuilderError';
}
$util.inherits(DBuilderError, SwiftUtilsError);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// static
//

DBuilderError.codes = {
    BAD_PATH_TO_DESTINATION_DIRECOTRY:       'BAD_PATH_TO_DESTINATION_DIRECOTRY',
    BAD_PATH_TO_TEMPLATES:                   'BAD_PATH_TO_TEMPLATES',
    BAD_STRUCTURE:                           'BAD_STRUCTURE',
    DESTINATION_DIRECTORY_NOT_FOUND:         'DESTINATION_DIRECTORY_NOT_FOUND',
    PATH_TO_DESTINATION_DIRECOTRY_UNDEFINED: 'PATH_TO_DESTINATION_DIRECOTRY_UNDEFINED',
    STRUCTURE_UNDEFINED:                     'STRUCTURE_UNDEFINED',
    SYSTEM_ERROR:                            'SYSTEM_ERROR',
    TEMPLATES_DIRECTORY_NOT_FOUND:           'TEMPLATES_DIRECTORY_NOT_FOUND'
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.DBuilderError = DBuilderError;