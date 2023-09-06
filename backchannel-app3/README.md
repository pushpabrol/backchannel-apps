# Express OpenID Connect Sample with OIDC Backchannel Logout

This sample demonstrates back channel logout in an Express Node.js app. The sample quickly shows how to log in, back channel log out, and view profile information of the logged-in user.


## Running This Sample

1. Install the dependencies with npm:

```bash
npm install
```


2. Auth0 Setup
   

   * Create an Auth0 tenant
   * Create an application of type Regular Web Application
   * Enable at least one connection at the application level
   * Under the Settings tab set the `Allowed callback Urls` of this appliction to be the `BASE_URL/callback`
   * Under the Settings tab set the `Allowed Logout Urls` of this appliction to be the `BASE_URL` - 
   * Save your settings
   * Go to the `Sessions` tab and set the "OIDC Back Channel Logout Url" to `BASE_URL/backchannel-logout`
   *  Click on `Save Changes` on this tab
   *  Make note of the `Client ID` and the `Domain` from the Settings page of the application and set the `CLIENT_ID` and the `ISSUER_BASE_URL` in your applications .env file
    


3. Rename `.env.example` to `.env` and replace or check the following values. 

   - `CLIENT_ID` - your Auth0 application client id
   - `ISSUER_BASE_URL` - absolute URL to your Auth0 application domain (ie: `https://accountName.auth0.com`)
   - `PORT` - PORT to run your app on
   -  `SECRET`  - 'a randomly rengerated string. You can generate one on the command line with the following `openssl rand -hex 32'
   - `BASE_URL` - <Application base url>
   - `APP_NAME` - <Name for your app>
   - `BACKGROUND_COLOR` - <Color branding for your app> When demonstrating backchannel logout across multiple apps this helps in showing the experience


4. Run the sample app:

```bash
npm start
```
or

```bash
npm start:dev
```



## Support + Feedback

Please use the [Issues queue](https://github.com/auth0-samples/auth0-express-webapp-sample/issues) in this repo for questions and feedback.

## Vulnerability Reporting

Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## What is Auth0?

Auth0 helps you to easily:

- implement authentication with multiple identity providers, including social (e.g., Google, Facebook, Microsoft, LinkedIn, GitHub, Twitter, etc), or enterprise (e.g., Windows Azure AD, Google Apps, Active Directory, ADFS, SAML, etc.)
- log in users with username/password databases, passwordless, or multi-factor authentication
- link multiple user accounts together
- generate signed JSON Web Tokens to authorize your API calls and flow the user identity securely
- access demographics and analytics detailing how, when, and where users are logging in
- enrich user profiles from other data sources using customizable JavaScript rules

[Why Auth0?](https://auth0.com/why-auth0)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
