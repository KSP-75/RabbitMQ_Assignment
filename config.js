const rabbit = require("foo-foo-mq");


const settings = {
  connection: {
    user: "guest",
    pass: "guest",
    host: "localhost",
    port: 5672,
    timeout: 3000,
    vhost: "%2f",
  },
  exchanges: [
    { name: "ex.1", type: "direct" },
    { name: "ex.2", type: "topic" },
    { name: "retry.1", type: "direct" },
    { name: "deadLetterExchange", type: "fanout" },
  ],
  queues: [
    {
      name: "qq.1",
      limit: 10,
      queueLimit: 50,
      deadLetter: "deadLetterExchange",
    },

    {
      name: "qq.2",
      limit: 10,
      queueLimit: 50,
      deadLetter: "deadLetterExchange",
    },
    {
      name: "retryQQ.1",
      limit: 10,
      queueLimit: 50,
      messageTtl: 5000,
      deadLetter: "ex.1",
    },
    { name: "deadLetterQueue" },
  ],
  bindings: [
    { exchange: "ex.1", target: "qq.1", keys: ["ex1"] },
    { exchange: "ex.2", target: "qq.2", keys: ["ex2"] },
    { exchange: "retry.1", target: "retryQQ.1", keys: ["ex1"] },
    { exchange: "deadLetterExchange", target: "deadLetterQueue" },
  ],
};

async function configure() {
  await rabbit
    .configure(settings)
    .then(() => {
      console.log("configured");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { configure };
