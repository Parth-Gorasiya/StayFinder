StayFinder

A full-stack vacation rental platform built with Node.js, Express,
MongoDB, and EJS. StayFinder lets users explore properties, create and
manage their own listings, upload images, leave ratings and reviews, and
view listing locations on an interactive map.

Live Demo: https://stayfinder-ckmk.onrender.com\
GitHub: https://github.com/Parth-Gorasiya/StayFinder

Note: The live application uses free-tier hosting. If the service
or database has been inactive for a while, the first request may take
a little longer while the services wake up.



About the Project

I built StayFinder to get hands-on experience developing a complete web
application rather than working on isolated frontend or backend
exercises. It brought routing, authentication, database relationships,
file uploads, validation, maps, sessions, authorization, and deployment
into one project.

The application follows an MVC-style structure. Routes receive requests,
middleware handles authentication, authorization, and validation,
controllers contain application logic, Mongoose models define the data
layer, and EJS templates render the interface.

A major focus was tying actions to the correct user. A signed-in user
can create a listing, but only its owner can edit or delete it. Reviews
follow the same idea: authenticated users can leave reviews, while
deletion is restricted to the review's author.

Features

Browse property listings with images, prices, and locations

View detailed information for individual properties

Sign up, log in, and log out with session-based authentication

Create listings while authenticated

Edit and delete listings with ownership-based authorization

Upload listing images to Cloudinary

Add star ratings and written reviews

Delete reviews with author-based authorization

Geocode listing locations with Mapbox

Display locations on an interactive Mapbox map

Validate listing and review data with Joi

Persist login sessions in MongoDB with connect-mongo

Display flash messages for success and error states

Handle invalid routes and application errors centrally

Screenshots

Explore Listings



Listing Details and Ownership

The details page displays the property's information and owner. Edit and
delete operations are protected on the server by ownership checks.



Create a Listing

Authenticated users can create a listing and upload a property image.



Reviews and Location

Users can rate properties and leave comments. Mapbox displays the
geocoded location of each listing.



Tech Stack

Area                                Technology

Runtime                             Node.js

Backend                             Express.js

Frontend                            EJS, EJS-Mate, Bootstrap, CSS,
JavaScript

Database                            MongoDB, Mongoose

Authentication                      Passport.js, Passport Local,
passport-local-mongoose

Sessions                            express-session, connect-mongo

Validation                          Joi

File Uploads                        Multer, multer-storage-cloudinary

Image Storage                       Cloudinary

Maps & Geocoding                    Mapbox

Flash Messages                      connect-flash

Deployment                          Render

Database Hosting                    MongoDB Atlas

Architecture

Browser
   |
   v
Express Routes
   |
   v
Middleware
(authentication / authorization / validation)
   |
   v
Controllers
   |
   +--------------------+
   |                    |
   v                    v
Mongoose Models     External Services
   |                Cloudinary / Mapbox
   v
MongoDB Atlas
   |
   v
EJS Views -> Browser

The codebase separates routes, controllers, models, middleware,
utilities, public assets, and EJS views. This keeps database and
application logic out of the presentation layer and makes the request
flow easier to follow.

How the Main Functionality Works

Authentication and Sessions

Authentication uses Passport.js with a local username/password strategy
and passport-local-mongoose. After login, Passport serializes the user
into the session and deserializes the user on later requests.

Sessions are stored in MongoDB through connect-mongo rather than
Express's default in-memory store, allowing authentication state to
persist across server restarts.

Protected routes use authentication middleware. The application can also
remember where a user was trying to go before login and redirect them
back after successful authentication.

Listings

Listings are MongoDB documents managed through Mongoose. A listing
contains its property information, image, price, location, geographic
coordinates, owner, and associated reviews.

The application supports the main CRUD operations:

Create: authenticated users can publish properties.

Read: users can browse listings and open individual property
pages.

Update: only the listing owner can edit a property.

Delete: only the listing owner can remove it.

Authorization is enforced on the server rather than relying on whether
an Edit or Delete button is visible in the browser.

Image Uploads

Multer handles multipart form uploads and works with Cloudinary storage.
Images are uploaded to Cloudinary instead of being stored permanently on
the application server.

The resulting image URL and filename are stored with the listing in
MongoDB. This keeps persistent media storage separate from the deployed
Node server.

Reviews and Ratings

Listings can have multiple reviews. Each review contains a comment,
rating, and reference to its author.

Mongoose references connect users, listings, and reviews. populate()
is used when related information is needed for rendering. Review
deletion is protected by author-based middleware.

Mapbox Geocoding and Maps

When a listing is created, its location is sent to the Mapbox geocoding
service. The returned geographic coordinates are stored in the listing's
geometry field.

Those coordinates are then used on the details page to render an
interactive Mapbox map and marker. Users therefore enter a normal
location instead of manually supplying latitude and longitude.

Validation

Joi provides server-side validation for listing and review input.
Validation runs in middleware before controller logic reaches the
database. Mongoose schemas provide an additional structural layer at the
model level.

Authentication vs. Authorization

StayFinder treats these as separate concerns:

Authentication: Is the user logged in?

Authorization: Is that user allowed to perform this action?

For example, authentication is enough to create a listing, but it does
not allow someone to edit another user's listing. isOwner protects
listing modifications, while isReviewAuthor protects review deletion.

Error Handling and Flash Messages

Async route logic uses a wrapper utility so errors can flow to
centralized Express error-handling middleware. Unknown routes are
handled as 404 errors through the same error flow.

connect-flash provides short-lived feedback after actions such as
authentication, creation, deletion, and authorization failures.

Data Relationships

User
 |
 | owns
 v
Listing
 |
 | has many
 v
Review
 |
 | written by
 v
User

A listing stores a reference to its owner and references to its reviews.
A review stores a reference to its author.

Project Structure

StayFinder/
├── controllers/       # Application logic
├── init/              # Database initialization / seed data
├── models/            # Mongoose models
├── public/            # CSS, browser JavaScript, static assets
├── routes/            # Express routers
├── utils/             # Error and async helpers
├── views/             # EJS templates and layouts
├── app.js             # Express configuration and entry point
├── cloudConfig.js     # Cloudinary / Multer configuration
├── middleware.js      # Auth, authorization, validation middleware
├── schema.js          # Joi validation schemas
├── package.json
└── .gitignore

Run Locally

Prerequisites

You will need Node.js/npm plus accounts or credentials for MongoDB,
Cloudinary, and Mapbox.

1. Clone the repository

git clone https://github.com/Parth-Gorasiya/StayFinder.git
cd StayFinder

2. Install dependencies

npm install

3. Configure environment variables

Create .env in the project root:

ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_mapbox_token

Never commit .env or real credentials to GitHub.

4. Start the application

node app.js

Open http://localhost:8080/listings.

Deployment

StayFinder is deployed on Render with MongoDB Atlas as its hosted
database. Production credentials are supplied through environment
variables. Cloudinary stores property images and Mapbox provides
geocoding and map rendering.

One useful production lesson came from the free Atlas cluster
automatically pausing after prolonged inactivity. Render could start
Node, but the application could not resolve/connect to the paused
database cluster. Reading the runtime logs made it possible to
distinguish an infrastructure availability problem from an
application-code problem.

Challenges and What I Learned

Organizing a growing Express application

Moving logic out of route files and into controllers, models,
middleware, and utilities made the code easier to understand and
maintain.

Protecting resources correctly

Hiding UI controls is not authorization. I implemented server-side owner
and review-author checks so users cannot modify another user's resources
by manually sending requests.

Handling image uploads

File uploads required the HTML field, Multer middleware, Cloudinary
storage, and Mongoose schema to agree on the same data flow. Debugging
field-name and schema mismatches helped me understand multipart requests
much better.

Working with third-party services

Mapbox required a multi-step flow: take a human-readable location,
geocode it, store the returned coordinates, and later use those
coordinates to render a map.

Managing authentication state

Passport and MongoDB-backed sessions helped me understand the difference
between authenticating a user, maintaining login state, and authorizing
access to a particular resource.

Debugging deployment

Deployment introduced issues that did not appear locally, including
environment configuration, cloud database connectivity, session storage,
and service availability. Reading production logs became an important
part of finishing the application.

Future Improvements

Functional destination search and database-backed filters

Availability calendars and booking workflows

Favorites / wishlists

User profile pages

Multiple images per listing

Pagination

Automated route and authorization tests

Accessibility and responsive UI improvements

Production health checks and monitoring

Security

Database credentials, session secrets, Cloudinary credentials, and API
tokens belong in environment variables and should never be committed to
the repository. If a credential is accidentally exposed, it should be
rotated rather than only removed from Git history.

Author

Parth Gorasiya

GitHub: https://github.com/Parth-Gorasiya
