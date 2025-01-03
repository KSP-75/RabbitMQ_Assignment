const rabbitMQ = require("foo-foo-mq");
const { init } = require("./config");

async function sendMessage() {
  try {
    await init();
    await publishToFanout();
    await publishToTopic();
    await publishToDirect();
    await publishToDeadLetter();
  } catch (err) {
    console.error("Error sending message: ", err);
  }
}

sendMessage();

async function publishToFanout() {
  const message = "Fanout exchange message";
  const routingKey = "ignored"; // Ignored for fanout
  await rabbitMQ.publish("exchange.1", { body: message });
  console.log(`Published to fanout exchange: ${message}`);
}

async function publishToTopic() {
  const message = "Topic exchange message";
  const routingKey = "name.ksp";
  await rabbitMQ.publish("exchange.2", { body: message, routingKey });
  console.log(`Published to topic exchange with key "${routingKey}": ${message}`);
}

async function publishToDirect() {
  const message = "Direct exchange message";
  const routingKey = "direct";
  await rabbitMQ.publish("exchange.3", { body: message, routingKey });
  console.log(`Published to direct exchange with key "${routingKey}": ${message}`);
}

async function publishToDeadLetter() {
  const message = "Dead letter message";
  await rabbitMQ.publish("dead.exchange.1", { body: message, expiresAfter: 4000 });
  console.log(`Published to dead letter exchange: ${message}`);
}
