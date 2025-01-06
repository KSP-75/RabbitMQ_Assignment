const rabbit = require("foo-foo-mq");
const maxRetries = 5;

async function handler(msg) {
  console.log("Message is : " , msg.body);
  const message = msg.body.text;
  const retryCount = msg.body.retry_count || 0;
  
  try {
    if (Math.random() <= 0.5) throw new Error(`Checking against the failure case for the message ${msg.body.text}`);
    
    msg.ack();
    console.log(`Message ${msg.body.text} processed successfully in ${msg.body.retry_count} retries:`, message);
  } catch (err) {
    console.log(`Message ${msg.body.text} processing failed:`, message, err.message);
    
    if (retryCount < maxRetries) {
      msg.body.retry_count = retryCount + 1;
      await retryPublish(msg.body);
      msg.ack();
    } else {
      console.log(`Max retries reached. Discarding message ${msg.body.text}:`, message);
      msg.reject();
    }
  }
}

async function retryPublish(args) {
  const { text, routingKey } = args;

  try {
    await rabbit.publish("retry.1", {
      body: args,
      routingKey: routingKey,
    });

    console.log(
      `Message ${args.text} sent successfully to exchange retry with key "${routingKey}":`,
      text
    );
  } catch (error) {
    console.log(
      `Error publishing message ${text} to exchange retry with key "${routingKey}":`,
      error.message
    );
  }
}


module.exports = {  handler };
