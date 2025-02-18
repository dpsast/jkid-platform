# Base image for Node.js
FROM node:18-alpine

# install bash
apk install bash

# Set working directory
WORKDIR /app

# Copy jkid-cli files and install dependencies
COPY jkid-cli ./jkid-cli
WORKDIR /app/jkid-cli
RUN npm install

# Copy jkid-daemon files and install dependencies
WORKDIR /app
COPY jkid-daemon ./jkid-daemon
WORKDIR /app/jkid-daemon
RUN npm install
RUN npx tsc

# Copy jkid-web files and install dependencies
WORKDIR /app
COPY jkid-web ./jkid-web
WORKDIR /app/jkid-web
RUN npm install
RUN npm run build

# Set the default working directory
WORKDIR /app

# Command to run all services
CMD ["sh", "-c", "cd jkid-daemon; if [ ! -e ./prisma/data.db ]; then npx prisma generate; npx prisma db push; fi; npm run start"]
