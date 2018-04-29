const express = require('express');

const app = express();


const port = process.env.port || 3000;



app.get('/', (req, res) =>{
  res.send('Service is running');
});

app.listen(port, () => {
  console.log('started on port: ' + port );
});
