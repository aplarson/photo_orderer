(function () {
  window.Orderable = Orderable = {};

  Orderable.PhotoArray = PhotoArray =  function () {
    this.$container = $('.orderable');
  };

  Orderable.initialize = function () {
    var orderable = new PhotoArray();
    orderable.attachListeners();
  };

  PhotoArray.prototype.attachListeners = function () {
    this.$container.click(this.grabElement.bind(this));
  };

  PhotoArray.prototype.grabElement = function (event) {
    this.$el = $(event.target).replaceWith('<div class="photo placeholder">');
    this.$el.addClass('grabbed').removeClass("in-place");
    this.$container.append(this.$el);
    this.$container.mousemove(this.moveElement.bind(this));
    this.$el.click(this.releaseElement.bind(this));
  };

  PhotoArray.prototype.moveElement = function (event) {
    placeEl(this.$el, event.pageX - 100, event.pageY - 150);
    var $placeholder = this.$container.find('.placeholder').remove();
    var $photos = this.$container.find('.in-place');
    var photoPositions = getPositions($photos);
    $photos.remove();
    this.placePhotos(photoPositions, this.$el.position(), $photos, $placeholder);
  };

  PhotoArray.prototype.placePhotos = function (positions, draggedPos, $photos, $el) {
    var dropped = false;
    $photos.each(function (idx, photo) {
      if (!dropped && dropPosition(draggedPos, positions[idx])) {
        this.$container.append($el);
        dropped = true;
      }
      this.$container.append($(photo));
    }.bind(this));
    if (!dropped) {
      this.$container.append($el);
    }
  };

  PhotoArray.prototype.releaseElement = function (event) {
    event.stopPropagation();
    var draggedPos = this.$el.position();
    this.$container.find('.placeholder').remove();
    var $photos = this.$container.find('.in-place');
    var photoPositions = getPositions($photos);
    this.$container.empty();
    this.placePhotos(photoPositions, draggedPos, $photos, this.$el);
    this.$el.removeClass('grabbed').addClass("in-place");
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
    $el.css('top', y);
    $el.css('left', x);
  };
})();
