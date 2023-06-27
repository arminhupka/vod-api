FROM node:16.20.0-alpine
WORKDIR /user/src/app
COPY . .
RUN npm ci
RUN npm run build
USER node
CMD ["npm", "run", "start:prod"]