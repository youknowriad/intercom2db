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

## Docker

Intercom2db ships with a docker container you can use to quickly get started and import your data:

```
docker pull rizeway/intercom2db
docker run --name intercom2db \
           -e I2DB_DATABASE_HOST=your.mysql \
           -e I2DB_DATABASE_USER=your_db_user \
           -e I2DB_DATABASE_PASSWORD=your_db_user_password \
           -e I2DB_API_APP_ID=your_intercom_app_id \
           -e I2DB_API_KEY=your_intercom_api_key \
           --rm rizeway/intercom2db
```

This will fire up a container and load your data in `you.mysql` server. Here is the list of the available environment
variables:

| Name                     | Default     | Description                     |
| ------------------------ | ----------- | ------------------------------- |
| `I2DB_DATABASE_HOST`     | `localhost` | Database host                   |
| `I2DB_DATABASE_PORT`     | `3306`      | Database port                   |
| `I2DB_DATABASE_USER`     | `root`      | Database username               |
| `I2DB_DATABASE_PASSWORD` | N/A         | Database password               |
| `I2DB_DATABASE_NAME`     | `intercom`  | Database database name          |
| `I2DB_API_APP_ID`        | N/A         | Intercom application ID         |
| `I2DB_API_KEY`           | N/A         | Intercom API key                |
| `I2DB_REFRESH_DELAY`     | N/A         | Auto-refresh delay (in seconds) |

If you don't want to use environment variables, you can still share a configuration file with your container
thanks to docker volumes:

```
docker pull rizeway/intercom2db
docker run --name intercom2db \
           -v /path/to/your/config.js:/app/config.js \
           --rm rizeway/intercom2db /app/config.js
```

### Compose

If you want to contribute to Intercom2db you can also use docker through `docker-compose`:

```
export I2DB_API_APP_ID=your_intercom_app_id
export I2DB_API_KEY=your_intercom_api_key

docker-composer up
```

This will boot two database containers (on for MySQL and one for PostgreSQL) and an Intercom2db container and link them together.

By default, `intercom2db` will die right after the loading process is finished. If you want to keep the containers alive
you will have to enable auto-refresh:

```
export I2DB_REFRESH_DELAY=3600

docker-composer up
```
