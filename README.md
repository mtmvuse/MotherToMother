<h1 align="center">react-express-firebase-auth-template</h1>
<div>
  <p align="center">
    This is a template for a React app with a Node/Express backend and Firebase authentication.
    <br />
    <a href="https://github.com/ChangePlusPlusVandy/react-express-firebase-auth-template/issues">Report Bug</a>
    ·
    <a href="https://github.com/ChangePlusPlusVandy/react-express-firebase-auth-template/issues">Request Feature</a>
  </p>
</div>

**Note**: if you run into any issue while following or using this template. **Report a bug** or **Request Feature** and assign it to me. **@salomondush**
## Firebase Setup
Create a firebase project using the [Firebase Console](https://console.firebase.google.com/u/0/?pli=1) 
- Click create project
- Give your project a name (preferably the same as your repo/project name) and click continue.
- Enabling Google Analytics is optional, click continue, and finally click create project.
- When your project is created, click continue.
- You'll be presented with a dashboard for your project. Click on **Authentication** from the displayed cards, Click **Get Started** go to the **Sign-in method** tab. 
- The biggest advantage of firebase is that it allows you to authenticate users using a variety of methods. For this project, we will use email/password. Click on the **Email/Password** tab, enable it, and save. This will allow users to sign in using their email and password.
- You can add other providers later on if you wish.

## Firebase React Integration

After creating the project, you need to create an application
- On your Firebase Console Dashboard left navigation, click on on the settings icon, and choose **Project Settings**, then select this icon `</>` to add an application to your project. Give it a name and click register app.
- This above step will give you config data. Create `.env` file in the root directory of the `react-auth-template` project and store the config data with the following exact format and names (don't use lowercase camelCase variables from firebase, use uppercase instead with the REACT_APP_ prefix):
**measurementId is not needed**
```
// .env

REACT_APP_FIREBASE_API_KEY = 
REACT_APP_FIREBASE_AUTH_DOMAIN = 
REACT_APP_FIREBASE_PROJECT_ID = 
REACT_APP_FIREBASE_STORAGE_BUCKET = 
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = 
REACT_APP_FIREBASE_APP_ID = 
```
**NOTE:** Make sure that you `.env` files are added to `.gitignore`, so that your secrets won't be uploaded to github. I included them in the `.gitignore` file in the root directory, but if you restructure the project in anyway, you'll need to update the path.

## Frontend and Backend interaction

- In `react-auth-template/src/components/Home.js`, there's a writen sample code in the useEffect hook
that makes a request to get a quote from a protected route/endpoint at the backend using the token from the frontend. You can use this as a reference to make requests to protected routes at the backend. After configuring the backend, you can test this by running the frontend and backend and navigating to the home page. You should see a quote displayed on the page.
## Firebase Node/Express Integration

At the backend, we will create a middleware that we will rely on for accessing frontend requests to verify tokens. We will utilize a [firebase backend module](https://github.com/ChangePlusPlusVandy/react-express-firebase-auth-template/issues) to verify the token that will be recieved from frontend requests.

- We will need to create a configuration file with our service account crednetials (created earlier). This will alow us to use the Firebase Admin SDK service account to communicate with Firebase when verifying a token.
- Go to Frebase Dashboard and click the settings icon from the side panel and choose **Project Settings**
- Click **Service Accounts** tab and click **Generate New Private Key**, and click **Generate Key** to confirm.
- Navigate to the `express-auth-template/config/` directory and create `serviceAccountKey.json` file in that directory, **Exactly that name**, and paste the contents from the downloaded json file. **PLEASE do not upload your secrets to github, so make sure that this file isn't tracked by github, i.e add it to .gitignore. AGAIN, the contents of `serviceAccountKey.json` should not be pushed to github.** I updated this repo to include that file in .gitignore, so basically ignoring any changes made to it, but if you restructure the project in anyway, you'll need to update the path.

Next, you'll also need to create a `.env` file in the root directory of the backend, `express-auth-template` and provide a port number for your backend. Since the frontend already assumes the port to be 3001, it's mandatory that you use the same port as follows. If you use a differenti port, make sure to make the same changes at the frontned where the backend is called.

```
PORT=3001
```

## Running the project

### Running the backend
- Navigate to the backend folder 
```
express-auth-template
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
react-auth-template
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

**Note**: Again, if you run into any issue while following or using this template. Click **Report a bug** or **Request Feature** at the top and assign it to me. **@salomondush**
