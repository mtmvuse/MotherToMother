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

## Running the frontend (React)

- Install dependencies
```
npm i
```
- Run the app
```
npm start
```
- Choose register and provide your email and password to test the app. Once you submit, firebase will authenticate you and redirect you to the home page. Then you can click to go to your profile then logout. Now login with the same credentials, and you'll be redirected to the home page.

## Firebase Node/Express Integration

# Sources
For a more detailed guide on how to set up firebase, and an explanation of all involved steps and files, check out the guide below. 

- [Build Authentication using Firebase | React | Express](https://dev.to/earthcomfy/build-authentication-using-firebase-react-express-28ig#firebase-react) 
