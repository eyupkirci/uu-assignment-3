Group id: 045


Names and student numbers of all authors: 
7771282 Eyup Kirci


full URL:chttp://webtech.science.uu.nl/group45/ 


The movie ticket app is an application designed to allow users to display movies and to buy movie tickets online. It provides a simple and efficient way for movie lovers to search for movies, select showtimes, and purchase tickets with ease. The app is built using various technologies and libraries, including Express.js, EJS, and SQLite3, to enable efficient data management and handling. Users can sign up and create an account, log in, and purchase tickets using secure payment methods. 


PROJECT SKELETON
app
├── controller/
│   ├── authController
├── helper/
│   ├── helperFunctions
├── node_modules/
├── public/
│   ├── assets/
│   ├── javascript.js
│   ├── style.css
├── routes/
│   ├── index.js
│   ├── api.js
├── database/
│   ├── database.db
│   ├── database.js
│   ├── movies.js
│   ├── users.js
├── views/
│   ├── components/
│   │   ├── header.ejs/
│   │   ├── footer.ejs/
│   ├── home.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── user.ejs
│   ├── movieDetail.ejs
├── app.js
├── .env
├── package.json
├── package-lock.json
└── readme.txt


Our DB is a SQLite database that has four tables:

users: Contains information about users of the system, including their name, email, username, password (hashed), address, credit card information, and order history.
movies: Contains information about movies available for booking, including the genre, image URL, IMDb ID, IMDb rating, release date, synopsis, title, and type.
availability: Contains information about the availability of movies, including the movie ID, date, timeslot, and number of available seats.
orders: Contains information about the orders made by users, including the order ID, user ID, movie ID, whether the order has been completed or not, the date of the order, and the timeslot.
The users and movies tables are populated by inserting data into them using predefined arrays of objects. The availability table is populated with entries for each movie on each day from March 10, 2023 to June 10, 2023, assuming three available timeslots per day. The orders table is empty when the database is created, but is used to store information about orders made by users.

The database is created using the sqlite3 module and the bcryptjs module is used to hash passwords before storing them in the users table. DB related fuctionalities put together under database folder and db related fuctions under helper folder. Users are imported from database/users.js and movies from database/movies.js while creating database calling database.js. It creates database.db in database folder.



 the structure of your application, including every content file and every code file, the structure of your database.


