'use strict';

var util = require('util');
var path = require('path');
var express = require('express');
var router = express.Router();
var notes = require(process.env.NOTES_MODEL ? path.join('..', process.env.NOTES_MODEL) : '../models/notes-memory');

const log   = require('debug')('notes:router-home');
const error = require('debug')('notes:error');

/* GET home page. */
router.get('/', function(req, res, next) {
    var notelist;
    notes.keylist()
    .then(keylist => {
        var keyPromises = keylist.map(key => {
            return notes.read(key).then(note => {
                return { key: note.key, title: note.title };
            });
        });
        return Promise.all(keyPromises);
    })
    .then(notelist => {
        var user = req.user ? req.user : undefined;
        res.render('index', {
            title: 'Notes',
            notelist: notelist,
            user: user,
            breadcrumbs: [
                { href: '/', text: 'Home' }
            ]
        });
    })
    .catch(err => { error(err); next(err); });
});

module.exports = router;
