/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  /**
   * The `build_dir` folder is where our projects are compiled during
   * development and the `compile_dir` folder is where our app resides once it's
   * completely built.
   */
  build_dir: 'build',
  compile_dir: 'bin',
  storage_dir: 'src/storage',

  /**
   * This is a collection of file patterns that refer to our app code (the
   * stuff in `src/`). These file paths are used in the configuration of
   * build tasks. `js` is all project javascript, less tests. `ctpl` contains
   * our reusable components' (`src/common`) template HTML files, while
   * `atpl` contains the same, but for our app's code. `html` is just our
   * main HTML file, `less` is our main stylesheet, and `unit` contains our
   * app's unit tests.
   */
  app_files: {
    js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
    jsunit: [ 'src/**/*.spec.js' ],

    coffee: [ 'src/**/*.coffee', '!src/**/*.spec.coffee' ],
    coffeeunit: [ 'src/**/*.spec.coffee' ],

    atpl: [ 'src/app/**/*.tpl.html' ],
    ctpl: [ 'src/common/**/*.tpl.html' ],

    html: [ 'src/index.html' ],
    less: 'src/less/main.less'
  },

  /**
   * This is a collection of files used during testing only.
   */
  test_files: {
    js: [
      'vendor/angular-mocks/angular-mocks.js'
    ]
  },

  /**
   * This is the same as `app_files`, except it contains patterns that
   * reference vendor code (`vendor/`) that we need to place into the build
   * process somewhere. While the `app_files` property ensures all
   * standardized files are collected for compilation, it is the user's job
   * to ensure non-standardized (i.e. vendor-related) files are handled
   * appropriately in `vendor_files.js`.
   *
   * The `vendor_files.js` property holds files to be automatically
   * concatenated and minified with our project source files.
   *
   * The `vendor_files.css` property holds any CSS files to be automatically
   * included in our app.
   *
   * The `vendor_files.assets` property holds any assets to be copied along
   * with our app's assets. This structure is flattened, so it is not
   * recommended that you use wildcards.
   */
  vendor_files: {
    js: [
      'vendor/jquery/dist/jquery.min.js',
      'vendor/angular/angular.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-ui-utils/modules/route/route.js',
      'vendor/angular-resource/angular-resource.js',
      'vendor/angular-translate/angular-translate.js',
      'vendor/angular-translate-storage-local/angular-translate-storage-local.min.js',
      'vendor/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
      'vendor/angular-cookies/angular-cookies.min.js',
      'vendor/angular-tree-control/angular-tree-control.js',
      'vendor/angular-ui-select/dist/select.js',
      'vendor/angular-sanitize/angular-sanitize.js',
      'vendor/angular-bootstrap-contextmenu/contextMenu.js',
      'vendor/angular-bootstrap-show-errors/src/showErrors.js',
      'vendor/angular-animate/angular-animate.js',
      'vendor/angular-file-upload/dist/angular-file-upload.js',
      'vendor/angular-touch/angular-touch.js',
      'vendor/angular-loading-bar/build/loading-bar.js',
      'vendor/angular-easyfb/build/angular-easyfb.min.js',
      'vendor/ng-tags-input/ng-tags-input.js',
      'vendor/ng-context-menu/dist/ng-context-menu.js',
      'vendor/moment/min/moment.min.js',
      'vendor/angular-moment/angular-moment.min.js',
      'vendor/angular-growl-v2/build/angular-growl.min.js',
      'vendor/angular-confirm-modal/angular-confirm.min.js',
      'vendor/satellizer/satellizer.min.js'
    ],
    css: [
      'vendor/angular-tree-control/css/tree-control.css',
      'vendor/angular-tree-control/css/tree-control-attribute.css',
      'vendor/angular-ui-select/dist/select.css',
      'vendor/angular-loading-bar/build/loading-bar.css',
      'vendor/ng-tags-input/ng-tags-input.css',
      'vendor/ng-tags-input/ng-tags-input.bootstrap.css',
      'vendor/angular-growl-v2/build/angular-growl.min.css',
      'vendor/bootstrap-social/bootstrap-social.css',
      'vendor/angular-file-upload/dist/angular-file-upload.js.map',
      'vendor/jquery/dist/jquery.min.map',
      'vendor/angular-cookies/angular-cookies.min.js.map',
      'vendor/angular-moment/angular-moment.min.js.map'
    ],
    assets: [
    ],
    images:[
      'src/images/*.*',
      'vendor/angular-tree-control/images/*.*'
    ],
    fonts:[
      'vendor/bootstrap/dist/fonts/*.*'
    ]
  }
};
