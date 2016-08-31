'use strict';

angular
  .module('camadas')
  .controller('CamadaController', ['Camada', 'Teachers', 'Students', 'Classes', 'CamadasSrv', 'ModalSrv', '$state', 'NotificationsSrv', 'CAMADA_TYPE',
    function (Camada, Teachers, Students, Classes, CamadasSrv, ModalSrv, $state, NotificationsSrv, CAMADA_TYPE) {
      var vm = this;
      vm.currentUnity = {};
      vm.teachers = Teachers && Teachers.data;
      vm.students = Students && Students.data;
      vm.classes = Classes && Classes.data;
      vm.camadaTypes = CAMADA_TYPE;

      function setCowork() {

      }

      setCowork();

      function setCurrent(current) {
        var camada = current && current.data && current.data._id ? current.data : {};

        if (camada.course) {
          var courseTmp = camada.course.find(function (item) {
            return item.coworking && item.coworking._id;
          });
          if (!courseTmp) {
            courseTmp = camada.course[0];
          }

          console.log(courseTmp);
          if (courseTmp && courseTmp.coworking) {
            courseTmp.location = courseTmp.coworking.locations.find(function (item) {
              return item._id === courseTmp.location;
            });
            courseTmp.room = courseTmp.location && courseTmp.location.rooms.find(function (item) {
              return item._id === courseTmp.room;
            });
            camada.courseTmp = {};
            camada.courseTmp.coworking = courseTmp.coworking;
            camada.courseTmp.location = courseTmp.location;
            camada.courseTmp.room = courseTmp.room;
            camada.courseTmp.startDate = new Date(courseTmp.startDate);
            camada.courseTmp.endDate = new Date(courseTmp.endDate);
          }
        }

        console.log(camada);

        vm.camadaTmp = camada;
      }

      setCurrent(Camada);

      function findUser(item, collection) {
        var i = 0,
          l = collection && collection.length;

        for (i; i < l; i++) {
          if (item.email === collection[i].email) {
            return collection[i];
          }
        }
        return false;
      }

      function findTeacher(user) {
        return findUser(user, vm.camadaTmp.teachers);
      }

      function findStudent(user, collection) {
        return findUser(user, collection || vm.camadaTmp.students);
      }

      function findAndRemoveUser(id, collection) {
        var i = 0,
          l = collection && collection.length;

        for (i; i < l; i++) {
          if (id === collection[i]._id) {
            collection.splice(i, 1);
            return i;
          }
        }
        return false;
      }

      function findAndRemoveTeacher(id) {
        return findAndRemoveUser(id, vm.camadaTmp.teachers);
      }

      function findAndRemoveStudent(id) {
        return findAndRemoveUser(id, vm.camadaTmp.students);
      }

      vm.onClickCompleted = function () {
        vm.camadaTmp.completed = vm.camadaTmp.completed ? false : true;
      };

      vm.onClickRemove = function () {
        ModalSrv.open({
          url: 'modules/camadas/views/camada.remove.view.html',
          confirm: function () {
            CamadasSrv.delete({
              _id: vm.camadaTmp._id
            }).then(function () {
              NotificationsSrv.removed();
              $state.go('camadas');
            }, function (err) {
              NotificationsSrv.error();
              console.debug(err);
            });
          }
        });
      };

      vm.onClickRemoveTeacher = function ($event, teacherId) {
        ModalSrv.open({
          url: 'modules/camadas/views/teacher.remove.view.html',
          confirm: function () {
            findAndRemoveTeacher(teacherId);
          }
        });
      };

      vm.onClickRemoveStudent = function ($event, studentId) {
        ModalSrv.open({
          url: 'modules/camadas/views/student.remove.view.html',
          confirm: function () {
            findAndRemoveStudent(studentId);
          }
        });
      };

      vm.onClickAddTeacher = function ($event, teacherId) {
        if (findTeacher(vm.teacherTmp)) {
          return;
        }
        vm.camadaTmp.teachers.push(vm.teacherTmp);
      };

      vm.onClickAddStudent = function ($event, studentId) {
        if (findStudent(vm.studentTmp)) {
          return;
        }
        vm.camadaTmp.students.push(vm.studentTmp);
      };

      function parseMasiveEmails(items, collection, entity) {
        var invalidEmails = [];
        var emails = [];
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (items) {
          angular.forEach(items.replace(/\n/g, ',').replace(/ /g, ',').split(','), function (email) {
            if (email && regex.test(email)) {
              var user = {
                email: email.replace(/ /g, '')
              };
              var existUser = findStudent(user, collection);
              var isRepeted = findStudent(user);

              if (existUser && !isRepeted) {
                vm.camadaTmp[entity].push(existUser);
              } else if (!isRepeted) {
                vm.camadaTmp[entity].push(user);
              }
            } else {
              invalidEmails.push(email);
            }
          });

          return invalidEmails.length ? invalidEmails.join(',') : '';
        }

        return items;
      }

      vm.onClickAddTeachers = function () {
        vm.teachersTmp.emails = parseMasiveEmails(vm.teachersTmp && vm.teachersTmp.emails, vm.teachers, 'teachers');
      };

      vm.onClickAddStudents = function () {
        vm.studentsTmp.emails = parseMasiveEmails(vm.studentsTmp && vm.studentsTmp.emails, vm.students, 'students');
      };

      vm.onSubmit = function () {
        console.log(vm.camadaTmp);
        CamadasSrv.upsert({
          camada: vm.camadaTmp
        }).then(function (data) {
          if (!vm.camadaTmp._id) {
            NotificationsSrv.success();
            $state.go('camada', {
              camadaId: data.data._id
            });
          } else {
            NotificationsSrv.updated();
            setCurrent(data);
          }
        }, function (err) {
          NotificationsSrv.error();
          console.debug(err);
        });
      };
    }
  ]);
