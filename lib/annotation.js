
/**
 * Module dependencies.
 */

var events = require('events')
  , offset = require('offset')
  , Rect = require('rect')
  , css = require('css');

/**
 * Expose `Annotation`.
 */

module.exports = Annotation;

/**
 * Initialize an annotation on `el` with `rect`.
 *
 * @param {Element} el
 * @param {Rect} rect
 * @api private
 */

function Annotation(el, rect) {
  css(el, { position: 'relative' });
  this.rect = rect;
  this.parent = el;
  this.el = document.createElement('div');
  this.el.className = 'annotation';
  this.show();
  this.bind();
}

/**
 * Show the annotation.
 *
 * @api public
 */

Annotation.prototype.show = function() {
  this.parent.appendChild(this.el);
  this.position();
};

/**
 * Position the annotation.
 *
 * @api private
 */

Annotation.prototype.position = function(){
  var b = this.rect.bounds();
  css(this.el, {
    position: 'absolute',
    top: b.y,
    left: b.x,
    width: b.w,
    height: b.h
  });
};

/**
 * Bind events.
 *
 * @api private
 */

Annotation.prototype.bind = function() {
  this.events = events(this.el, this);
  this.events.bind('mousedown');
  this.events.bind('mousemove');
  this.events.bind('mouseup');
};

/**
 * Unbind events.
 *
 * @api private
 */

Annotation.prototype.unbind = function() {
  this.events.unbind();
};

/**
 * Mousedown.
 *
 * @api private
 */

Annotation.prototype.onmousedown = function(e) {
  e.preventDefault();
  e.stopPropagation();
  this.off = offset(this.parent);
  this.x = e.offsetX;
  this.y = e.offsetY;
};

/**
 * Mousemove.
 *
 * @api private
 */

Annotation.prototype.onmousemove = function(e) {
  if (!this.off) return;
  var x = e.pageX - this.off.x - this.x;
  var y = e.pageY - this.off.y - this.y;
  this.rect.moveTo(x, y);
  css(this.el, { top: y, left: x });
};

/**
 * Mouseup.
 *
 * @api private
 */

Annotation.prototype.onmouseup = function(e) {
  this.off = null;
};
