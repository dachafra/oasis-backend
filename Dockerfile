FROM node:8.9.1

MAINTAINER dachafra@gmail.com

WORKDIR /tripscore/oasis-backend

COPY package*.json ./

RUN	npm install 

COPY . .

ENTRYPOINT ["/tripscore/oasis-backend/run.sh"]

EXPOSE 8080
