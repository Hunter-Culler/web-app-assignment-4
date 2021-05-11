"use strict"

const { reset } = require("nodemon");
const User = require("../models/user");
const Post = require("../models/post");

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
            newPost.id = Math.floor(Math.random() * (max - min + 1)) + min;
            Post.create(newPost)
            .then(post => {
                newPost.save()
                res.locals.post = post;
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