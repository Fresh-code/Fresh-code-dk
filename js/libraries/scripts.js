jQuery(function ($) {
  $(document).on("ready", function () {
    setTimeout(function () {
      // $('.dropdown-button').dropdown();
      $('.square-option').on('click', function () {
        $(this).toggleClass('checked');
      });
      $(".button-collapse").sideNav();

      // Temporary script
      $("#colorChoice").change(function () {
        $("#hexShow").replaceWith('<span id="hexShow" class="black-text">' + $(this).val() + '</span>')
      });
      $("#colorChoice2").change(function () {
        $("#hexShow2").replaceWith('<span id="hexShow" class="black-text">' + $(this).val() + '</span>')
      });
      $("#colorChoice3").change(function () {
        $("#hexShow3").replaceWith('<span id="hexShow" class="black-text">' + $(this).val() + '</span>')
      });
    }, 500)
  })
});