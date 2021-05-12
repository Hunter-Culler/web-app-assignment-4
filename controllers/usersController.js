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
Post = require("../models/post"),
passport = require("passport"),
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
        id: body.id,
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

    indexView: (req, res) => {
        res.render("users/index");
    },

    new: (req, res) => {
        res.render("users/new");
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath != undefined){
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
            console.log(`(show) Error fetching user by ID: ${error.message}`);
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
            console.log(`(edit) Error fetching user by ID: ${error.message}`);
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
            console.log(`(update) Error updating user by ID: ${error.message}`);
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
        newUser.id = Math.floor(Math.random() * (max - min + 1)) + min;
        User.register(newUser, req.body.password, (error, user) => {
            if (user) {
              req.flash("success", 'User Account Successfully Created!');
              newUser.save();
              res.locals.redirect = "/login";
              next();
            }
            else {
              req.flash("error", `Failed to create user account: ${error.message}`);
              res.locals.redirect = "/signup";
              next();
            }
        });
    },
    validate: (req, res, next) => {

        req.check("email", "email is not valid!").isEmail();
    
        req.check("password", "Password can not be empty.").notEmpty();
    
        req.getValidationResult().then((error) => {
          if (!error.isEmpty()) {
            let messages = error.array().map(e => e.msg);
            req.flash("error", messages.join(" and "));
            req.skip = true;
            //console.log("here1");
            res.local.redirect = "/homepage";
            next();
          }
          else
            next();
        });
    },
    authenticate: (req, res, next) =>{
        console.log("authenticating");
        User.findOne({
            username: req.body.username
        })
        .then(user => {
            if (user && user.password === req.body.password){
                res.locals.redirect = `/home/${user._id}`;
                req.flash("success", `${user.firstname}'s logged in successfully!`);
                res.locals.user = user;
                next();
            }else {
                req.flash("error", "Your username or password is incorrect.");
                res.locals.redirect = "/users/login";
                next();
            }
        })
        .catch(error => {
            console.log(`Error logging in user: ${error.message}`);
            next(error);
        });
    },
    delete: (req, res, next) => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
        .then(() =>{
            res.locals.redirect = "/users";
            next();
        })
        .catch(error => {
            console.log(`(delete) Error fetching user by ID: ${error.message}`);
            next(error);
        })
    },
    login: (req, res, next) => {
        const db = mongoose.connection;
        var dbo = db

        var queryUsername = { username: req.body.username , password: req.body.password };
        var queryPassword = { password: req.body.password };
        var queryResult;
        console.log(queryUsername);
        dbo.collection("users").findOne(queryUsername)
        .then(result => {
            if (result) {
                res.locals.redirect = `/home/${result._id}`;
                res.locals.currentUser = result;
                next();
            } else {
                console.log("No document matches the provided query.");
                res.render("login");
                next();
            }
        })
        .catch(err => console.error(`Failed to find document: ${err}`));
    },
    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/login";
        console.log(res.locals.redirect);
        next();
    },
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
    showViewUserPage: (req, res) => {
        res.render("users/page");
    },
    showHome: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
        .then(user => {
            res.locals.currentUser = user;
            Post.find().sort({ createdAt : `descending`})
            .then(posts => {
                res.locals.posts = posts;
                next();
            })
            .catch(error => {
                console.log(`Error fetching course data: ${error.message}`);
                next(error);
            })
        })
        .catch(error => {
            console.log(`Error fetching user by ID: ${error.message}`);
        })
      },
    showViewHome: (req, res) => {
        res.render("users/home");
    },
    showPosts: (req, res, next) => {
        let userId = req.params.id;

        User.findById(userId)
        .then(user => {
            res.locals.currentUser = user;

            var queryID = { posterID: userId };
    
            Post.find(queryID)
            .then(posts => {
                res.locals.posts = posts;
                next();
            })
            .catch(error => {
                console.log(`Error fetching course data: ${error.message}`);
                next(error);
            })
        })
        .catch(error => {
            console.log(`(showPosts) Error fetching user by ID: ${error.message}`);
        })
    },
    showViewPosts: (req, res) => {
        res.render("/users/myPosts");
    },
    addFriend: (req, res, next) => {
        let userId = req.params.id;

        User.findById(userId)
        .then(user => {
            user.friends.push()
        })
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