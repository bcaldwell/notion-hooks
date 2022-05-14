# STAGE 1
FROM node:16-alpine as builder
RUN apk add git && mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
# RUN npm config set unsafe-perm true
# RUN npm install -g typescript
# RUN npm install -g ts-node
RUN yarn install --network-timeout 1000000000
COPY --chown=node:node . .
RUN yarn run build

# STAGE 2
FROM node:16-alpine
RUN apk add git && mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app && ln -s /home/node/app/bin/run /usr/local/bin/notion-hooks
WORKDIR /home/node/app
COPY package*.json ./
# RUN npm install --save-dev sequelize-cli
RUN yarn install --production --network-timeout 1000000000

USER node
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/bin/run ./bin/run

CMD [ "notion-hooks" ]