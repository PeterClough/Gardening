module.exports = {
  db: {
    connector: 'mongodb',
    host: "127.0.0.1",
    port: 27017,
    database: 'gardening',
    username: "systemUser",
    password: "idunno",
    name: "gardening"
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
  },
  "diaryProgressDS": {
    "name": "diaryProgressDS",
    "connector": "loopback-component-storage",
    "provider": "filesystem",
    "root": "/Users/peter/Intranet/myApp/client/src/storage/assets/images/diary_progress"
  },
  "diaryEntryDS": {
    "name": "diaryEntryDS",
    "connector": "loopback-component-storage",
    "provider": "filesystem",
    "root": "/Users/peter/Intranet/myApp/client/src/storage/assets/images/diary_entry"
  }
};

