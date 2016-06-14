module.exports = {

  "db": {
    "host":"127.10.45.2",
    "port":27017,
    "database": "gardening",
    "username": "admin",
    "password": "P-DPtwUznTTY",
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
      "root":  "../../data/storage/assets/images/diary_progress"
  },
    "diaryEntryDS": {
    "name": "diaryEntryDS",
      "connector": "loopback-component-storage",
      "provider": "filesystem",
      "root": "../../data/storage/assets/images/diary_entry"
  }


}
