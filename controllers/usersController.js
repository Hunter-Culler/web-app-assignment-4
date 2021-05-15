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
                req.flash("error", `Failed to fetch user account data because 
                of the follwoing errors: ${error.message}`);
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
                req.flash("error", `Failed to show user account because 
                of the follwoing errors: ${error.message}`);
                console.log(`(show) Error fetching user by ID: ${error.message}`);
            })
    },

    //----------------------------------------------------------------------------------------------//
    showView: (req, res) => {
        res.render(users / show);
    },

    //----------------------------------------------------------------------------------------------//
    edit: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
                res.locals.currentUser = user;
                next();
            })
            .catch(error => {
                req.flash("error", `Failed to edit user account because 
                of the follwoing errors: ${error.message}`);
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
                res.locals.redirect = `/users/${user._id}/page`;
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

        // validate email
        req
            .sanitizeBody("email")
            .normalizeEmail({
                all_lowercase: true
            })
            .trim();
        req.check("email", "email is not valid!").isEmail();

        //validate zipcode
        req
            .check("zipCode", "Zip code is invalid")
            .notEmpty()
            .isInt()
            .isLength({
                min: 5,
                max: 5
            })
            .equals(req.body.zipCode);
        
        //validate name, username and passsword
        req.check("firstname", "First name can not be empty.").notEmpty();

        req.check("lastname", "Last name can not be empty.").notEmpty();

        req.check("username", "Username can not be empty.").notEmpty();

        req.check("password", "Password can not be empty.").notEmpty();

        //make sure password matched the confrim password field
        req.check("password", "confirm password field did not match up")
        .equals(req.body.confirmPassword);

        //get result of validation
        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                let messages = error.array().map(e => e.msg);
                req.flash("error", messages.join(" and "));
                req.skip = true;
                res.locals.redirect = "/signup";
                next();
            }
            else
                next();
        });
    },

    //----------------------------------------------------------------------------------------------//
    //not actually used since I couldn't figure out how to access the user object inside
    authenticate: passport.authenticate("local", {
        failureRedirect: "/",
        failureFlash: true,
        successRedirect: "/",
        successFlash: "Logged in!"
    }),
    
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
                req.flash("error", `Failed to delete user account because 
                of the follwoing errors: ${error.message}`),
                console.log(`(delete) Error deleting user by ID: ${error.message}`);
                next(error);
            })
    },

    //----------------------------------------------------------------------------------------------//
    login: (req, res, next) => {
        const db = mongoose.connection;
        var dbo = db

        var queryUsername = { username: req.body.username, password: req.body.password };

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
            .catch(
                req.flash("error", `Failed to login user account`),
                err => console.error(`Failed to find document: ${err}`
                ));
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
                res.locals.pageUser = user;
                next();
            })
            .catch(error => {
                req.flash("error", `Failed to show user page because 
                of the follwoing errors: ${error.message}`);
                console.log(`(showUserPage) Error fetching user by ID: ${error.message}`);
            })
    },

    //----------------------------------------------------------------------------------------------//
    showViewUserPage: (req, res) => {
        res.render("users/page");
    },

    //----------------------------------------------------------------------------------------------//
    showHome: (req, res, next) => {
        let userId = req.params.id;
        //get current user
        User.findById(userId)
        .then(user => {
            res.locals.currentUser = user;
            //display posts with newest first
            Post.find().sort({ createdAt: `descending` })
            .then(posts => {
                res.locals.posts = posts;
                //display top 10 occurring hashtags
                hashtag.find().sort({occurrences: `descending`}).limit(10)
                .then(hashtags => {
                    res.locals.hashtags = hashtags;
                    //display all users on the site
                    User.find()
                    .then(users => {
                        res.locals.users = users;
                        next();
                    })
                    .catch(error => {
                        req.flash("error", `Failed to fetch user data because 
                        of the follwoing errors: ${error.message}`);
                        console.log(`Error fetching users data: ${error.message}`);
                        next(error);
                    })
                })
                .catch(error => {
                    req.flash("error", `Failed to fetch hashtag because 
                    of the follwoing errors: ${error.message}`);
                    console.log(`Error fetching hashtag data: ${error.message}`);
                    next(error);
                })
            })
            .catch(error => {
                req.flash("error", `Failed to post user data because 
                of the follwoing errors: ${error.message}`);
                console.log(`Error fetching post data: ${error.message}`);
                next(error);
            })
        })
        .catch(error => {
            req.flash("error", `Failed to fetch user by ID because 
            of the follwoing errors: ${error.message}`);
            console.log(`Error fetching user by ID: ${error.message}`);
        })
    
    },

    //----------------------------------------------------------------------------------------------//
    showAllPosts: (req, res, next) => {
        let userId = req.params.id;
        console.log("In show posts");

        const db = mongoose.connection;
        var dbo = db

        User.findById(userId)
            .then(user => {
                res.locals.currentUser = user;

                //var queryID = { posterID: userId };

                Post.find()
                    .then(posts => {
                        console.log(posts);
                        res.locals.posts = posts;
                        next();
                    })
                    .catch(error => {
                        req.flash("error", `Failed to fetch post data because 
                        of the follwoing errors: ${error.message}`);
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
                        req.flash("error", `Failed to fetch post data because 
                        of the follwoing errors: ${error.message}`);
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
        console.log()
        let currUser = res.locals.currentUser;
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
        if (currUser) {
                console.log("User:");
                console.log(currUser);
                console.log("Added Friend:");
                console.log(user.username);
                User.findByIdAndUpdate(currUser, {
                    $addToSet: {
                        friends: userId,
                        friendsUsername: user.username
                    }
                })
                .then(() => {
                    next();
                })
                .catch(error => {
                    req.flash("error", `Failed to follow user account because 
                    of the follwoing errors: ${error.message}`);
                    console.log(`Error fetching user by ID: ${error.message}`);
                    next(error);
                });
        }})    
    },
    

    //----------------------------------------------------------------------------------------------//
    removeFriend: (req, res, next) => {
        let currUser = res.locals.currentUser;
        let userId = req.params.id;
        User.findById(userId)
            .then(user => {
        if (currUser) {
                console.log("User:");
                console.log(currUser);
                console.log("Removed Friend:");
                console.log(user.username);
                User.findByIdAndUpdate(currUser, {
                    $pull: {
                        friends: userId,
                        friendsUsername: user.username
                    }
                })
                .then(() => {
                    next();
                })
                .catch(error => {
                    req.flash("error", `Failed to unfollow user account because 
                    of the follwoing errors: ${error.message}`);
                    console.log(`Error fetching user by ID: ${error.message}`);
                    next(error);
                });
        }})
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
    }
}


