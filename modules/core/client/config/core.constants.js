/* eslint angular/window-service: 0 */
/* eslint angular/document-service: 0 */

'use strict';

window.CH_API = (function () {
  var host = location.host,
    base = '';
  //base = 'sos-api-qa.herokuapp.com';

  if (host.indexOf('sos-admin-dev') !== -1) {
    base = 'sos-api-dev.herokuapp.com';
  } else if (host.indexOf('sos-admin-qa') !== -1) {
    base = 'sos-api-qa.herokuapp.com';
  } else if (host === 'dash.coderhouse.com' || host === 'sos-dash.herokuapp.com') {
    base = 'api.coderhouse.com';
  } else if (host === 'coderhouse.io' || host === 'coderhouse.com' || host === 'sos-admin.herokuapp.com') {
    base = 'api.coderhouse.com';
  } else if (host.indexOf('localhost') !== -1) {
    base = host.split(':')[0] + ':3002';
  }

  return 'https://' + base;
})();

angular
  .module('core')
  .constant('PATHS', {
    API: window.CH_API,
    CLASSES: window.CH_API + '/admin/classes',
    STAGES: window.CH_API + '/admin/stages',
    MODULES: window.CH_API + '/admin/modules',
    PROFILES: window.CH_API + '/admin/profiles',
    USERS: window.CH_API + '/admin/users',
    TPS: window.CH_API + '/admin/tps',
    SCHEDULES: window.CH_API + '/admin/schedules',
    CAMADAS: window.CH_API + '/admin/camadas',
    USERS_HISTORY: window.CH_API + '/admin/histories',
    UPLOAD_IMAGES: window.CH_API + '/admin/upload/images',
    REMOTES: window.CH_API + '/admin/remotes',
    COUNTRIES: window.CH_API + '/private/countries',
    CITIES: window.CH_API + '/private/cities'
  })
  .constant('ROLES', {
    1: 'Admin',
    2: 'Estudiante',
    3: 'Profesor',
    10: 'Free'
  })
  .constant('CAMADA_TYPE', {
    present: 'Presencial',
    remote: 'Remoto'
  })
  .constant('COURSES_COLORS', {
    'disenador-web': '#40c4ff',
    'programador-web': '#03a9f4',
    'frontend': '#536dfe',
    'fullstack': '#FF5722',
    'movil': '#9c27b0',
    'marketing': '#8BC34A',
    'marketing1': '#673AB7',
    'marketing2': '#8BC34A',
    'wordpress': '#303F9F',
    'wordpress1': '#3F51B5',
    'wordpress2': '#303F9F',
    'disenador-grafico': '#FF4081',
    'diseno-ux': '#F44336',
    'diseno': '#D32F2F'
  })
  .constant('COURSES_LOGOS', {
    'disenador-web': 'http://res.cloudinary.com/hdsqazxtw/image/upload/v1470182840/disenador-web_cgdjko.png',
    'programador-web': 'http://res.cloudinary.com/hdsqazxtw/image/upload/v1470182837/programador-web_bj9xzn.png',
    'frontend': 'http://res.cloudinary.com/hdsqazxtw/image/upload/v1470182835/experto-frontend_mssacz.png',
    'fullstack': 'http://res.cloudinary.com/hdsqazxtw/image/upload/v1470182836/experto-full-stack_pldrr8.png',
    'movil': 'http://res.cloudinary.com/hdsqazxtw/image/upload/v1470182836/experto-movil_a8kzhj.png',
    'marketing1': 'http://res.cloudinary.com/hdsqazxtw/image/upload/v1470182837/marketing-digital-basico_zttnji.png',
    'marketing2': 'http://res.cloudinary.com/hdsqazxtw/image/upload/v1470182837/marketing-digital-avanzado_deqez7.png',
    'wordpress1': 'http://res.cloudinary.com/hdsqazxtw/image/upload/v1470182839/wordpress-basico_pml6oo.png',
    'wordpress2': 'http://res.cloudinary.com/hdsqazxtw/image/upload/v1470182839/wordpress-avanzado_up7wyi.png',
    'disenador-grafico': 'http://res.cloudinary.com/hdsqazxtw/image/upload/v1470240226/diseno-grafico_otphco.png',
    'diseno-ux': 'http://res.cloudinary.com/hdsqazxtw/image/upload/v1470182835/diseno-ux_ddfwvs.png',
    angular: 'http://res.cloudinary.com/hdsqazxtw/image/upload/v1470240266/angular_tcrxmh.png',
    htmlcss: 'http://res.cloudinary.com/hdsqazxtw/image/upload/v1470240266/htmlcss_y5qoai.png',
    react: 'http://res.cloudinary.com/hdsqazxtw/image/upload/v1470240265/react_i8twyj.png'
  });
