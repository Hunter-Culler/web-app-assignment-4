/*
    Hunter Culler and Ian Anderson
    University of Colorado Denver CSCI 4800 E01
    Web Application Developement
    Group Assignment 4

    May 12th, 2021

    Status = functional

*/
"use strict"

const { error } = require("jquery");
const { reset } = require("nodemon");
const hashtag = require("../models/hashtag");

const User = require("../models/user"),
    Post = require("../models/post"),
    passport = require("passport"),
    jsonWebToken = require("jsonwebtoken"),
    mongoose = require("mongoose"),
    getUserParams = body => {
        return {
            firstname: body.firstname,
            lastname: body.lastname,
            username: body.username,
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
                console.log(`(index) Error fetching user data: ${error.message}`);
                next(error);
            })
    },

    //----------------------------------------------------------------------------------------------//
    indexView: (req, res) => {
        res.render("users/index");
    },

    //----------------------------------------------------------------------------------------------//
    new: (req, res) => {
        res.render("users/new");
    },

    //----------------------------------------------------------------------------------------------//
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath != undefined) {
            res.redirect(redirectPath);
        }
        else {
            next();
        }
    },

    //----------------------------------------------------------------------------------------------//
    show: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(`(show) Error fetching user by ID: ${error.message}`);
            })
    },

    //----------------------------------------------------------------------------------------------//
    showView: (req, res) => {
        res.render(users / show);
    },

    //----------------------------------------------------------------------------------------------//
    edit: (req, res) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.locals.currentUser = user;
                next();
            })
            .catch(error => {
                console.log(`(edit) Error fetching user by ID: ${error.message}`);
                next(error);
            })
    },

    //----------------------------------------------------------------------------------------------//
    showEdit: (req, res) => {
        res.render("users/edit");
    },

    //----------------------------------------------------------------------------------------------//
    update: (req, res, next) => {
        let userId = req.params.id,
            userParams = getUserParams(req.body);
        let updatedUser = new User({
            name: {
                first: req.body.first,
                last: req.body.last,
            },
            email: req.body.email,
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
                console.log(`(update) Error updating user by ID: ${error.message}`);
                next(error);
            });
    },

    //----------------------------------------------------------------------------------------------//
    create: (req, res, next) => {
        if (req.skip) return next();
        let userParams = getUserParams(req.body);
        console.log(userParams);
        let newUser = new User(userParams);
        //newUser.Handle = newUser.Username;
        User.register(newUser, req.body.password, (error, user) => {
            if (user) {
                //display flash message
                req.flash("success", 'User Account Successfully Created!');
                newUser.save();
                res.locals.redirect = "/";
                next();
            }
            else {
                //display flash message
                req.flash("error", `Failed to create user account because 
                of the follwoing errors: ${error.message}`);
                res.locals.redirect = "/signup";
                next();
            }
        });
    },

    //----------------------------------------------------------------------------------------------//
    validate: (req, res, next) => {

        req
            .sanitizeBody("email")
            .normalizeEmail({
                all_lowercase: true
            })
            .trim();
        req.check("email", "email is not valid!").isEmail();

        req
            .check("zipCode", "Zip code is invalid")
            .notEmpty()
            .isInt()
            .isLength({
                min: 5,
                max: 5
            })
            .equals(req.body.zipCode);
        
        req.check("firstname", "First name can not be empty.").notEmpty();

        req.check("lastname", "Last name can not be empty.").notEmpty();

        req.check("username", "Username can not be empty.").notEmpty();

        req.check("password", "Password can not be empty.").notEmpty();

        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                let messages = error.array().map(e => e.msg);
                req.flash("error", messages.join(" and "));
                req.skip = true;
                res.local.redirect = "/signup";
                next();
            }
            else
                next();
        });
    },

    //----------------------------------------------------------------------------------------------//
    /* Version provided by Matthew*/
    //not actually used since I couldn't figure out how to access the user object inside
    authenticate: passport.authenticate("local", {
        failureRedirect: "/",
        failureFlash: true,
        successRedirect: "/",
        successFlash: "Logged in!"
    }),
    

//----------------------------------------------------------------------------------------------//
/*
    verifyJWT: (req, res, next) => {
        let token = req.headers.token;
        if (token) {
        jsonWebToken.verify(token, "secret_encoding_passphrase", (errors, payload) => {
            if (payload) {
            User.findById(payload.data).then(user => {
                if (user) {
                    next();
                } else {
                    res.status(httpStatus.FORBIDDEN).json({
                        error: true,
                        success: false,
                        failureFlash: "Incorrect Info! Please check your username and password and try again"
                        //message: "No User account found."
                    });
                }
            });
            } else {
            res.status(httpStatus.UNAUTHORIZED).json({
                error: true,
                message: "Cannot verify API token."
            });
            next();
            }
            });
        } else {
            res.status(httpStatus.UNAUTHORIZED).json({
                error: true,
                message: "Provide Token"
            });
        }
    },
*/
//----------------------------------------------------------------------------------------------//
    delete: (req, res, next) => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
            .then(() => {
                req.flash("success", `User deleted successfully`);
                res.locals.redirect = "/users";
                next();
            })
            .catch(error => {
                console.log(`(delete) Error fetching user by ID: ${error.message}`);
                next(error);
            })
    },

    //----------------------------------------------------------------------------------------------//
    login: (req, res, next) => {
        const db = mongoose.connection;
        var dbo = db

        var queryUsername = { username: req.body.username, password: req.body.password };
        //var queryPassword = { password: req.body.password };
        //var queryResult;
        console.log(queryUsername);
        dbo.collection("users").findOne(queryUsername)
            .then(result => {
                if (result) {
                    res.locals.redirect = `users/home/${result._id}`;
                    res.locals.currentUser = result;
                    next();
                } else {
                    console.log("No document matches the provided query.");
                    res.render("users/login");
                    next();
                }
            })
            .catch(err => console.error(`Failed to find document: ${err}`));
    },

    //----------------------------------------------------------------------------------------------//
    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/";
        console.log(res.locals.redirect);
        next();
    },

    //----------------------------------------------------------------------------------------------//
    showUserPage: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.locals.currentUser = user;
                next();
            })
            .catch(error => {
                console.log(`(showUserPage) Error fetching user by ID: ${error.message}`);
            })
    },

    //----------------------------------------------------------------------------------------------//
    showViewUserPage: (req, res) => {
        res.render("users/page");
    },

    //----------------------------------------------------------------------------------------------//
    showHome: (req, res, next) => {
        console.log(req.params);
        let userId = req.params.id;
        User.findById(userId)
        .then(user => {
            res.locals.currentUser = user;
            Post.find().sort({ createdAt: `descending` })
            .then(posts => {
                res.locals.posts = posts;
                hashtag.find().sort({occurrences: `descending`})
                .then(hashtags => {
                    res.locals.hashtags = hashtags;
                    User.find()
                    .then(users => {
                        res.locals.users = users;
                        next();
                    })
                    .catch(error => {
                        console.log(`Error fetching users data: ${error.message}`);
                        next(error);
                    })
                })
                .catch(error => {
                    console.log(`Error fetching hashtag data: ${error.message}`);
                    next(error);
                })
            })
            .catch(error => {
                console.log(`Error fetching post data: ${error.message}`);
                next(error);
            })
        })
        .catch(error => {
            console.log(`Error fetching user by ID: ${error.message}`);
        })
    
    },

    //----------------------------------------------------------------------------------------------//
    showViewHome: (req, res) => {
        res.render("users/home");
    },

    //----------------------------------------------------------------------------------------------//
    showPosts: (req, res, next) => {
        let userId = req.params.id;
        console.log("In show posts");

        const db = mongoose.connection;
        var dbo = db

        User.findById(userId)
            .then(user => {
                res.locals.currentUser = user;

                var queryID = { posterID: userId };

                Post.find(queryID)
                    .then(posts => {
                        console.log(posts);
                        res.locals.posts = posts;
                        next();
                    })
                    .catch(error => {
                        console.log(`Error fetching post data: ${error.message}`);
                        next(error);
                    })
            })
            .catch(error => {
                console.log(`(showPosts) Error fetching post by ID: ${error.message}`);
                next(error);
            })
    },

    //----------------------------------------------------------------------------------------------//
    showViewPosts: (req, res) => {
        console.log("rendering posts page");
        res.render("users/posts");
    },

    //----------------------------------------------------------------------------------------------//
    addFriend: (req, res, next) => {
        let userId = req.params.id;
        
        User.findById(userId)
            .then(user => {
                console.log(user.username);
                user.friends.push();
                next();
            })
            .catch(error => {
                console.log(`Error fetching user by ID: ${error.message}`);
                next(error);
            })
    },

    //----------------------------------------------------------------------------------------------//
    getLogInPage: (req, res) => {
        res.render("users/login");
    },

    //----------------------------------------------------------------------------------------------//
    getSignUpPage: (req, res) => {
        res.render("/signup");
    },

    //----------------------------------------------------------------------------------------------//
    signIn: (req, res) => {

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
            if (data) {
                console.log("Successfully signed in!");
            }
            else {
                res.render("/login");
            }
        });
    },

    //----------------------------------------------------------------------------------------------//
    getAllUsers: (req, res) => {
    user.find([])
        .exec()
        .then(users => {
            res.render("users", { users: users })
        })
        .catch((error) => {
            console.log(error);
            return [];
        })
        .then(() => {
            console.log("promise complete");
        })
    },

    //----------------------------------------------------------------------------------------------//
    // Function for signing up
    signUp: (req, res) => {
    // Make user object with entered parameters
    let user = new User({
        username: req.body.txtUsername,
        password: req.body.txtPassword,
        fname: req.body.txtFirstname,
        lname: req.body.txtLastname,
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
        .catch(error => { res.send(error) });

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
}

/*  !!TO HUNTER!!: MOVED ALL THE BELOW FUNCTIONS INTO THE MODULE.EXPORTS FOR CONSISTANCY
//----------------------------------------------------------------------------------------------//
exports.getLogInPage = (req, res) => {
    res.render("/login");
}

//----------------------------------------------------------------------------------------------//
exports.getSignUpPage = (req, res) => {
    res.render("/signup");
}

//----------------------------------------------------------------------------------------------//
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
        if (data) {
            console.log("Successfully signed in!");
        }
        else {
            res.render("login");
        }
    });
}

//----------------------------------------------------------------------------------------------//
exports.getAllUsers = (req, res) => {
    user.find([])
        .exec()
        .then(users => {
            res.render("users", { users: users })
        })
        .catch((error) => {
            console.log(error);
            return [];
        })
        .then(() => {
            console.log("promise complete");
        })
}

//----------------------------------------------------------------------------------------------//
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
        .catch(error => { res.send(error) });

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
//}

