(function () {
  $.Orderable = Orderable =  function (container, picSize) {
    this.$container = $(container);
    this.picSize = picSize;
    this.$container.mousedown(this.grabElement.bind(this));
    this.$container.mouseup(this.releaseElement.bind(this));
  };

  $.fn.orderable = function (picSize) {
    return this.each(function () {
      new $.Orderable(this, picSize);
    });
  };

  Orderable.prototype.grabElement = function (event) {
    this.$el = $(event.target).replaceWith('<div class="photo placeholder">');
    this.$el.toggleClass('grabbed in-place');
    this.$photos = this.$container.find('.in-place');
    this.$container.append(this.$el);
    placeEl(this.$el, placePos(event, this.picSize, this.$container));
    this.$container.mousemove(this.moveElement.bind(this));
  };

  Orderable.prototype.moveElement = function (event) {
    placeEl(this.$el, placePos(event, this.picSize, this.$container));
    this.placePhotos(event);
  };

  Orderable.prototype.placePhotos = function (event) {
    var $placeholder = this.$container.find('.placeholder');
    var draggedPos = { top: event.pageY, left: event.pageX };
    if (!this.dropPosition(draggedPos, $placeholder.offset())) {
      var dropped = false;
      $placeholder.remove();
      this.$photos.each(function (idx, photo) {
        if (!dropped && this.dropPosition(draggedPos, $(photo).offset())) {
          $(photo).before($placeholder);
          dropped = true;
        }
      }.bind(this));
      if (!dropped) {
        this.$container.append($placeholder);
      }
    }
  };

  Orderable.prototype.releaseElement = function (event) {
    this.$container.find('.placeholder').replaceWith(this.$el);
    this.$el.toggleClass('grabbed in-place');
    this.$el = null;
    this.$container.off('mousemove');
  };

  Orderable.prototype.dropPosition = function (heldPos, pos) {
    return this.inRow(heldPos, pos) &&
      pos.left < heldPos.left &&
      heldPos.left < pos.left + this.picSize.width;
  };

  Orderable.prototype.inRow = function (heldPos, fixedPos) {
    return heldPos.top > fixedPos.top &&
      heldPos.top < fixedPos.top + this.picSize.height;
  };

  var placeEl = function ($el, pos) {
    $el.css({'top': pos.top, 'left': pos.left });
  };

  var placePos = function (event, picSize, $container) {
    return { left: event.pageX - (picSize.width / 2),
      top: event.pageY - (picSize.height / 2) - $('body').scrollTop() };
  };
})();
