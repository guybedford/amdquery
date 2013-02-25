define({
  prototype: {
    click: function(callback) {
      this[0].addEventListener('click', callback);
    }
  }
});
