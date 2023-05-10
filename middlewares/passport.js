import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return done(null, false, { message: 'User not registered' });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          return done(null, false, { message: 'Invalid password' });
        }

        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    done(null, user);
  } catch (error) {
    console.error(error);
    done(error);
  }
});

passport.use(
  "register",
  new LocalStrategy(
    {
      email: "email",
      password: "password",
    },
    async (email, password, done) => {
      try {
        const existingUserEmail = await prisma.user.findUnique({
          where: { email },
        });
        if (existingUserEmail) {
          return done(null, false, {
            message: "User already exists with this email",
          });
        }


        return done(null, true);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }
  )
);


export default passport;
