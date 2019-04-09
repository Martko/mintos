# mintos
Browser robot for fetching interests information from Mintos marketplace and storing it in MySQL database that can be used for data analysis or investments dashboard data source for Google Data Studio (http://datastudio.google.com) or Tableau.

## Setup
### Install dependencies
```
npm i
```
Debian based systems require the following packages to be installed in order to be able to run chromium:

```
sudo apt-get install libpangocairo-1.0-0 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libgconf2-4 libasound2 libatk1.0-0 libgtk-3-0
```
### Startup script
to set up environment copy the example script and change the contents according to your prefs.

```
cp start.example.sh start.sh && vim start.sh
```

### Mysql Schema
Create required mysql table and views by importing `schema.sql`

## How to run
```
sh start.sh
```