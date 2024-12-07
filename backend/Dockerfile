FROM node:hydrogen-slim

WORKDIR /backend/

COPY .env /backend/
COPY app.js /backend/
COPY controllers /backend/controllers/
COPY schemas /backend/schemas/
COPY package.json /backend/
COPY package-lock.json /backend/

EXPOSE 3001

RUN npm install

CMD ["node", "app.js"]