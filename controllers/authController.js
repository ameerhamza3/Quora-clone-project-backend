import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import dotenv from "dotenv";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

import passport from "../middlewares/passport.js";

export const register = (req, res, next) => {
  passport.authenticate("register", async (err, user, info) => {
    try {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (!user) {
        return res.status(400).json({ message: info.message });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "profile-pictures",
        use_filename: true,
      });

      const newUser = await prisma.user.create({
        data: {
          name: req.body.name,
          age: parseInt(req.body.age),
          gender: req.body.gender,
          email: req.body.email,
          username: req.body.username,
          password: hashedPassword,
          profilePicture: result.secure_url,
        },
      });

      const token = jwt.sign(
        { id: newUser.id, name: newUser.name },
        process.env.JWT_SECRET
      );

      return res.status(201).json({
        message: "User registered successfully",
        
          userId: newUser.id,
          name: newUser.name,
          email: newUser.email,
          profilePicture: newUser.profilePicture,
          token: token,
      
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  })(req, res, next);
};

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!user) {
      return res.status(400).json({ message: info.message });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      message: "Authentication Successful",
      userId: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      token,
    });
  })(req, res, next);
};
