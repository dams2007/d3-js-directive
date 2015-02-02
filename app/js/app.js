'use strict';

goog.require('scrollAnimation.mainController');
goog.require('scrollAnimation.d3ChartDirective');



/**
 * Main app.
 */

angular.module('app', [])
  .controller('homeController', scrollAnimation.mainController)
  .directive('d3chart', scrollAnimation.d3ChartDirective)