module.exports = {

  "db": {
    "host": process.env.OPENSHIFT_MONGODB_DB_HOST,
    "port":process.env.OPENSHIFT_MONGODB_DB_PORT,
    "database": "gardening",
    "username": "admin",
    "password": "leDxL_MY3Jyt",
    "name": "gardening",
    "connector": "mongodb",
    "debug":true,
    "timezone": "UTC"
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
      "root":  process.env.OPENSHIFT_DATA_DIR + "/storage/assets/images/diary_progress"
  },
  "diaryEntryDS": {
    "name": "diaryEntryDS",
      "connector": "loopback-component-storage",
      "provider": "filesystem",
      "root": process.env.OPENSHIFT_DATA_DIR + "/storage/assets/images/diary_entry"
  }
};
