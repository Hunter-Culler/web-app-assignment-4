"use strict"

const mongoose = require('mongoose'),
{ Schema } = require('mongoose'),
postSchema = new Schema(
    {
        posterId: {
            type: String,
            required: true
        },
        username: {
            type: String
        },
        comments: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema);