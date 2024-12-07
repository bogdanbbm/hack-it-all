FROM node:18-alpine

WORKDIR /frontend/

COPY public/ /frontend/public/
COPY src/ /frontend/src/
COPY package*.json /frontend/
COPY .env /frontend/

RUN npm install
RUN npm install -g serve
RUN npm run build --omit=dev

EXPOSE 3000

CMD ["serve" , "-s", "build"]
# CMD ["npm", "start"]