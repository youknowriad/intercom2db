module.exports = function(Promise) {
  return {
    create: function(connexion) {
      return new Promise(function(resolve, reject) {
        connexion.connect();
        connexion.query('CREATE TABLE IF NOT EXISTS company (' +
            'id varchar(255) primary key,' +
            'company_id varchar(255) DEFAULT NULL,' +
            'name varchar(255) DEFAULT NULL,' +
            'created_at int(11) DEFAULT NULL,' +
            'updated_at int(11) DEFAULT NULL,' +
            'last_request_at int(11) DEFAULT NULL,' +
            'monthly_spend int(11) DEFAULT NULL,' +
            'session_count int(11) DEFAULT NULL,' +
            'user_count int(11) DEFAULT NULL' +
          ') ENGINE=InnoDB', function(err) {
          if (err) {
            return reject(err);
          }
          connexion.query('CREATE TABLE IF NOT EXISTS user (' +
              'id varchar(255) primary key,' +
              'user_id varchar(255) DEFAULT NULL,' +
              'name varchar(255) DEFAULT NULL,' +
              'email varchar(255) DEFAULT NULL,' +
              'pseudonym varchar(255) DEFAULT NULL,' +
              'city_name varchar(255) DEFAULT NULL,' +
              'continent_code varchar(255) DEFAULT NULL,' +
              'country_name varchar(255) DEFAULT NULL,' +
              'latitude DOUBLE DEFAULT NULL,' +
              'longitude DOUBLE DEFAULT NULL,' +
              'postal_code varchar(255) DEFAULT NULL,' +
              'region_name varchar(255) DEFAULT NULL,' +
              'timezone varchar(255) DEFAULT NULL,' +
              'country_code varchar(255) DEFAULT NULL,' +
              'last_request_at int(11)  DEFAULT NULL,' +
              'last_seen_ip varchar(255) DEFAULT NULL,' +
              'created_at int(11)  DEFAULT NULL,' +
              'signed_up_at int(11) DEFAULT NULL,' +
              'updated_at int(11) DEFAULT NULL,' +
              'session_count int(11) DEFAULT NULL,' +
              'user_agent_data text DEFAULT NULL,' +
              'company_id varchar(255) DEFAULT NULL,' +
              'INDEX company (company_id),' +
              'FOREIGN KEY fk_company(company_id) REFERENCES company(id) ON DELETE cascade' +
            ') ENGINE=InnoDB', function(err) {
            if (err) {
              return reject(err);
            }
            connexion.query('CREATE TABLE IF NOT EXISTS tag (' +
              'id varchar(255) primary key,' +
              'name varchar(255) DEFAULT NULL' +
            ') ENGINE=InnoDB', function(err) {
              if (err) {
                return reject(err);
              }
              connexion.query('CREATE TABLE IF NOT EXISTS user_tags (' +
                'tag_id varchar(255),' +
                'user_id varchar(255),' +
                'FOREIGN KEY fk_user(user_id) REFERENCES user(id) ON DELETE cascade,' +
                'FOREIGN KEY fk_tag(tag_id) REFERENCES tag(id) ON DELETE cascade' +
              ') ENGINE=InnoDB', function(err) {
                if (err) {
                  return reject(err);
                }
                connexion.query('CREATE TABLE IF NOT EXISTS segment (' +
                  'id varchar(255) primary key,' +
                  'name varchar(255) DEFAULT NULL,' +
                  'created_at int(11)  DEFAULT NULL,' +
                  'updated_at int(11) DEFAULT NULL' +
                ') ENGINE=InnoDB', function(err) {
                  if (err) {
                    return reject(err);
                  }
                  connexion.query('CREATE TABLE IF NOT EXISTS user_segments (' +
                    'segment_id varchar(255),' +
                    'user_id varchar(255),' +
                    'FOREIGN KEY fk_user(user_id) REFERENCES user(id) ON DELETE cascade,' +
                    'FOREIGN KEY fk_segment(segment_id) REFERENCES segment(id) ON DELETE cascade' +
                  ') ENGINE=InnoDB', function() {
                      resolve();
                  });
                });
              });
            });
          });
        });
      });
    }
  };
};
