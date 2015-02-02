goog.provide('scrollAnimation.d3ChartDirective');
goog.require('scrollAnimation.mainController');

/**
 * ...
 * @constructor
 * @ngInject
 * @export
 */
scrollAnimation.d3ChartDirective = function() {


  return {
    controller: scrollAnimation.mainController,
    restrict: 'A',
    controllerAs: 'homeCtrl',
    link: function(scope, element, attrs) {
      var elements = angular.element(document.querySelectorAll('[d3chart]'));
      for (var i = 0; i < elements.length; i++) {
        d3.select(element[i]);
        radialProgress(element[i], attrs.radius)
          .label(attrs.label)
          .diameter(attrs.diameter)
          .value(attrs.value)
          .render();
      };

      function radialProgress(parent, radius) {

        var _data = null,
          _duration = 1000,
          _selection,
          _margin = {
            top: 0,
            right: 0,
            bottom: 30,
            left: 0
          },
          __width = attrs.width,
          __height = attrs.height,
          _width = attrs.width,
          _height = attrs.height,
          _diameter,
          _label = "",
          _fontSize = 10,
          _radius = radius;

        var _mouseClick;

        var _value = 0,
          _minValue = 0,
          _maxValue = 100;

        var _currentArc = 0,
          _currentArc2 = 0,
          _currentValue = 0;

        var _arc = d3.svg.arc()
          .startAngle(0 * (Math.PI / 180)); //just radians

        _selection = d3.select(parent);


        function component() {

          _selection.each(function(data) {

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            var enter = svg.enter().append("svg").attr("class", "radial-svg").append("g");

            measure(_radius);

            svg.attr("width", __width)
              .attr("height", __height);


            var background = enter.append("g").attr("class", "component")

            _arc.endAngle(360 * (Math.PI / 180))

            background.append("rect")
              .attr("class", "background")
              .attr("width", _width)
              .attr("height", _height);

            background.append("path")
              .attr("transform", "translate(" + _width / 2 + "," + _width / 2 + ")")
              .attr("d", _arc);

            background.append("text")
              .attr("class", "label")
              .attr("transform", "translate(" + _width / 2 + "," + (_width + _fontSize) + ")")
              .text(_label);
            var g = svg.select("g")
              .attr("transform", "translate(" + _margin.left + "," + _margin.top + ")");


            _arc.endAngle(_currentArc);
            enter.append("g").attr("class", "arcs");
            var path = svg.select(".arcs").selectAll(".arc").data(data);
            path.enter().append("path")
              .attr("class", "arc")
              .attr("transform", "translate(" + _width / 2 + "," + _width / 2 + ")")
              .attr("d", _arc);

            enter.append("g").attr("class", "labels");
            var label = svg.select(".labels").selectAll(".label").data(data);
            label.enter().append("text")
              .attr("class", "label")
              .attr("y", _width / 2 + _fontSize / 3)
              .attr("x", _width / 2)
              .attr("width", _width)
              // .attr("x",(3*_fontSize/2))
              .text(function(d) {
                return Math.round((_value - _minValue) / (_maxValue - _minValue) * 100) + "%"
              })
              .style("font-size", _fontSize + "px")

            path.exit().transition().duration(500).attr("x", 1000).remove();

            layout(svg);

            function layout(svg) {

              var ratio = (_value - _minValue) / (_maxValue - _minValue);
              var endAngle = Math.min(360 * ratio, 360);
              endAngle = endAngle * Math.PI / 180;

              path.datum(endAngle);
              path.transition().duration(_duration)
                .attrTween("d", arcTween);

              label.datum(Math.round(ratio * 100));
              label.transition().duration(_duration)
                .tween("text", labelTween);

            }

          });

        }

        function labelTween(a) {
          var i = d3.interpolate(_currentValue, a);
          _currentValue = i(0);

          return function(t) {
            _currentValue = i(t);
            this.textContent = Math.round(i(t)) + "%";
          }
        }

        function arcTween(a) {
          var i = d3.interpolate(_currentArc, a);

          return function(t) {
            _currentArc = i(t);
            return _arc.endAngle(i(t))();
          };
        }

        function measure(_radius) {
          _width = _diameter - _margin.right - _margin.left - _margin.top - _margin.bottom;
          _height = _width;
          _fontSize = _width * .2;
          _arc.outerRadius(_width / 2);
          _arc.innerRadius(_width / 2 * _radius);
        }

        component.value = function(_) {
          if (!arguments.length) return _value;
          _value = [_];
          _selection.datum([_value]);
          return component;
        }


        component.margin = function(_) {
          if (!arguments.length) return _margin;
          _margin = _;
          return component;
        };

        component.diameter = function(_) {
          if (!arguments.length) return _diameter
          _diameter = _;
          return component;
        };

        component.minValue = function(_) {
          if (!arguments.length) return _minValue;
          _minValue = _;
          return component;
        };

        component.maxValue = function(_) {
          if (!arguments.length) return _maxValue;
          _maxValue = _;
          return component;
        };

        component.label = function(_) {
          if (!arguments.length) return _label;
          _label = _;
          return component;
        };

        component._duration = function(_) {
          if (!arguments.length) return _duration;
          _duration = _;
          return component;
        };

        component.render = function() {
          measure(_radius);
          component();
          return component;
        }


        return component;
      }
    }
  }
};