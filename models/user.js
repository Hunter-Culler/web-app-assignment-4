/*
	Hunter Culler and Ian Anderson
	University of Colorado Denver CSCI 4800 E01
	Web Application Developement
	Group Assignment 4

	March 31st, 2021

	Status = Functional

*/

"use strict"

const mongoose = require("mongoose"),
{ Schema } = require("mongoose"),
passport = require('passport'),
passportLogicalMongoose = require("passport-local-mongoose"),
userSchema = new mongoose.Schema(
    {
        username: String,
        password: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        dob: Date,
        gender: String,
        telephone: String,
        email: {
            type: String,
            required: true,
            unique: true
        },
        address: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            zipCode: {
                type: Number,
            min: [10000, "Zip code too short"],
            max: 99999
            }
        },
        sec_question: String,
        sec_answer: String
    }
);

userSchema.plugin(passportLogicalMongoose, {
    usernameField: "username"
});

module.exports = mongoose.model("User", userSchema);