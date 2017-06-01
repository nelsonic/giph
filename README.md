# Giphinate

# Instructions

 This API queries the Giphy API for any provided query string, returning the result.
 This data should be cached in a database using the provided migrations and schemas.
 This API is incomplete, so your task is to fill in the gaps!

## Running:
Install dependencies - `npm install`

Run migrations - `npm run migrations`

Run the application - `npm start` _By default it will listen on port 8000_

## Requirements:
 - Complete the `./lib/handlers/giphinate.js` handler to call the giphy API
 and return the first GIF URL in the response. You should cache the data in
 the database so the next time the same query is used, the GIF URL is returned
 from the database instead of the Giphy API.
 - Create a new `DELETE` route and controller which deletes the record
 associated with the query text sent up.
 - Add tests
 - Add any additional frameworks or features which you think would be
 necessary to get this app to production.

#### Bonus Points 🙆:
- If you have any remaining time, it would be good to implement some
request logging. If you don't have time to do this,
add a text file explaining how you would do it.

## NOTES:
 - You should use at least node version 6.9.1
 - The API should follow RESTful practices
 - The code style defined in the `.eslint` files should be
 followed - this can be validated using the `eslint` node modules.
 - Bonus points will be given for useful abstraction
