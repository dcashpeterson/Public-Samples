'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chalk = require('chalk');
var execa = require('execa');
var ora = require('ora');

function install(packages, currentState) {
    if (!packages.length) {
        return _promise2.default.resolve(currentState);
    }

    var installer = currentState.get('installer');
    var color = chalk.supportsColor ? '--color=always' : null;

    var isYarn = installer === 'yarn';

    var installGlobal = currentState.get('global') ? isYarn ? 'global' : '--global' : null;
    var saveExact = currentState.get('saveExact') ? isYarn ? '--exact' : '--save-exact' : null;

    var installCmd = isYarn ? 'add' : 'install';

    var npmArgs = [installCmd].concat(installGlobal).concat(saveExact).concat(packages).concat(color).filter(Boolean);

    console.log('');
    console.log('$ ' + chalk.green(installer) + ' ' + chalk.green(npmArgs.join(' ')));
    var spinner = ora('Installing using ' + chalk.green(installer) + '...');
    spinner.enabled = spinner.enabled && currentState.get('spinner');
    spinner.start();

    return execa(installer, npmArgs, { cwd: currentState.get('cwd') }).then(function (output) {
        spinner.stop();
        console.log(output.stdout);
        console.log(output.stderr);

        return currentState;
    }).catch(function (err) {
        spinner.stop();
        throw err;
    });
}

module.exports = install;