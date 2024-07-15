'use strict';

var chalk = require('chalk');
var installPackages = require('./install-packages');
var emoji = require('./emoji');

function buildPackageToUpdate(moduleName, version, isYarn, saveExact) {
    // handle adding ^ for yarn, npm seems to handle this if not exact
    return isYarn && !saveExact ? moduleName + '@^' + version : moduleName + '@' + version;
}

function updateAll(currentState) {
    var packages = currentState.get('packages');

    if (currentState.get('debug')) {
        console.log('packages', packages);
    }

    var packagesToUpdate = packages.filter(function (packageEntry) {
        return packageEntry.mismatch || packageEntry.notInstalled || packageEntry.bump;
    });

    if (!packagesToUpdate.length) {
        console.log(emoji(':heart:  ') + 'Your modules look ' + chalk.bold('amazing') + '. Keep up the great work.' + emoji(' :heart:'));
        return;
    }

    var isYarn = currentState.get('installer') === 'yarn';
    var saveExact = currentState.get('saveExact');

    var saveDependencies = packagesToUpdate.filter(function (pkg) {
        return !pkg.devDependency;
    }).map(function (pkg) {
        return buildPackageToUpdate(pkg.moduleName, pkg.latest, isYarn, saveExact);
    });

    var saveDevDependencies = packagesToUpdate.filter(function (pkg) {
        return pkg.devDependency;
    }).map(function (pkg) {
        return buildPackageToUpdate(pkg.moduleName, pkg.latest, isYarn, saveExact);
    });

    var updatedPackages = packagesToUpdate.map(function (pkg) {
        return buildPackageToUpdate(pkg.moduleName, pkg.latest, isYarn, saveExact);
    }).join(', ');

    if (!currentState.get('global')) {
        if (saveDependencies.length) {
            !isYarn && saveDependencies.push('--save');
        }

        if (saveDevDependencies.length) {
            isYarn ? saveDevDependencies.push('--dev') : saveDevDependencies.push('--save-dev');
        }
    }

    return installPackages(saveDependencies, currentState).then(function (currentState) {
        return installPackages(saveDevDependencies, currentState);
    }).then(function (currentState) {
        console.log('');
        console.log(chalk.green('[npm-check] Update complete!'));
        console.log(chalk.green('[npm-check] ' + updatedPackages));
        console.log(chalk.green('[npm-check] You should re-run your tests to make sure everything works with the updates.'));
        return currentState;
    });
}

module.exports = updateAll;