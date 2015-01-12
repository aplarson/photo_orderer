(function () {
  window.Orderable = Orderable = {};

  Orderable.attachListeners = function () {
    $('.photo').mousedown(window.Orderable.grabElement);
  };

  Orderable.grabElement = function (event) {
    var $el = $(event.target);
    var position = $el.position();
    $el.addClass('grabbed');
    $el.addClass('moved');
    $el.css('top', position.top);
    $el.css('left', position.left);
    $el.data('startX', event.offsetX);
    $el.data('startY', event.offsetY);
    $el.mousemove(Orderable.moveElement);
    $el.mouseup(Orderable.releaseElement);
  };

  Orderable.moveElement = function (event) {
    var $el = $(event.target);
    var position = $el.position();
    var moveX = event.offsetX - $el.data('startX');
    var moveY = event.offsetY - $el.data('startY');
    $el.css('top', position.top + moveY);
    $el.css('left', position.left + moveX);
    $el.data('startX', event.offsetX);
    $el.data('startY', event.offsetY);
  };

  Orderable.releaseElement = function (event) {
    var $el = $(event.target);
    var draggedPosition = $el.position();
    if (draggedPosition.top < 300) {
      var row = 1;
    } else {
      var row = 2;
    }
    $el.remove();
    var $photos = $('.photo');
    var photoPositions = [];
    $photos.each(function (idx, photo) {
      photoPositions[idx] = $(photo).position();
    });
    $photos.remove();
    var dropped = false;
    var $container = $('.orderable');
    $photos.each(function (idx, photo) {
      var $currentPhoto = $(photo);
      var currentPosition = photoPositions[idx];
      if (currentPosition.top < 300) {
        var currentRow = 1;
      } else {
        var currentRow = 2;
      }
      if (dropped === true || currentRow !== row) {
        $container.append($currentPhoto);
      } else if (currentPosition.left < draggedPosition.left) {
        $container.append($currentPhoto);
      } else {
        $container.append($el);
        dropped = true;
        $container.append($currentPhoto);
      }
    })
    $(event.target).removeClass('grabbed');
    Orderable.attachListeners();
  };
})();
