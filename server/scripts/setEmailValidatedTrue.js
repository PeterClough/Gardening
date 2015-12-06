conn = new Mongo();
db = conn.getDB("myApp");


db.user.update(
  {},
  { $set:
    {
      "emailVerified": true
    }
  },
  {
    multi:true
  }
);


