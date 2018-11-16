"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Poison = exports.Food = exports.Animator = exports.VLine = exports.Axis = exports.Player = exports.Ball = exports.Obstacle = exports.Movable = exports.CompositeDrawable = exports.Drawable = exports.Vector2D = exports.Point2D = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('./RoughCanvas.ts'),
    RoughCanvas = _require.RoughCanvas,
    Drawing = _require.Drawing;

var Point2D =
/*#__PURE__*/
function () {
  // Point
  function Point2D(x, y) {
    _classCallCheck(this, Point2D);

    _defineProperty(this, "x", void 0);

    _defineProperty(this, "y", void 0);

    this.x = x;
    this.y = y;
  }

  _createClass(Point2D, [{
    key: "add",
    value: function add(v) {
      return new Point2D(v.mx + this.x, v.my + this.y);
    }
  }]);

  return Point2D;
}();

exports.Point2D = Point2D;

var Vector2D =
/*#__PURE__*/
function () {
  function Vector2D(vect, vecty) {
    _classCallCheck(this, Vector2D);

    _defineProperty(this, "mx", void 0);

    _defineProperty(this, "my", void 0);

    _defineProperty(this, "angle", void 0);

    _defineProperty(this, "magnitude", void 0);

    if (vect.hasOwnProperty('angle')) {
      this.angle = vect.angle;
      this.magnitude = vect.magnitude;
      this.mx = Math.cos(vect.angle) * vect.magnitude;
      this.my = Math.sin(vect.angle) * vect.magnitude;
    } else {
      if (typeof vect === 'number') {
        vect = {
          mx: vect,
          my: vecty
        };
      }

      this.angle = Math.atan2(vect.my, vect.mx);
      this.magnitude = Math.sqrt(Math.pow(vect.mx, 2) + Math.pow(vect.my, 2));
      this.mx = vect.mx;
      this.my = vect.my;
    }
  }

  _createClass(Vector2D, [{
    key: "toString",
    value: function toString() {
      return "[".concat(this.mx, ",").concat(this.my, "/").concat(this.angle * 180 / Math.PI, "\xB0,").concat(this.magnitude, "\u2192]");
    }
  }, {
    key: "valueOf",
    value: function valueOf() {
      return "[".concat(this.mx, ",").concat(this.my, "/").concat(this.angle * 180 / Math.PI, "\xB0,").concat(this.magnitude, "\u2192]");
    }
    /**
     * Add the ivector with another.
     * @param v Vector to add
     */

  }, {
    key: "add",
    value: function add(v) {
      if (typeof v === 'number') {
        return new Vector2D(this.mx + v, this.my + v);
      }

      if (v instanceof Point2D) {
        return new Vector2D({
          mx: this.mx + v.x,
          my: this.my + v.y
        });
      }

      return new Vector2D({
        mx: this.mx + v.mx,
        my: this.my + v.my
      });
    }
    /**
     * Subtract the vector with another.
     * @param v Vector to subtract
     */

  }, {
    key: "sub",
    value: function sub(v) {
      if (typeof v === 'number') {
        return new Vector2D(this.mx - v, this.my - v);
      }

      if (v instanceof Point2D) {
        return new Vector2D({
          mx: this.mx - v.x,
          my: this.my - v.y
        });
      }

      return new Vector2D({
        mx: this.mx - v.mx,
        my: this.my - v.my
      });
    }
    /**
     * Scale the vector
     * @param scale Amount to scale the vector
     */

  }, {
    key: "scale",
    value: function scale(_scale) {
      return new Vector2D({
        angle: this.angle,
        magnitude: this.magnitude * _scale
      });
    }
  }, {
    key: "rotate",
    value: function rotate(angle) {
      var mx = this.mx;
      var c = Math.cos(angle);
      var s = Math.sin(angle);
      return new Vector2D(c * this.mx - s * this.my, s * mx + c * this.my);
    }
    /**
     * Multiply vector with another vector.
     * @param v Vector to multiply with
     */

  }, {
    key: "mult",
    value: function mult(v) {
      if (typeof v === 'number') {
        return new Vector2D(this.mx * v, this.my * v);
      }

      if (v instanceof Point2D) {
        v = new Vector2D(v.x, v.y);
      }

      return new Vector2D({
        mx: v.mx * this.mx,
        my: v.my * this.my
      });
    }
    /**
     * Divide vector with another vector.
     * @param v Vector to multiply with
     */

  }, {
    key: "div",
    value: function div(v) {
      if (typeof v === 'number') {
        return new Vector2D(this.mx / v, this.my / v);
      }

      if (v instanceof Point2D) {
        return new Vector2D(this.mx / v.x, this.my / v.y);
      } // return new Vector2D({angle:this.angle,magnitude:this.magnitude/v.magnitude});


      return new Vector2D({
        mx: v.mx / this.mx,
        my: v.my / this.my
      });
    }
    /**
     * Get a normalized version of the vector. (Magnatude of 1)
     */

  }, {
    key: "normalize",
    value: function normalize() {
      return this.magnitude > 0 ? this.div(this.magnitude) : this;
    }
  }, {
    key: "limit",
    value: function limit(magnitude) {
      if (this.magnitude > magnitude) {
        return this.normalize().mult(magnitude);
      }

      return this;
    }
  }, {
    key: "angleBetween",
    value: function angleBetween(v) {
      return Math.acos(this.dot(v) / Math.sqrt(this.magnitude * this.magnitude * v.magnitude * this.magnitude));
    }
  }, {
    key: "dist",
    value: function dist(v) {
      var dx = Math.pow(this.mx - v.mx, 2);
      var dy = Math.pow(this.my - v.my, 2);
      return Math.sqrt(dx + dy);
    }
  }, {
    key: "dot",
    value: function dot(v) {
      return this.mx * v.mx + this.my * v.my;
    }
  }, {
    key: "lerp",
    value: function lerp(v, my, amt) {
      var _v;

      var lerpVal = function lerpVal(start, stop, amt) {
        return start + (stop - start) * amt;
      };

      var mx = v;
      v instanceof Vector2D && (amt = my, (_v = v, mx = _v.mx, my = _v.my, _v));
      return new Vector2D(lerpVal(this.mx, mx, amt), lerpVal(this.my, my, amt));
    }
  }]);

  return Vector2D;
}();

exports.Vector2D = Vector2D;

var Drawable =
/*#__PURE__*/
function () {
  function Drawable() {
    _classCallCheck(this, Drawable);

    _defineProperty(this, "surface", void 0);

    _defineProperty(this, "drawing", void 0);

    _defineProperty(this, "offset", new Point2D(0, 0));
  }

  _createClass(Drawable, [{
    key: "draw",

    /**
     * Default function for draw.
     * Most extenders should call this (as super)
     */
    value: function draw(surface) {
      !this.drawing && this.refresh(surface);
      surface.ctx.save();
      surface.ctx.translate(this.offset.x, this.offset.y);
      surface.draw(this.drawing);
      surface.ctx.restore();
    }
  }]);

  return Drawable;
}();

exports.Drawable = Drawable;

var CompositeDrawable =
/*#__PURE__*/
function (_Drawable) {
  _inherits(CompositeDrawable, _Drawable);

  function CompositeDrawable() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, CompositeDrawable);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CompositeDrawable)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "drawings", null);

    return _this;
  }

  _createClass(CompositeDrawable, [{
    key: "draw",
    value: function draw(surface) {
      !this.drawings && this.refresh(surface);
      this.drawings.forEach(surface.draw.bind(surface));
    }
  }, {
    key: "drawing",
    set: function set(d) {
      this.drawings = [d];
    }
  }]);

  return CompositeDrawable;
}(Drawable);

exports.CompositeDrawable = CompositeDrawable;

var Movable =
/*#__PURE__*/
function (_Drawable2) {
  _inherits(Movable, _Drawable2);

  // Point: Position
  // Velocity: Change to position.
  // Change to velocity
  // Mass of Movable
  function Movable(x, y) {
    var _this2;

    _classCallCheck(this, Movable);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Movable).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "position", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "velocity", new Vector2D(0, 0));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "maxSpeed", 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "accelleration", new Vector2D(0, 0));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "mass", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "_linkedTo", []);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this2)), "_attachedTo", []);

    _this2.position = new Point2D(x, y);
    return _this2;
  } // Handle default movement based on "accelleration".


  _createClass(Movable, [{
    key: "tick",
    value: function tick() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var surface = arguments.length > 1 ? arguments[1] : undefined;
      this.velocity = this.velocity.add(this.accelleration).limit(this.maxSpeed);
      this.position = this.position.add(this.velocity);
      !(time % 10) && this.refresh(surface); // this.accelleration=new Vector2D(0,0);
    }
  }, {
    key: "attach",
    value: function attach(drawable) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
      if (position == -1) this._attachedTo.push(drawable);else this._attachedTo.splice(position, 0, drawable);
    }
  }, {
    key: "link",
    value: function link(drawable) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
      if (position == -1) this._linkedTo.push(drawable);else this._linkedTo.splice(position, 0, drawable);
    }
  }, {
    key: "draw",
    value: function draw(surface) {
      var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // save current rotation.
      surface.ctx.save();
      surface.ctx.translate(this.position.x, this.position.y);

      this._linkedTo.forEach(function (l) {
        return l.draw(surface);
      });

      surface.ctx.rotate(this.velocity.angle);

      this._attachedTo.forEach(function (a) {
        return a.draw(surface);
      });

      _get(_getPrototypeOf(Movable.prototype), "draw", this).call(this, surface); // restore rotation


      surface.ctx.restore();
    }
  }, {
    key: "moveTo",
    value: function moveTo(x, y) {
      this.position = new Point2D(x, y);
    }
  }, {
    key: "applyForce",
    value: function applyForce(f) {
      this.accelleration = this.accelleration.add(f);
    }
  }]);

  return Movable;
}(Drawable);

exports.Movable = Movable;

var Obstacle =
/*#__PURE__*/
function (_Drawable3) {
  _inherits(Obstacle, _Drawable3);

  // Award granted to player contacting this item.
  // Multiplier to vector of player crossing this item.
  function Obstacle() {
    var _this3;

    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 80;

    _classCallCheck(this, Obstacle);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(Obstacle).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "position", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "award", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "vectorMultiplier", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "size", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this3)), "scale", void 0);

    _this3.position = new Point2D(x, y);
    _this3.size = size;
    _this3.scale = scale;
    return _this3;
  }

  _createClass(Obstacle, [{
    key: "refresh",
    value: function refresh(surface) {
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "red";
      this.drawing = surface.generator.circle(this.position.x, this.position.y, this.size * this.scale, {
        stroke: color,
        fillStyle: 'solid',
        fill: color
      });
    }
  }, {
    key: "moveTo",
    value: function moveTo(x, y) {
      this.position = new Point2D(x, y);
    }
  }, {
    key: "setScale",
    value: function setScale() {
      var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 80;
      this.scale = s;
    }
  }, {
    key: "setSize",
    value: function setSize() {
      var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.size = s;
    }
  }]);

  return Obstacle;
}(Drawable);

exports.Obstacle = Obstacle;

var Ball =
/*#__PURE__*/
function (_Movable) {
  _inherits(Ball, _Movable);

  function Ball() {
    var _this4;

    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 25;
    var mass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    _classCallCheck(this, Ball);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(Ball).call(this, x, y));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this4)), "size", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this4)), "color", "blue");

    _this4.position = new Point2D(x, y);
    _this4.size = size;
    _this4.mass = mass;
    return _this4;
  }

  _createClass(Ball, [{
    key: "tick",
    value: function tick() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var surface = arguments.length > 1 ? arguments[1] : undefined;
      this.edge(surface.canvas.width, surface.canvas.height);
      return _get(_getPrototypeOf(Ball.prototype), "tick", this).call(this, time, surface);
    }
  }, {
    key: "edge",
    value: function edge(width, height) {
      if (this.position.x + this.size >= width || this.position.x - this.size <= 0) {
        console.log(this.velocity.angle);
        this.velocity.angle < 1 ? this.velocity.angleBetween(new Vector2D(0, 1)) : this.velocity.angleBetween(new Vector2D(0, -1));
      } else if (this.position.y + this.size >= height || this.position.y - this.size <= 0) {
        console.log(this.velocity.angle);
        this.velocity.angle < 1 ? this.velocity.angleBetween(new Vector2D(0, 1)) : this.velocity.angleBetween(new Vector2D(0, -1));
      }
    }
  }, {
    key: "refresh",
    value: function refresh(surface) {
      this.drawing = surface.generator.circle(0, 0, this.size, {
        stroke: this.color,
        fillStyle: 'solid',
        fill: this.color
      });
    }
  }]);

  return Ball;
}(Movable);

exports.Ball = Ball;

var Player =
/*#__PURE__*/
function (_Movable2) {
  _inherits(Player, _Movable2);

  function Player() {
    var _this5;

    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Player);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(Player).call(this, x, y));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this5)), "_attractionVector", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this5)), "_friction", void 0);

    _this5._attractionVector = new Vector2D(0, 0);
    _this5.mass = 16;
    _this5._friction = 0.25;
    _this5.offset = new Point2D(16, 0);
    return _this5;
  }

  _createClass(Player, [{
    key: "tick",
    value: function tick(time, surface) {
      this.accelleration = this._attractionVector.sub(this.position).limit(5);

      _get(_getPrototypeOf(Player.prototype), "tick", this).call(this, time, surface);
    }
  }, {
    key: "attractToPoint",
    value: function attractToPoint(p) {
      this._attractionVector = new Vector2D(p.x, p.y);
    }
  }, {
    key: "refresh",
    value: function refresh(surface) {
      this.drawing = surface.generator.path('L -32 8 L -32 -8Z', {
        stroke: "white"
      });
    } // setAngle(a: number) {
    //     this.velocity=new Vector2D({angle:a*(Math.PI/180), magnitude: this.velocity.magnitude});
    // }

  }]);

  return Player;
}(Movable);

exports.Player = Player;

var Axis =
/*#__PURE__*/
function (_CompositeDrawable) {
  _inherits(Axis, _CompositeDrawable);

  function Axis(w, h) {
    var _this6;

    _classCallCheck(this, Axis);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Axis).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this6)), "w", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this6)), "h", void 0);

    _this6.w = w;
    _this6.h = h;
    return _this6;
  }

  _createClass(Axis, [{
    key: "refresh",
    value: function refresh(surface) {
      var centerX = surface.canvas.width / 2;
      var centerY = surface.canvas.height / 2;
      this.drawings = [surface.generator.line(centerX, centerY, centerX, centerY - this.h), surface.generator.line(centerX, centerY, this.w + centerX, centerY)];
    }
  }]);

  return Axis;
}(CompositeDrawable);

exports.Axis = Axis;

var VLine =
/*#__PURE__*/
function (_CompositeDrawable2) {
  _inherits(VLine, _CompositeDrawable2);

  function VLine(xvec, yvec) {
    var _this7;

    var txt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

    _classCallCheck(this, VLine);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(VLine).call(this));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this7)), "vec", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this7)), "txt", void 0);

    _this7.vec = new Point2D(xvec, yvec);
    _this7.txt = txt;
    return _this7;
  }

  _createClass(VLine, [{
    key: "refresh",
    value: function refresh(surface) {
      this.drawings = [surface.generator.line(0, 0, this.vec.x, this.vec.y, {
        stroke: 'white'
      })];
    }
  }]);

  return VLine;
}(CompositeDrawable);

exports.VLine = VLine;

var Animator =
/*#__PURE__*/
function () {
  // multiply this times magnitude of vector each frame to get next position.
  // expected frame rate
  function Animator(r) {
    var sprites = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, Animator);

    _defineProperty(this, "sprites", void 0);

    _defineProperty(this, "running", false);

    _defineProperty(this, "stepping", 1 / 60);

    _defineProperty(this, "frameRate", 60);

    _defineProperty(this, "surface", void 0);

    _defineProperty(this, "time", 0);

    this.surface = r;
    this.sprites = sprites;
  }

  _createClass(Animator, [{
    key: "start",
    value: function start() {
      if (this.running) return;
      this.running = true;
      requestAnimationFrame(this.animate.bind(this));
    }
  }, {
    key: "stop",
    value: function stop() {
      this.running = false;
    }
  }, {
    key: "animate",
    value: function animate(time) {
      if (!this.running) return;
      var diff = time - this.time;
      this.time = time;
      this.draw(diff);
      requestAnimationFrame(this.animate.bind(this));
    }
  }, {
    key: "draw",
    value: function draw() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var clear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (clear) this.surface.ctx.clearRect(0, 0, this.surface.canvas.width, this.surface.canvas.height);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.sprites[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var sprite = _step.value;

          if (sprite instanceof Movable) {
            sprite.tick(time, this.surface);
          }

          sprite.draw(this.surface);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "add",
    value: function add(sprite) {
      var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

      if (position == -1) {
        if (Array.isArray(sprite)) this.sprites = this.sprites.concat(sprite);else this.sprites.push(sprite);
      } else {
        var _this$sprites$splice;

        if (Array.isArray(sprite)) (_this$sprites$splice = this.sprites.splice).call.apply(_this$sprites$splice, [this.sprites, position, 0].concat(_toConsumableArray(sprite)));else this.sprites.splice.call(this.sprites, position, 0, sprite);
      }
    }
  }, {
    key: "remove",
    value: function remove(sprite) {
      if (typeof sprite !== 'number') {
        sprite = this.sprites.findIndex(function (n) {
          return n === sprite;
        });
        if (sprite == -1) return;
      }

      this.sprites.splice(sprite, 1);
    }
  }]);

  return Animator;
}();

exports.Animator = Animator;

var Food =
/*#__PURE__*/
function (_Obstacle) {
  _inherits(Food, _Obstacle);

  function Food() {
    var _this8;

    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;

    _classCallCheck(this, Food);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(Food).call(this, x, y, size, scale));
    _this8.award = 1;
    _this8.vectorMultiplier = 1; // no change to vector motion.

    return _this8;
  }

  _createClass(Food, [{
    key: "refresh",
    value: function refresh(surface) {
      _get(_getPrototypeOf(Food.prototype), "refresh", this).call(this, surface, "green");
    }
  }]);

  return Food;
}(Obstacle);

exports.Food = Food;

var Poison =
/*#__PURE__*/
function (_Obstacle2) {
  _inherits(Poison, _Obstacle2);

  function Poison() {
    var _this9;

    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var scale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;

    _classCallCheck(this, Poison);

    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(Poison).call(this, x, y, size, scale));
    _this9.award = -1;
    _this9.vectorMultiplier = 0.5; // slow a little

    return _this9;
  } // this.drawing=surface.generator.circle(this.position.x,this.position.y,this.size*this.scale,{stroke:"red"})


  _createClass(Poison, [{
    key: "refresh",
    value: function refresh(surface) {
      _get(_getPrototypeOf(Poison.prototype), "refresh", this).call(this, surface, "red");
    }
  }]);

  return Poison;
}(Obstacle);

exports.Poison = Poison;

