## Description
Backend of Esmorga. An app to manage events.

## Installation

First clone de repository:
```bash
$ git clone https://github.com/Esmorga-Backend/esmorga-backend.git
```

Install mongodb and init it:
```
https://www.mongodb.com/docs/manual/administration/install-community/
```
Define ENV:

export APP_PORT=3000
export MONGODB_URI="mongodb://localhost:27017/"
export AoiToken="XXX"

And then execute:

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# jest test (unit and component)
$ npm run test

# test coverage
$ npm run test:cov

# jest unit test
$ npm run test:unit

# jest component test 
$ npm run test:component

# e2e tests
    #Open 
$ npm run test:e2e-open-cypress
    #Run
$ npm run test:e2e-run-cypress

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
