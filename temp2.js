const rabbitMQ = require("foo-foo-mq");
const { init } = require("./config");

async function receive() {
  try {
    await init();

    await rabbitMQ.handle("", async function (msg) {
      try {
        console.log("Received message:", msg.body);
        const isValid = Math.random() > 0.5; // Simulate message validation
        if (isValid) {
          console.log("Message processed successfully.");
          msg.ack(); // Acknowledge
        } else {
          throw new Error("Message validation failed");
        }
      } catch (err) {
        console.error("Error processing message:", err.message);
        msg.nack(); // Reject and send to dead letter queue
      }
    });

    await rabbitMQ.startSubscription("q.5");
  } catch (err) {
    console.error("Error consuming messages:", err);
  }
}

receive();
