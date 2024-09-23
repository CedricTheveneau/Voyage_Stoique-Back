FROM node:20

WORKDIR /app

COPY . .

RUN npm install

RUN apt-get update && apt-get install -y ffmpeg

EXPOSE 8082

CMD [ "npm", "run", "start" ]