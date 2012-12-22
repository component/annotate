
/**
 * Module dependencies.
 */

var Popover = require('popover')
  , Annotation = require('./annotation')
  , Emitter = require('emitter')
  , events = require('events')
  , Rect = require('rect')
  , css = require('css')

/**
 * Expose `Document`.
 */

module.exports = Document;

/**
 * Initialize a document with `el`.
 *
 * @param {Element} el
 * @api public
 */

function Document(el) {
  if (!(this instanceof Document)) return new Document(el);
  this.selection = document.createElement('div');
  this.selection.className = 'annotation-selection';
  this.selection.style.display = 'none';
  el.appendChild(this.selection);
  this.el = el;
  this.bind();
}

/**
 * Mixin emitter.
 */

Emitter(Document.prototype);

/**
 * Create an annotation with `rect`.
 *
 * @param {Rect} rect
 * @return {Annotation}
 * @api public
 */

Document.prototype.select = function(rect) {
  this.emit('annotation', rect);
  return new Annotation(this.el, rect);
};

/**
 * Bind events.
 *
 * @api private
 */

Document.prototype.bind = function() {
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

Document.prototype.unbind = function() {
  this.events.unbind();
};

/**
 * Mousedown.
 *
 * @api private
 */

Document.prototype.onmousedown = function(e) {
  e.preventDefault();
  var el = this.selection;
  var x = e.offsetX;
  var y = e.offsetY;
  this.down = new Rect(x, y);
  css(el, {
    display: 'block',
    top: y,
    left: x,
    width: 1,
    height: 1
  });
};

/**
 * Mousemove.
 *
 * @api private
 */

Document.prototype.onmousemove = function(e) {
  if (!this.down) return;
  var el = this.selection;
  this.down.to(e.offsetX, e.offsetY);
  var b = this.down.bounds();
  css(el, { width: b.w, height: b.h });
};

/**
 * Mouseup.
 *
 * @api private
 */

Document.prototype.onmouseup = function(e) {
  var rect = this.down;
  if (!rect) return;
  this.down = null;
  this.selection.style.display = 'none';
  this.select(rect);
};
