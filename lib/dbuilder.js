/**
 * Created by G@mOBEP
 *
 * Company: Realweb
 * Date: 29.01.13
 * Time: 12:34
 */
var $fs = require('fs'),
    $path = require('path'),

    DBuilderError = require('./errors/dBuilderError').DBuilderError,

    fsUtil = require('./fs'),
    typeUtil = require('./type');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function DBuilder ()
{
    /**
     * Путь к директории с шаблонами
     *
     * @type {String}
     * @private
     */
    this._pathToTemplates = null;

    /**
     * Путь к директории назначения
     *
     * @type {String}
     * @private
     */
    this._destination = null;

    /**
     * Структура директорий
     *
     * @type {Object}
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
    if (typeof pathToTemplates !== 'string' || !pathToTemplates.length) throw new DBuilderError()
        .setMessage('Не удалось задать путь к директории шаблонов. Путь не передан или представлен в недопустимом формате')
        .setCode(DBuilderError.codes.BAD_PATH_TO_TEMPLATES);
    if (!fsUtil.existsSync(pathToTemplates) || !$fs.statSync(pathToTemplates).isDirectory()) throw new DBuilderError()
        .setMessage('Не удалось задать путь к директории шаблонов. Директория (' + pathToTemplates + ') не найдена')
        .setCode(DBuilderError.codes.TEMPLATES_DIRECTORY_NOT_FOUND);

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
    if (typeof destination !== 'string' || !destination.length) throw new DBuilderError()
        .setMessage('Не удалось задать путь к директории назначения. Путь не передан или представлен в недопустимом формате')
        .setCode(DBuilderError.codes.BAD_PATH_TO_DESTINATION_DIRECOTRY);
    if (!fsUtil.existsSync(destination) || !$fs.statSync(destination).isDirectory()) throw new DBuilderError()
        .setMessage('Не удалось задать путь к директории назначения. Директория (' + destination + ') не найдена')
        .setCode(DBuilderError.codes.DESTINATION_DIRECTORY_NOT_FOUND);


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
    if (!typeUtil.isObject(struct)) throw new DBuilderError()
        .setMessage('Не удалось задать структуру каталогов. Структура не передана или представлена в недопустимом формате')
        .setCode(DBuilderError.codes.BAD_STRUCTURE);

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

    if (!self._struct) throw new DBuilderError()
        .setMessage('Не удалось создать структуру каталогов. Структура не задана')
        .setCode(DBuilderError.codes.STRUCTURE_UNDEFINED);
    if (!self._destination) throw new DBuilderError()
        .setMessage('Не удалось создать структуру каталогов. Не задан путь к директории назначения')
        .setCode(DBuilderError.codes.PATH_TO_DESTINATION_DIRECOTRY_UNDEFINED);

    try
    {
        var graph = ['Была создана следующая структура каталогов:', self._destination];

        (function bypass (struct, dest, space)
        {
            space = space || '';

            var count = 1,
                number = Object.keys(struct).length;

            for (var name in struct)
            {
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
    catch (e)
    {
        throw new DBuilderError()
            .setMessage('Во время создания структуры каталогов возникла ошибка (ответ node: ' + e.message + ')')
            .setCode(DBuilderError.codes.SYSTEM_ERROR);
    }

    return self;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.DBuilder = DBuilder;