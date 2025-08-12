import { OAuth2Client } from "google-auth-library";
import { getEnvVariable } from "./getEnvVariable.js";

const clientOAuth = new OAuth2Client({
    clientId: getEnvVariable('GOOGLE_CLIENT_ID'),
    clientSecret: getEnvVariable('GOOGLE_CLIENT_SECRET'),
    redirectUri: getEnvVariable('GOOGLE_REDIRECT_URI'),
});

export async function getGoogleAuthUrl() {
    return clientOAuth.generateAuthUrl({
        scope:
            [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
            ],
    });
};

export async function validateCode(code) {
  const response = await clientOAuth.getToken(code);

  return clientOAuth.verifyIdToken({
    idToken: response.tokens.id_token,
  });
}