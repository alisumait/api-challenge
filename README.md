# Docs 

## [Xendit Challenge](#) 

RESTful API for storing comments and retrieving members against an existing Github organization.

Both API microservices were dockerized to Docker Hub and deployed on AWS. Link  ...

## Index

* [Getting Started](#getting-started)	
* [API Endpoints](#api-endpoints)	


## Getting Started

#### Download

1. Clone the repo
```
git clone https://github.com/alisumait/xendit-challenge.git
```
2. Install NPM packages in /members and /comments for running unit tests
```
npm install
```
3. In the root folder, run ```docker-compose up --build``` to run both containers locally.

4. API can be accessed from port 3000 for comments and 3001 for members respectively.

#### API Keys

Secret keys are pushed in .env for demo purposes. You can generate new ones from github.com and cloud.mongodb.com

---

## API Endpoints

There are 2 endpoints to access the API:

```
/orgs/<org-name>/comments
```
Operations for this endpoints are:

1. ```GET``` to retrieve a list of comments stored in the DB against an organization

2. ```POST``` to post a comment under an organization that exists in Github with ```{ comment: "sample comment" }``` as body.

1. ```DELETE``` to soft-delete all comments under an organization.

---

```
/orgs/<org-name>/members
```
Operations for this endpoints are:

1. ```GET``` to retrieve a list of public members of a Github organization sorted in descending order by the number of followers.

---

## Running tests

Mocha & Chai were used for unit and integration tests. ```mongodb-memory-server``` package was used to spin up new DBs locally for testing.

To run the tests, cd to ./comments and ./members and run ```npm run test```.
