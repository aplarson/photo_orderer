(function () {
  window.Orderable = Orderable = {};

  Orderable.PhotoArray = PhotoArray =  function ($container, picSize) {
    this.$container = $container;
    this.picSize = picSize;
    this.$container.mousedown(this.grabElement.bind(this));
  };

  PhotoArray.prototype.grabElement = function (event) {
    this.$el = $(event.target).replaceWith('<div class="photo placeholder">');
    this.$el.addClass('grabbed').removeClass("in-place");
    this.$container.append(this.$el);
    placeEl(this.$el, placePos(event, this.picSize));
    this.$container.mousemove(this.moveElement.bind(this));
    this.$container.mouseup(this.releaseElement.bind(this));
  };

  PhotoArray.prototype.moveElement = function (event) {
    placeEl(this.$el, placePos(event, this.picSize));
    this.placePhotos(event);
  };

  PhotoArray.prototype.placePhotos = function (event) {
    var $placeholder = this.$container.find('.placeholder');
    var draggedPos = { top: event.pageY, left: event.pageX };
    if (!this.dropPosition(draggedPos, $placeholder.position())) {
      var dropped = false;
      $placeholder.remove();
      var $photos = this.$container.find('.in-place');
      $photos.each(function (idx, photo) {
        if (!dropped && this.dropPosition(draggedPos, $(photo).position())) {
          $(photo).before($placeholder);
          dropped = true;
        }
      }.bind(this));
      if (!dropped) {
        this.$container.append($placeholder);
      }
    }
  };

  PhotoArray.prototype.releaseElement = function (event) {
    this.$container.find('.placeholder').replaceWith(this.$el);
    this.$el.removeClass('grabbed').addClass("in-place");
    this.$container.off('mousemove');
  };

  PhotoArray.prototype.dropPosition = function (heldPos, pos) {
    return this.inRow(heldPos, pos) &&
      pos.left < heldPos.left &&
      heldPos.left < pos.left + this.picSize.width;
  };

  PhotoArray.prototype.inRow = function (draggedPos, fixedPos) {
    if (fixedPos.top < this.picSize.height) {
      return draggedPos.top <= this.picSize.height;
    }
    else {
      return draggedPos.top >= this.picSize.height;
    }
  };

  var placeEl = function ($el, pos) {
    $el.css({'top': pos.top, 'left': pos.left });
  };

  var placePos = function (event, picSize) {
    return { left: event.pageX - (picSize.width / 2),
      top: event.pageY - (picSize.height / 2) };
  };
})();
