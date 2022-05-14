# STAGE 1
FROM node:16-alpine as builder

RUN apk add git
WORKDIR /home/node/app

COPY package.json ./
COPY yarn.lock ./

# RUN npm config set unsafe-perm true
RUN npm install -g typescript shx
RUN yarn install --production --network-timeout 1000000000
COPY --chown=node:node . .

RUN yarn run build

# STAGE 2
FROM node:16-alpine
RUN ln -s /home/node/app/bin/run /usr/local/bin/notion-hooks
WORKDIR /home/node/app
COPY package.json ./

USER node
COPY --from=builder --chown=node:node /home/node/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /home/node/app/bin/run ./bin/run
COPY --from=builder --chown=node:node /home/node/app/dist ./dist

CMD [ "notion-hooks" ]