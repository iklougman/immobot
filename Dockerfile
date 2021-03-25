FROM node:12
WORKDIR /usr/
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

FROM keymetrics/pm2:15-alpine
EXPOSE 80
CMD ["pm2", "start", "immobot"]