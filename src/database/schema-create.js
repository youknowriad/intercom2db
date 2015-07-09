module.exports = {
  create: function(connexion) {
    var opts = { type: connexion.QueryTypes.CREATE },
      query = function(sql) {
        return connexion.query(sql, opts);
      };

    return query(
      'CREATE TABLE IF NOT EXISTS company (' +
      'id varchar(255) primary key,' +
      'company_id varchar(255) DEFAULT NULL,' +
      'name varchar(255) DEFAULT NULL,' +
      'created_at integer DEFAULT NULL,' +
      'updated_at integer DEFAULT NULL,' +
      'last_request_at integer DEFAULT NULL,' +
      'monthly_spend integer DEFAULT NULL,' +
      'session_count integer DEFAULT NULL,' +
      'user_count integer DEFAULT NULL' +
      ')')
      .then(function() {
        return query('CREATE TABLE IF NOT EXISTS users (' +
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
        'company_id varchar(255) DEFAULT NULL REFERENCES company (id) ON DELETE cascade' +
        ')');
      })
      .then(function() {
        return query('CREATE TABLE IF NOT EXISTS tag (' +
        'id varchar(255) primary key,' +
        'name varchar(255) DEFAULT NULL' +
        ')');
      })
      .then(function() {
        return query('CREATE TABLE IF NOT EXISTS user_tags (' +
        'tag_id varchar(255) REFERENCES users(id) ON DELETE cascade,' +
        'user_id varchar(255) REFERENCES tag(id) ON DELETE cascade' +
        ')');
      })
      .then(function() {
        return query('CREATE TABLE IF NOT EXISTS segment (' +
        'id varchar(255) primary key,' +
        'name varchar(255) DEFAULT NULL,' +
        'created_at integer  DEFAULT NULL,' +
        'updated_at integer DEFAULT NULL' +
        ')');
      })
      .then(function() {
        return query('CREATE TABLE IF NOT EXISTS user_segments (' +
        'segment_id varchar(255) REFERENCES segment(id) ON DELETE cascade,' +
        'user_id varchar(255) REFERENCES users(id) ON DELETE cascade' +
        ')');
      });
  }
};
