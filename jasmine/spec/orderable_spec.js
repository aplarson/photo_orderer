describe("orderable", function () {
  it("should be a jQuery plugin", function () {
    expect($.Orderable).toBeDefined();
  });

  it("should not move an element when immediately dropped", function () {
    var dragEl = $(".photo").eq(0);
    var offset = dragEl.offset();
    dragEl.simulate('click', {});
    expect(dragEl.offset()).toEqual(offset);
  });

  it("should allow dragging horizontally", function () {
    var dragEl = $(".photo").eq(0);
    var oldOffset = dragEl.offset();
    dragEl.simulate('drag-n-drop', { dx: 400 });
    expect(dragEl.offset().top).toEqual(oldOffset.top);
    expect(dragEl.offset().left).not.toEqual(oldOffset.left);
  });

  it("should allow dragging vertically", function () {
    var dragEl = $(".photo").eq(0);
    var oldOffset = dragEl.offset();
    dragEl.simulate('drag-n-drop', { dy: 200 });
    expect(dragEl.offset().top).not.toEqual(oldOffset.top);
    expect(dragEl.offset().left).toEqual(oldOffset.left);
  });

  it("should allow dragging in both directions", function () {
    var dragEl = $('.photo').eq(0);
    var oldOffset = dragEl.offset();
    dragEl.simulate('drag-n-drop', {dx: 400, dy: 200});
    expect(dragEl.offset().top).not.toEqual(oldOffset.top);
    expect(dragEl.offset().left).not.toEqual(oldOffset.left);
  });
});
