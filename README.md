# Tripscore server by the OASIS team
## Server
Server written with Node.js, express using SQLite as a database engine.
Mainly used to gather and provide station data. A docker container is in the top of the server.

## About
Together, Ghent and the region of Madrid have initiated an innovative action that will increase the accessibility of public services and public transport. To do this, they will collaborate to publish linked open data. Both cities are experienced publishers of open data, and together they will prove that new technologies (such as the “Semantic Web”) can lead to economies of scale, such as the creation of cross-country applications.

The proof of concept is a small app in which a user can fill in the route he usually takes to work/home. The product will show the quality of experience of the trip, compared to trains that depart earlier or later, within a predefined timespan.
The applications uses linked open data from the iRail API, combined with historical data.

## Installation
### Requirements 
* Docker

### Commands
To install:
```bash
$ git clone https://github.com/dachafra/oasis-backend
$ cd oasis-backend
$ docker build -t oasis-backend .
$ docker run -d --name oasis-backend -p localhost-port:8080 oasis-backend
```
