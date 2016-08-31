'use strict';

angular
  .module('classes')
  .controller('ClassesController', ['Classes', 'UserHistory', 'Tps', 'Camadas', 'ClassesSrv', '$state', 'ModalSrv', '$rootScope', 'StagesSrv', 'ModulesSrv', 'NotificationsSrv', '$stateParams', '$location',
    function (Classes, UserHistory, Tps, Camadas, ClassesSrv, $state, ModalSrv, $rootScope, StagesSrv, ModulesSrv, NotificationsSrv, $stateParams, $location) {
      var vm = this,
        tps = Tps && Tps.data,
        currentStages = null,
        currentModules = null,
        dragOptions = {
          accept: function (sourceItemHandleScope, destSortableScope) {
            return $rootScope.PERMISSIONS.admin || $rootScope.PERMISSIONS.teacher;
          },
          containment: '.table', //optional param
          placeholder: '<tr><td></td> <td></td> <td></td> <td></td></tr>',
          containerPositioning: 'relative'
        };

      vm.onDragStages = angular.extend({}, dragOptions, {
        orderChanged: function () {
          angular.forEach(vm.stages, function (item, key) {
            item.order = key++;
            StagesSrv.update({
              stage: item
            });
          });
        }
      });

      vm.onDragModules = angular.extend({}, dragOptions, {
        orderChanged: function () {
          angular.forEach(vm.modules, function (item, key) {
            item.order = key++;
            ModulesSrv.update({
              module: item
            });
          });
        }
      });

      function setScheduler(camadas, classes) {
        var formatDate = function (date) {
          if (!date || !angular.isDate(date)) {
            date = date ? new Date(date) : new Date();
          }
          return new Date(date.getFullYear() + ',' + date.getMonth() + ',' + date.getDate()).getTime();
        };

        var today = formatDate();

        angular.forEach(camadas, function (camada) {
          if (!camada.completed && camada.schedules && camada.schedules.length) {
            angular.forEach(camada.class.stages, function (stageItem) {
              angular.forEach(camada.schedules, function (schedule) {
                if (stageItem.starter) {
                  stageItem.enableBySchedule = true;
                } else if (schedule && schedule.stage === stageItem._id) {
                  stageItem.from = schedule.from;
                  stageItem.enableBySchedule = today >= formatDate(schedule.from);
                }
              });
            });
          } else {
            angular.forEach(camada.class.stages, function (stageItem) {
              stageItem.enableBySchedule = true;
            });
          }
        });
        return classes;
      }

      function setProgress(classes) {
        if (!$rootScope.PERMISSIONS.student) {
          return classes;
        }

        var histories = UserHistory && UserHistory.data;

        angular.forEach(classes, function (classItem) {
          var amountOfStagesModules = 0,
            amountOfStagesModulesCompleted = 0,
            prevItem = null;

          angular.forEach(classItem.stages, function (stageItem) {
            var amountOfModules = stageItem.modules.length,
              amountOfCompletedModules = 0;

            angular.forEach(stageItem.modules, function (moduleItem) {
              angular.forEach(histories, function (history) {
                if (history.module && history.module._id === moduleItem._id) {
                  // if (moduleItem.tp) {
                  //   angular.forEach(tps, function (tp) {
                  //     if (tp && tp.module._id === moduleItem._id && tp.url) {
                  //       moduleItem.completed = true;
                  //       ++amountOfCompletedModules;
                  //     }
                  //   });
                  // } else {
                  //   moduleItem.completed = true;
                  //   ++amountOfCompletedModules;
                  // }
                  moduleItem.completed = true;
                  ++amountOfCompletedModules;
                }
              });
            });

            stageItem.progress = parseInt((amountOfCompletedModules * 100) / amountOfModules, 10);
            amountOfStagesModules += amountOfModules;
            amountOfStagesModulesCompleted += amountOfCompletedModules;
          });

          angular.forEach(classItem.stages, function (stageItem) {
            stageItem.enable = isPrevStageComplete(stageItem._id, classItem.stages);
          });

          classItem.progress = parseInt((amountOfStagesModulesCompleted * 100) / amountOfStagesModules, 10);
        });

        return classes;
      }

      function parseClasses() {
        var classes = Classes && Classes.data;
        if ($rootScope.PERMISSIONS.teacher || $rootScope.PERMISSIONS.student) {
          vm.camadas = Camadas && Camadas.data;
          if ($rootScope.PERMISSIONS.student) {
            setScheduler(vm.camadas);
          }
          classes = vm.camadas.map(function (item) {
            return item.class;
          });
        }
        vm.classes = setProgress(classes);
      }

      parseClasses();

      function setCurrentClass() {
        var classId = $stateParams.classId;
        var classItem = null;
        if (classId) {
          classItem = vm.classes.filter(function (item) {
            return item._id === classId;
          })[0];
          vm.currentClassId = classItem._id;
          vm.stages = currentStages = classItem && classItem.stages;
        }
      }

      setCurrentClass();

      function setCurrentStage() {
        var stageId = $stateParams.stageId;
        var stage = null;
        if (stageId) {
          stage = vm.stages.filter(function (item) {
            return item._id === stageId;
          })[0];
          vm.currentStageId = stage._id;
          vm.modules = currentModules = stage && stage.modules;
        }
      }

      setCurrentStage();

      vm.onClickOrderBy = function (by) {
        vm.currentOrder = vm.currentOrder !== by ? by : '-' + by;
      };

      vm.onClickUpsertClass = function (e, classTmp) {
        e.preventDefault();

        ModalSrv.open({
          url: 'modules/classes/views/class.upsert.view.html',
          params: {
            classTmp: classTmp || {}
          },
          confirm: function (params) {
            if (params.classTmp && params.classTmp.name) {
              ClassesSrv.upsert({
                class: params.classTmp
              }).then(function (data) {
                NotificationsSrv.success();
                if (!params.classTmp._id) {
                  vm.classes.push(data.data);
                }
              }, function (err) {
                NotificationsSrv.error();
                console.debug(err);
              });
            }
          }
        });
      };

      vm.onClickUpsertStage = function (e, stageTmp) {
        e.preventDefault();
        ModalSrv.open({
          url: 'modules/classes/views/stage.upsert.view.html',
          params: {
            stageTmp: angular.extend(stageTmp || {}, {
              class: vm.currentClassId
            })
          },
          confirm: function (params) {
            if (params.stageTmp && params.stageTmp.name) {
              StagesSrv.upsert({
                stage: params.stageTmp
              }).then(function (data) {
                NotificationsSrv.success();
                if (!params.stageTmp._id) {
                  vm.stages.push(data.data);
                }
              }, function (err) {
                NotificationsSrv.error();
                console.debug(err);
              });
            }
          }
        });
      };

      vm.onClickUpsertModule = function (e, moduleTmp) {
        e.preventDefault();

        ModalSrv.open({
          url: 'modules/classes/views/module.upsert.view.html',
          params: {
            moduleTmp: angular.extend(moduleTmp || {}, {
              class: vm.currentClassId,
              stage: vm.currentStageId
            })
          },
          confirm: function (params) {
            if (params.moduleTmp && params.moduleTmp.name) {
              ModulesSrv.upsert({
                module: params.moduleTmp
              }).then(function (data) {
                NotificationsSrv.success();
                if (!params.moduleTmp._id) {
                  vm.modules.push(data.data);
                }
              }, function (err) {
                NotificationsSrv.error();
                console.debug(err);
              });
            }
          }
        });
      };

      vm.onClickShowStages = function (e, classItem) {
        e.stopPropagation();
        e.preventDefault();
        vm.currentClassId = classItem._id;
        vm.stages = currentStages = classItem && classItem.stages;
        $state.go('classes-stages', {
          classId: vm.currentClassId
        }, {
          notify: false
        });
      };

      vm.onClickShowModules = function (e, stage) {
        e.stopPropagation();
        e.preventDefault();
        vm.currentStageId = stage._id;
        currentModules = stage && stage.modules;

        // if ($rootScope.PERMISSIONS.student && !isPrevStageComplete(stage._id)) {
        //   NotificationsSrv.error({
        //     msg: 'Tenes que completar la clase anterior!'
        //   });
        //   return;
        // }

        if ($rootScope.PERMISSIONS.student && !stage.enableBySchedule) {
          var date = new Date(stage.from);
          NotificationsSrv.error({
            msg: 'La clase estara disponible el dia ' + date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()
          });
          return false;
        }

        $state.go('classes-stages-modules', {
          classId: vm.currentClassId,
          stageId: vm.currentStageId
        }, {
          notify: false
        });

        vm.modules = currentModules;
        return currentModules;
      };

      function isPrevStageComplete(id, collection) {
        var items = currentStages || collection,
          item = null,
          i = 0,
          l = items && items.length;

        for (i; i < l; i++) {
          item = items[i];
          if (item._id === id) {
            if ((items[i - 1] && items[i - 1].progress >= 100) || item.progress) {
              return true;
            } else if (!items[i - 1]) {
              return true;
            }
            return false;
          }
        }
        return false;
      }

      vm.onClickEditModule = function (e, id) {
        e.stopPropagation();
        e.preventDefault();
        $state.go('module', {
          classId: vm.currentClassId,
          stageId: vm.currentStageId,
          moduleId: id
        });
      };

      vm.onClickRemove = function (e, id) {
        e.preventDefault();
        e.stopPropagation();

        var findAndRemove = function (id) {
          var items = vm.classes,
            item = null,
            i = 0,
            l = items ? items.length : 0;

          for (i = l - 1; i >= 0; i--) {
            item = items[i];
            if (item._id === id) {
              items.splice(i, 1);
            }
          }
        };

        ModalSrv.open({
          url: '/modules/classes/views/class.remove.view.html',
          confirm: function () {
            ClassesSrv.delete({
              id: id
            }).then(function () {
              NotificationsSrv.removed();
              findAndRemove(id);
            }, function (err) {
              NotificationsSrv.error();
              console.debug(err);
            });
          }
        });
      };

      vm.onClickRemoveStage = function (e, id) {
        e.preventDefault();
        e.stopPropagation();

        var findAndRemove = function (id) {
          var items = vm.stages,
            item = null,
            i = 0,
            l = items ? items.length : 0;

          for (i = l - 1; i >= 0; i--) {
            item = items[i];
            if (item._id === id) {
              items.splice(i, 1);
            }
          }
        };

        ModalSrv.open({
          url: '/modules/classes/views/stage.remove.view.html',
          confirm: function () {
            StagesSrv.delete({
              id: id
            }).then(function () {
              NotificationsSrv.removed();
              findAndRemove(id);
            }, function (err) {
              NotificationsSrv.error();
              console.debug(err);
            });
          }
        });
      };

      vm.onClickRemoveModule = function (e, id) {
        e.preventDefault();
        e.stopPropagation();

        var findAndRemove = function (id) {
          var items = vm.modules,
            item = null,
            i = 0,
            l = items ? items.length : 0;

          for (i = l - 1; i >= 0; i--) {
            item = items[i];
            if (item._id === id) {
              items.splice(i, 1);
            }
          }
        };

        ModalSrv.open({
          url: '/modules/classes/views/module.remove.view.html',
          confirm: function () {
            ModulesSrv.delete({
              id: id
            }).then(function () {
              NotificationsSrv.removed();
              findAndRemove(id);
            }, function (err) {
              NotificationsSrv.error();
              console.debug(err);
            });
          }
        });
      };
    }
  ]);
