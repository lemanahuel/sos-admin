/* eslint angular/window-service: 0 */
/* eslint angular/document-service: 0 */

'use strict';

window.CH_API = (function() {
  var host = location.host,
    base = 'localhost:3002';

  if (host.indexOf('herokuapp') !== -1) {
    base = (host.indexOf('-qa') !== -1 ? 'ch-api-qa' : host.indexOf('-dev') !== -1 ? 'ch-api-dev' : 'ch-api') + '.herokuapp.com';
  } else if (host.indexOf('coderhouse') !== -1) {
    base = 'api.coderhouse.' + (host.indexOf('.io') !== -1 ? 'io' : 'com');
  } else if (host.indexOf('localhost') === -1) {
    base = host.split(':')[0] + ':3002';
  }

  return 'https://' + base;
})();

angular
  .module('core')
  .constant('PATHS', {
    API: window.CH_API,
    CAPACITATION_CENTERS: window.CH_API + '/private/capacitation-centers',
    JOBS: window.CH_API + '/private/jobs',
    COMPANIES: window.CH_API + '/private/companies',
    CURRENCY: window.CH_API + '/private/currency',
    PING: window.CH_API + '/private/ping',
    CAREERS: window.CH_API + '/private/careers',
    LEVELS: window.CH_API + '/private/levels',
    COURSES: window.CH_API + '/private/courses',
    USERS: window.CH_API + '/private/users',
    SUBSCRIPTIONS: window.CH_API + '/private/subscriptions',
    UPLOAD_IMAGE: window.CH_API + '/private/upload-image',
    COUNTRIES: window.CH_API + '/private/countries',
    CITIES: window.CH_API + '/private/cities',
    COWORKINGS: window.CH_API + '/private/coworkings',
    RECRUITERS: window.CH_API + '/private/recruiters',
    IO_USERS: window.CH_API + '/private/io-users',
    REPORTS_IO_USERS: window.CH_API + '/private/reports/io-users',
    REPORTS_CAMADAS: window.CH_API + '/private/reports/camadas',
    CAMADAS: window.CH_API + '/private/camadas',
    TEACHERS_AVAILABLE: window.CH_API + '/private/teachers/available',
    COWORKINGS_AVAILABLE: window.CH_API + '/private/coworkings/available',
    HOLIDAYS: window.CH_API + '/private/holidays',
    CLASSES: window.CH_API + '/private/classes',
    STAGES: window.CH_API + '/private/stages',
    MODULES: window.CH_API + '/private/modules',
    UNENROLL: window.CH_API + '/private/unenroll',
    TPS: window.CH_API + '/admin/tps',
    SCHEDULES: window.CH_API + '/admin/schedules',
    USERS_HISTORY: window.CH_API + '/admin/histories',
    UPLOAD_IMAGES: window.CH_API + '/admin/upload/images',
    REMOTES: window.CH_API + '/admin/remotes',
    AUTH: window.CH_API + '/authenticate'
  })
  .constant('ROLES', {
    1: 'Admin'
  });