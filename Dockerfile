# production image
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]

