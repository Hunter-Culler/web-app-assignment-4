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