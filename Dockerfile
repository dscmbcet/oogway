FROM node:18-alpine
ENV NODE_ENV=production\
    TZ=Asia/Kolkata
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD [ "npm","start" ]