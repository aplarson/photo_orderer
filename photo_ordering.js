(function () {
  window.Orderable = Orderable = {};

  Orderable.PhotoArray = PhotoArray =  function () {
    this.$container = $('.orderable');
    this.$container.mousedown(this.grabElement.bind(this));
  };

  PhotoArray.prototype.grabElement = function (event) {
    this.$el = $(event.target).replaceWith('<div class="photo placeholder">');
    this.$el.addClass('grabbed').removeClass("in-place");
    this.$container.append(this.$el);
    placeEl(this.$el, event.pageX - 100, event.pageY - 150);
    this.$container.mousemove(this.moveElement.bind(this));
    this.$el.mouseup(this.releaseElement.bind(this));
  };

  PhotoArray.prototype.moveElement = function (event) {
    placeEl(this.$el, event.pageX - 100, event.pageY - 150);
    this.placePhotos();
  };

  PhotoArray.prototype.placePhotos = function () {
    var dropped = false;
    var $placeholder = this.$container.find('.placeholder').remove();
    var $photos = this.$container.find('.in-place');
    var draggedPos = this.$el.position();
    $photos.each(function (idx, photo) {
      if (!dropped && dropPosition(draggedPos, $(photo).position())) {
        $(photo).before($placeholder);
        dropped = true;
      }
    }.bind(this));
    if (!dropped) {
      this.$container.append($placeholder);
    }
  };

  PhotoArray.prototype.releaseElement = function (event) {
    this.$el.off('mouseup');
    this.$container.find('.placeholder').replaceWith(this.$el);
    this.$el.removeClass('grabbed').addClass("in-place");
    this.$container.off('mousemove');
  };

  var dropPosition = function (heldPos, pos) {
    return inRow(heldPos, pos) && pos.left > heldPos.left
  };

  var inRow = function (draggedPos, fixedPos) {
    if (fixedPos.top < 300) {
      return draggedPos.top <= 300
    }
    else {
      return draggedPos.top >= 300
    }
  };

  var placeEl = function ($el, x, y) {
    $el.css({'top': y, 'left': x });
  };
})();
