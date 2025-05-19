require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');

const elasticClient = new Client({
  node: process.env.ELASTIC_SEARCH_NODE,
  auth: {
    username: process.env.ELASTIC_SEARCH_USERNAME,
    password: process.env.ELASTIC_SEARCH_PASSWORD,
  },
   tls: {
    rejectUnauthorized: false, // add this if using self-signed SSL cert
  },
});

module.exports = elasticClient;