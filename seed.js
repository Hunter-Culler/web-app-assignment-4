"use strict"

const mongoose = require("mongoose"),
User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/social_media_website", { useNewUrlParser: true, useFindAndModify: false });
mongoose.connection;

var users = [
    {
        firstname: Hunter,
        lastname: Culler,
        username: hunterwc,
        password: password1,
        dob: 05/26/1994,
        gender: "Male",
        telephone: "720-440-3370",
        email: "hunterwc@gmail.com",
        address: {
            street: "11673 Grant Street",
            city: "Northglenn",
            state: "CO",
            zipCode: 80233
        },
        sec_question: "What is your mother's maiden name?",
        sec_answer: "Watson"
    }
]