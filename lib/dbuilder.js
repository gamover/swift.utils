/**
 * Created by G@mOBEP
 *
 * Company: Realweb
 * Date: 29.01.13
 * Time: 12:34
 */
var $fs = require('fs'),
    $path = require('path'),

    $swiftErrors = require('swift.errors'),

    fsUtil = require('./fs'),
    typeUtil = require('./type');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function DBuilder ()
{
    /**
     * Путь к директории с шаблонами
     *
     * @type {String|null}
     * @private
     */
    this._pathToTemplates = null;

    /**
     * Путь к директории назначения
     *
     * @type {String|null}
     * @private
     */
    this._destination = null;

    /**
     * Структура директорий
     *
     * @type {Object|null}
     * @private
     */
    this._struct = null;
}

/**
 * Задание пути к директории с шаблонами
 *
 * @param {String} pathToTemplates
 *
 * @returns {DBuilder}
 */
DBuilder.prototype.setPathToTemplates = function setPathToTemplates (pathToTemplates)
{
    //
    // проверка параметров
    //
    if (typeof pathToTemplates !== 'string')
        throw new $swiftErrors.TypeError('не удалось задать путь к директории с шаблонами в "DBuilder". Недопустимый тип пути к директории шаблонов (ожидается: "string", принято: "' + typeof pathToTemplates + '")');
    if (!pathToTemplates.length)
        throw new $swiftErrors.ValueError('не удалось задать путь к директории с шаблонами в "DBuilder". Пустое значение пути к директории шаблонов');
    if (!fsUtil.existsSync(pathToTemplates) || !$fs.statSync(pathToTemplates).isDirectory())
        throw new $swiftErrors.ValueError('не удалось задать путь к директории с шаблонами в "DBuilder". Директория "' + pathToTemplates + '" не найдена');
    //
    // задание пути к директории с шаблонами
    //
    this._pathToTemplates = $path.normalize(pathToTemplates);

    return this;
};

/**
 * Задание пути к директории назначения
 *
 * @param {String} destination
 *
 * @returns {DBuilder}
 */
DBuilder.prototype.setDestination = function setDestination (destination)
{
    //
    // проверка параметров
    //
    if (typeof destination !== 'string')
        throw new $swiftErrors.TypeError('не удалось задать путь к директории назначения в "DBuilder". Недопустимый тип пути к директории назначения (ожидается: "string", принято: "' + typeof destination + '")');
    if (!destination.length)
        throw new $swiftErrors.ValueError('не удалось задать путь к директории назначения в "DBuilder". Пустое значение пути к директории назначения');
    if (!fsUtil.existsSync(destination) || !$fs.statSync(destination).isDirectory())
        throw new $swiftErrors.ValueError('не удалось задать путь к директории назначения в "DBuilder". Директория "' + destination + '" не найдена');
    //
    // задание пути к директории назначения
    //
    this._destination = destination;

    return this;
};

/**
 * Задание структуры директорий
 *
 * @param {Object} struct
 *
 * @returns {DBuilder}
 */
DBuilder.prototype.setStruct = function setStruct (struct)
{
    if (!typeUtil.isObject(struct))
        throw new $swiftErrors.TypeError('не удалось задать структуру директорий в "DBuilder". Недопустимый тип структуры директорий (ожидается: "object", принято: "' + typeof struct + '")');
    //
    // задание структуры директорий
    //
    this._struct = struct;

    return this;
};

/**
 * Построение структуры директорий
 *
 * @returns {DBuilder}
 */
DBuilder.prototype.build = function build ()
{
    var self = this;

    if (!self._struct)
        throw new $swiftErrors.SystemError('не удалось построить структуру директорий в "DBuilder". Не задана структура директорий');
    if (!self._destination)
        throw new $swiftErrors.SystemError('не удалось построить структуру директорий в "DBuilder". Не задан путь к директории назначения');

    try
    {
        var graph = ['Была создана следующая структура директорий:', self._destination];

        (function bypass (struct, dest, space)
        {
            space = space || '';

            var count = 1,
                number = Object.keys(struct).length;

            for (var name in struct)
            {if (!(struct.hasOwnProperty(name))) continue;

                var objStruct = struct[name],
                    path = dest + '/' + name,
                    type = objStruct.type || 'dir';

                if (type === 'dir')
                {
                    if (!fsUtil.existsSync(path))
                    {
                        $fs.mkdirSync(path);

                        if (count === number) graph.push(space + '└ ' + name);
                        else
                        {
                            if (space === '' && count === 1) graph.push(space + '│');

                            graph.push(space + '├ ' + name);
                        }
                    }

                    if (typeof objStruct.include !== 'undefined')
                        bypass(objStruct.include, path, (count < number ? space + '│ ' : space + '  '));
                }
                else if (!fsUtil.existsSync(path))
                {
                    var content = '';
                    if (self._pathToTemplates && typeof objStruct.template !== 'undefined')
                    {
                        var templates = objStruct.template.split(',');

                        templates.map(function (template)
                        {
                            var pathToTemplate = $path.resolve(self._pathToTemplates + '/' + template);

                            if (fsUtil.existsSync(pathToTemplate) && $fs.lstatSync(pathToTemplate).isFile())
                                content += $fs.readFileSync(pathToTemplate);
                        });
                    }
                    else if (typeof objStruct.content !== 'undefined') content = objStruct.content;

                    $fs.writeFileSync(path, content, 'UTF-8');

                    if (number > count) graph.push(space + '├ ' + name);
                    else graph.push(space + '└ ' + name);
                }

                count++;
            }
        })(self._struct, self._destination);

        graph.forEach(function (line) { console.log(line); });
    }
    catch (err)
    {
        throw new $swiftErrors.SystemError('не удалось построить структуру директорий в "DBuilder". Возикла системная ошибка: ' + err.message).setInfo(err);
    }

    return self;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.DBuilder = DBuilder;