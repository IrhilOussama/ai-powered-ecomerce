import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import User, { MyUser } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_REDIRECT_URL, // This should match the Authorized redirect URI in Google Cloud Console.
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done) => {
      try {
        // Extract the user's email and display name from the profile.
        const email = profile.emails && profile.emails[0].value;
        const username = profile.displayName;

        if (!email) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        // Check if the user already exists in the database.
        let user: MyUser | null = await User.findUserByEmail(email);

        if (!user) {
          // If not, create a new user.
          // Since Google-authenticated users won’t be using a password for login,
          // you might store an empty string or a placeholder value.
          user = await User.create({ username, email, password: '' });
        }

        // Return the user to the next step in authentication.
        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

// Since we're using JWTs (not sessions), you can omit serializeUser/deserializeUser if you’re not using session support.
// If you do plan on using sessions elsewhere, you can add them as shown below:

// passport.serializeUser((user: any, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const user = await User.findUserById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });
