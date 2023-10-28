<h1 align="center">Mother To Mother Repository</h1>

## Overview

Mother to Mother is a web application that automates outgoing and incoming dontion flows. It has both a user app and admin portal to it. The user app allows donoers/ requesters create profiles and record each of their donations. The admin portal allows admins to view all donations and requests and generate reports to better understand the donation flows.

## Running the project

### Running the backend

- Navigate to the backend folder

```
MTM-Backend
```

and run

```
npm install
```

to install dependencies. Run

```
npm start
```

to start the server.

- The server should be running on port `3001`.

### Running the frontend (React)

- Navigate to the frontend directory

```
MTM-Frontend
```

and run

```
npm i
```

to install dependencies. Run

```
npm start
```

to start the frontend app.

- Choose register and provide your email and password to test the app. Once you submit, firebase will authenticate you and redirect you to the home page. Then you can click to go to your profile then logout. Now login with the same credentials, and you'll be redirected to the home page where you'll see a quote displayed from the backend.

# Sources

For a more detailed guide on how to set up firebase, and an explanation of all involved steps and files, check out the guide below.

- [Build Authentication using Firebase | React | Express](https://dev.to/earthcomfy/build-authentication-using-firebase-react-express-28ig#firebase-react)
