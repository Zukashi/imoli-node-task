# Use the official Node.js image.
FROM node:18.17.1

# Set the working directory
WORKDIR /usr/src/app

# Install git
RUN apt-get update && apt-get install -y git

# Clone wait-for-it
RUN git clone https://github.com/vishnubob/wait-for-it.git

# Change permissions to make it executable
RUN chmod +x wait-for-it/wait-for-it.sh

# Copy package.json and package-lock.json
COPY package*.json ./

# Install TypeScript
RUN npm install -g typescript

# Install project dependencies
RUN npm install

# Copy local code to the container image.
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Start the application
CMD ["sh", "-c", "./wait-for-it/wait-for-it.sh db:5432 -- npm run start"]
