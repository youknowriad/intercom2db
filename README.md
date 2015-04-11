# Intercom2db

Intercom2db is a small utility that allow you to extract data from [intercom](http://intercom.io) to a database. Support only mysql for now.

## Install

```sh
$ npm install -g intercom2db
```

Intercom2db depends on [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/).


## Usage

Create a config file like this :

```javascript
// myconfig.js
module.exports = {
  database: {
    host: 'mysqlhost',
    port: '3306',
    user: 'username',
    password: 'password',
    database: 'intercom'
  },
  intercom: {
    appId: 'your_intercom_app_id',
    apiKey: 'your_intercom_api_key'
  }
};
```

Launch the import

```sh
$ intercom2db path_to_my_config_file.js
```
