# Idea generator webservice

Stack: nodejs, mongodb

## REST API

### Component

```[GET,POST,PUT,DELETE]/component``` accepts CRUD operations

Example component:

```
{
   "_id":"5885d705a765b21802ec59c5",
   "name":"Kundensegmente",
   "values":[
      "Jeder als Selbstnutzer",
      "Jeder als Weitergeber",
      "Exklusiver Kundenkreis als Selbstnutzer",
      "Exklusiver Kundenkreis als Weitergeber"
   ]
}
```

### Generator

```[POST]/generator/random``` generate random ideas

Following parameters must be provided:

```
{
	"product": "Parfum",
	"number_of_ideas": 1,
	"number_of_components_per_idea": 2
}
```

Example generate idea:
```
{
    "_id" : ObjectId("5881fd39f807ac600834273b"),
    "product" : "Parfum",
    "Einnahmequellen" : [
        "Individueller Startpreis der im Zeitverlauf verringert wird",
        "Preis mit Rabatt abhängig vom Standort"
    ],
    "Kundenbeziehung" : [
        "Empfehlungssystem: Beruhend auf Kundenattributen",
        "Bewertungen / Empfehlungen / Rezension von Kunden"
    ],
    "Kanaele" : [
        "Verkaufsautomat(en)",
        "Verkäufe via E-Mail"
    ],
    "Kundensegmente" : [
        "Exklusiver Kundenkreis als Selbstnutzer",
        "Jeder als Selbstnutzer"
    ]
}
```

## ENV

 - PORT=somePortToRunOn
 - DB_HOST=someDbHost
 - DB_NAME=business_model_idea_generator