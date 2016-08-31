'use strict';

angular
  .module('profiles')
  .controller('ProfileController', ['User', 'UsersSrv', 'ModalSrv', '$state', 'UploadsSrv', '$scope', 'NotificationsSrv', '$rootScope', 'COURSES_LOGOS', 'COURSES_COLORS',
    function (User, UsersSrv, ModalSrv, $state, UploadsSrv, $scope, NotificationsSrv, $rootScope, COURSES_LOGOS, COURSES_COLORS) {
      var vm = this;
      vm.datePicker = {
        options: {
          formatYear: 'yyyy',
          startingDay: 1
        },
        format: 'dd MMMM yyyy',
        altInputFormats: ['M!/d!/yyyy'],
        popup: {
          opened: false,
          onClickOpen: function () {
            vm.datePicker.popup.opened = true;
          }
        }
      };
      vm.geoConfig = {
        types: ['geocode']
      };

      function getCourseStyles(className) {
        var style = null;
        var logo = null;
        className = className ? className.toLowerCase() : className;

        if (className.indexOf('diseñador') !== -1) {
          style = 'disenador-web';
        } else if (className.indexOf('programador') !== -1) {
          style = 'programador-web';
        } else if (className.indexOf('frontend') !== -1) {
          style = 'frontend';
        } else if (className.indexOf('fullstack') !== -1) {
          style = 'fullstack';
        } else if (className.indexOf('mobile') !== -1) {
          style = 'movil';
        } else if (className.indexOf('gráfico') !== -1) {
          style = 'disenador-grafico';
        } else if (className.indexOf('ux design') !== -1) {
          style = 'diseno-ux';
        } else if (className.indexOf('marketing digital avanzado') !== -1) {
          style = 'marketing2';
        } else if (className.indexOf('marketing digital') !== -1) {
          style = 'marketing1';
        } else if (className.indexOf('wordpress avanzado') !== -1) {
          style = 'wordpress2';
        } else if (className.indexOf('wordpress') !== -1) {
          style = 'wordpress1';
        } else if (className.indexOf('angular 2') !== -1) {
          style = 'diseno';
          logo = COURSES_LOGOS.angular;
        } else if (className.indexOf('html y css') !== -1) {
          style = 'disenador-web';
          logo = COURSES_LOGOS.htmlcss;
        } else if (className.indexOf('react') !== -1) {
          style = 'wordpress1';
          logo = COURSES_LOGOS.react;
        }

        return {
          logo: logo ? logo : COURSES_LOGOS[style],
          style: COURSES_COLORS[style]
        };
      }

      function parseCertification(className) {
        if (className && className.toLowerCase().indexOf('(versión 2)') !== -1) {
          return className.replace('(Versión 2)', '');
        }
        return className;
      }

      function setCertificationLinkedin() {
        angular.forEach(vm.userTmp.profile.certifications, function (item) {
          var certLinkedin = 'https://www.linkedin.com/profile/add';
          certLinkedin += '?_ed=0_JhwrBa9BO0xNXajaEZH4qchmXj_bl7e8YUqBLyHMpFamjuhvQxj9mAY5hdRFzAvUaSgvthvZk7wTBMS3S-m0L6A6mLjErM6PJiwMkk6nYZylU7__75hCVwJdOTZCAkdv';
          certLinkedin += '&pfCertificationName=' + item.class.name;
          certLinkedin += '&pfCertificationUrl=' + item.url;
          certLinkedin += '&pfLicenseNo=' + item._id;
          certLinkedin += '&pfCertStartDate=201601';
          certLinkedin += '&pfCertFuture=201612';
          certLinkedin += '&trk=onsite_html';
          var styles = getCourseStyles(item.class.name);
          item.logo = styles.logo;
          item.style = styles.style;
          item.class.name = parseCertification(item.class.name);

          item.linkedinUrl = certLinkedin;
          console.log(item);
        });
      }

      function setCurrent(current) {
        vm.userTmp = current && current.data;
        vm.userTmp.profile = vm.userTmp.profile || {};
        console.log(vm.userTmp.profile);
        vm.userTmp.profile.bday = vm.userTmp.profile && vm.userTmp.profile.bday ? new Date(vm.userTmp.profile.bday).getTime() : vm.userTmp.profile.bday;

        if (!vm.userTmp.profile.avatar && $rootScope.AUTH_PROFILE.picture) {
          vm.userTmp.profile.avatar = $rootScope.AUTH_PROFILE.picture;
        }

        if (!vm.userTmp.profile.country) {
          vm.userTmp.profile.country = 'Argentina';
        }

        if (vm.userTmp.profile.certifications && vm.userTmp.profile.certifications.length) {
          setCertificationLinkedin();
        }
      }

      setCurrent(User);

      function upload(file, callback) {
        if (!file) {
          return;
        }
        UploadsSrv.images(file)
          .progress(function () {
            //FwNotifierSrv.uploadImage();
          })
          .success(function (data) {
            //FwNotifierSrv.success();
            callback(data);
          })
          .error(function () {
            NotificationsSrv.error();
            //FwNotifierSrv.serverError();
          });
      }

      $scope.$watch('vm.avatarFile', function () {
        upload(vm.avatarFile, function (data) {
          vm.userTmp.profile.avatar = data.url;
        });
      });

      vm.onClickLinkedin = function (e, url) {
        e.preventDefault();
        window.open(url, '_blank').focus();
      };

      vm.onSubmit = function () {
        console.log('onSubmit', vm.userTmp.profile);
        UsersSrv.upsert({
          user: vm.userTmp
        }).then(function (profile) {
          if (!vm.userTmp.profile._id) {
            NotificationsSrv.success();
            $state.go('profile', {
              userId: profile.data._id
            });
          } else {
            NotificationsSrv.updated();
            setCurrent(profile);
          }
        }, function (err) {
          NotificationsSrv.error();
          console.debug(err);
        });
      };
    }
  ]);
