/**
 * Created by G@mOBEP
 *
 * Date: 27.12.12
 * Time: 0:16
 */

/**
 * Обрезание пробелов по краям строки
 *
 * @param {String} str строка
 *
 * @returns {String}
 */
exports.trim = function trim (str)
{
    if (typeof str !== 'string')
    {
        return str;
    }

    return str.replace(/^\s+|\s+$/g, '');
};

/**
 * Перевод первой буквы строки в верхний регистр
 *
 * @param {String} str строка
 *
 * @returns {String}
 */
exports.ucfirst = function ucfirst (str)
{
    if (typeof str !== 'string')
    {
        return str;
    }

    return str.charAt(0).toUpperCase() + str.substr(1);
};