'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    // get packge info
    pkg: grunt.file.readJSON('package.json'),

    // app
    app: 'app/js/app.js',

    // get all components
    components: grunt.file.expand(
      'app/components/**/*.js'
    ).join(' '),
    // run shell scripts
    shell: {

      // create app.min.js
      min: {
        command: 'java -jar closure/compiler.jar ' +
          '--compilation_level SIMPLE_OPTIMIZATIONS ' +
          // '--formatting PRETTY_PRINT ' +
          '--language_in ECMASCRIPT5_STRICT ' +
          '--angular_pass ' + // inject dependencies automatically
          '--externs closure/externs/angular.js ' + // angular.d -> angular.module
          '--generate_exports ' + // keep @export notated code
          '--manage_closure_dependencies ' +
          '--js closure/library/base.js ' + // don't add 'goog.' stuff to script
          '--js <%= app %> ' +
          '--js <%= components %> ' +
          '--js_output_file app/js/app.min.js'
      }
    },

  });

  grunt.loadNpmTasks('grunt-shell'); //npm install --save-dev grunt-shell
  grunt.registerTask('default', ['shell:min']);
};