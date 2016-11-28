var express = require( 'express')
var app = express()
var cf_app = require( './app/vcap_application')
var cf_svc = require( './app/vcap_services')

app.set( 'views', __dirname + '/views')
app.set( 'view engine', 'jade')
app.use( express.static( __dirname + '/public'))
var url = cf_svc.get_rabbitmq_url();
var message = 'OK';
var text = "NOT WORKING";

var q = 'nodejs';

function bail(err) {
  console.error(err);
  process.exit(1);
}

// Publisher
function publisher(conn) {
  console.log("Publishing Message to RabbitMQ")
  conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(q);
    ch.sendToQueue(q, new Buffer(message));
  }
}

// Consumer
function consumer(conn) {
  console.log("Consuming RabbitMQ Queue")
  var ok = conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(q);
    ch.consume(q, function(msg) {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch.ack(msg);
        text = msg.content.toString();
      }
    });
  }
}



app.get( '/', function ( req, res) {
  console.log("Connecting to RabbitMQ")
  require('amqplib/callback_api')
  .connect(url, function(err, conn) {
    console.log("Connected to RabbitMQ")
    if (err != null) bail(err);
    consumer(conn);
    publisher(conn);
  });
  res.render( 'pages/index', {
    rabbitmq_msg: text
  })
})

console.log("App Listening")
app.listen( process.env.PORT || 4000)
