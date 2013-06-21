/**
 * Created by G@mOBEP
 *
 * Date: 02.03.13
 * Time: 12:06
 */

var $path = require('path'),
    $fs = require('fs');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.exists = typeof $fs.exists === 'function' ? $fs.exists : $path.exists;
exports.existsSync = typeof $fs.existsSync === 'function' ? $fs.existsSync : $path.existsSync;

/**
 * Получение первого существующего пути из списка
 *
 * @param {Array} paths список путей
 *
 * @returns {String|null}
 */
exports.getExistingPath = function getExistingPath (paths)
{
    for (var i = 0, n = paths.length; i < n; i++)
    {
        var path = $path.normalize(paths[i]);

        if (exports.existsSync(path)) return path;
    }

    return null;
};

/**
 * Рекурсивное создание директорий
 *
 * @param {String} path путь
 *
 * @returns {Boolean}
 */
exports.createDirReq = function (path)
{
    var dirNameList,
        subpath = '';

    if (typeof path !== 'string' || !path.length)
    {
        return false;
    }

    path        = $path.normalize(path);
    dirNameList = path.split('/');

    for (var i = 0, n = dirNameList.length; i < n; i++)
    {
        subpath += '/' + dirNameList[i];

        if (!exports.existsSync(subpath) || !$fs.statSync(subpath).isDirectory())
        {
            $fs.mkdirSync(subpath);
        }
    }

    return true;
};