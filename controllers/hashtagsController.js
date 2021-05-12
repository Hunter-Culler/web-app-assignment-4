"use strict"

const { reset } = require("nodemon");
const Hashtag = require("../models/hashtag");

module.exports = {
    getTrending: (req, res, next) => {
        Hashtag.find()
        .then(hashtags => {
            console.log(hashtags);
        })
    }
}