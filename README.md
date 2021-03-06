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
* The authorization server accepts the following redirect URIs:
   * http://localhost:3000,
   * http://localhost:3000/callback,
   * https://ride-sharing.ml/callback, and,
   * https://ride-sharing.tk


### Step 2 - exchange code for token(s)

We now need to get the code out of the URI's query parameter and send it in an XMLHttpRequest to the authorization server's token endpoint.

Authorization code flow is less susceptible to token theft than the implicit flow because it does not expose the security tokens in URIs. However, the authorization code is also sensitive since it can be exchanged for security tokens. These are some of the measures suggested to mitigate the risk of code theft:
* Only allow the code to be presented once. This is something that must be enforced by the authorization server. Unfortunately, Cognito, like many other authorization servers, fails to do so.
* PKCE. We are good here.
* Remove the code from the browser's history - this is one of the acceptance criteria of this exercise, see below.

For a more complete discussion, see the [OAuth 2.0 Threat Model and Security Considerations RFC](https://tools.ietf.org/html/rfc6819).

#### Acceptance criteria
* The authorization server sends back one or more security tokens.
* The code is *not* in browser history.
* If the exchange fails, an error message appears with the reason for the failure.

#### Hints
* Since you are using the authorization code grant, the authorization server needs to redirect to a page that exchanges the code for tokens.
* There is a, thus far unused, React component that may come in handy.
* Prior to the implementation of this requirement, the case for using React Router is not exactly compelling. Here you can make it shine.
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

#### Hints
* `UserManager` raises events. A client can register callbacks for them.
* A `user` reducer has already been provided for the global redux state as well as the actions it accepts. `user` global state can be made available through `mapStateToProps` and dispatch functions through `mapDispatchToProps` similar to, for example, `rides` and `resetRides` respectively.

### Step 4 - log out

The converse of logging in, logging out, turns out to be trickier. The application must recognize that the user has logged out, but so must the authorization server. In other words, the session with the authorization server must be invalidated.

#### Acceptance criteria
* The logout button makes place for a login button.
* Menu items are disabled as appropriate.
* When logging back in after log out, the user must re-authenticate.
* No more tokens in local or session storage.

#### Hints
* `UserManager` provides a method to remove the user from storage.
* Have a look at the authorization server's (Cognito) [logout endpoint documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/logout-endpoint.html). Why would it be useful to navigate to that page?

### Step 5 - keep authentication state across page reloads

#### Acceptance criteria
When you logged in and refresh the page, you are still logged in.

#### Hints
* In the previous step you used a `UserManager` method to remove the user from storage. To meet this requirement, you need the converse: load the user from storage. Chances are that there is a method for this too.
* You may previously have registered a listener to a `userLoaded` event to handle the case where the user successfully authenticates. It would not be unreasonable to expect that this would also be raised when a user is loaded from storage. Apparently it is not. In other words, you need to take explicit action when the promise to load the user is fulfilled.

### Step 6 - send access token with create, update and delete calls

#### Acceptance criteria
* You can add a ride.
* You can delete your own rides.
* You can edit and update your own rides.

#### Hints
* You obtained an access token when logging in, but does it contain the right scopes? I.e. does it bestow permission to make the API call?
* Following 'custom scopes' are recognized in the backend (Cognito, API Gateway):
  * `rides/create`
  * `rides/update`
  * `rides/delete`
* The existing code relies on a `profile` field in the `user` object. This is created by `UserManager` based on the ID token. In order to receive an ID token, `openid` needs to be specified as a scope.
* The `scope` query string parameter is a string containing one or more scopes separated by a space.
* The API expects the access token in the `Authorization` header. It is preceded by `Bearer` followed by a space.

### Step 7 - obtain a new access token when the old one is about to expire (optional)

Security people like short-lived tokens, UX'ers do not want the user to have to authenticate too often. In order to satisfy both, authorization servers are often configured to issue access and ID tokens with a shortish expiry time and to also issue refresh tokens. These refresh tokens are valid for longer and can be used to obtain new access and ID tokens - there is an endpoint for that. But AS client libraries typically wraps it in an abstraction. As you are now pretty accomplished with all things OAuth and OIDC, that is all the hints that you are going get!
