/*
	Hunter Culler and Ian Anderson
	University of Colorado Denver CSCI 4800 E01
	Web Application Developement
	Group Assignment 4

	May 12th, 2021

	Status = Functional

*/

"use strict"

const mongoose = require("mongoose"),
{ Schema } = require("mongoose"),
passport = require('passport'),
bcrypt = require("bcrypt"),
user = require("./user"),
passportLocalMongoose = require("passport-local-mongoose"),
userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        /*
        password: {
            type: String,
            required: true
        },
        */
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
            //!!FIXME!!: potentially will exclude some valide zipCodes
            min: [10000, "Zip code too short"],
            max: 99999
            }
        },
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        
        friendsUsername: [
            {
                type: Schema.Types.String,
                ref: "User.username"
            }
        ],
        sec_question: {
            type: String,
            required: true
        },
        sec_answer: {
            type: String,
            required: true
        }
    }
);



userSchema.virtual("fullName").get(function() {
    return `${this.firstname} ${this.lastname}`;
});

/*  !!FIXME!! Hash comparisons never match properly*/
/*
userSchema.pre("save", function(next) {
    let user = this;
    console.log("Password to hash:");
    console.log(user.password);
    bcrypt.hash(user.password, 10).then(hash => {
            user.password = hash;
            next();
        })
        .catch(error => {
            console.log(`Error while hashing password: ${error.message}`);
            next(error);
        });
});
*/

userSchema.methods.passwordComparison = function(inputPassword) {
    let user = this;
    //debug checking
    console.log("Input Password?");
    console.log(inputPassword);

    return bcrypt.compare(inputPassword, user.password);
};


userSchema.plugin(passportLocalMongoose, {
    usernameField: "username",
    passwordField: "password"
});

module.exports = mongoose.model("User", userSchema);