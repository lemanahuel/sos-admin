'use strict';

angular
  .module('profiles')
  .controller('ProfileStepController', ['User', 'UsersSrv', 'ModalSrv', '$state', '$scope', 'NotificationsSrv', '$rootScope',
    function (User, UsersSrv, ModalSrv, $state, $scope, NotificationsSrv, $rootScope) {
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
      vm.schooling = ['Abogacía', 'Accidentología Vial', 'Acompañante Terapéutico', 'Actividad física y deportiva', 'Actor de Teatro', ' cine y TV', 'Actor y Director de Artes Escénicas', 'Actuación', 'Actuario', 'Acuicultura', 'Administración', 'Administración Aduanera - Despachante de Aduana', 'Administración Aeronáutica', 'Administración Agropecuaria', 'Administración Ambiental', 'Administración Bancaria', 'Administración de Agencias de Viajes y Turismo', 'Agente de Viajes y Turismo', 'Administración de Bienes Culturales', 'Administración de Recursos Humanos', 'Administración de Salud', 'Administración y Sistemas', 'Artes Electrónicas', 'Biodiversidad', 'Bioinformática', 'Bioingeniería', 'Administración de Servicios de Salud', 'Administración Hotelera', 'Agrimensura', 'Agronomía ', 'Análisis de sistemas', 'Antropología', 'Archivología', 'Arquitectura', 'Arte Dramático (Teatro)', 'Artes Audiovisuales', 'Artes Electrónicas', 'Artes Plásticas', 'Artes y Ciencias del Teatro', 'Asesor - Asesoramiento en Imagen', 'Asesor en Imagen Corporativa', 'Asistente en Administración Hotelera', 'Asistente en Ceremonial y Organización', 'Astronomía', 'Aviación', 'Azafata', 'Bellas Artes', 'Bibliotecología', 'Bibliotecología y Ciencias de la Información', 'Bioinformática', 'Bioingeniería', 'Bioquímica', 'Biotecnología', 'Bioterio', 'Bromatología', 'Calígrafo público ', 'Ciencia Política', 'Ciencias Ambientales', 'Canto', 'Chef Internacional', 'Ciencia y Tecnología de los Alimentos', 'Ciencias Ambientales', 'Ciencias del Gobierno', 'Composición con Medios Electroacústicos', 'Creatividad Educativa ', 'Criminalística', 'Ciencias Antropológicas', 'Ciencias biológicas', 'Ciencias de la Atmósfera', 'Ciencias de la Computación', 'Ciencias de la Comunicación', 'Ciencias de la Educación', 'Ciencias Físicas', 'Ciencias Geológicas', 'Ciencias Matemáticas', 'Ciencias Políticas', 'Ciencias Químicas', 'Ciencias Veterinarias', 'Cine - Dirección Cinematográfica', 'Cocinero', 'Comercio Internacional', 'Comisarios de a Bordo y Azafata', 'Compaginación Cinematográfica', 'Comunicación Publicitaria', 'Contador Público', 'Cosmetología', ' Cosmiatría y Estética', 'Counseling', 'Crítica Cinematográfica', 'Danza', 'Dermatocosmiatría', 'Despachante de Aeronaves', 'Diagnóstico por Imágenes', 'Dibujante asistido por Computadora', 'Diseño Asistido', 'Dirección de cine', 'Dirección de Fotografía', 'Dirección Teatral', 'Diseño Asistido', 'Diseño de Animaciones y Dibujos Animados', 'Diseño de Espectáculos', 'Diseño de Historietas', 'Diseño de Imagen Empresaria', 'Diseño de Imagen y Sonido ', 'Diseño de Indumentaria y Textil', 'Diseño de Indumentaria con Tecnología Digital aplicada', 'Diseño de Información', 'Diseño de Interiores - Decorador de Interiores', 'Diseño de Interiores y Equipamiento', 'Diseño de Joyas', 'Diseño de Mobiliario', 'Diseño de Modas', 'Diseño de Packaging', 'Diseño de Parques y Jardines', 'Diseño de Productos', ' Orientación Indumentaria', 'Diseño de Sitios Web', 'Diseño del Espacio Escénico', 'Diseño del Paisaje', 'Diseño en Animación y Efectos Visuales', 'Diseño en Comunicación Visual', 'Diseño Escenográfico', 'Diseño Fotográfico', 'Diseño Gráfico', 'Diseño Gráfico Multimedial', 'Diseño Gráfico Publicitario', 'Diseño Industrial', 'Diseño Informático Editorial', 'Diseño Multimedial', 'Diseño Textil e Indumentaria', 'Ecología Urbana', 'Enología y Viticultura ', 'Estadística', 'Estudios Orientales', 'Genética', 'Diseño Web', 'Diseño y Programación de Simuladores Virtuales', 'Ecología', 'Economía y Administración de la Pequeña y Mediana Empresa', 'Economía', 'Economía y Administración Agraria', 'Edición', 'Enfermería ', 'Farmacia ', 'Filosofía', 'Enfermero Universitario', 'Floricultura', 'Fonoaudiología', 'Fotografía', 'Gastronomía ', 'Geografía', 'Gestión Cultural y Emprendimientos Culturales', 'Gestión de Agroalimentos', 'Gestión y Administración Municipal', 'Grafología', 'Guionista cinematográfico', 'Guionista Cinematográfico', 'Guionista de Radio y TV', 'Hemoterapia', 'Historia', 'Humanística y Ceremonial', 'Iluminación Cinematográfica', 'Iluminación y Cámara Cinematográficas', 'Ingeniería Civil', 'Ingeniería de Alimentos ', 'Ingeniería Electricista ', 'Ingeniería Electrónica ', 'Ingeniería en Agrimensura ', 'Ingeniería en Informática', 'Ingeniería en Alimentos ', 'Ingeniería en Automatización y Control Industrial', 'Ingeniería en Ecología', 'Ingeniería en Materiales', 'Ingeniería en Seguridad e Higiene en el Trabajo', 'Ingeniería Zootecnista', 'Martillero y Corredor Público', 'Oceanografía', 'Organización de la Producción', 'Ingeniería en Ecología', 'Ingeniería Mecánica', 'Ingeniería Naval y Mecánica ', 'Ingeniería Química ', 'Kinesiología y Fisiatría ', 'Letras', 'Instrumentación Quirúrgica', 'Jardinería', 'Locutor Integral de Radio y TV', 'Manejo de Áreas Protegidas', 'Martillero y Corredor Público Rural', 'Medicina', 'Meteorólogo', 'Musicoterapia', 'Nutrición', 'Observador Meteorológico', 'Obstetricia', 'Oceanografía', 'Odontología', 'Operador Técnico de Estudio y Planta Transmisora de Radiodifusión', 'Óptico Técnico', 'Organización de Eventos', 'Paleontología', 'Periodismo y Comunicación', 'Piloto Privado y Comercial de Avión', 'Podólogo Universitario', 'Producción de Bioimágenes', 'Producción Vegetal', 'Psicomotricidad', 'Relaciones Laborales - Recursos Humanos', 'Salud Ambiental', 'Seguridad Ciudadana', 'Producción Vegetal Orgánica', 'Producción y Dirección de Radio y TV', 'Producción de Medios Audiovisuales', ' Eventos y Espectáculos', 'Producción y Dirección de Televisión', ' Cine y Radio', 'Profesorado en Artes Plásticas', 'Profesorado en Ciencias Económicas', 'Profesorado en Comunicación Social', 'Profesorado en Portugués', 'Programador de Sistemas', 'Psicología  ', 'Psicología Social', 'Psicomotricidad', 'Psicopedagogía', 'Publicidad', 'Relaciones del Trabajo', 'Salud Ambiental', 'Seguridad Vial y Transporte', 'Tecnología Educativa', 'Sistemas de Información de las Organizaciones', 'Sociología', 'Teatro', 'Tecnicatura Universitaria en Web', 'Tecnología en Alimentos', 'Terapia Ocupacional', 'Trabajo Social', 'Traductorado Público', 'Tripulante de Cabina de Pasajeros', 'Turismo', 'Vestuarista', 'Visitador Medico - Agente de Propaganda medica', 'Web', 'Yoga'];

      vm.stepOne = true;
      vm.stepTwo = false;
      vm.stepThree = false;
      vm.stepFour = false;

      vm.toStepTwo = function (e) {
        e.preventDefault();
        vm.stepOne = false;
        vm.stepTwo = true;
        vm.stepThree = false;
        vm.stepFour = false;
      };

      vm.toStepThree = function (e, formProfile) {
        e.preventDefault();
        console.log(formProfile);
        //formProfile && formProfile.$setDirty();
        if (!formProfile || formProfile.$valid) {
          vm.stepOne = false;
          vm.stepTwo = false;
          vm.stepThree = true;
          vm.stepFour = false;
        } else {
          //Completar todos los campos
          NotificationsSrv.error({
            msg: 'Debe completar todos los campos.'
          });
        }
      };

      vm.toStepFour = function (form) {
        form.$setDirty();
        if (form.$valid) {
          vm.stepOne = false;
          vm.stepTwo = false;
          vm.stepThree = false;
          vm.stepFour = true;
        } else {
          //Completar todos los campos
          NotificationsSrv.error({
            msg: 'Debe completar todos los campos.'
          });
        }
      };

      function setCurrent(current) {
        vm.userTmp = current && current.data;
        vm.userTmp.profile = vm.userTmp.profile || {};
        console.log(vm.userTmp.profile);
        vm.userTmp.profile.bday = vm.userTmp.profile && vm.userTmp.profile.bday ? new Date(vm.userTmp.profile.bday).getTime() : vm.userTmp.profile.bday;

        if (!vm.userTmp.profile.avatar && $rootScope.AUTH_PROFILE.picture) {
          vm.userTmp.profile.avatar = $rootScope.AUTH_PROFILE.picture;
        }

        vm.isStudent = parseInt(vm.userTmp.role, 30) === 2;
      }

      setCurrent(User);

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
