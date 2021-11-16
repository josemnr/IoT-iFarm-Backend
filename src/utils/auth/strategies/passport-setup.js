
const passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const axios = require('axios');
const boom = require('@hapi/boom')
const {config} = require('../../../../config');

const GOOGLE_AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://www.googleapis.com/oauth2/v4/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const OAuth2Strategy = new  GoogleStrategy({
  authorizationURL: GOOGLE_AUTHORIZATION_URL,
  tokenURL: GOOGLE_TOKEN_URL,
  clientID:     config.googleClientId,
  clientSecret: config.googleClientSecret,
  callbackURL: "/auth/google-outh/callback"


}, async function (accessToken, refreshToken, profile, cb){
  const {data, status} = await axios({
    url: `http://ifarmbackend-env.eba-bya4yeyg.us-east-1.elasticbeanstalk.com/api/auth/sign-provider`,
    method: 'post',
    data: {
      name: profile.name,
      email: profile.email,
      password: profile.id,
      apiKeyToken: conig.apiKeyToken
    }
  });
    
    if(!data || status !== 200){
      return cb(boom.unauthorized(), false);
    }
  
    return cb(null, data);

  }
);


OAuth2Strategy.userProfile = function(accessToken, done){
  this._oauth2.get(GOOGLE_USERINFO_URL, accessToken, (err, body) =>{
    if(err){
      return done(err);
    }



    try{
        const {sub, name, email} = JSON.parse(body);

        const profile = {
            id: sub, 
            name,
            email
        }
        done(null, profile);
    }catch(parseError){
      return done(parseError);
    }


  });
};

passport.use("google-oauth", OAuth2Strategy);







 