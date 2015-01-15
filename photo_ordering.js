(function () {
  window.Orderable = Orderable = {};

  Orderable.PhotoArray = PhotoArray =  function () {
    this.$container = $('.orderable');
    this.$container.click(this.grabElement.bind(this));
  };

  PhotoArray.prototype.grabElement = function (event) {
    this.$el = $(event.target).replaceWith('<div class="photo placeholder">');
    this.$el.addClass('grabbed').removeClass("in-place");
    this.$container.append(this.$el);
    placeEl(this.$el, event.pageX - 100, event.pageY - 150);
    this.$container.mousemove(this.moveElement.bind(this));
    this.$el.click(this.releaseElement.bind(this));
  };

  PhotoArray.prototype.moveElement = function (event) {
    placeEl(this.$el, event.pageX - 100, event.pageY - 150);
    var $placeholder = this.$container.find('.placeholder').remove();
    this.render($placeholder);
  };

  PhotoArray.prototype.placePhotos = function (draggedPos, $photos, $el) {
    var dropped = false;
    $photos.each(function (idx, photo) {
      if (!dropped && dropPosition(draggedPos, $(photo).position())) {
        $(photo).before($el);
        dropped = true;
      }
    }.bind(this));
    if (!dropped) {
      this.$container.append($el);
    }
  };

  PhotoArray.prototype.releaseElement = function (event) {
    event.stopPropagation();
    this.$el.off('click');
    var draggedPos = this.$el.position();
    this.$container.find('.placeholder').replaceWith(this.$el);
    this.$el.removeClass('grabbed').addClass("in-place");
    this.$container.off('mousemove');
  };

  PhotoArray.prototype.render = function ($el) {
    var $photos = this.$container.find('.in-place');
    this.placePhotos(this.$el.position(), $photos, $el);
  };

  var dropPosition = function (heldPos, pos) {
    return inRow(heldPos, pos) && pos.left > heldPos.left
  };

  var getPositions = function ($photos) {
    var photoPositions = [];
    $photos.each(function (idx, photo) {
      photoPositions[idx] = $(photo).position();
    });
    return photoPositions;
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
