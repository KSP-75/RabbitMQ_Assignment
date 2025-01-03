const rabbit = require("foo-foo-mq");
const { configure } = require("./config");
const { handler } = require("./common");

async function consumer() {
  try {
    await configure();

    await rabbit.handle("ex1", (message) => handler(message));

    await rabbit.startSubscription("qq.1");
  } catch (err) {
    console.error("Getting Error in consumer1:", err);
  }
}

consumer();
