# Use the official Node.js image as base
FROM node:lts-alpine

RUN npm install --global nodemon

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from the current directory to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3001

# Command to run your application
CMD ["npm", "run", "dev"]
