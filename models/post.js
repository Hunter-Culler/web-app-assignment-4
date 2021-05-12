/*
	Hunter Culler and Ian Anderson
	University of Colorado Denver CSCI 4800 E01
	Web Application Developement
	Group Assignment 4

	May 12th, 2021

	Status = Functional

*/

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