/*
	Hunter Culler and Ian Anderson
	University of Colorado Denver CSCI 4800 E01
	Web Application Developement
	Group Assignment 4

	March 31st, 2021

	Status = functional

*/
"use strict"

const { reset } = require("nodemon");

const User = require("../models/user"),
//Post = require("..models/post"),
passport = require("passport"),
mongoose = require("mongoose"),
getUserParams = body => {
    return {
        username: body.username,
        password: body.passoword,
        firstname: body.firstname,
        lastname: body.lastname,
        dob: body.dob,
        gender: body.gender,
        telephone: body.telephone,
        email: body.email,
        address: {
            street: body.street,
            city: body.city,
            state: body.state,
            zipCode: body.zipCode
        },
        sec_question: body.sec_question,
        sec_answer: body.sec_answer
    };
};


module.exports = {
    index: (req, res, next) => {
        User.find()
        .then(users => {
            res.locals.users = users;
            next();
        })
        .catch(error => {
            console.log(`Error fetching user data: ${error.message}`);
            next(error);
        })
    },

    indexView: (req, res) => {
        res.render("users/index");
    },

    new: (req, res) => {
        res.render("users/new");
    },

    create: (req, res, next) => {
        let newUser = new User({
            name: {
                first: req.body.first,
                last: req.body.last,
            },
            email: req.body.email,
            password: req.body.password,
            zipCode: req.body.zipCode
        });
        user.removeAllListeners(mewUser)
        .then( user => {
            res.locals.user = user;
            res.locals.redirect = "/users";
            next();
        })
        .catch(error =>{
            console.log(`Error saving user: ${error.message}`);
            next(error);
        })
    },

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined){
            res.redirect(redirectPath);
        }
        else{
            next();
        }
    },

    show: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
        .then(user => {
            res.locals.user = user;
            next();
        })
        .catch(error => {
            console.log(`Error fetching user by ID: ${error.message}`);
        })
    },

    showView: (req, res) => {
        res.render(users/show);
    },

    edit: (req, res) => {
        let userId = req.params.id;
        User.findById(userId)
        .then(user => {
            res.locals.currentUser = user;
            next();
        })
        .catch(error => {
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);
        })
    },
    showEdit: (req, res) => {
        res.render("users/edit");
    },
    update: (req, res, next) => {
        let userId = req.params.id,
        userParams = getUserParams(req.body);
        let updatedUser = new User({
            name: {
                first: req.body.first,
                last: req.body.last,
            },
            email: req.body.email,
            password: req.body.password,
            zipCode: req.body.zipCode
        })
        User.findByIdAndUpdate(userId, {
            $set: userParams
        })
        .then(user => {
            res.locals.redirect = `/users/${user._id}/userPage`;
            next();
        })
        .catch(error => {
            console.log(`Error updating user by ID: ${error.message}`);
            next(error);
        });
    },
    create: (req, res, next) => {
        if (req.skip) return next();
        let userParams = getUserParams(req.body);

        let newUser = new User(userParams);
        newUser.Handle = newUser.Username;
        var min = Math.ceil(10000);
        var max = Math.floor(99999);
        newUser.UniqueID = Math.floor(Math.random() * (max - min + 1)) + min;
    },
    delete: (req, res, next) => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
        .then(() =>{
            res.locals.redirect = "/users";
            next();
        })
        .catch(error => {
            console.log(`Error fetching user by ID: ${error.message}`);
            next(error);
        })
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath != undefined) res.redirect(redirectPath);
        else next();
    },
    login: (req, res, next) => {
        
    }
}

exports.getLogInPage = (req, res) => {
    res.render("/login");
}

exports.getSignUpPage = (req, res) => {
    res.render("/signup");
}

// Function for signing into the site
exports.signIn = (req, res) => {
    
    // Make user object with the entered parameters
    let user = new User({
        username: req.body.username,
        password: req.body.password
    });

    // Search database for user with entered username and check if the entered password matches what is on file
    var myQuery = User.findOne({
        username: user.username
    })
    .where("password", user.password);

    // Check if a user was found, if not then returns to login screen
    myQuery.exec((error, data) => {
        if(data) {
            console.log("Successfully signed in!");
        }
        else {
            res.render("login");
        }
    });
}

exports.getAllUsers = (req,res) => {
    user.find([])
    .exec()
    .then(users => {
        res.render("users", {users: users})
    })
    .catch((error) => {
        console.log(error);
        return [];
    })
    .then(() => {
        console.log("promise complete");
    })
}

// Function for signing up
exports.signUp = (req, res) => {
    // Make user object with entered parameters
    let user = new User({
        username: req.body.txtUsername,
        password: req.body.txtPassword,
        fname: req.body.txtFirstname,
        lname: req.body.txtLastname,
        //dob: IDBOpenDBRequest.body.txtDOB,
        dob: req.body.txtDOB,
        gender: req.body.gender,
        telephone: req.body.txtTel,
        email: req.body.txtEmail,
        address: req.body.txtAddress + ', ' + req.body.txtCity + ', ' + req.body.txtState + ', ' + req.body.txtZip,
        sec_question: req.body.dlSecurity,
        sec_answer: req.body.txtSecurity
    });

    // Save user to database
    user.save()
    .then(() => {
        res.render("thanks")
    })
    .catch(error => { res.send(error)});

    //Below code is for checking if a user already exists with the entered email address, and if so stops the account from being made
    /*
    var myQuery = User.findOne({
        email: user.email
    })
    .where("email", user.email);

    myQuery.exec((error, data) => {
        if(data) {
            var email = document.getElementById("txtEmail");
            email.classList.add("exists");
            res.render("signup");
        }
        else {
            var email = document.getElementById("txtEmail");
            email.classList.remove("exists");
            console.log("Successfully created account");
        }
    });
    */
}