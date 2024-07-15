'use strict';

var npmCheck = require('./in');
var createState = require('./state/state');

async function init(userOptions) {
    return npmCheck((await createState(userOptions)));
}

module.exports = init;