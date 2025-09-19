const express = require('express');
const StatsD = require("hot-shots");
const cors = require('cors');

const args = process.argv.slice(2);

const app = express()
const router = express.Router();
const port = args[0] || 3000;

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

// #region http Stats
// Getting efficient http tags for sending to statsd, because custom metrics get expensive if there are too many permutations
// {route: /asd/:org/:team } is good, {route: /asd/org1/team1} is too many
app.use(function (req, res, next) {
  const startTime = new Date().getTime();

  console.log(req.url);
  // console.log(req.route); -> undefined

  res.on("finish", () => {
    const endTime = new Date().getTime();
    // console.log(req.route.path); -> /resource/:org/:team
    // statsDClient.histogram("http_request_time", endTime-startTime, {route: req.url});
  });

  next();
});
// #endregion

router.use(cors({
  origin: new RegExp("https://cristian\.test"),
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "HEAD", "PATCH"],
  allowedHeaders: ["DNT", "X-Formhero-Token", "Keep-Alive", "User-Agent", "X-Requested-With", "If-Modified-Since", "Cache-Control", "Content-Type"],
  exposedHeaders: ["x-formhero-token"],
  credentials: true,
  maxAge: 600,
}));

// #region Routes
router.get('/', (req, res) => {
    // new Promise((resolve) => {
    //     setTimeout(() => { console.log('the promise finished'); resolve(); }, 10000);
    // });
    console.log("hello world");
    res.send('Hello World!')
})

router.get('/resource/:org/:team', (req, res) => {
  const { org, team } = req.params;
  res.send(`org: ${org}, team: ${team}`);
})

// #region TEST PATHS
// Test methods for locking up node
router.get("/crash", (req, _res) => {
  console.log(
    `Received crash / shutdown request with id ${req.params.id}`
  );
  process.exit(66);
});

router.get("/close", (req, _res) => {
  console.log(
    `Received server close request with id ${req.params.id}`
  );
  server.close();
});

router.get("/spinlock", (req, _res) => {
  console.log(
    `Received spinlock request with id ${req.params.id}`
  );
  let a = 0;
  while(true) {
    a++;
  }
});
// #endregion TEST PATHS

// #endregion Routes

app.use('/', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

