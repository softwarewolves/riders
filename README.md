# Ride sharing

This is an intentionally vulnerable browser-based React application for use in course work.

It consumes a backend API defined in [a companion, Ride Sharing API, project](https://github.com/JohanPeeters/rides-api). Feel free to set up your own serverless backend with this project. Alternatively, you can use a ready-made backend - ask me for URLs, keys, client IDs and such.

Some of this API requires access tokens. Currently, these are not being sent with the XHR requests, so some of the intended functionality fails - this needs fixing. Doing so is the main aim of this tutorial. The [Exercise](#Exercise) section below guides you through this step by step.

## Getting started

If you only want to observe the behavior of this SPA, you can do so at https://ride-sharing.ml, a site hosted on Netlify. On the other hand, you can also set up your own experiments by cloning the repo and making changes. Here are the instructions for running the application locally.

### Prerequisites

Node 8.x

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

* `npm test`: launches the test runner in interactive watch mode.
* `npm run build` - you do not need this to run the application locally.
* `npm run eject` - do not do this unless you know what you are doing.

### State shape

The project uses [redux](https://redux.js.org/) to manage application state. Application state combines 4 reducers: `error`, `rides`, `filter` and `user`.
Here is an example state:

```
{
  error: 'cannot retrieve rides - network error',
  rides: [],
  filter: ride => true,
  user: null,
  fresh: true
}
```

### Access Control

The API backend used by https://ride-sharing.ml is secured with an [AWS Cognito User Pool](https://docs.aws.amazon.com/cognito), which means that the following API calls will only succeed if accompanied by an appropriate security token:
* `POST /rides` - create
* `PUT /rides/{rideID}` - update
* `DELETE /rides/{rideID}` - delete

## Exercise

In order to access the protected methods in the backend API, you need to authenticate with the trusted authorization server and retrieve security tokens that will give you access. In line with the [most recent draft of the OAuth 2.0 Security Best Current Practice](https://tools.ietf.org/html/draft-ietf-oauth-security-topics-12), I advice to use the Authorization Code Grant with PKCE. As this is a sensitive operation, I also advice to use a well-established library for this. Unfortunately, at the time of writing, this narrows the choice down to very few. A dependency on [oidc-client-js](https://github.com/IdentityModel/oidc-client-js) is already included in `package.json` and `package-lock.json`, so it was installed by `npm install`. You can start using it right away.

### Step 1 - authenticate with the authorization server

`oidc-client`'s principal abstraction is `UserManager`. It is documented in [the project's Github wiki](https://github.com/IdentityModel/oidc-client-js/wiki). Note that it has several methods that redirect the application to the authorization server. Choose judiciously.

#### Acceptance criteria
* The application opens the login page on the configured authorization server. You may want to create an account at this stage.
* The authorization server redirects the browser to the application's redirect URI with the authorization code in a query parameter.

#### Hints
* The OAuth client communicates its choice of grant to the authorization server with the `response_type` query parameter. The default is `id_token`. This is *not* what we need here. So you have the choice between 2 alternatives: `code` or `token`. Only 1 of those leads to an implementation that meets the acceptance criteria. Which one?
* For this part of the exercise, you can get away with the `scope` query parameter sent by default - this will need to be revisited at a later stage.

### Step 2 - exchange code for token(s)

We now need to get the code out of the URI's query parameter and send it in an XMLHttpRequest to the authorization server's token endpoint.

Authorization code flow is less susceptible to token theft than the implicit flow because it does not expose the security tokens in URIs. However, the authorization code is also sensitive since it can be exchanged for security tokens. These are some of the measures suggested to mitigate the risk of code theft:
* Only allow the code to be presented once. This is something that must be enforced by the authorization server. Unfortunately, Cognito, like many other authorization servers, does not enforce this.
* PKCE. We are good here.
* Remove the code from the browser's history - this is one of the acceptance criteria of this exercise, see below.

For a more complete discussion, see the [OAuth 2.0 Threat Model and Security Considerations RFC](https://tools.ietf.org/html/rfc6819).

#### Acceptance criteria
* The authorization server sends back one or more security tokens.
* The code is *not* in browser history.
* If the exchange fails, an error message appears with the reason for the failure.

#### Hints
* Since you will be using PKCE, the authorization server needs to redirect to a page that will exchange the code for tokens.
* Prior to the implementation of this requirement, the case for using React Router is not exactly compelling. Here you can make it shine.
* There is a, thus far unused, React component that may come in handy.
* Leverage the React router - at the moment it is present in the application, but not really useful.
* Error messages are being displayed by the `ErrorMessage` component based on the `error` state key. So, if authentication fails, call the `notify` Redux action creator to set error state.

### Step 3 - put the app into an authenticated state

The app uses a redux store to keep track of global state. It already has a `user` reducer, but this is currently not being called. As it stands, authentication state is being injected into several components:
* `Header` shows a different button depending on whether the user is logged in,
* `Ride` decides whether the user can alter a ride based on ownership, and,
* `RideSharingMenu` enables menu items based on the presence of a user.

Place the user in the global redux state when the authorization server returns tokens.

#### Acceptance criteria
* The login button becomes a logout button when the user has authenticated.
* Menu items are enabled.

#### Hint
`UserManager` raises events. A client can register callbacks for them.

### Step 4 - log out

The converse of logging in, logging out, turns out to be trickier. The application must recognize that the user has logged out, but so must the authorization server. In other words, the session with the authorization server must be invalidated.

#### Acceptance criteria
* The logout button makes place for a login button.
* Menu items are disabled as appropriate.
* When logging back in after log out, the user must re-authenticate.
* No more tokens in local or session storage.

#### Hint
Have a look at the authorization server's (Cognito) [logout API documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/logout-endpoint.html). Why would it be useful to call?

### Step 5 - keep authentication state across page reloads

#### Acceptance criteria
When you logged in and refresh the page, you are still logged in.

### Step 6 - send access token with create, update and delete calls

#### Acceptance criteria
* You can add a ride.
* You can delete your own rides.
* You can edit and update your own rides.

#### Hint
You obtained an access token when logging in, but does it contain the right scopes? I.e. does it bestow permission to make the API call?
