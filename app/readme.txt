Group id: 045

Names and student numbers of author: 
7771282 Eyup Kirci

full URL: http://webtech.science.uu.nl/group45/ 


The movie ticket app is an application designed to allow users to display movies and to buy movie tickets online. It provides a simple and efficient way for movie lovers to search for movies, select showtimes, and purchase tickets with ease. The app is built using various technologies and libraries, including Express.js, EJS, and SQLite3, to enable efficient data management and handling. Users can sign up and create an account, log in, and purchase tickets using secure payment methods. 

In this project:
- express was used for building web applications, including routing, middleware, and HTTP request/response handling.
- body-parser was used to parse the request body to make it available under req.body property, making it easier to work with data sent through POST requests.
- cookie-parser was used to parse parse cookies attached to the request object.
- cors was used for enabling Cross-Origin Resource Sharing (CORS) on the server-side, allowing the app to make requests to other domains.
- ejs is used to generate HTML markup using JavaScript code and data provided by the app.
- sqlite3 was used for interacting with SQLite databases
- bcryptjs was used for hashing passwords and providing better security for user accounts. No password stored data as it is. They were hashed and then stored in the db.
- dotenv was used for loading environment variables from a .env file, making it easy to manage environment-specific configuration values. By this way, I was able to make app running both on localhost and on other servers by making small configuration.
- express-validator is used for validating and sanitizing data provided by the user, reducing the risk of security vulnerabilities. By using express-validator login and register rules are implemented
- jsonwebtoken is used for provideing a way to create and verify JSON Web Tokens (JWT), which I used for user authentication and authorization. The only data I sent to client is token that contains  user: {username: user.username,id: user.id, } object.
- morgan is used for logging middleware that generates logs for HTTP requests made to the server.
- nodemon is used to automatically restart the server when changes are made to the codebase, making the development process faster and more efficient.

Implementations

In "views":
- The "components" folder contains reusable UI components such as the header and footer, which are included in other pages.
- The "home.ejs" file is the landing page for the application. It provides an overview of the app's main features and options for the user to get started.
    - In "home.ejs", registered and anonymous users can display movies by clicking on "buy" button. If the user hits the buy button, a modal view order page is opened. Server communications are implemented using AJAX / fetch fuctionalities. If an anonymous user want to book or buy the movie, the user is redirected to login page, then register page for creating new account. 
    - A generic pagination is also implemented on this page, which means the pagination will work even if new movies added on database later.
- The "login.ejs" file provides the user with a form to enter their login credentials and sign in to their account.
- The "register.ejs" file provides the user with a form to create a new account by entering their personal and payment information.
- The "user.ejs" file is the user's account dashboard where they can view their previous booking with details like the date, their personal information.
    - By hitting details button on movie card, they are redirected to the movieDetail page of the movie.
- The "movieDetail.ejs" file displays the details of a selected movie such as the synopsis, rating, and showtimes at various theaters.

Throughout the application, both the server side and client side render implementations were used to show coding skills off. 

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


The DB is a SQLite database that has four tables:

users: Contains information about users of the system, including their name, email, username, password (hashed), address, credit card information, and order history.
movies: Contains information about movies available for booking, including the genre, image URL, IMDb ID, IMDb rating, release date, synopsis, title, and type.
availability: Contains information about the availability of movies, including the movie ID, date, timeslot, and number of available seats.
orders: Contains information about the orders made by users, including the order ID, user ID, movie ID, whether the order has been completed or not, the date of the order, and the timeslot.
The users and movies tables are populated by inserting data into them using predefined arrays of objects. The availability table is populated with entries for each movie on each day from March 10, 2023 to June 5, 2023, assuming three available timeslots per day. The orders table is empty when the database is created, but is used to store information about orders made by users.

The database is created using the sqlite3 module and the bcryptjs module is used to hash passwords before storing them in the users table. DB related fuctionalities put together under database folder and db related fuctions under helper folder. Users are imported from database/users.js and movies from database/movies.js while creating database calling database.js. It creates database.db in database folder. Then the application is statrted by running "node app.js".



Registered Users:
[
  {
    email: "john@example.com",
    password: "p@ssW0rd!$H@rd",
  },
  {
    email: "amina.jafari_2023@zyxmail.com",
    password: "Wn8%Yd@kL3",
  },
  {
    email: "petrov_vladi@mail.ru",
    password: "hJ6@Xq3TmL",
  },
  {
    email: "emilia_silva@xyzmail.com",
    password: "eZ#9pB6cH7",
  },
  {
    email: "soo-young.kim@hanmail.net",
    password: "zS#1vN@8mP",
  },
];


The SQL definition of your database:

  // Create users table

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    address TEXT NOT NULL,
    credit_card REAL NOT NULL,
    order_history TEXT
  )`);

  // Create movies table

  db.run(
    `CREATE TABLE IF NOT EXISTS movies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          genre TEXT NOT NULL,
          imageurl TEXT NOT NULL,
          imdbid TEXT NOT NULL,
          imdbrating REAL NOT NULL,
          released INTEGER NOT NULL,
          synopsis TEXT NOT NULL,
          title TEXT NOT NULL,
          type TEXT NOT NULL
          )`
  );


  // Create availability table

  db.run(
    `CREATE TABLE IF NOT EXISTS availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER,
    date DATE,
    timeslot TEXT,
    available_seats INTEGER CHECK (available_seats <= 30),
    FOREIGN KEY (movie_id) REFERENCES movies (id)
);`,
    (err) => {
      if (err) {
        console.error(err.message);
      }

      console.log("availability table created.");
    }
  );


   // Create orders table

  db.run(
    `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  movie_id INTEGER,
  is_completed TEXT CHECK(is_completed IN ('true', 'false')),
  date TEXT,
  timeslot TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (movie_id) REFERENCES movies(id),
  FOREIGN KEY (timeslot) REFERENCES availability(movie_id)
)`,
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("orders table created.");
    }
  );
