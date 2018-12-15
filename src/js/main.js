$(document).ready(function() {
  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  ////////////
  // READY - triggered when PJAX DONE
  ////////////

  // single time initialization
  // legacySupport();
  initaos();
  var easingSwing = [0.02, 0.01, 0.47, 1];

  function pageReady() {
    // initPopups();
    initSliders();
    // initParallax();
    initValidations();
    initScrollMonitor();
  }

  // this is a master function which should have all functionality
  pageReady();

  //////////
  // COMMON
  //////////

  function initaos() {
    AOS.init();
  }

  // function legacySupport() {
  //   // svg support for laggy browsers
  //   svg4everybody();

  //   // Viewport units buggyfill
  //   window.viewportUnitsBuggyfill.init({
  //     force: false,
  //     refreshDebounceWait: 150,
  //     appendToBody: true
  //   });
  // }

  // HAMBURGER TOGGLER
  _document.on("click", "[js-hamburger]", function() {
    $(this).toggleClass("is-active");
    $(".header__list").toggleClass("is-active");
    $(".header__mobile").toggleClass("is-active");
    $("body").toggleClass("is-fixed");
    $("html").toggleClass("is-fixed");
  });

  // _document.on("click", ".cardiology__item", function() {
  //   $(".cardiology__item").removeClass("is-active");
  //   $(this).addClass("is-active");
  // });

  _document.on("click", ".cardiology__item", function(e) {
    e.preventDefault();
    var $self = $(this).parent(),
      $selfItem = $(this),
      tabIndex = $self.index();
    // $self.siblings().removeClass("is-active");
    $(".cardiology__item").removeClass("is-active");
    $selfItem.addClass("is-active");
    $(".cardiology__tab")
      .removeClass("is-active")
      .css("display", "none")
      .eq(tabIndex)
      .fadeIn();
  });

  _document.on("click", ".header__menu-link, .header__btn", closeMobileMenu);

  function closeMobileMenu() {
    $("[js-hamburger]").removeClass("is-active");
    $(".header__list").removeClass("is-active");
    // $(".header__mobile").removeClass("is-active");
    // $("body").removeClass("is-fixed");
    // $("html").removeClass("is-fixed");
  }

  // header scroll
  _window.on(
    "scroll",
    throttle(function() {
      var scroll = _window.scrollTop();
      var headerHeight = $(".header").height();
      var heroHeight = $(".firstscreen").height();

      if (scroll > headerHeight) {
        $(".header").addClass("is-fixed-start");
      } else {
        $(".header").removeClass("is-fixed-start");
      }
      if (scroll >= heroHeight - headerHeight / 1) {
        $(".header").addClass("is-fixed");
      } else {
        $(".header").removeClass("is-fixed");
      }
    }, 25)
  );

  // $(window).scroll(function() {
  //   var scroll = $(window).scrollTop();

  //   if (scroll >= 1) {
  //     $(".firstscreen").addClass("is-hidden");
  //   } else {
  //     $(".firstscreen").removeClass("is-hidden");
  //   }
  // });

  // Prevent # behavior
  _document
    .on("click", '[href="#"]', function(e) {
      e.preventDefault();
    })
    .on("click", 'a[href^="#section"]', function(e) {
      // section scroll
      var el = $(this).attr("href");
      scrollToSection($(el));
      $("body").removeClass("is-fixed");
      $("html").removeClass("is-fixed");
      $(".header__list").removeClass("is-active");
      $("[js-hamburger]").removeClass("is-active");
      return false;
    });

  function scrollToSection(el) {
    var headerHeight = $(".header").height();
    var targetScroll = el.offset().top - headerHeight / 100;
    // document.scrollingElement || document.documentElement

    TweenLite.to(window, 1, {
      scrollTo: { y: targetScroll, autoKill: false },
      ease: easingSwing
    });
  }

  //////////
  // SLIDERS
  //////////

  function initSliders() {
    (function() {
      function personalInfoSliderInit() {
        if ($(document).width() > 768) {
          if ($("[js-professional]").hasClass("slick-initialized"))
            $("[js-professional]").slick("unslick");
          //
          if ($("[js-professional-info]").hasClass("slick-initialized"))
            $("[js-professional-info]").slick("unslick");
        } else {
          if (!$("[js-professional]").hasClass("slick-initialized")) {
            $("[js-professional]").slick({
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: true,
              // dots: false,
              // dots: true,
              customPaging: function(slider, i) {
                var thumb = $(slider.$slides[i]).data();
                return "<a>" + i + "</a>";
              },
              asNavFor: "[js-professional-info]"
            });
          }

          //custom function showing current slide
          var $status = $(".pagingInfo");
          var $slickElement = $("[js-professional]");

          $slickElement.on("init reInit afterChange", function(
            event,
            slick,
            currentSlide,
            nextSlide
          ) {
            //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
            var i = (currentSlide ? currentSlide : 0) + 1;
            $status.text(i + "/" + slick.slideCount);
          });

          if (!$("[js-professional-info]").hasClass("slick-initialized")) {
            $("[js-professional-info]").slick({
              slidesToShow: 1,
              slidesToScroll: 1,
              asNavFor: "[js-professional]",
              dots: false,
              arrows: false
            });
          }
        }
      }

      personalInfoSliderInit();

      $(window).resize(function() {
        personalInfoSliderInit();
      });
    })();
  }

  ////////////////
  // FORM VALIDATIONS
  ////////////////

  // jQuery validate plugin
  // https://jqueryvalidation.org
  function initValidations() {
    // GENERIC FUNCTIONS
    var validateErrorPlacement = function(error, element) {
      error.addClass("ui-input__validation");
      error.appendTo(element.parent("div"));
    };
    var validateHighlight = function(element) {
      $(element)
        .parent("div")
        .addClass("has-error");
    };
    var validateUnhighlight = function(element) {
      $(element)
        .parent("div")
        .removeClass("has-error");
    };
    var validateSubmitHandler = function(form) {
      $("[js-trigger-thanks-popup]").click();
      initSubmit();
      $.ajax({
        type: "POST",
        url: $(form).attr("action"),
        data: $(form).serialize(),
        success: function(response) {
          $(form).removeClass("loading");
          var data = $.parseJSON(response);
          if (data.status == "success") {
            // do something I can't test
          } else {
            $(form)
              .find("[data-error]")
              .html(data.message)
              .show();
          }
        }
      });
    };

    /////////////////////
    // LEAD FORM
    ////////////////////

    $(".js-footer-form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        name: "required",
        mail: "required",
        mailConfirm: "required",
        mess: "required"
      },
      messages: {
        name: "This field is required!",
        mail: "This field is required!",
        mailConfirm: "This field is required!",
        mess: "This field is required!"
      }
    });
  }

  ////////////
  // REVEAL FUNCTIONS
  ////////////
  function initScrollMonitor(fromPjax) {
    $("[js-reveal]").each(function(i, el) {
      var type = $(el).data("type") || "halflyEnterViewport";

      if (type === "halflyEnterViewport") {
        var scrollListener = throttle(function() {
          var vScrollBottom = _window.scrollTop() + _window.height();
          var elTop = $(el).offset().top;
          var triggerPoint = elTop + $(el).height() / 2;

          if (vScrollBottom > triggerPoint) {
            $(el).addClass("is-animated");
            window.removeEventListener("scroll", scrollListener, false); // clear debounce func
          }
        }, 100);

        window.addEventListener("scroll", scrollListener, false);
        return;
      }
    });
  }

  // some plugins get bindings onNewPage only that way
  function triggerBody() {
    $(window).scroll();
    $(window).resize();
  }
});
