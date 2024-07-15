#!/usr/bin/env node

'use strict';

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var meow = require('meow');
var updateNotifier = require('update-notifier');
var isCI = require('is-ci');
var createCallsiteRecord = require('callsite-record');
var pkg = require('../package.json');
var npmCheck = require('./index');
var staticOutput = require('./out/static-output');
var interactiveUpdate = require('./out/interactive-update');
var updateAll = require('./out/update-all');
var debug = require('./state/debug');
var pkgDir = require('pkg-dir');
var detectPreferredPM = require('preferred-pm');

updateNotifier({ pkg: pkg }).notify();

/* eslint-disable indent */
var cli = meow('\n        Usage\n          $ npm-check <path> <options>\n\n        Path\n          Where to check. Defaults to current directory. Use -g for checking global modules.\n\n        Options\n          -u, --update          Interactive update.\n          -y, --update-all      Uninteractive update. Apply all updates without prompting.\n          -g, --global          Look at global modules.\n          -s, --skip-unused     Skip check for unused packages.\n          -p, --production      Skip devDependencies.\n          -d, --dev-only        Look at devDependencies only (skip dependencies).\n          -i, --ignore          Ignore dependencies based on succeeding glob.\n          -E, --save-exact      Save exact version (x.y.z) instead of caret (^x.y.z) in package.json.\n          --specials            List of depcheck specials to include in check for unused dependencies.\n          --no-color            Force or disable color output.\n          --no-emoji            Remove emoji support. No emoji in default in CI environments.\n          --debug               Debug output. Throw in a gist when creating issues on github.\n\n        Examples\n          $ npm-check           # See what can be updated, what isn\'t being used.\n          $ npm-check ../foo    # Check another path.\n          $ npm-check -gu       # Update globally installed modules by picking which ones to upgrade.\n    ', {
    flags: {
        update: {
            type: 'boolean',
            alias: 'u'
        },
        updateAll: {
            type: 'boolean',
            alias: 'y'
        },
        global: {
            type: 'boolean',
            alias: 'g'
        },
        skipUnused: {
            type: 'boolean',
            alias: 's'
        },
        production: {
            type: 'boolean',
            alias: 'p'
        },
        devOnly: {
            type: 'boolean',
            alias: 'd'
        },
        saveExact: {
            type: 'boolean',
            alias: 'E'
        },
        ignore: {
            type: 'string',
            alias: 'i'
        },
        specials: {
            type: 'string'
        },
        color: {
            type: 'boolean'
        },
        emoji: {
            type: 'boolean',
            default: !isCI
        },
        debug: {
            type: 'boolean'
        },
        spinner: {
            type: 'boolean',
            default: !isCI
        }
    }
});

/* eslint-enable indent */

var options = {
    cwd: cli.input[0] || pkgDir.sync() || process.cwd(),
    update: cli.flags.update,
    updateAll: cli.flags.updateAll,
    global: cli.flags.global,
    skipUnused: cli.flags.skipUnused,
    ignoreDev: cli.flags.production,
    devOnly: cli.flags.devOnly,
    saveExact: cli.flags.saveExact,
    specials: cli.flags.specials,
    emoji: cli.flags.emoji,
    installer: process.env.NPM_CHECK_INSTALLER || 'auto',
    debug: cli.flags.debug,
    spinner: cli.flags.spinner,
    ignore: cli.flags.ignore
};

if (options.debug) {
    debug('cli.flags', cli.flags);
    debug('cli.input', cli.input);
}

_promise2.default.resolve().then(function () {
    return options.installer === 'auto' ? detectPreferredInstaller(options.cwd) : options.installer;
}).then(function (installer) {
    options.installer = installer;
    return npmCheck(options);
}).then(function (currentState) {
    currentState.inspectIfDebugMode();

    if (options.updateAll) {
        return updateAll(currentState);
    }

    if (options.update) {
        return interactiveUpdate(currentState);
    }

    return staticOutput(currentState);
}).catch(function (error) {
    console.log(error.message);

    if (options.debug) {
        console.log(createCallsiteRecord(error).renderSync());
    } else {
        console.log('For more detail, add `--debug` to the command');
    }

    process.exit(1);
});

var SUPPORTED_INSTALLERS = new _set2.default(['npm', 'pnpm', 'ied', 'yarn']);

async function detectPreferredInstaller(cwd) {
    var preferredPM = await detectPreferredPM(cwd);
    return preferredPM && SUPPORTED_INSTALLERS.has(preferredPM.name) ? preferredPM.name : 'npm';
}