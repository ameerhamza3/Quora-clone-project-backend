import { v2 as cloudinary } from "cloudinary";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import dotenv from "dotenv";
dotenv.config();

export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.query.userId) },
      select: {
        id: true,
        name: true,
        age: true,
        gender: true,
        email: true,
        profilePicture: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.err;
  }
};

export const editUserprofile = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { newName,newAge, gender } = req.body;
    let profilePicture;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile-pictures",
        use_filename: true,
      });
      profilePicture = result.secure_url;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name:newName,
        age: parseInt(newAge),

        ...(profilePicture && { profilePicture }),
      },
    });

    return res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
