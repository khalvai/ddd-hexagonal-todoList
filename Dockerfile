FROM node:20 As development

WORKDIR /usr/src/app

COPY  package*.json ./
COPY  yarn.lock ./

RUN  yarn 
COPY  . .

EXPOSE 3000
CMD [ "yarn", "dev" ]


# BUILD FOR PRODUCTION

FROM node:20  As build

WORKDIR /usr/src/app

COPY  package*.json ./
COPY  yarn.lock ./

COPY  --from=development /usr/src/app/node_modules ./node_modules

COPY  . .

RUN yarn run build

ENV NODE_ENV production

USER node

# PRODUCTION

FROM node:20  As production

COPY  --from=build /usr/src/app/node_modules ./app/node_modules
COPY  --from=build /usr/src/app/dist  ./app/dist
COPY .env /app/.env
ENV NODE_ENV=production
# start the server
CMD [ "node", "app/dist/main.js" ]