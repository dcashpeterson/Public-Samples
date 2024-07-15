'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var depcheck = require('depcheck');
var ora = require('ora');
var _ = require('lodash');

var _require = require('rc-config-loader'),
    rcFile = _require.rcFile;

function skipUnused(currentState) {
    return currentState.get('skipUnused') || // manual option to ignore this
    currentState.get('global') || // global modules
    currentState.get('update') || // in the process of doing an update
    !currentState.get('cwdPackageJson').name; // there's no package.json
}

function loadRcFile(rcFileName) {
    try {
        var results = rcFile(rcFileName);
        // Not Found
        if (!results) {
            return {};
        }
        return results.config;
    } catch (error) {
        console.error('Error parsing rc file; skipping it; error: ' + error.message);
        return {}; // default value
    }
}

function getSpecialParsers(currentState) {
    var specialsInput = currentState.get('specials');
    if (!specialsInput) return;
    return specialsInput.split(',').map(function (special) {
        return depcheck.special[special];
    }).filter(Boolean);
}

function checkUnused(currentState) {
    var spinner = ora('Checking for unused packages. --skip-unused if you don\'t want this.');
    spinner.enabled = spinner.enabled && currentState.get('spinner');
    spinner.start();

    return new _promise2.default(function (resolve) {
        if (skipUnused(currentState)) {
            resolve(currentState);
            return;
        }

        var depcheckDefaults = {
            ignoreDirs: ['sandbox', 'dist', 'generated', '.generated', 'build', 'fixtures', 'jspm_packages'],
            ignoreMatches: ['gulp-*', 'grunt-*', 'karma-*', 'angular-*', 'babel-*', 'metalsmith-*', 'eslint-plugin-*', '@types/*', 'grunt', 'mocha', 'ava'],
            specials: getSpecialParsers(currentState)
        };

        var npmCheckRc = loadRcFile('npmcheck');

        var depcheckOptions = (0, _extends3.default)({}, depcheckDefaults, npmCheckRc.depcheck);

        depcheck(currentState.get('cwd'), depcheckOptions, resolve);
    }).then(function (depCheckResults) {
        spinner.stop();
        var unusedDependencies = [].concat(depCheckResults.dependencies, depCheckResults.devDependencies);
        currentState.set('unusedDependencies', unusedDependencies);

        var cwdPackageJson = currentState.get('cwdPackageJson');

        // currently missing will return devDependencies that aren't really missing
        var missingFromPackageJson = _.omit(depCheckResults.missing || {}, (0, _keys2.default)(cwdPackageJson.dependencies), (0, _keys2.default)(cwdPackageJson.devDependencies));
        currentState.set('missingFromPackageJson', missingFromPackageJson);
        return currentState;
    });
}

module.exports = checkUnused;