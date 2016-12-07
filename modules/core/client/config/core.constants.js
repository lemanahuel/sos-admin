/* eslint angular/window-service: 0 */
/* eslint angular/document-service: 0 */

'use strict';

window.SOS_API = (function() {
  var host = location.host,
    base = 'localhost:3001';

  if (host.indexOf('herokuapp') !== -1) {
    base = (host.indexOf('-qa') !== -1 ? 'sos-api-qa' : host.indexOf('-dev') !== -1 ? 'sos-api-dev' : 'sos-api') + '.herokuapp.com';
  } else if (host.indexOf('voluntariosos') !== -1) {
    base = 'api.voluntariosos.' + (host.indexOf('.io') !== -1 ? 'io' : 'com');
  } else if (host.indexOf('localhost') === -1) {
    base = host.split(':')[0] + ':3001';
  }

  return 'https://' + base;
})();

angular
  .module('core')
  .constant('PATHS', {
    API: window.SOS_API,
    CAPACITATION_CENTERS: window.SOS_API + '/private/capacitation-centers',
    USERS: window.SOS_API + '/private/users',
    INCIDENTS: window.SOS_API + '/private/incidents',
    TESTIMONIES: window.SOS_API + '/private/testimonies',
    AUTH: window.SOS_API + '/authenticate'
  })
  .constant('ROLES', {
    1: 'Admin'
  });