FROM node:8.9.1

MAINTAINER dachafra@gmail.com

WORKDIR /tripscore/oasis-backend

RUN	git clone https://github.com/dachafra/oasis-backend.git . \
	&& npm install \
	&& chmod +x run.sh

ENTRYPOINT ["/tripscore/oasis-backend/run.sh]

EXPOSE 8080
