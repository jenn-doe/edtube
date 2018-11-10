# Setup up postgres to work with this code
1. Install Postgres on your computer
    - if you are using homebrew to install postgres, you'll need to run the following command after installing: `/usr/local/opt/postgres/bin/createuser -s postgres`
2. Ensure your `username:password` are `postgres:postgres` and you connect on port `5432` (the default port)
3. Connect to your local postgres service with the user postgres via terminal `$ psql -U postgres -h localhost`
4. Create a database that will be accessed by the code in the psql console `$ CREATE DATABASE edtube;`

# Run app for the first time
1. In your terminal, go to directory containing this file that you're reading
2. `$ npm install` to download all the dependencies
3. `$ npm start` to start the process with nodemon (it will reload the app when .js files are changed for fast iteration)
4. In your browser, go to `localhost:8080` to see a basic html page reading test data from the database
