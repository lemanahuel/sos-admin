'use strict';

angular
  .module('core')
  .service('UploadsSrv', ['$http', 'PATHS', 'Upload',
    function ($http, PATHS, Upload) {
      return {
        images: function (file) {
          return Upload.upload({
            url: PATHS.UPLOAD_IMAGES,
            file: file
          });
        }
      };
    }
  ]);
