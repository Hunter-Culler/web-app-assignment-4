/*
	Hunter Culler and Ian Anderson
	University of Colorado Denver CSCI 4800 E01
	Web Application Developement
	Group Assignment 4

	May 12th, 2021

	Status = Functional

*/

"use strict"

const { reset } = require("nodemon");
const User = require("../models/user");
const Post = require("../models/post");
const Hashtag = require("../models/hashtag");
const { post } = require("jquery");

module.exports = {
    index: (req, res, next) => {
        Post.find()
        .then(posts => {
            res.locals.posts = posts;
            next();
        })
        .catch(error => {
            console.log(`Error fetching post data: ${error.message}`);
            next(error);
        })
    },

    //----------------------------------------------------------------------------------------------//
    indexView: (req, res) => {
        res.render("posts/index");
    },

    //----------------------------------------------------------------------------------------------//
    new: (req, res) => {
        let userId = req.params.id;

        User.findById(userId)
            .then(user => {
                res.render("posts/new", { user: user });
            })
            .catch(error => {
                req.flash("error", `Failed to create post because 
                of the follwoing errors: ${error.message}`);
                console.log(`Error creating post: ${error.message}`);
                next(error);
            })
    },

    //----------------------------------------------------------------------------------------------//
    create: (req, res, next) => {
        let userId = req.params.id;
        var username = '';

        //get user to associate to the post
        User.findById(userId)
        .then(user => {
            username = user.username
            let newPost = new Post({
                posterId: userId,
                caption: req.body.caption,
                username: username,
                comments: '',
            });
            var min = Math.ceil(10000);
            var max = Math.floor(99999);
            newPost.postId = Math.floor(Math.random() * (max - min + 1)) + min;
            Post.create(newPost)
            .then(post => {
                res.locals.post = post;
                //search post for hashtags used
                var hashtags = getHashTags(post.caption);
                if (hashtags.length != 0){
                    for (var i = 0; i < hashtags.length; i++){
                        console.log(hashtags[i]);
                        newPost.hashtags.push(hashtags[i]);
                        //increments the occurrences value of the hashtag by 1 if it exists in the db,
                        //otherwise creates a new hashtag object in the db
                        Hashtag.updateOne({hashtag: hashtags[i]}, {$inc : {occurrences : 1}}, {upsert : true}, function(){});
                    }
                }
                newPost.save();
                res.redirect(`/home/${userId}`);
            })
            .catch(error => {
                req.flash("error", `Failed to save post because 
                of the follwoing errors: ${error.message}`);
                console.log(`Error saving post ${error.message}`)
                next(error);
            })
        })
        .catch(error => {
            req.flash("error", `Failed to create postt because 
            of the follwoing errors: ${error.message}`);
            console.log(`(create post) Error creating post: ${error.message}`);
        })
    },

    //----------------------------------------------------------------------------------------------//
    show: (req, res, next) => {
        let postId = req.params.id;
        Post.findById(postId)
        .then(post => {
            res.locals.post = post;
            next();
        })
        .catch(error => {
            req.flash("error", `Failed to show postt because 
            of the follwoing errors: ${error.message}`);
            console.log(`Error fetching post by ID: ${error.message}`);
        })
    },

    //----------------------------------------------------------------------------------------------//
    showView: (req, res) => {
        res.render("posts/show");
    },

    //----------------------------------------------------------------------------------------------//
    delete: (req, res, next) => {
        let postId = req.params.id;
        let creatorID = req.params.posterId;
        /*!!TO HUNTER!! I made creatorID to add an if statement checking if the user that 
        deleting a comment is the user that created it.  Currently
        anyone can delete any post.  Also flash messages would be good here.
        */
        Post.findById(postId)
        .then(post => {
            res.locals.redirect = `/home/${post.posterId}`;
            Post.findByIdAndRemove(postId)
            .then(() =>{
                next();
            })
            .catch(error => {
                req.flash("error", `Failed to delete post because 
                of the follwoing errors: ${error.message}`);
                console.log(`(delete) Error deleting post by ID: ${error.message}`);
                next(error);
            })
        })
        
    },

    //----------------------------------------------------------------------------------------------//
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath != undefined) res.redirect(redirectPath);
        else next();
    }
}

//function for parsing the post's text for hashtags
function getHashTags(inputText) {
    var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    var matches = [];
    var match;

    while((match = regex.exec(inputText))) {
        matches.push(match[1]);
    }

    return matches;
}