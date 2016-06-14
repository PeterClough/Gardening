var db = db.getSiblingDB('gardening');

/** Country indexes **/
db.Country.drop();

db.getCollection("Country").ensureIndex({
  "_id": NumberInt(1),
},[

]);

/** HardinessZone indexes **/
db.HardinessZone.drop();

db.getCollection("HardinessZone").ensureIndex({
  "_id": NumberInt(1),
},[

]);

/** PlantRating indexes **/
db.PlantRating.drop();

db.getCollection("PlantRating").ensureIndex({
  "_id": NumberInt(1),
},[

]);

/** SoilAcidity indexes **/
db.SoilAcidity.drop();

db.getCollection("SoilAcidity").ensureIndex({
  "_id": NumberInt(1),
},[

]);

/** SoilAcidity indexes **/
db.SoilType.drop();

db.getCollection("SoilType").ensureIndex({
  "_id": NumberInt(1),
},[

]);

/** Language indexes **/
db.Language.drop();

db.getCollection("Language").ensureIndex({
  "_id": NumberInt(1),
},[

]);


/** Language records **/
db.getCollection("Language").insert({
  "_id": ObjectId("56bdef0af95bf017e7000001"),
  "name": "English",
  "code": "en"
});
db.getCollection("Language").insert({
  "_id": ObjectId("56bdef1ff95bf017e7000002"),
  "name": "Español",
  "code": "es"
});

/** Country records **/
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_AFGHANISTAN",
  "code": "AF",
  "_id": ObjectId("54818c3e3119f600002d2b83")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ALBANIA",
  "code": "AL",
  "_id": ObjectId("54818c3e3119f600002d2b84")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ALGERIA",
  "code": "DZ",
  "_id": ObjectId("54818c3e3119f600002d2b85")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ANDORRA",
  "code": "AD",
  "_id": ObjectId("54818c3e3119f600002d2b86")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ANGOLA",
  "code": "AO",
  "_id": ObjectId("54818c3e3119f600002d2b87")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ANTARCTICA",
  "code": "AQ",
  "_id": ObjectId("54818c3e3119f600002d2b88")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ANTIGUA_AND_BARBUDA",
  "code": "AG",
  "_id": ObjectId("54818c3e3119f600002d2b89")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ARGENTINA",
  "code": "AR",
  "_id": ObjectId("54818c3e3119f600002d2b8a")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ARMENIA",
  "code": "AM",
  "_id": ObjectId("54818c3e3119f600002d2b8b")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ARUBA",
  "code": "AW",
  "_id": ObjectId("54818c3e3119f600002d2b8c")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_AUSTRALIA",
  "code": "AU",
  "_id": ObjectId("54818c3e3119f600002d2b8d")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_AUSTRIA",
  "code": "AT",
  "_id": ObjectId("54818c3e3119f600002d2b8e")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_BAHAMAS",
  "code": "BS",
  "_id": ObjectId("54818c3e3119f600002d2b8f")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_BAHRAIN",
  "code": "BH",
  "_id": ObjectId("54818c3e3119f600002d2b90")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_BANGLADESH",
  "code": "BD",
  "_id": ObjectId("54818c3e3119f600002d2b91")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_BARBADOS",
  "code": "BB",
  "_id": ObjectId("54818c3e3119f600002d2b92")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_BELARUS",
  "code": "BY",
  "_id": ObjectId("54818c3e3119f600002d2b93")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_BELGIUM",
  "code": "BE",
  "_id": ObjectId("54818c3e3119f600002d2b94")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_BELIZE",
  "code": "BZ",
  "_id": ObjectId("54818c3e3119f600002d2b95")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_BERMUDA",
  "code": "BM",
  "_id": ObjectId("54818c3e3119f600002d2b96")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_BHUTAN",
  "code": "BT",
  "_id": ObjectId("54818c3e3119f600002d2b97")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_BOLIVIA",
  "code": "BO",
  "_id": ObjectId("54818c3e3119f600002d2b98")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_BOSNIA",
  "code": "BA",
  "_id": ObjectId("54818c3e3119f600002d2b99")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_BOTSWANA",
  "code": "BW",
  "_id": ObjectId("54818c3e3119f600002d2b9a")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_BRAZIL",
  "code": "BR",
  "_id": ObjectId("54818c3e3119f600002d2b9b")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_BULGARIA",
  "code": "BG",
  "_id": ObjectId("54818c3e3119f600002d2b9c")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_CAMBODIA",
  "code": "KH",
  "_id": ObjectId("54818c3e3119f600002d2b9d")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_CAMEROON",
  "code": "CM",
  "_id": ObjectId("54818c3e3119f600002d2b9e")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_CANADA",
  "code": "CA",
  "_id": ObjectId("54818c3e3119f600002d2b9f")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_CAYMAN_ISLANDS",
  "code": "KY",
  "_id": ObjectId("54818c3e3119f600002d2ba0")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_CHAD",
  "code": "TD",
  "_id": ObjectId("54818c3e3119f600002d2ba1")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_CHILE",
  "code": "CL",
  "_id": ObjectId("54818c3e3119f600002d2ba2")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_CHINA",
  "code": "CN",
  "_id": ObjectId("54818c3e3119f600002d2ba3")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_COLOMBIA",
  "code": "CO",
  "_id": ObjectId("54818c3e3119f600002d2ba4")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_CONGO",
  "code": "CG",
  "_id": ObjectId("54818c3e3119f600002d2ba5")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_COSTA_RICA",
  "code": "CR",
  "_id": ObjectId("54818c3e3119f600002d2ba6")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_CROATIA",
  "code": "HR",
  "_id": ObjectId("54818c3e3119f600002d2ba7")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_CUBA",
  "code": "CU",
  "_id": ObjectId("54818c3e3119f600002d2ba8")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_CYPRUS",
  "code": "CY",
  "_id": ObjectId("54818c3e3119f600002d2ba9")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_CZECH_REPUBLIC",
  "code": "CZ",
  "_id": ObjectId("54818c3e3119f600002d2baa")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_DENMARK",
  "code": "DK",
  "_id": ObjectId("54818c3e3119f600002d2bab")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_DOMINICAN_REPUBLIC",
  "code": "DO",
  "_id": ObjectId("54818c3e3119f600002d2bac")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ECUADOR",
  "code": "EC",
  "_id": ObjectId("54818c3e3119f600002d2bad")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_EGYPT",
  "code": "EG",
  "_id": ObjectId("54818c3e3119f600002d2bae")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_EL_SALVADOR",
  "code": "SV",
  "_id": ObjectId("54818c3e3119f600002d2baf")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_EQUATORIAL_GUINEA",
  "code": "GQ",
  "_id": ObjectId("54818c3e3119f600002d2bb0")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ESTONIA",
  "code": "EE",
  "_id": ObjectId("54818c3e3119f600002d2bb1")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ETHIOPIA",
  "code": "ET",
  "_id": ObjectId("54818c3e3119f600002d2bb2")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_FALKLAND_ISLANDS",
  "code": "FK",
  "_id": ObjectId("54818c3e3119f600002d2bb3")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_FAROE_ISLANDS",
  "code": "FO",
  "_id": ObjectId("54818c3e3119f600002d2bb4")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_FIJI",
  "code": "FJ",
  "_id": ObjectId("54818c3e3119f600002d2bb5")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_FINLAND",
  "code": "FI",
  "_id": ObjectId("54818c3e3119f600002d2bb6")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_FRANCE",
  "code": "FR",
  "_id": ObjectId("54818c3e3119f600002d2bb7")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_FRENCH_GUIANA",
  "code": "GF",
  "_id": ObjectId("54818c3e3119f600002d2bb8")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_FRENCH_POLYNESIA",
  "code": "PF",
  "_id": ObjectId("54818c3e3119f600002d2bb9")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_GAMBIA",
  "code": "GM",
  "_id": ObjectId("54818c3e3119f600002d2bba")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_GEORGIA",
  "code": "GE",
  "_id": ObjectId("54818c3e3119f600002d2bbb")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_GERMANY",
  "code": "DE",
  "_id": ObjectId("54818c3e3119f600002d2bbc")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_GHANA",
  "code": "GH",
  "_id": ObjectId("54818c3e3119f600002d2bbd")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_GIBRALTAR",
  "code": "GI",
  "_id": ObjectId("54818c3e3119f600002d2bbe")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_GREECE",
  "code": "GR",
  "_id": ObjectId("54818c3e3119f600002d2bbf")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_GREENLAND",
  "code": "GL",
  "_id": ObjectId("54818c3e3119f600002d2bc0")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_GRENADA",
  "code": "GD",
  "_id": ObjectId("54818c3e3119f600002d2bc1")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_GUAM",
  "code": "GU",
  "_id": ObjectId("54818c3e3119f600002d2bc2")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_GUATEMALA",
  "code": "GT",
  "_id": ObjectId("54818c3e3119f600002d2bc3")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_GUERNSEY",
  "code": "GG",
  "_id": ObjectId("54818c3e3119f600002d2bc4")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_GUINEA",
  "code": "GN",
  "_id": ObjectId("54818c3e3119f600002d2bc5")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_GUYANA",
  "code": "GY",
  "_id": ObjectId("54818c3e3119f600002d2bc6")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_HAITI",
  "code": "HT",
  "_id": ObjectId("54818c3e3119f600002d2bc7")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_HONDURAS",
  "code": "HN",
  "_id": ObjectId("54818c3e3119f600002d2bc8")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_HONG_KONG",
  "code": "HK",
  "_id": ObjectId("54818c3e3119f600002d2bc9")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_HUNGARY",
  "code": "HU",
  "_id": ObjectId("54818c3e3119f600002d2bca")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ICELAND",
  "code": "IS",
  "_id": ObjectId("54818c3e3119f600002d2bcb")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_INDIA",
  "code": "IN",
  "_id": ObjectId("54818c3e3119f600002d2bcc")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_INDONESIA",
  "code": "_id",
  "_id": ObjectId("54818c3e3119f600002d2bcd")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_IRAN",
  "code": "IR",
  "_id": ObjectId("54818c3f3119f600002d2bce")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_IRAQ",
  "code": "IQ",
  "_id": ObjectId("54818c3f3119f600002d2bcf")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_IRELAND",
  "code": "IE",
  "_id": ObjectId("54818c3f3119f600002d2bd0")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ISLE_OF_MAN",
  "code": "IM",
  "_id": ObjectId("54818c3f3119f600002d2bd1")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ISRAEL",
  "code": "IL",
  "_id": ObjectId("54818c3f3119f600002d2bd2")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ITALY",
  "code": "IT",
  "_id": ObjectId("54818c3f3119f600002d2bd3")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_JAMAICA",
  "code": "JM",
  "_id": ObjectId("54818c3f3119f600002d2bd4")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_JAPAN",
  "code": "JP",
  "_id": ObjectId("54818c3f3119f600002d2bd5")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_JERSEY",
  "code": "JE",
  "_id": ObjectId("54818c3f3119f600002d2bd6")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_JORDAN",
  "code": "JO",
  "_id": ObjectId("54818c3f3119f600002d2bd7")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_KENYA",
  "code": "KE",
  "_id": ObjectId("54818c3f3119f600002d2bd8")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_KUWAIT",
  "code": "KW",
  "_id": ObjectId("54818c3f3119f600002d2bd9")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_LATVIA",
  "code": "LV",
  "_id": ObjectId("54818c3f3119f600002d2bda")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_LEBANON",
  "code": "LB",
  "_id": ObjectId("54818c3f3119f600002d2bdb")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_LIBERIA",
  "code": "LR",
  "_id": ObjectId("54818c3f3119f600002d2bdc")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_LIBYA",
  "code": "LY",
  "_id": ObjectId("54818c3f3119f600002d2bdd")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_LIECHTENSTEIN",
  "code": "LI",
  "_id": ObjectId("54818c3f3119f600002d2bde")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_LITHUANIA",
  "code": "LT",
  "_id": ObjectId("54818c3f3119f600002d2bdf")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_LUXEMBOURG",
  "code": "LU",
  "_id": ObjectId("54818c3f3119f600002d2be0")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MACAO",
  "code": "MO",
  "_id": ObjectId("54818c3f3119f600002d2be1")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MACEDONIA",
  "code": "MK",
  "_id": ObjectId("54818c3f3119f600002d2be2")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MADAGASCAR",
  "code": "MG",
  "_id": ObjectId("54818c3f3119f600002d2be3")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MALAYSIA",
  "code": "MY",
  "_id": ObjectId("54818c3f3119f600002d2be4")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MALDIVES",
  "code": "MV",
  "_id": ObjectId("54818c3f3119f600002d2be5")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MALTA",
  "code": "MT",
  "_id": ObjectId("54818c3f3119f600002d2be7")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MALI",
  "code": "ML",
  "_id": ObjectId("54818c3f3119f600002d2be6")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MARTINIQUE",
  "code": "MQ",
  "_id": ObjectId("54818c3f3119f600002d2be8")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MAURITANIA",
  "code": "MR",
  "_id": ObjectId("54818c3f3119f600002d2be9")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MAURITIUS",
  "code": "MU",
  "_id": ObjectId("54818c3f3119f600002d2bea")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MEXICO",
  "code": "MX",
  "_id": ObjectId("54818c3f3119f600002d2beb")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MONACO",
  "code": "MC",
  "_id": ObjectId("54818c3f3119f600002d2bec")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MONGOLIA",
  "code": "MN",
  "_id": ObjectId("54818c3f3119f600002d2bed")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MONTENEGRO",
  "code": "ME",
  "_id": ObjectId("54818c3f3119f600002d2bee")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MONTSERRAT",
  "code": "MS",
  "_id": ObjectId("54818c3f3119f600002d2bef")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MOROCCO",
  "code": "MA",
  "_id": ObjectId("54818c3f3119f600002d2bf0")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_MOZAMBIQUE",
  "code": "MZ",
  "_id": ObjectId("54818c3f3119f600002d2bf1")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_NAMIBIA",
  "code": "NA",
  "_id": ObjectId("54818c3f3119f600002d2bf2")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_NEPAL",
  "code": "NP",
  "_id": ObjectId("54818c3f3119f600002d2bf3")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_NETHERLANDS",
  "code": "NL",
  "_id": ObjectId("54818c3f3119f600002d2bf4")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_NEW_ZEALAND",
  "code": "NZ",
  "_id": ObjectId("54818c3f3119f600002d2bf5")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_NICARAGUA",
  "code": "NI",
  "_id": ObjectId("54818c3f3119f600002d2bf6")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_NIGER",
  "code": "NE",
  "_id": ObjectId("54818c3f3119f600002d2bf7")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_NIGERIA",
  "code": "NG",
  "_id": ObjectId("54818c3f3119f600002d2bf8")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_NORTH_KOREA",
  "code": "KP",
  "_id": ObjectId("54818c3f3119f600002d2bf9")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_NORWAY",
  "code": "NO",
  "_id": ObjectId("54818c3f3119f600002d2bfa")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_OMAN",
  "code": "OM",
  "_id": ObjectId("54818c3f3119f600002d2bfb")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_PAKISTAN",
  "code": "PK",
  "_id": ObjectId("54818c3f3119f600002d2bfc")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_PALESTINE",
  "code": "PS",
  "_id": ObjectId("54818c3f3119f600002d2bfd")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_PANAMA",
  "code": "PA",
  "_id": ObjectId("54818c3f3119f600002d2bfe")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_PAPUA_NEW_GUINEA",
  "code": "PG",
  "_id": ObjectId("54818c3f3119f600002d2bff")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_PARAGUAY",
  "code": "PY",
  "_id": ObjectId("54818c3f3119f600002d2c00")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_PERU",
  "code": "PE",
  "_id": ObjectId("54818c3f3119f600002d2c01")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_PHILIPPINES",
  "code": "PH",
  "_id": ObjectId("54818c3f3119f600002d2c02")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_POLAND",
  "code": "PL",
  "_id": ObjectId("54818c3f3119f600002d2c03")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_PORTUGAL",
  "code": "PT",
  "_id": ObjectId("54818c3f3119f600002d2c04")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_PUERTO_RICO",
  "code": "PR",
  "_id": ObjectId("54818c3f3119f600002d2c05")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_QATAR",
  "code": "QA",
  "_id": ObjectId("54818c3f3119f600002d2c06")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ROMANIA",
  "code": "RO",
  "_id": ObjectId("54818c3f3119f600002d2c07")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_RUSSIAN_FEDERATION",
  "code": "RU",
  "_id": ObjectId("54818c3f3119f600002d2c08")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_RWANDA",
  "code": "RW",
  "_id": ObjectId("54818c3f3119f600002d2c09")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SAMOA",
  "code": "WS",
  "_id": ObjectId("54818c3f3119f600002d2c0a")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SAN_MARINO",
  "code": "SM",
  "_id": ObjectId("54818c3f3119f600002d2c0b")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SAUDI_ARABIA",
  "code": "SA",
  "_id": ObjectId("54818c3f3119f600002d2c0c")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SENEGAL",
  "code": "SN",
  "_id": ObjectId("54818c3f3119f600002d2c0d")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SERBIA",
  "code": "RS",
  "_id": ObjectId("54818c3f3119f600002d2c0e")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SEYCHELLES",
  "code": "SC",
  "_id": ObjectId("54818c3f3119f600002d2c0f")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SIERRA_LEONE",
  "code": "SL",
  "_id": ObjectId("54818c3f3119f600002d2c10")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SINGAPORE",
  "code": "SG",
  "_id": ObjectId("54818c3f3119f600002d2c11")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SLOVAKIA",
  "code": "SK",
  "_id": ObjectId("54818c3f3119f600002d2c12")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SLOVENIA",
	"code": "SI",
  "_id": ObjectId("54818c3f3119f600002d2c13")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SOMALIA",
  "code": "SO",
  "_id": ObjectId("54818c3f3119f600002d2c14")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SOUTH_AFRICA",
  "code": "ZA",
  "_id": ObjectId("54818c3f3119f600002d2c15")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SOUTH_KOREA",
  "code": "KR",
  "_id": ObjectId("54818c3f3119f600002d2c16")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SOUTH_SUDAN",
  "code": "SS",
  "_id": ObjectId("54818c3f3119f600002d2c17")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SPAIN",
  "code": "ES",
  "_id": ObjectId("54818c3f3119f600002d2c18")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SRI_LANKA",
  "code": "LK",
  "_id": ObjectId("54818c3f3119f600002d2c19")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SUDAN",
  "code": "SD",
  "_id": ObjectId("54818c3f3119f600002d2c1a")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SWAZILAND",
  "code": "SZ",
  "_id": ObjectId("54818c3f3119f600002d2c1b")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SWEDEN",
  "code": "SE",
  "_id": ObjectId("54818c3f3119f600002d2c1c")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SWITZERLAND",
  "code": "CH",
  "_id": ObjectId("54818c3f3119f600002d2c1d")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_SYRIA",
  "code": "SY",
  "_id": ObjectId("54818c3f3119f600002d2c1e")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_TAIWAN",
  "code": "TW",
  "_id": ObjectId("54818c3f3119f600002d2c1f")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_TAJIKISTAN",
  "code": "TJ",
  "_id": ObjectId("54818c3f3119f600002d2c20")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_THAILAND",
  "code": "TH",
  "_id": ObjectId("54818c3f3119f600002d2c21")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_TONGA",
  "code": "TO",
  "_id": ObjectId("54818c3f3119f600002d2c22")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_TRINIDAD_AND_TOBAGO",
  "code": "TT",
  "_id": ObjectId("54818c3f3119f600002d2c23")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_TUNISIA",
  "code": "TN",
  "_id": ObjectId("54818c3f3119f600002d2c24")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_TURKEY",
  "code": "TR",
  "_id": ObjectId("54818c3f3119f600002d2c25")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_TURKMENISTAN",
  "code": "TM",
  "_id": ObjectId("54818c3f3119f600002d2c26")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_UGANDA",
  "code": "UG",
  "_id": ObjectId("54818c3f3119f600002d2c27")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_UKRAINE",
  "code": "UA",
  "_id": ObjectId("54818c3f3119f600002d2c28")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_UNITED_ARAB_EMIRATES",
  "code": "AE",
  "_id": ObjectId("54818c3f3119f600002d2c29")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_UNITED_KINGDOM",
  "code": "GB",
  "_id": ObjectId("54818c3f3119f600002d2c2a")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_UNITED_STATES",
  "code": "US",
  "_id": ObjectId("54818c3f3119f600002d2c2b")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_URUGUAY",
  "code": "UY",
  "_id": ObjectId("54818c3f3119f600002d2c2c")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_UZBEKISTAN",
  "code": "UZ",
  "_id": ObjectId("54818c3f3119f600002d2c2d")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_VENEZUELA",
  "code": "VE",
  "_id": ObjectId("54818c3f3119f600002d2c2e")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_VIET_NAM",
  "code": "VN",
  "_id": ObjectId("54818c3f3119f600002d2c2f")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_YEMEN",
  "code": "YE",
  "_id": ObjectId("54818c3f3119f600002d2c30")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ZAMBIA",
  "code": "ZM",
  "_id": ObjectId("54818c3f3119f600002d2c31")
});
db.getCollection("Country").insert({
  "translateKey": "COUNTRY_ZIMBABWE",
  "code": "ZW",
  "_id": ObjectId("54818c3f3119f600002d2c32")
});

/** HardinessZone records **/
db.getCollection("HardinessZone").insert({
  "name": "1",
  "_id": ObjectId("54818c3f3119f600002d2c34")
});
db.getCollection("HardinessZone").insert({
  "name": "2",
  "_id": ObjectId("54818c3f3119f600002d2c35")
});
db.getCollection("HardinessZone").insert({
  "name": "3",
  "_id": ObjectId("54818c3f3119f600002d2c36")
});
db.getCollection("HardinessZone").insert({
  "name": "4",
  "_id": ObjectId("54818c3f3119f600002d2c37")
});
db.getCollection("HardinessZone").insert({
  "name": "5",
  "_id": ObjectId("54818c3f3119f600002d2c38")
});
db.getCollection("HardinessZone").insert({
  "name": "6",
  "_id": ObjectId("54818c3f3119f600002d2c39")
});
db.getCollection("HardinessZone").insert({
  "name": "7",
  "_id": ObjectId("54818c3f3119f600002d2c3a")
});
db.getCollection("HardinessZone").insert({
  "name": "8",
  "_id": ObjectId("54818c3f3119f600002d2c3b")
});
db.getCollection("HardinessZone").insert({
  "name": "9",
  "_id": ObjectId("54818c3f3119f600002d2c3c")
});
db.getCollection("HardinessZone").insert({
  "name": "10",
  "_id": ObjectId("54818c3f3119f600002d2c3d")
});
db.getCollection("HardinessZone").insert({
  "name": "11",
  "_id": ObjectId("54818c3f3119f600002d2c3e")
});
db.getCollection("HardinessZone").insert({
  "name": "12",
  "_id": ObjectId("54818c3f3119f600002d2c3f")
});

/** PlantRating records **/
db.getCollection("PlantRating").insert({
  "name": "*",
  "_id": ObjectId("54818c3f3119f600002d2c41")
});
db.getCollection("PlantRating").insert({
  "name": "**",
  "_id": ObjectId("54818c3f3119f600002d2c42")
});
db.getCollection("PlantRating").insert({
  "name": "***",
  "_id": ObjectId("54818c3f3119f600002d2c43")
});
db.getCollection("PlantRating").insert({
  "name": "****",
  "_id": ObjectId("54818c3f3119f600002d2c44")
});
db.getCollection("PlantRating").insert({
  "name": "*****",
  "_id": ObjectId("54818c3f3119f600002d2c45")
});

/** SoilAcidity records **/
db.getCollection("SoilAcidity").insert({
  "translateKey": "SOIL_ACIDITY_ALKALINE",
  "order": 1,
  "_id": ObjectId("54818c3f3119f600002d2c47")
});
db.getCollection("SoilAcidity").insert({
  "translateKey": "SOIL_ACIDITY_NEUTRAL",
  "order": 2,
  "_id": ObjectId("56e04535f95bf0bc99000000")
});
db.getCollection("SoilAcidity").insert({
  "translateKey": "SOIL_ACIDITY_MODERATELY_ACID",
  "order": 3,
  "_id": ObjectId("54818c3f3119f600002d2c48")
});
db.getCollection("SoilAcidity").insert({
  "translateKey": "SOIL_ACIDITY_ACID",
  "order": 4,
  "_id": ObjectId("54818c3f3119f600002d2c49")
});

/** SoilType records **/
db.getCollection("SoilType").insert({
  "translateKey": "SOIL_TYPE_SANDY",
  "order": 1,
  "_id": ObjectId("54818c3f3119f600002d2c4c")
});
db.getCollection("SoilType").insert({
  "translateKey": "SOIL_TYPE_SILT",
  "order": 2,
  "_id": ObjectId("54818c3f3119f600002d2c4d")
});
db.getCollection("SoilType").insert({
  "translateKey": "SOIL_TYPE_CLAY",
  "order": 3,
  "_id": ObjectId("54818c3f3119f600002d2c4b")
});
db.getCollection("SoilType").insert({
  "translateKey": "SOIL_TYPE_PEAT",
  "order": 4,
  "_id": ObjectId("54818c3f3119f600002d2c4f")
});
db.getCollection("SoilType").insert({
  "translateKey": "SOIL_TYPE_LOAM",
  "order": 5,
  "_id": ObjectId("54818c3f3119f600002d2c4e")
});
db.getCollection("SoilType").insert({
  "translateKey": "SOIL_TYPE_CHALKY",
  "order": 6,
  "_id": ObjectId("54818c3f3119f600002d2c50")
});
