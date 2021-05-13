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
Our site uses multiple pages for each user. Tehy begin on a login page which prompts for a username or password. The user has the option to create an account instead, which takes them to a signup page, prompting them for multiple fields. 

After logging in, they are taken to a main homepage which displays a feed of all posts made by users on the site, a list of the top 10 trending hashtags, and a list of all users on the site, which link to their individual user pages. 

Each user has a user page which shows a little information about the user, as well as a button to add that user as a friend. On theit own user page, the user has the ability to edit their information.

Each user also has a page that displays all of their own posts, where they can delete them if the wish. If viewing another user's posts, they will not be able to delete.

Finally there is also a page to display a list of the user's friended users where they can unfriend them if they want.

### Implementation choices

#### Users
User objects are stored in MongoDB. Upon creation their passwords are salted and hashed using passport authentication. Each user has a unique ID which is associated to any post they create. Users have a list of other users they have added as friends. 

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
Hunter Culler - Hashtag Implementation, Posts implementation, Authentication, CSS, Sign In, 

Ian Anderson - Friending/Unfriending, Sign Up, 


