const express = require('express');

module.exports = function(app) {
    app.set('view engine', 'pug');
    app.set('views', './views') // default path to where we store the views/templates
}