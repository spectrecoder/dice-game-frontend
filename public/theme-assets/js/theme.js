/**
 *   File Name: theme.js
 *   Description: Theme related common JS.
 *   -------------------------------------------------------------------------------------------
 *   Item Name: Crypto ICO - Cryptocurrency Website Landing Page HTML Template
 *   Version: 1.0
 *   Author: Pixinvent
 *   Author URL: http://www.themeforest.net/user/pixinvent
 **/

/* Preloader */
$(window).on("load", function () {
  setTimeout(function () {
    $("body").addClass("loaded");
  }, 200);

  // Vertical Nav with social icons + telegram

  $("nav.vertical-social").midnight();

  // Navbar dropdown on hover
  $(".navbar .dropdown").on("mouseover", function () {
    var $this = $(this).find(".dropdown-menu");
    if ($this.hasClass("show")) {
      return false;
    }
    $(".dropdown-toggle", this).dropdown("toggle");
  });
  $(".navbar .dropdown").on("mouseout", function () {
    var $this = $(this).find(".dropdown-menu");
    if ($this.hasClass("show")) {
      $(".dropdown-toggle", this).dropdown("toggle");
    }
  });
  $(".navbar .dropdown-toggle").on("click", function () {
    var $this = $(this);
    if ($this.hasClass("show")) {
      return false;
    }
  });

  if ($(".page-animated").length > 0) {
    InitWaypointAnimations();
  }

  setTimeout(function () {
    $(".cic-logo").addClass("cic-logo-animation");
    $(".svg-elements-1").addClass("svg-elements-1-animation");
    $(".svg-elements-2").addClass("svg-elements-2-animation");
  }, 3000);
});

(function (window, document, $) {
  "use strict";
  var $html = $("html"),
    $body = $("body");

  //Using scrollSpy for the navigation
  $($body).scrollspy({ target: "#navigation" });
  //Init Navbar slideline function
  navbarSlideLine();
  //Update the slideline position on scroll/click
  $(window).on("activate.bs.scrollspy", function (e) {
    navbarSlideLine();
  });

  /* Add shadow and color to fixed top navbar */
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll >= 50) {
      if ($(window).width() > 992) {
        $(".navbar").addClass("navbar-fixed navbar-shadow");
        $(".navbar #slide-line").removeClass("d-none");
        inverseNavbar(true); // For inverse navbar
      }
    } else {
      $(".navbar").removeClass("navbar-fixed navbar-shadow");
      $(".navbar #slide-line").addClass("d-none");
      inverseNavbar(false);
    }
  });

  // Navbar absolute position on small screen
  navbarAbsolute();
  $(window).resize(function () {
    /* Invoke on window resize */ navbarAbsolute();
  });

  /* Menu navbar toggler animation */
  $(".main-menu .navbar-toggler").click(function (event) {
    $(".main-menu").toggleClass("open", 2000, "swing");
  });

  /* On menu click, Smooth Scrolling */
  $('.main-menu a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .not(".link")
    .click(function (event) {
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          event.preventDefault();
          $("html, body").animate(
            {
              scrollTop: target.offset().top,
            },
            1000,
            function () {
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) {
                return false;
              } else {
                $target.attr("tabindex", "-1");
                $target.focus();
              }
            }
          );
        }
      }
    });

  /* FlipClock Counter */
  var clock;
  clock = $(".clock").FlipClock({
    clockFace: "DailyCounter",
    autoStart: false,
    callbacks: {
      stop: function () {
        $(".message").html("The clock has stopped!");
      },
    },
  });
  clock.setTime(8100000);
  clock.setCountdown(true);
  clock.start();

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

  if ($(window).width() < 992) {
    swiper.slideTo(2, 1000, false);
  }

  $(window).resize(function () {
    if ($(window).width() < 992) {
      swiper.slideTo(2, 1000, false);
    }
  });
})(window, document, jQuery);

/* Absolute navbar below 992(md) screen */
function navbarAbsolute() {
  if ($(window).width() < 992) {
    $(".main-menu").removeClass("fixed-top").addClass("navbar-absolute");
    $(
      ".main-menu .nav-item, .main-menu .dropdown, .main-menu .btn-sign-in"
    ).removeClass("animated");
  } else {
    $(".main-menu").addClass("fixed-top").removeClass("navbar-absolute");
    $(
      ".main-menu .nav-item, .main-menu .dropdown, .main-menu .btn-sign-in"
    ).addClass("animated");
  }
}

function inverseNavbar(isFixed) {
  if ($("body").hasClass("template-intro-video")) {
    if (isFixed) {
      $(".navbar-brand-logo-dark").removeClass("d-none");
      $(".navbar-brand-logo").addClass("d-none");
      $(".btn-sign-in")
        .removeClass("btn-light")
        .addClass("btn-gradient-blue btn-glow");
    } else {
      $(".navbar-brand-logo-dark").addClass("d-none");
      $(".navbar-brand-logo").removeClass("d-none");
      $(".btn-sign-in")
        .addClass("btn-light")
        .removeClass("btn-gradient-blue btn-glow");
    }
  }
}
// Set the slideline width for active menu
function navbarSlideLine() {
  var $nav = $("#navigation"),
    $slideLine = $nav.find("#slide-line"),
    $currentItem = $nav.find(".active");
  // Menu has active item
  if ($currentItem[0]) {
    $slideLine.css({
      width: $currentItem.width() + 16,
      left:
        $currentItem.parent().position().left +
        ($currentItem.parent().width() - $currentItem.width()) / 2 -
        8,
    });
  }
}
