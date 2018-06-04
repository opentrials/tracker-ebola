FROM node:6
MAINTAINER Open Knowledge International

WORKDIR /workdir

COPY app ./app
COPY config.json .
COPY server.js .
COPY gulpfile.js .
COPY package.json .
RUN npm install

ENV HOST 0.0.0.0
ENV PORT 80

EXPOSE $PORT
CMD ["npm", "start"]
