# Ride sharing

This is an intentionally vulnerable browser-based React application for use in course work.
Find and fix the vulnerabilities.

This app consumes a backend API defined in [a companion, Ride Sharing API, project](https://github.com/JohanPeeters/rides-api). Some of this API requires access tokens. Currently, these are not being sent with the XHR requests, so some of the intended functionality fails - this needs fixing.

## Getting started

If you only want to observe the behavior of this SPA, you can do so at https://ride-sharing.tk, a site hosted on Netlify. On the other hand, you can also set up your own experiments by cloning the repo and making changes. Here are the instructions for running the application locally.

### Prerequisites

Node 8.x

#### Windows only
* MinGW with base MSYS package added to your PATH
* `copy c:\MinGW\bin\mingw32-make.exe c:\MinGW\bin\make.exe`
* `copy c:\MinGW\bin\mingw32-make.exe c:\MinGW\bin\make.exe`

### Installation

```
git clone https://github.com/softwarewolves/riders.git  
cd riders
npm install
```

Create a `.env` file in the project's root directory with values you obtain from the instructor:

```
REACT_APP_API_KEY=<API-key>
REACT_APP_API_HOST=<hostname>
REACT_APP_API_STAGE=<stage name>
```

At a later stage, the following additional environment variables will also be required, so you might as well include them now. This will save you from having to restart your development server when they are introduced:

```
REACT_APP_ISSUER=<authorization server URL>
REACT_APP_CLIENT_ID=<client id>
```

### Run locally

`npm start`

This will start a development server, open a tab in your default browser, and load the app. As Hot Module Replacement is on, any changes will take immediate effect.

## Background

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Apart from `npm start`, it includes the following scripts:

* `npm test`: launches the test runner in interactive watch mode. It is recommended that you keep the tests running while you make changes to the project to make sure you do not unintentionally break things.
* `npm run build` - you do not need this to run the application locally.
* `npm run eject` - do not do this unless you know what you are doing.

### State shape

The project uses [redux](https://redux.js.org/) to manage application state. Application state combines 4 reducers: `error`, `rides`, `filter` and `user`.
Here is an example of the state of the application:

```
{
  error: 'cannot retrieve rides - network error',
  rides: [],
  filter: ride => true,
  user: null
}
```

### Access Control

The API backend used by https://ride-sharing.ml is secured with an [AWS Cognito User Pool](https://docs.aws.amazon.com/cognito), which means that the following API calls will only succeed if accompanied by an appropriate security token:
* `POST /rides` - create
* `PUT /rides/{rideID}` - update
* `DELETE /rides/{rideID}` - delete

## Exercise
In order to access the protected methods in the backend API, you need to authenticate with the trusted authorization server and retrieve security tokens that will get you access. In line with the [most recent draft of the OAuth 2.0 Security Best Current Practice](https://tools.ietf.org/html/draft-ietf-oauth-security-topics-12), we advice to use the Authorization Code Grant with PKCE. As this is a sensitive operation, we also advice to use a well-established library for this. Unfortunately, at the time of writing, this narrows the choice down to one: [oidc-client-js](https://github.com/IdentityModel/oidc-client-js). The dependency is already included in `package.json` and `package-lock.json`, so it was installed by `npm install`. You can start using it right away.
