const rabbitMQ = require("foo-foo-mq");
const { configure } = require("./config");


async function sendMessage() {
  try {
    await configure();
    await publisher();
  } catch (err) {
    console.error("Error sending message:", err);
  }
}
sendMessage();

async function publisher() {

const message = 
    {
      text: "Super Mario!",
      routingKey: "ex1",
      retry_count: 0,
    }


  try {
    await rabbitMQ.publish("ex.1", {
      body: message,
      routingKey: message.routingKey,
    });

    console.log(
      `Message sent successfully to exchange "${"ex.1"}" with key "${message.routingKey}":`,
      message.text
    );
  } catch (error) {
    console.error(
      `Error publishing message to exchange "ex.1" with key "${message.routingKey}":`,
      error.message
    );
  }
}


