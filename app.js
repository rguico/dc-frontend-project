'use strict';

const express = require('express'),
      csv = require('csv'),
      parse = require('csv-parse/lib/sync'),
      fs = require('fs'),
      bodyParser = require('body-parser'),
      app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/companies', (req, res) => {
  fs.readFile('companies.csv', 'utf-8', (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.error('myfile does not exist');
        return;
      } else {
        throw err;
      }
    }

    const records = parse(data, {columns: true});

    res.json(records);
  });
});

app.get('/companies/:companyId', (req, res) => {
  const companyId = req.params.companyId;

  fs.readFile('company_detail.csv', 'utf-8', (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        console.error('myfile does not exist');
        return;
      } else {
        throw err;
      }
    }

    const records = parse(data, {columns: true});

    const filteredRecords = records.filter(record => record['Company Id'] == companyId);

    res.json(filteredRecords);
  });
});

app.post('/companies/:companyId', (req, res) => {
  const companyId = req.params.companyId;

  console.log(companyId);
  console.log(req.body);

  if (req.body.officer) {
    fs.appendFile('add_officers.txt', `New Officer: ${req.body.officer} for ${companyId}\n`);
    res.status(200).send();
  } else {
    res.status(400).send('There was a problem with your request!');
  }
})

app.listen(3000, () => {
  console.log('Welcome to the DataCubes Project App!');
});