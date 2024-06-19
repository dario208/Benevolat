FROM node:20-alpine as front_build
ARG ENV_PROD_FILE
ENV ENV_PROD_FILE $ENV_PROD_FILE
WORKDIR /app
COPY package.json ./
RUN npm install -g npm
RUN yarn install
COPY ./ .
RUN echo "$ENV_PROD_FILE" | base64 -d > ./src/services/environment.ts \
    && yarn build

FROM nginx:stable-alpine
WORKDIR /var/www/html
COPY --from=front_build /app/build ./
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]