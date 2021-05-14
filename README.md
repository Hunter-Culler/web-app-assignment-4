# Social Media Website
This is the repository for our Social Media Website Project. This website allows users to add eachother as friends, make posts with hashtags, and see which hashtags are trending.

## File structure
```
+-- controllers/
|   +-- errorController.js
|   +-- homeController.js
|   +-- postsController.js
|   +-- usersController.js
+-- models/
|   +-- post.js
|   +-- user.js
+-- node_modules/
+-- public/
|   +-- css/
|   |   +--assignment3.css
|   |   +-- styles.css
|   +-- images/
|   +-- js/
|   |   +-- script.js
+-- views/
|   +-- posts/
|   |   +-- edit.ejs
|   |   +-- index.ejs
|   |   +-- new.ejs
|   |   +-- show.ejs
|   +-- users/
|   |   +-- edit.ejs
|   |   +-- home.ejs
|   |   +-- index.ejs
|   |   +-- login.ejs
|   |   +-- page.ejs
|   |   +-- posts.ejs
|   +-- layout.ejs
|   +-- signup.ejs
+-- main.js
+-- package-lock.json
+-- package.json
+-- README.md
+-- seed.js
```

## Design choices

### Display
Our site uses multiple pages for each user. The view defaults to the login page which prompts for a username or password. The user has the option to create an account instead, which takes them to a signup page, prompting them for multiple fields.

Login sessions are handled using sessions and cookies using passport, express, and express validator.

After logging in, they are taken to a main homepage which displays a feed of all posts made by the user and other users that they follow, a list of the top 10 trending hashtags, 

and a list of all users on the site, devided into a followed and an unfollowed section which links to the specified user profiles as well as providing the option to change follow status.

Users also have the option to delete their posts from thier homepage as well.

Each user has an "about me" page which shows a little information about the user including DoB, minimal address, and how many people they follow (aka thier 'friends').

Users have the ability to edit their account info, logout, or quickly access thier homepage and profile page using the navbar which is omnipresent as long as the user is logged in and the session is valid.

The User cannot delete posts that they did not create, and the follow/unfollow button changes states dynamically depending on the friendship status between the users account and the account in question.


### Implementation choices

#### Users
User objects are stored in MongoDB. Upon creation their passwords are salted and hashed using passport authentication.  The password for user's account is never stored or transmitted in plaintext as it is hashed 

on the client-side upon account creation or password editing using libraries from the passport package. Each user has a unique ID which is associated to any post they create.  This Id is autogenerated by mongoDB.

Each user has two arrays as part of the user model/schema that keep track of the user's they are following.  One array stores the users ObjectID ( auto id usnique string generated by mongoDB ).

The other array stores the user's friends usernames in plaintext.  This makes it easier for certain application like displaying friends list and making username comparisons without having to dereference a user's

ObjectID.

#### Posts
Post objects are stored in MongoDB. When a post is created it is parsed to see if it contains any hashtags, any of which are stored in an array within the post object. These posts are displayed to the user in decrementing order of pubDate. 

#### Hashtags
Hashtag objects are stored in the MongoDB. After a Post is created, its array of hashtags are looped through, and every hashtag that is already in the db are incremented and those that are not already included have an object created for them. These hashtags are displayed on the main page of every user in decrementing order of occurrences. 

## To Run
Download this repository and make sure npm and mongodb are installed. Then in the folder where the repository was downloaded, run the following commands:
```
npm install
npm start
```

Then the site will be up and running on localhost at port 3000.

## Breakdown of responsibilities
Hunter Culler - Hashtag Implementation, post data structure design, user authentication, CSS initialization and styling, Sign In. 

Ian Anderson - User authentication and data encryption, User Schema, UserController, User Follow/Unfollow, Sign Up, Routing direction, CSS styling implementation, Nav bar, Dynamic buttons and page states
account editing, passport, sessions, cookies, form validation and scrubbing, access control, 


