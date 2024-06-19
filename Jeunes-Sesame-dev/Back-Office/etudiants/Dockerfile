FROM node:20-alpine as student_build
ARG ENV_PROD_FILE
ENV ENV_PROD_FILE $ENV_PROD_FILE
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm
RUN npm ci --no-audit --maxsockets 1
COPY ./ .
RUN echo "$ENV_PROD_FILE" | base64 -d > ./src/environments/environment.prod.ts \
    && npm run build-prod

FROM nginx:stable-alpine
ENV APP_NAME=etudiants
WORKDIR /var/www/html
COPY --from=student_build /app/dist/${APP_NAME} ./
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
