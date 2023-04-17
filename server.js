const express = require('express')
const StatsD = require("hot-shots");

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// #region TEST PATHS
// Test methods for locking up node
  app.get("/crash", (req, _res) => {
    console.log(
      `Received crash / shutdown request with id ${req.params.id}`
    );
    process.exit(66);
  });

  app.get("/close", (req, _res) => {
    console.log(
      `Received server close request with id ${req.params.id}`
    );
    server.close();
  });

  app.get("/spinlock", (req, _res) => {
    console.log(
      `Received spinlock request with id ${req.params.id}`
    );
    let a = 0;
    while(true) {
      a++;
    }
  });
// #endregion

// #region StatsD timer
/*

Defaults to connecting to DD_AGENT_HOST or localhost:8125 if that value is unset.
If you've set up a DataDog Agent locally this should work as-is.

You can find your metrics in DD under Metrics -> Summary (https://app.datadoghq.com/metric/summary)

*/
const statsDClient = new StatsD({})


function sendStatsdMetrics() {
  statsDClient.gauge("my_random_number_gauge", Math.floor(Math.random() * 10));
}

setInterval(sendStatsdMetrics, 10000);
// #endregion

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

