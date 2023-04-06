const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

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

  // Doesn't work
  app.get("/eventlock", (req, _res) => {
    console.log(
      `Received eventlock request with id ${req.params.id}`
    );
    
    const setNewTimeout = () => { setTimeout(setNewTimeout, 0); }
    for(let i = 0; i < 30; i++) {
        setNewTimeout();
    }
  });



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

