module.exports = function(Promise, importerFactory) {
  function prepare(connexion) {
    return connexion.query('DELETE FROM users', { type: connexion.QueryTypes.DELETE });
  }

  function process(user) {
    var connexion = this.connection,
      companyId = user.companies.companies.length > 0 ? user.companies.companies[0].id : null;

    return this.query('INSERT INTO users (id, user_id, name, email, pseudonym, city_name, continent_code, country_name, latitude, longitude, postal_code, region_name, timezone, country_code, last_request_at, last_seen_ip, created_at, signed_up_at, updated_at, session_count, user_agent_data, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', {
      type: connexion.QueryTypes.INSERT,
      replacements: [user.id, user.user_id, user.name, user.email, user.pseudonyme, user.location_data.city_name, user.location_data.continent_code, user.location_data.country_name, user.location_data.latitude, user.location_data.longitude, user.location_data.postal_code, user.location_data.region_name, user.location_data.timezone, user.location_data.country_code, user.last_request_at, user.last_seen_ip, user.created_at, user.signed_up_at, user.updated_at, user.session_count, user.user_agent_data, companyId]
    }).then(function() {
      var tagsPromise = Promise.all([]);

      if (user.tags.tags.length > 0) {
        var tagsSql = user.tags.tags.map(function(tag) {
          return '(\'' + user.id + '\', \'' + tag.id + '\')';
        });
        tagsPromise = this.query('INSERT INTO user_tags (user_id, tag_id) VALUES ' + tagsSql.join(','));
      }

      return tagsPromise.then(function() {
        if (user.segments.segments.length > 0) {
          var segmentsSql = user.segments.segments.map(function(segment) {
            return '(\'' + user.id + '\', \'' + segment.id + '\')';
          });
          return this.query('INSERT INTO user_segments (user_id, segment_id) VALUES ' + segmentsSql.join(','));
        }
      }.bind(this), console.log);
    }.bind(this), console.log);
  }

  return importerFactory.get('users', prepare, process);
};

