var Promise = require('bluebird');

module.exports = {
  create: function(connexion, schema) {
    var opts = { type: connexion.QueryTypes.CREATE },
      query = function(sql) {
        return connexion.query(sql, opts);
      },
      promise = Promise.resolve(true);

    if (schema.name) {
      promise = query('DROP SCHEMA IF EXISTS ' + schema.name).then(function() {
        return query('CREATE SCHEMA ' + schema.name);
      });
    }

    return promise.then(function() {
      return query(
        'CREATE TABLE IF NOT EXISTS ' + schema.toSQL() + 'company (' +
        'id varchar(255) primary key,' +
        'company_id varchar(255) DEFAULT NULL,' +
        'name varchar(255) DEFAULT NULL,' +
        'created_at integer DEFAULT NULL,' +
        'updated_at integer DEFAULT NULL,' +
        'last_request_at integer DEFAULT NULL,' +
        'monthly_spend integer DEFAULT NULL,' +
        'session_count integer DEFAULT NULL,' +
        'user_count integer DEFAULT NULL' +
        ')');
    })
      .then(function() {
        return query(
          'CREATE TABLE IF NOT EXISTS ' + schema.toSQL() + 'company_custom_attributes (' +
          'company_id varchar(255) DEFAULT NULL REFERENCES ' + schema.toSQL() + 'company(id) ON DELETE cascade,' +
          'name varchar(255) DEFAULT NULL,' +
          'value text DEFAULT NULL' +
          ')');
      })
      .then(function() {
        return query('CREATE TABLE IF NOT EXISTS ' + schema.toSQL() + 'users (' +
        'id varchar(255) primary key,' +
        'user_id varchar(255) DEFAULT NULL,' +
        'name varchar(255) DEFAULT NULL,' +
        'email varchar(255) DEFAULT NULL,' +
        'pseudonym varchar(255) DEFAULT NULL,' +
        'city_name varchar(255) DEFAULT NULL,' +
        'continent_code varchar(255) DEFAULT NULL,' +
        'country_name varchar(255) DEFAULT NULL,' +
        'latitude numeric DEFAULT NULL,' +
        'longitude numeric DEFAULT NULL,' +
        'postal_code varchar(255) DEFAULT NULL,' +
        'region_name varchar(255) DEFAULT NULL,' +
        'timezone varchar(255) DEFAULT NULL,' +
        'country_code varchar(255) DEFAULT NULL,' +
        'last_request_at integer  DEFAULT NULL,' +
        'last_seen_ip varchar(255) DEFAULT NULL,' +
        'created_at integer  DEFAULT NULL,' +
        'signed_up_at integer DEFAULT NULL,' +
        'updated_at integer DEFAULT NULL,' +
        'session_count integer DEFAULT NULL,' +
        'user_agent_data text DEFAULT NULL,' +
        'company_id varchar(255) DEFAULT NULL REFERENCES ' + schema.toSQL() + 'company(id) ON DELETE cascade' +
        ')');
      })
      .then(function() {
        return query(
          'CREATE TABLE IF NOT EXISTS ' + schema.toSQL() + 'user_custom_attributes (' +
          'user_id varchar(255) DEFAULT NULL REFERENCES ' + schema.toSQL() + 'users(id) ON DELETE cascade,' +
          'name varchar(255) DEFAULT NULL,' +
          'value text DEFAULT NULL' +
          ')');
      })
      .then(function() {
        return query('CREATE TABLE IF NOT EXISTS ' + schema.toSQL() + 'tag (' +
        'id varchar(255) primary key,' +
        'name varchar(255) DEFAULT NULL' +
        ')');
      })
      .then(function() {
        return query('CREATE TABLE IF NOT EXISTS ' + schema.toSQL() + 'user_tags (' +
        'tag_id varchar(255) REFERENCES ' + schema.toSQL() + 'tag(id) ON DELETE cascade,' +
        'user_id varchar(255) REFERENCES ' + schema.toSQL() + 'users(id) ON DELETE cascade' +
        ')');
      })
      .then(function() {
        return query('CREATE TABLE IF NOT EXISTS ' + schema.toSQL() + 'segment (' +
        'id varchar(255) primary key,' +
        'name varchar(255) DEFAULT NULL,' +
        'created_at integer  DEFAULT NULL,' +
        'updated_at integer DEFAULT NULL' +
        ')');
      })
      .then(function() {
        return query('CREATE TABLE IF NOT EXISTS ' + schema.toSQL() + 'user_segments (' +
        'segment_id varchar(255) REFERENCES ' + schema.toSQL() + 'segment(id) ON DELETE cascade,' +
        'user_id varchar(255) REFERENCES ' + schema.toSQL() + 'users(id) ON DELETE cascade' +
        ')');
      })
      .then(function() {
        return query('CREATE TABLE IF NOT EXISTS ' + schema.toSQL() + 'conversation (' +
        'id varchar(255),' +
        'message_id varchar(255),' +
        'type varchar(1),' +
        'created_at integer  DEFAULT NULL,' +
        'updated_at integer DEFAULT NULL,' +
        'subject text DEFAULT NULL,' +
        'body text DEFAULT NULL,' +
        'user_id varchar(255) DEFAULT NULL REFERENCES ' + schema.toSQL() + 'users(id) ON DELETE cascade,' +
        'PRIMARY KEY(id, message_id)' +
        ')');
      });
  }
};
