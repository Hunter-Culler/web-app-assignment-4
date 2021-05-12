"use strict"

const { reset } = require("nodemon");
const User = require("../models/user");
const Post = require("../models/post");
const Hashtag = require("../models/hashtag");

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
    indexView: (req, res) => {
        res.render("posts/index");
    },
    new: (req, res) => {
        let userId = req.params.id;

        User.findById(userId)
            .then(user => {
                res.render("posts/new", { user: user });
            })
            .catch(error => {
                console.log(`Error fetching course by ID: ${error.message}`);
                next(error);
            })
    },
    create: (req, res, next) => {
        let userId = req.params.id;
        var username = '';

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
                var hashtags = getHashTags(post.caption);
                if (hashtags.length != 0){
                    for (var i = 0; i < hashtags.length; i++){
                        console.log(hashtags[i]);
                        newPost.hashtags.push(hashtags[i]);
                        Hashtag.updateOne({hashtag: hashtags[i]}, {$inc : {occurrences : 1}}, {upsert : true}, function(){});
                    }
                }
                newPost.save();
                res.redirect(`/home/${userId}`);
            })
            .catch(error => {
                console.log(`Error saving post ${error.message}`)
                next(error);
            })
        })
        .catch(error => {
            console.log(`(create post) Error fetching user by ID: ${error.message}`);
        })
    },
    show: (req, res, next) => {
        let postId = req.params.id;
        Post.findById(postId)
        .then(course => {
            res.locals.post = post;
            next();
        })
        .catch(error => {
            console.log(`Error fetching course by ID: ${error.message}`);
        })
    },
    showView: (req, res) => {
        res.render("posts/show");
    },
    delete: (req, res, next) => {
        let postId = req.params.id;
        Post.findById(postId)
        .then(post => {
            res.locals.redirect = `/home/${post.posterId}`;
            Post.findByIdAndRemove(postId)
            .then(() =>{
                next();
            })
            .catch(error => {
                console.log(`(delete) Error fetching post by ID: ${error.message}`);
                next(error);
            })
        })
        
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath != undefined) res.redirect(redirectPath);
        else next();
    }
}

function getHashTags(inputText) {
    var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    var matches = [];
    var match;

    while((match = regex.exec(inputText))) {
        matches.push(match[1]);
    }

    return matches;
}