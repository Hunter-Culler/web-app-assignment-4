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
            password: body.password,
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

        req.sanitizeBody("email".normalizeEmail({
            all_lowercase: true
        })).trim();

        req.check("email", "email is not valid!").isEmail();
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
    
    /*  Attempt with callback function
    authenticate: (req, res, next) => {
        console.log("authenticating");
        User.findOne({
            username: req.body.username,
            //password: req.body.password
        })
            .then(user => {
                if (user) {
                    console.log("User found in DB");
                    passport.authenticate("local", function (err, user, info) {
                        if (err) {
                            console.log("BLOCK 1");
                            return next(err); 
                        }
                        if (!user) {
                            console.log("BLOCK 2");
                            return res.redirect("/login"); 
                        }
                        req.logIn(user, function(err) {
                            if (err) {
                                console.log("BLOCK 3");
                                return next(err); 
                            }
                            console.log("BLOCK 4");
                            //res.locals.redirect = `/home/${user._id}`;
                            return res.redirect(`/home/${user._id}`);
                        })
                    });
                } else {
                    req.flash("error", "Failed to authenticate. User not found.");
                    res.locals.redirect = "/login";
                    next();
                }
            })
            .catch(error => {
                console.log(`Error logging in user: ${error.message}`);
                next(error);
            });
    },
    */
    
    // V3 of aunthenticate, currently lets anyone through, correct or incorrect password.
    authenticate: (req, res, next) => {
        console.log("authenticating");
        User.findOne({
            username: req.body.username,
            //password: req.body.password
        })
            .then(user => {
                if (user) {
                    console.log("User found in DB");
                    passport.authenticate("local", {
                        failureRedirect: "/",
                        failureFlash: "Failed to login!",
                        successRedirect: "/home/:id",
                        //successRedirect: `users/home/${user._id}`,
                        successFlash: "Logged in!"  
                    }),
                    //!!Important!! this line it why is will always successfully redirect regardless of password,
                    //however the server freezes without it.  I've tried to make it conditional with the function below it without success so far.
                    //authenticate is supposed to execute the subceeding event handler only when successful but again it just causes
                    //the server to freeze and even crash sometimes.
                    res.locals.redirect = `/home/${user._id}`;
                    next();
                    /*
                    (req, res) => {
                        console.log(`success: server.post login   req.user.username:${req.user.username}`)
                        res.locals.redirect = `/home/${user._id}`;
                    }
                    */
                    
                } else {
                    req.flash("error", "Failed to authenticate. User not found.");
                    res.locals.redirect = "/";
                    next();
                }
            })
            .catch(error => {
                console.log(`Error logging in user: ${error.message}`);
                next(error);
            });
    },
    
    
    
    

    /* Version provided by Matthew
    authenticate: passport.authenticate("local", {
        failureRedirect: "/",
        failureFlash: "Failed to login!",
        successRedirect: "/home/:id",
        //successRedirect: `/home/${user._id}`,
        successFlash: "Logged in!"
    }),
    */

    /*CLOSEST SO FAR
    authenticate: passport.authenticate('local',
        {
            failureRedirect: "/",
        },
        (req, res, next) => {
            // If this function gets called, authentication was successful.
            // `req.user` contains the authenticated user.
            if(res){
            console.log(res),
            res.locals.redirect = `/home/${res.user._id}`,
            console.log("authenticate success"),
            next();
            }
        }),
    */
        
    
    /*
    authenticate: (req, res, next) => {
        User.findOne({ username: req.body.username })
            .then(user => {
                if (user) {
                    passport.authenticate('local',
                        {
                            failureRedirect: "/",
                        },
                        (req, res, next) => {
                            // If this function gets called, authentication was successful.
                            // `req.user` contains the authenticated user.
                            console.log("authenticate success"),
                            res.locals.redirect = `/home/${req.user._id}`;
                        })
                } else {
                    req.flash("error", "Login failed, User not registered");
                    res.locals.redirect = "/";
                    next();
                }
            }
    },
    */
    

    /* !!FIXME!! function compiles, but hashes never match properly
    authenticate: (req, res, next) => {
        User.findOne({username: req.body.username})
        .then(user => {
            if (user) {
                user.passwordComparison(req.body.password)
                .then(passwordsMatch => {
                    //debug checking
                    console.log("Do passwords match?");
                    console.log(passwordsMatch);

                    if(passwordsMatch) {
                        res.locals.redirect = `/home/${user._id}`;
                        req.flash("success", `${user.firstname} logged in successfully!`);
                        res.locals.user = user;
                        next();
                    } else {
                        req.flash("error", "Failed to authenticate. Please check your username and password.");
                        res.locals.redirect = "/login";
                        next();
                    }
                });
            } else {
                req.flash("error", "Login failed, User not registered");
                res.locals.redirect = "/login";
                next();
            }
        })
        .catch(error => {
            console.log(`Error logging in user: ${error.message}`);
            next(error);
        });
    },
    */
    
    /* V2 of aunthenticate (too fancy doesn't work)
    authenticate: (req, res, next) => {
        passport.authenticate("local", (errors, user) => {
            if (user) {
                let signedToken = jsonWebToken.sign(
                    {
                      data: user._id,
                      exp: new Date().setDate(new Date().getDate() + 1)
                    },
                "secret_encoding_passphrase"
                );
                res.json({
                    success: true,
                    token: signedToken,
                    successRedirect: `/users/home/${user._id}`,
                    successFlash: "Login Successful!"
                });
            } else {
                res.json({
                    success: false,
                    failureRedirect: "/login",
                    failureFlash: "Incorrect Info! Please check your username and password and try again"
                });
            }
        })
    },
    */

    /*  OLD authenticate without hashing
    authenticate: (req, res, next) => {
        console.log("authenticating");
        User.findOne({
            username: req.body.username
        })
            .then(user => {
                if (user && user.password === req.body.password) {
                    res.locals.redirect = `/home/${user._id}`;
                    req.flash("success", `${user.firstname} logged in successfully!`);
                    res.locals.user = user;
                    next();
                } else {
                    req.flash("error", "Failed to authenticate. Please check your username and password.");
                    res.locals.redirect = "/login";
                    next();
                }
            })
            .catch(error => {
                console.log(`Error logging in user: ${error.message}`);
                next(error);
            });
    },
    */
    

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

