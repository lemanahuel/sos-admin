'use strict';

module.exports = {
  secure: true,
  port: process.env.PORT || 3040,
  db: process.env.MONGOHQ_URL || 'mongodb://localhost/voluntariosos'
};
