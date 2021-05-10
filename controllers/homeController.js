/*
	Hunter Culler and Ian Anderson
	University of Colorado Denver CSCI 4800 E01
	Web Application Developement
	Group Assignment 4

	March 31st, 2021

	Status = Functional

*/

"use strict"

module.exports = {
    showSignIn: (req, res) => {
        res.render("login");
    },
    showHomepage: (req, res) => {
        res.render("home.ejs");
    },
    showSignUp: (req, res) => {
        res.render("signup");
    },
}