(function () {
  window.Orderable = Orderable = {};

  Orderable.attachListeners = function () {
    $('.photo').click(window.Orderable.grabElement);
  };

  Orderable.grabElement = function (event) {
    var $el = $(event.target);
    var position = $el.position();
    $el.addClass('grabbed');
    $el.addClass('moved');
    $el.css('top', event.pageY - 150);
    $el.css('left', event.pageX - 100);
    $el.unbind();
    $el.mousemove(Orderable.moveElement);
    $el.click(Orderable.releaseElement);
  };

  Orderable.moveElement = function (event) {
    var $el = $(event.target);
    $el.unbind('mousemove');
    $el.css('top', event.pageY - 150);
    $el.css('left', event.pageX - 100);
    $el.mousemove(Orderable.moveElement);
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
      if (!dropped) {
        $container.append($el);
      }
    })
    $(event.target).removeClass('grabbed');
    Orderable.attachListeners();
  };
})();
