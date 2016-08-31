'use strict';

angular
  .module('modules')
  .controller('ModuleController', ['Class', 'Stage', 'Module', 'Modules', 'Tp', 'UserHistory', 'Camada', 'ModulesSrv', 'UsersHistorySrv', 'TpsSrv', 'ModalSrv', '$state', '$rootScope', '$timeout', 'NotificationsSrv',
    function (Class, Stage, Module, Modules, Tp, UserHistory, Camada, ModulesSrv, UsersHistorySrv, TpsSrv, ModalSrv, $state, $rootScope, $timeout, NotificationsSrv) {
      var vm = this;
      var $simplemde = null,
        dragOptions = {
          accept: function (sourceItemHandleScope, destSortableScope) {
            return $rootScope.PERMISSIONS.admin || $rootScope.PERMISSIONS.teacher;
          },
          containment: '.table', //optional param
          placeholder: '<tr><td></td> <td></td> <td></td> <td></td> <td></td></tr>',
          containerPositioning: 'relative'
        };

      vm.class = Class && Class.data;
      vm.stage = Stage && Stage.data;
      vm.modules = Modules && Modules.data;
      vm.userHistory = UserHistory && UserHistory.data;
      vm.tpTmp = Tp && Tp.data && Tp.data.tp || {};

      var camadas = Camada && Camada.data;

      function setEditorByLevel() {
        vm.EditorCodemirror = false;

        var mapLevelEditor = ['5732200406eb0f4e0f5c1cd6',
          '5732200506eb0f4e0f5c1cd9',
          '5732200506eb0f4e0f5c1cdb',
          '5732200506eb0f4e0f5c1cdc',
          '5732200506eb0f4e0f5c1cd8',
          '5732200506eb0f4e0f5c1ce1'
        ];

        for (var i = 0; i < camadas.length; i++) {
          vm.EditorCodemirror = (camadas[i] && camadas[i].course && camadas[i].course && mapLevelEditor.indexOf(camadas[i].course.level) !== -1);
          if (vm.EditorCodemirror) {
            i = camadas.length;
          }
        }
      }

      setEditorByLevel();

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

      function setCurrent(current) {
        vm.moduleTmp = current && current.data && current.data._id ? current.data : {};
        vm.moduleTmp.class = vm.class._id;
        vm.moduleTmp.stage = vm.stage._id;
        console.log(vm.moduleTmp);
      }

      setCurrent(Module);

      vm.disabledSave = true;
      var instanceCM = {};

      function setEditor() {
        var editorOptions = {
          lineNumbers: true,
          theme: 'monokai',
          lineWrapping: true,
          autofocus: true
        };
        vm.editorOptionsForLenguaje = {
          markdown: angular.extend({}, editorOptions, {
            mode: 'markdown'
          }),
          html: angular.extend({}, editorOptions, {
            mode: 'htmlmixed'
          }),
          css: angular.extend({}, editorOptions, {
            mode: 'css'
          }),
          javascript: angular.extend({}, editorOptions, {
            mode: 'javascript'
          })
        };
        /*$simplemde = new SimpleMDE({
          element: document.getElementById('simplemde'),
          autoDownloadFontAwesome: false,
          indentWithTabs: false,
          spellChecker: false,
          status: false,
          toolbarTips: false,
          placeholder: '...',
          toolbar: ['bold', 'italic', 'heading', 'heading-smaller', 'heading-bigger', 'horizontal-rule', '|', 'quote', 'code', 'unordered-list', 'ordered-list', '|', 'preview', 'guide']
        });

        $simplemde.value(vm.moduleTmp.text);

        if ($rootScope.PERMISSIONS.student) {
          var $editorToolbar = document.querySelector('.editor-toolbar');
          angular.element($editorToolbar.querySelector('.fa.fa-eye'))[0].click();
          angular.element($editorToolbar)[0].remove();
        }*/
      }
      setEditor();

      vm.currentUserHistory = {};

      function setHistory() {
        if (!$rootScope.PERMISSIONS.student && !$rootScope.PERMISSIONS.teacher) {
          return;
        }

        var exists = false,
          items = vm.userHistory,
          item = null,
          i = 0,
          l = items && items.length;

        for (i; i < l; i++) {
          item = items[i];
          if (item.module && item.module._id === vm.moduleTmp._id) {
            exists = true;
            vm.currentUserHistory = item;
          }

          angular.forEach(vm.modules, function (moduleItem) {
            if (item.module && item.module._id === moduleItem._id) {
              moduleItem.completed = true;
            }
          });
        }

        if (!exists) {
          UsersHistorySrv.upsert({
            history: {
              class: vm.class._id,
              module: vm.moduleTmp._id,
              user: $rootScope.USER._id
            }
          }).then(function (history) {
            vm.currentUserHistory = history.data || history;
            setCurrentCodemirror();
          }, function (err) {
            NotificationsSrv.error();
            console.debug(err);
          });
        } else {
          setCurrentCodemirror();
        }
      }

      function setCurrentCodemirror() {
        if (vm.EditorCodemirror && !vm.currentUserHistory.codemirror || (vm.currentUserHistory.codemirror && !vm.currentUserHistory.codemirror.length)) {
          vm.currentUserHistory.codemirror = [{
            mode: 'html',
            file: 'index',
            code: '<html>\n  <head>\n    <title>Example</title>\n  </head>\n  <body>\n    <h1>Example</h1>\n  </body>\n<html>'
          }, {
            mode: 'css',
            file: 'style',
            code: ''
          }, {
            mode: 'javascript',
            file: 'index',
            code: ''
          }];
          //vm.setContentIframe();
        }
      }

      vm.codemirrorLoaded = function (_editor) {
        // Editor part
        var _doc = _editor.getDoc();
        _editor.on('change', function () {
          vm.disabledSave = false;
        });

        instanceCM[_editor.options.mode] = _editor;
        if (_editor.options.mode == 'html') {
          var wrapper = angular.element(_editor.display.wrapper).parent().parent().parent().parent();
        }
      };

      vm.tabSelected = function (mode) {
        instanceCM[mode === 'html' ? 'htmlmixed' : mode].focus();
      };

      vm.setContentIframe = function () {
        if (vm.currentUserHistory && vm.currentUserHistory.codemirror) { //TODO hotfix
          var $elem = document.getElementById('iframe-view');
          var html = vm.currentUserHistory.codemirror[0].code; //obviously, this line can be omitted - just assign your string to the name strVal or put your string var in the pattern.exec call below
          //HEAD
          var pattern = /<head[^>]*>((.|[\n\r])*)<\/head>/im;
          var array_matches = pattern.exec(html);
          if (array_matches[1]) {
            $elem.contentDocument.getElementsByTagName('head')[0].innerHTML = array_matches[1];
          }
          //BODY
          pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
          array_matches = pattern.exec(html);

          if (array_matches[1]) {
            $elem.contentDocument.getElementsByTagName('body')[0].innerHTML = array_matches[1];
          }
          //CSS
          if (vm.currentUserHistory.codemirror[1].code.length) {
            var style = document.createElement('style');
            style.innerHTML = vm.currentUserHistory.codemirror[1].code;
            $elem.contentDocument.getElementsByTagName('body')[0].appendChild(style);
          }
          //JAVASCRIPT
          if (vm.currentUserHistory.codemirror[2].code.length) {
            var script = document.createElement('script');
            script.innerHTML = vm.currentUserHistory.codemirror[2].code;
            $elem.contentDocument.getElementsByTagName('body')[0].appendChild(script);
          }
        }
      };

      vm.CodemirrorRefresh = function (nameInstance) {
        nameInstance = nameInstance === 'html' ? 'htmlmixed' : nameInstance;
        if (instanceCM[nameInstance]) {
          instanceCM[nameInstance].refresh();
        }
      };

      setHistory();
      console.log(vm.currentUserHistory);

      function getStage(cb) {
        var items = vm.class.stages,
          item = null,
          i = 0,
          l = items && items.length;

        for (i; i < l; i++) {
          if (vm.stage._id === items[i]._id) {
            cb(i, items);
            return;
          }
        }
      }

      vm.onClickPrevStage = function () {
        getStage(function (i, items) {
          var stage = items[i - 1];
          if (stage) {
            goToStage(stage);
            return;
          }
        });
      };

      vm.onClickNextStage = function () {
        getStage(function (i, items) {
          var stage = items[i + 1];
          if (stage) {
            goToStage(stage);
            return;
          }
        });
      };

      function setPrevAndNextBtnStage() {
        getStage(function (i, items) {
          if (items[i + 1]) {
            vm.hideBtnNextStage = true;
          }
          if (items[i - 1]) {
            vm.hideBtnPrevStage = true;
          }
        });
      }

      setPrevAndNextBtnStage();

      function getModule(cb) {
        var items = vm.modules,
          item = null,
          i = 0,
          l = items && items.length;

        for (i; i < l; i++) {
          if (vm.moduleTmp._id === items[i]._id) {
            cb(i, items);
            return;
          }
        }
      }

      function setPrevAndNextBtnModule() {
        getModule(function (i, items) {
          if (!items[i + 1]) {
            vm.hideBtnNextModule = true;
          }
          if (!items[i - 1]) {
            vm.hideBtnPrevModule = true;
          }
        });
      }

      setPrevAndNextBtnModule();

      vm.onClickPrevModule = function () {
        getModule(function (i, items) {
          goToModule(items[i - 1]._id);
        });
      };

      vm.onClickNextModule = function () {
        getModule(function (i, items) {
          if (items[i + 1]) {
            goToModule(items[i + 1]._id);
            return;
          }
        });
      };

      function goToStage(stage) {
        $state.go('module', {
          classId: vm.class._id,
          stageId: stage._id,
          moduleId: stage.modules[0]._id
        });
      }

      function goToModule(id) {
        $state.go('module', {
          classId: vm.class._id,
          stageId: vm.stage._id,
          moduleId: id
        });
      }

      vm.onClickEdit = function (e, id) {
        e.stopPropagation();
        e.preventDefault();
        goToModule(id);
      };

      vm.onClickRemove = function () {
        ModalSrv.open({
          url: 'modules/modules/views/module.remove.view.html',
          confirm: function () {
            ModulesSrv.delete({
              _id: vm.moduleTmp._id
            }).then(function () {
              NotificationsSrv.removed();
              $state.go('modules');
            }, function (err) {
              NotificationsSrv.error();
              console.debug(err);
            });
          }
        });
      };

      vm.onSubmit = function () {
        //vm.moduleTmp.text = $simplemde.value();

        ModulesSrv.upsert({
          module: vm.moduleTmp
        }).then(function (module) {
          if (!vm.moduleTmp._id) {
            NotificationsSrv.success();
            $state.go('module', {
              classId: vm.moduleTmp.class._id,
              stageId: vm.moduleTmp.stage._id,
              moduleId: module.data._id
            });
          } else {
            NotificationsSrv.updated();
            setCurrent(module);
          }
        }, function (err) {
          NotificationsSrv.error();
          console.debug(err);
        });
      };

      vm.onSubmitTp = function () {
        vm.tpTmp = vm.tpTmp || {};
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);

        var tp = {
          url: vm.tpTmp.url,
          camada: vm.tpTmp.camada,
          module: vm.moduleTmp,
          user: vm.tpTmp.user || $rootScope.USER._id
        };

        if (vm.tpTmp._id) {
          tp._id = vm.tpTmp._id;
        }

        if (vm.tpTmp.url && vm.tpTmp.url.match(regex) && vm.tpTmp.url.length) {
          TpsSrv.upsert({
            tp: tp
          }).then(function (tp) {
            NotificationsSrv.success();
            //setCurrent(module);
            vm.tpTmp = tp.data;
            //vm.onClickShowFeedback();
          }, function (err) {
            NotificationsSrv.error();
            console.debug(err);
          });
        } else {
          NotificationsSrv.error({
            msg: 'La ruta al TP no es valida'
          });
        }
      };

      vm.saveCodemirror = function () {
        UsersHistorySrv.update({
          history: vm.currentUserHistory
        }).then(function (history) {
          vm.disabledSave = true;
          vm.setContentIframe();
        }, function (err) {
          NotificationsSrv.error();
          console.debug(err);
        });
      };

      if (vm.EditorCodemirror) {
        $timeout(function () {
          var wrapper = document.getElementById('tabsCodemirror');
          wrapper.children[0].children[0].children[0].click();
          vm.CodemirrorRefresh('htmlmixed');
        });
      }
    }
  ]);
