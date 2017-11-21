FROM node:8.9.1

MAINTAINER dachafra@gmail.com

WORKDIR /tripscore/oasis-backend

RUN	git clone https://github.com/dachafra/oasis-backend.git . \
	&& npm install \
	&& chomd +x run.sh

CMD run.sh

EXPOSE 8080
