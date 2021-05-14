/*
	Hunter Culler and Ian Anderson
	University of Colorado Denver CSCI 4800 E01
	Web Application Developement
	Group Assignment 4

	May 12th, 2021

	Status = Functional

*/

"use strict"

module.exports = {
    showSignIn: (req, res) => {
        console.log("homecontroller rendered login page");
        res.render("users/login");
    },

    //----------------------------------------------------------------------------------------------//
    showHomepage: (req, res) => {
        res.render("home");
    },

    //----------------------------------------------------------------------------------------------//
    showSignUp: (req, res) => {
        res.render("signup");
    },

    //----------------------------------------------------------------------------------------------//
    showContactView: (req, res) => {
        res.render("contact");
    }
}