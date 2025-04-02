
FROM node:18


WORKDIR /app

COPY react-code/package.json ./
COPY react-code/package-lock.json ./

RUN npm install


COPY my-app/ ./


EXPOSE 3000


CMD ["npm", "start"]
