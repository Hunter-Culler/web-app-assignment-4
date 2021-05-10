"use strict"

const { reset } = require("nodemon");
const Post = require("../models/post");

module.exports = {
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
        var userName = ''

        User.findById(userId)
            .then(user => {
                userName = user.Username

                let newPost = new Post({
                    postingUserID: userId,
                    caption: req.body.caption,
                    postPicture: '',
                    userName: userName,
                    comments: '',
                    likes: 0,
                });

                Post.create(newPost)
                    .then(post => {
                        res.locals.course = post;
                        res.redirect(`/home/${userId}`);
                    })
                    .catch(error => {
                        console.log(`Error saving post ${error.message}`)
                        next(error);
                    })
            })
            .catch(error => {
                console.log(`Error fetching course by ID: ${error.message}`);
            })
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath != undefined) res.redirect(redirectPath);
        else next();
    }
}