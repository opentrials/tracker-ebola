FROM node:6
MAINTAINER Open Knowledge International

WORKDIR /workdir

COPY app .
COPY package.json .
COPY server.js .
RUN npm install --production

ENV HOST 0.0.0.0
ENV PORT 80

EXPOSE $PORT
CMD ["npm", "start"]
