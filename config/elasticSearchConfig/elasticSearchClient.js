require('dotenv').config();
const { Client } = require('@opensearch-project/opensearch');

let elasticClient;

try {
  elasticClient = new Client({
    node: process.env.ELASTIC_SEARCH_NODE_P,
    auth: {
      username: process.env.ELASTIC_SEARCH_USERNAME_P,
      password: process.env.ELASTIC_SEARCH_PASSWORD_P,
    },
    tls: {
      rejectUnauthorized: false, 
    },
  });

  elasticClient.info()
    .then(() => {
      console.log(" Connected to Elasticsearch/OpenSearch successfully!");
    })
    .catch((err) => {
      console.error(" Failed to connect to Elasticsearch/OpenSearch:", err.message);
    });

} catch (error) {
  console.error(" Error setting up Elasticsearch client:", error.message);
}

module.exports = elasticClient;
