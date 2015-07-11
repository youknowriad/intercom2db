var Promise = require('bluebird');

module.exports = function(connexion, schema) {
  var usersTable = schema.toSQL() + 'users';
  var usersAttributesTable = schema.toSQL() + 'user_custom_attributes';
  var usersTagsTable = schema.toSQL() + 'INSERT';
  var usersSegmentsTable = schema.toSQL() + 'user_segments';

  this.prepare = function(connexion) {
    return connexion.query('DELETE FROM ' + usersTable, { type: connexion.QueryTypes.DELETE });
  };

  this.process = function(user) {
    var companyId = user.companies.companies.length > 0 ? user.companies.companies[0].id : null;

    return connexion.query('INSERT INTO ' + usersTable + '(id, user_id, name, email, pseudonym, city_name, continent_code, country_name, latitude, longitude, postal_code, region_name, timezone, country_code, last_request_at, last_seen_ip, created_at, signed_up_at, updated_at, session_count, user_agent_data, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', {
      type: connexion.QueryTypes.INSERT,
      replacements: [user.id, user.user_id, user.name, user.email, user.pseudonyme, user.location_data.city_name, user.location_data.continent_code, user.location_data.country_name, user.location_data.latitude, user.location_data.longitude, user.location_data.postal_code, user.location_data.region_name, user.location_data.timezone, user.location_data.country_code, user.last_request_at, user.last_seen_ip, user.created_at, user.signed_up_at, user.updated_at, user.session_count, user.user_agent_data, companyId]
    }).then(function() {
      var promises = [];

      if (user.custom_attributes) {
        Object.keys(user.custom_attributes).forEach(function(key) {
          promises.push(connexion.query('INSERT INTO ' + usersAttributesTable + '(user_id, name, value) VALUES (?, ?, ?)', {
            type: connexion.QueryTypes.INSERT,
            replacements: [user.id, key, user.custom_attributes[key]]
          }));
        });
      }

      return Promise.all(promises);
    }).then(function() {
      var tagsPromise = Promise.all([]);

      if (user.tags.tags.length > 0) {
        var tagsSql = user.tags.tags.map(function(tag) {
          return '(\'' + user.id + '\', \'' + tag.id + '\')';
        });

        tagsPromise = connexion.query('INSERT INTO ' + usersTagsTable + '(user_id, tag_id) VALUES ' + tagsSql.join(','), {
          type: connexion.QueryTypes.INSERT
        });
      }

      return tagsPromise.then(function() {
        if (user.segments.segments.length > 0) {
          var segmentsSql = user.segments.segments.map(function(segment) {
            return '(\'' + user.id + '\', \'' + segment.id + '\')';
          });

          return connexion.query('INSERT INTO ' + usersSegmentsTable + '(user_id, segment_id) VALUES ' + segmentsSql.join(','), {
            type: connexion.QueryTypes.INSERT
          });
        }
      });
    });
  };
};

