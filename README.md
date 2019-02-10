# Lazy Cupboard

# Welcome to LazyCupboard


Lazy cupboard is a fresh, new way to organize your recipes and manage your meals in a health-consious and budget friendly-way. 

This project gives structure to the user's eating habbits, while keeping variety and flexibility in mind by providing recipes that work for ingredients that they already have in their kitchen.

Lazy cupboard helps people save money and live more healthy lives by eating out less.



### How it Works


Lazy Cupboard takes care of the greuling process of making recipes and gives time back to the user.

First we authenticate our users using Passport.js. which then allows a viewer to view the home page.

Then we take the user input and save it in a query that looks through the Edamam API.
Once a user has clicked the ingredients they want to use(based on what they have gotten from the search) the app will query a search through edamaom to find recipes containing those ingredients. The search will then return the recipe options to the user. The user can then choose from the recipe list what they would like to make today.

Deployed site:[https://lazycupboard.herokuapp.com/](https://lazycupboard.herokuapp.com/)

### Technologies used
* JavaScript
* NodeJS
* Express
* Materialize CSS
* Passport
* Handlebars
* JQuery
* MySQL
* Sequelize ORM
* Axios
* Mocha, Chai, Travis


### New User Guide

1. Go to landing page and register as a user by clickin on the 'Sign Up' button
<br/>
[IMG GOES HERE]
<br/><br/>

2. Fill out the register form shown below
<br/>
[IMG GOES HERE]
<br/><br/>

3. Once you're registered, you will be redirected to the login page below
<br/>
[IMG GOES HERE]
<br/><br/>

4. Once you're logged in, you can begin your search for recipes:
<br/>
First: Enter the ingredients you have or would like to use to see the nutritous facts available for each ingredient.
<br/>
[IMG GOES HERE]
<br/><br/>

Second: After reviewing the nutritous facts provided to you, use the check boxes to the to the left of the ingredients list to mark the ingredients you are still interested in including in your recipes search. Then click on the 'Find Recipes' button.
<br/>
[IMG GOES HERE]
<br/><br/>

Third: Review the recipes provide to you by clicking the recipe names to view the required ingredients, or click the 'Prepare' button to view the ingredients and a link to view more details about preparation.
<br/>
[IMG GOES HERE]
