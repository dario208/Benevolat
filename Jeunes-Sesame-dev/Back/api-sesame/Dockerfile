FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm
RUN npm ci --no-audit --maxsockets 1
COPY ./ /app
RUN npm run build
ENTRYPOINT [ "npm", "run", "start:prod" ]
