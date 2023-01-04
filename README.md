# NODE EXPRESS SERVER w. JEST

A complete node server with Jest testing.

## Operation

To run the server in development, use `npm run dev`.

To run the server in production, use `npm start`.

To run jest tests, use `npm test` for all tests, `npm run test:api` for api tests only or `npm run test:unit` for unit tests only.

### Environment

Environment variables **must** be provided - place a development.json and a production.json file inside .env in the root directory of the project. A test.json file should also be provided to allow the Jest tests to run. The following variables are required for the server to run:

* MONGO_URL
* DB_NAME
* PORT
* JWT_SECRET
* JWT_EXPIRY
* ROOT_PATH

_All of the variables except for MONGO\_URL are required for the test environment file which you will need in order to run Jest API/unit tests._

## Author

pj1301
