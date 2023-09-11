# Use the official Node.js image.
FROM node:18.17.1

# Set the working directory
WORKDIR /usr/src/app

# Install TypeScript
RUN npm install -g typescript

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy local code to the container image.
COPY . .

# Compile TypeScript to JavaScript

# Compile TypeScript to JavaScript
RUN npm run build

# Start the application
CMD [ "npm", "run", "start" ]