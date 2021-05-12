"use strict"

const mongoose = require('mongoose'),
{ Schema } = require('mongoose'),
postSchema = new Schema(
    {
        postId: {
            type: Number,
            unique: true,
            default: 0
        },
        posterId: {
            type: String,
            required: true
        },
        username: {
            type: String
        },
        caption: {
            type: String
        },
        comments: [
            {
                type: String
            }
        ],
        hashtags: [
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