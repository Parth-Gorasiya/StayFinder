# StayFinder

### Full-Stack Vacation Rental Platform

StayFinder is a full-stack web application for discovering and managing
vacation rental listings. It combines an Express backend,
server-rendered EJS views, and MongoDB. Users can register, create and
manage their own listings, upload property images, leave ratings and
reviews, and explore listing locations through interactive Mapbox maps.

[Live Demo](https://stayfinder-ckmk.onrender.com) ·
[GitHub](https://github.com/Parth-Gorasiya/StayFinder)

> **Demo note:** StayFinder uses free-tier cloud services. After
> prolonged inactivity, the application or database may take a short
> time to become available again.

## Features

### Authentication and user ownership

-   Registration, login, and logout with Passport.js.
-   Local username/password authentication with
    `passport-local-mongoose`.
-   Persistent MongoDB-backed sessions using `express-session` and
    `connect-mongo`.
-   Protected routes for authenticated actions.
-   Owner-only listing edit and delete operations.
-   Author-only review deletion.
-   Redirect handling for users sent to login from protected pages.

### Listings

-   Browse available vacation-rental listings.
-   View property details, owner, price, location, reviews, and map.
-   Create listings with title, description, price, location, country,
    and image.
-   Edit and delete listings owned by the signed-in user.
-   Mongoose relationships between users, listings, and reviews.
-   `populate()` for related owner and review-author data.

### Reviews, images, and maps

-   Five-star ratings and written reviews.
-   Multer-based multipart image uploads.
-   Cloudinary storage for persistent listing images.
-   Mapbox forward geocoding from human-readable locations.
-   Geographic coordinates stored with listings.
-   Interactive Mapbox maps and markers on listing pages.

### Validation and error handling

-   Joi validation for listing and review input.
-   Mongoose schema validation.
-   Reusable authentication, authorization, and validation middleware.
-   Centralized async error handling and 404 handling.
-   Flash messages for successful actions and errors.

## Tech Stack

  ---------------------------------------------------------------------
  Layer                              Technologies
  ---------------------------------- ----------------------------------
  Backend                            Node.js, Express.js

  Views and UI                       EJS, EJS-Mate, Bootstrap, CSS,
                                     JavaScript

  Database                           MongoDB Atlas, Mongoose

  Authentication                     Passport.js, Passport Local,
                                     passport-local-mongoose

  Sessions                           express-session, connect-mongo

  Validation                         Joi

  File uploads                       Multer, multer-storage-cloudinary

  Image hosting                      Cloudinary

  Maps and geocoding                 Mapbox

  Messaging                          connect-flash

  Hosting                            Render
  ---------------------------------------------------------------------

## Architecture

StayFinder follows an MVC-style structure. Routes define application
endpoints, middleware handles authentication, authorization, and
validation, controllers contain request logic, Mongoose models manage
persistent data, and EJS views render the interface.

``` text
StayFinder/
├── controllers/
├── init/
├── models/
├── public/
├── routes/
├── utils/
├── views/
├── app.js
├── cloudConfig.js
├── middleware.js
├── schema.js
└── package.json
```

The request flow is:

``` text
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
Mongoose / MongoDB  Cloudinary / Mapbox
   |
   v
EJS Views
```

## Run Locally

### 1. Prerequisites

-   Node.js and npm.
-   Git.
-   A MongoDB database connection.
-   A Cloudinary account.
-   A Mapbox account and access token.

### 2. Clone the repository

``` bash
git clone https://github.com/Parth-Gorasiya/StayFinder.git
cd StayFinder
```

### 3. Install dependencies

``` bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root and replace the placeholders
with your own credentials.

``` env
ATLASDB_URL=YOUR_MONGODB_CONNECTION_STRING
SECRET=REPLACE_WITH_A_RANDOM_SESSION_SECRET

CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUD_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUD_API_SECRET=YOUR_CLOUDINARY_API_SECRET

MAP_TOKEN=YOUR_MAPBOX_ACCESS_TOKEN
```

Keep `.env` out of Git. Database credentials, session secrets, and
service credentials should never be committed.

### 5. Start the application

``` bash
node app.js
```

Open `http://localhost:8080/listings`.

## Route Overview

  --------------------------------------------------------------------------------
  Method        Endpoint                            Purpose        Access
  ------------- ----------------------------------- -------------- ---------------
  GET           `/listings`                         Browse         Public
                                                    listings       

  GET           `/listings/new`                     Display        Login required
                                                    new-listing    
                                                    form           

  POST          `/listings`                         Create a       Login required
                                                    listing        

  GET           `/listings/:id`                     View listing,  Public
                                                    reviews, and   
                                                    map            

  GET           `/listings/:id/edit`                Display edit   Owner only
                                                    form           

  PUT           `/listings/:id`                     Update a       Owner only
                                                    listing        

  DELETE        `/listings/:id`                     Delete a       Owner only
                                                    listing        

  POST          `/listings/:id/reviews`             Add a review   Login required

  DELETE        `/listings/:id/reviews/:reviewId`   Delete a       Review author
                                                    review         only

  GET           `/signup`                           Display signup Public
                                                    form           

  POST          `/signup`                           Register an    Public
                                                    account        

  GET           `/login`                            Display login  Public
                                                    form           

  POST          `/login`                            Authenticate a Public
                                                    user           

  GET           `/logout`                           End the        Authenticated
                                                    current        session
                                                    session        
  --------------------------------------------------------------------------------

## Authentication and Authorization

StayFinder uses Passport.js for session-based authentication. After
login, Passport serializes the user into the session and deserializes
the user on later requests. Sessions are persisted in MongoDB through
`connect-mongo`.

Authentication and authorization are separate:

``` text
Authentication -> Is the user logged in?
Authorization  -> Is the user allowed to modify this resource?
```

`isLoggedIn` protects authenticated actions. Listing modifications
additionally require ownership, while review deletion requires the
current user to be the review author. These checks happen on the server
rather than relying on visible UI controls.

## Data Relationships

``` text
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
 | authored by
 v
User
```

Listings reference their owner and reviews, while reviews reference
their author. Mongoose `populate()` retrieves related documents when
rendering listing pages.

## Image Upload Behavior

Listing forms submit images as multipart form data. Multer processes the
upload and Cloudinary stores the file. StayFinder then saves the
returned image URL and filename with the listing.

``` text
Browser
   |
   v
Multer
   |
   v
Cloudinary
   |
   v
Image URL + filename
   |
   v
MongoDB Listing
```

This avoids relying on the deployed application's local filesystem for
persistent media.

## Mapbox Behavior

When a listing is created, its human-readable location is sent to Mapbox
for geocoding. The returned coordinates are stored with the listing and
later used to render its map and marker.

``` text
Location
   |
   v
Mapbox Geocoding
   |
   v
[longitude, latitude]
   |
   v
Listing geometry
   |
   v
Interactive Mapbox map
```

## Validation and Error Handling

Joi validates listing and review requests before controller logic
performs database operations. Mongoose schemas provide an additional
model-level structure.

Async errors are forwarded through a reusable wrapper into centralized
Express error handling. Unknown routes use the same error flow, while
`connect-flash` provides user-facing feedback for authentication,
creation, deletion, and authorization events.

## Deployment

StayFinder is hosted on Render and uses MongoDB Atlas for persistent
data. Cloudinary stores uploaded property images, while Mapbox provides
geocoding and interactive maps.

For production:

1.  Configure the MongoDB connection string and session secret in the
    hosting environment.
2.  Configure Cloudinary credentials and the Mapbox token.
3.  Configure MongoDB Atlas network access for the deployed service.
4.  Keep private credentials outside the repository.
5.  Start the Node application using the hosting service's production
    command.

Free-tier infrastructure may become inactive after prolonged periods
without traffic. An automatically paused Atlas cluster must be resumed
before the application can reconnect to its database.

## Current Scope and Limitations

-   StayFinder manages rental listings but does not process real
    bookings or payments.
-   Destination search and category filters are primarily interface
    features rather than a complete search system.
-   Availability calendars are not implemented.
-   Listings currently use a primary image rather than a multi-image
    gallery.
-   Favorites and wishlists are not implemented.
-   The application uses server-rendered EJS rather than a separate SPA
    frontend.
-   StayFinder is a portfolio-focused full-stack application rather than
    a production rental marketplace.

## Author

**Parth Gorasiya**

[GitHub](https://github.com/Parth-Gorasiya) ·
[LinkedIn](https://www.linkedin.com/in/parth-gorasiya)
