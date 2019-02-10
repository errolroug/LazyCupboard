# Lazy Cupboard

## Welcome to LazyCupboard


Lazy cupboard is a fresh new to organize your recipes and manage your meals. 

This project gives structure to the user, while keeping variety and flexibility in mind.

Lazy cupboard helps people save money by eating out less



//-----------------------------**How it Works**-------------------------------------//


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
