'use strict';

angular
  .module('core')
  .service('NotificationsSrv', ['Notification',
    function(Notification) {
      return {
        success: function(params) {
          params = params || {};
          params.msg = params.msg || 'Guardado';
          Notification.success(params.msg);
        },
        updated: function(params) {
          params = params || {};
          params.msg = params.msg || 'Actualizado';
          Notification.success(params.msg);
        },
        removed: function(params) {
          params = params || {};
          params.msg = params.msg || 'Eliminado';
          Notification.success(params.msg);
        },
        error: function(params) {
          params = params || {};
          params.msg = params.msg || 'Hubo un problemilla, contactate con soporte';
          Notification.error(params.msg);
        },
        info: function(params) {
          params = params || {};
          params.msg = params.msg || 'Info';
          Notification.info(params.msg);
        }
      };
    }
  ]);