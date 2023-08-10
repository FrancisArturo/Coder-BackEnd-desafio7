import passport from "passport";
import userModel from "../dao/models/user.models.js";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { cookieExtractor } from "../utils/jwt.js";
import { GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, SECRET_CODE_JWT } from "./config.js";





const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;




const initializePassport = () => {

    passport.use("jwt", new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: SECRET_CODE_JWT,
        },
        async (jwtPayload, done) => {
            try {
                return done(null, jwtPayload);
            } catch (err) {
                return done(err)
            }
        }
    ))



    passport.use(new GithubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            //console.log(profile);
            let user = await userModel.findOne({ email: profile._json.email })
            if (user) {
                return done(null, user);
            } else {
                user = await userModel.create({
                    firstName: profile._json.name,
                    lastName: "",
                    email: profile._json?.email,
                    password: "",
                    role: "user",
                }); 
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }
    ));



    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById({ _id: id });;
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    });
}

export default initializePassport;