const keys = require('./keys');
const redis = require('redis');


const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
console.log('***** WORKER STARTED *****');
console.log(redisClient)
const sub = redisClient.duplicate();
console.log(sub)

function fib(index) {
  console.log('***** WORKER CALLED: IN FID');
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  console.log('**** WORKER CALLED: in sub messeage');
  console.log(message);
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
