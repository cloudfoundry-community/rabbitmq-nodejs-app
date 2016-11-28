# rabbitmq-nodejs-app
This simple CF nodesjs app uses the amqplib(https://github.com/squaremo/amqp.node) library to send and receive message to a rabbitmq service on Cloud Foundry.

## Requirments
- Need to have rabbitmq service on CF space

## Usage
```
cf push
cf bs rabbitmq-nodejs-app rmq
cf restage rabbitmq-nodejs-app
```
Visit the URL and if it says "OK" then your rabbitmq is good!
