module.exports = function (connection) {
  if (!connection || typeof (connection ? connection.query : void 0) !== 'function') {
    throw new Error('Sequelize mixin requires connection to be given');
  }

  return function (target) {
    target.connection = connection;

    target.query = function (query, args) {
      return connection.query(query, args);
    };

    target.selectOne = function (query, args) {
      return target.query(query, args).then(function (_arg) {
        var results = _arg[0];

        if (results.length === 1) {
          return results[0];
        }

        if (results.length === 0) {
          throw new Error('Query returned no result');
        }

        throw new Error('Query returned more than one result');
      });
    };

    target.escape = function (value) {
      return value;
    };

    return target;
  };
};
