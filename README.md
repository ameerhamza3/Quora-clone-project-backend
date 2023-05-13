# Quora-clone-project-backend

This is the backend server for a Quora clone project. It provides the API endpoints required for the Quora-like functionality.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)

## Project Description

This project aims to replicate some of the core features and functionality of the popular platform Quora.
It includes user authentication, question posting, answer posting, Topic Posting, Topic Details, and voting on answers and questions.

## Features

- User registration and authentication
- Posting and viewing questions
- Posting and viewing answers
- Upvoting and downvoting answers
- User profile management
- Posting and viewing Topic Details

## Technologies Used

- Node.js (v14.21.3)
- Express.js
- Postgress 
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing
- Cloudinary for image upload and storage

## Prerequisites

- Node.js (v14.21.3) and npm (6.14.18) installed
- Postgres installed and running
- Cloudinary account (sign up at https://cloudinary.com)

## Installation
1. Clone the repository:
  - git clone https://github.com/ameerhamza3/quora-clone-backend.git

2. Install the dependencies:
  - npm install

3. Set up the environment variables:
- Create a `.env` file in the root directory.
- Define the following environment variables:
  - `DB_URI`: Connection string for your PostgreSQL database
  - `JWT_SECRET`: Secret key for JSON Web Token (JWT) signing
  - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
  - `CLOUDINARY_API_KEY`: Your Cloudinary API key
  - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

4. Start the server:
  - To start the server, run either `npm start` or `node server.js`.
  - The server should now be running on `http://localhost:4000`.
