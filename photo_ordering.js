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
    this.$container.find('.photo').click(this.grabElement.bind(this));
  };

  PhotoArray.prototype.grabElement = function (event) {
    this.$el = $(event.target).addClass('grabbed');
    placeEl(this.$el, event.pageX - 100, event.pageY - 150);
    this.$el.mousemove(this.moveElement.bind(this));
    this.$el.click(this.releaseElement.bind(this));
  };

  PhotoArray.prototype.moveElement = function (event) {
    this.$el.unbind('mousemove');
    placeEl(this.$el, event.pageX - 100, event.pageY - 150);
    this.$el.mousemove(this.moveElement.bind(this));
  };

  PhotoArray.prototype.placePhotos = function (positions, draggedPos, $photos) {
    var dropped = false;
    var draggedLeft = draggedPos.left;
    $photos.each(function (idx, photo) {
      var pos = positions[idx];
      if (!dropped && inRow(draggedPos, pos) && pos.left > draggedLeft) {
        this.$container.append(this.$el);
        dropped = true;
      }
      this.$container.append($(photo));
    }.bind(this));
    if (!dropped) {
      this.$container.append(this.$el);
    }
  };

  PhotoArray.prototype.releaseElement = function (event) {
    var draggedPos = this.$el.position();
    this.$el.remove();
    var $photos = this.$container.find('.photo');
    var photoPositions = getPositions($photos);
    $photos.remove();
    this.placePhotos(photoPositions, draggedPos, $photos);
    this.$el.removeClass('grabbed');
    this.attachListeners();
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
