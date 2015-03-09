module.exports = {
  db: {
    connector: 'mongodb',
    host: "127.0.0.1",
    port: 27017,
    database: 'myApp',
    username: "systemUser",
    password: "idunno",
    name: "myApp"
  },
  "emailDs": {
    "name": "emailDs",
    "connector": "mail",
    "transports": [
      {
        "type": "smtp",
        "host": "smtp.gardensyjardines.com",
        "secure": true,
        "port": 465,
        "tls": {
          "rejectUnauthorized": false
        },
        "auth": {
          "user": "noreply@gardensyjardines.com",
          "pass": "Idunno123"
        }
      }
    ]
  }
};

