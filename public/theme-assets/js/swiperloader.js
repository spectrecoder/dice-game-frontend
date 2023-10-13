(function (window, document, $) {
  "use strict";
  /* Video Modal Open / Close */

  /* Gets the video src from the data-src on video button */
  var $videoSrc;
  $(".video-btn").click(function () {
    $videoSrc = $(this).data("src");
  });

  /* when the modal is opened autoplay it   */
  $("#ico-modal").on("shown.bs.modal", function (e) {
    /* set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get */
    $("#video").attr(
      "src",
      $videoSrc + "?rel=0&amp;showinfo=0&amp;modestbranding=1&amp;autoplay=1"
    );
  });

  /* stop playing the youtube video when I close the modal */
  $("#ico-modal").on("hide.bs.modal", function (e) {
    /* a poor man's stop video */
    $("#video").attr("src", $videoSrc);
  });
  /* Initialize Swiper */
  var swiper = new Swiper(".swiper-container", {
    slidesPerView: 5,
    grabCursor: true,
    navigation: {
      nextEl: ".next-slide",
      prevEl: ".prev-slide",
    },
    /* Responsive breakpoints */
    breakpoints: {
      /* when window width is <= 576px */
      576: {
        slidesPerView: 1,
      },
      /* when window width is <= 767px */
      767: {
        slidesPerView: 2,
      },
      /* when window width is <= 992px */
      992: {
        slidesPerView: 3,
      },
    },
  });

  // if ($(window).width() < 992) {
  //   swiper.slideTo(2, 1000, false);
  // }

  // $(window).resize(function () {
  //   if ($(window).width() < 992) {
  //     swiper.slideTo(2, 1000, false);
  //   }
  // });
})(window, document, jQuery);
