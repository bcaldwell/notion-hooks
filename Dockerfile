# STAGE 1
FROM node:18-alpine as builder

RUN apk add git
WORKDIR /home/node/app

COPY package.json ./
COPY yarn.lock ./

# RUN npm config set unsafe-perm true
RUN yarn install --network-timeout 1000000000
# install again to be copied, this has some stuff cached so faster
RUN yarn install --production --network-timeout 1000000000 --modules-folder node_modules_production
COPY --chown=node:node . .

RUN yarn run build


# STAGE 2
FROM node:16-alpine
# symlink resulting run script to bin folder
RUN ln -s /home/node/app/bin/run /usr/local/bin/notion-hooks

WORKDIR /home/node/app

USER node

# this is needed for the cli to work
COPY package.json ./

COPY --from=builder --chown=node:node /home/node/app/node_modules_production ./node_modules
COPY --from=builder --chown=node:node /home/node/app/bin/run ./bin/run
COPY --from=builder --chown=node:node /home/node/app/dist ./dist

CMD [ "notion-hooks" ]
