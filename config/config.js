'use strict'
const email_id = "gmail_id";
const pass = "gmail_password";
const service = "Gmail";
const clientId = "Your Client ID"
const clientSecret = "Your Client Secret"
const callbackUrl = "http://localhost:5000/account/auth/facebook/callback"
const databaseUrl= "mongoDB url";
module.exports ={
    mailer:{
        service:service,
        auth:{
            user:email_id,
            pass:pass
        }
    },
    database:databaseUrl,
    facebook:{
        clientId:clientId,
        clientSecret:clientSecret,
        callbackUrl:callbackUrl
    }
}