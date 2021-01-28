FROM node:12.16.3

WORKDIR /app

ADD package.json /app

ADD . /app

RUN yarn

RUN yarn client:build:prod

CMD ["yarn", "server:start"]