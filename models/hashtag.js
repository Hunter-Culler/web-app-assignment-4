/*
	Hunter Culler and Ian Anderson
	University of Colorado Denver CSCI 4800 E01
	Web Application Developement
	Group Assignment 4

	May 12th, 2021

	Status = Functional

*/

"use strict"

const { internalServererror } = require('../controllers/errorController');

const mongoose = require('mongoose'),
{ Schema } = require('mongoose'),
hashtagSchema = new Schema(
    {
        hashtag: {
            type: String
        },
        occurrences: {
            type: Number,
            default: 0
        }
    }
);

module.exports = mongoose.model("Hashtag", hashtagSchema);