FROM node:14-alpine
ENV NODE_ENV=production
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 3000:3000
CMD [ "npm","start" ]