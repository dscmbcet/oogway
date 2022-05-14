FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD [ "npm","start" ]