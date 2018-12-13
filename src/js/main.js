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
  legacySupport();
  initaos();
  var easingSwing = [0.02, 0.01, 0.47, 1];

  // on transition change
  // getPaginationSections();
  // pagination();
  // _window.on("scroll", throttle(pagination, 50));
  // _window.on("resize", debounce(pagination, 250));

  function pageReady() {
    initPopups();
    initSliders();
    initParallax();
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

  function legacySupport() {
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: false,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }

  // HAMBURGER TOGGLER
  _document.on("click", "[js-hamburger]", function() {
    $(this).toggleClass("is-active");
    $(".header__mobile").toggleClass("is-active");
    $("body").toggleClass("is-fixed");
    $("html").toggleClass("is-fixed");
  });

  _document.on("click", ".header__menu-link, .header__btn", closeMobileMenu);

  function closeMobileMenu() {
    $("[js-hamburger]").removeClass("is-active");
    $(".header__mobile").removeClass("is-active");
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
      return false;
    });

  function scrollToSection(el) {
    var headerHeight = $(".header").height();
    var targetScroll = el.offset().top - headerHeight;
    // document.scrollingElement || document.documentElement

    TweenLite.to(window, 1, {
      scrollTo: {y:targetScroll, autoKill:false},
      ease: easingSwing
    });
  }

  //////////
  // ANIMATE FOOTER BUTTON
  //////////

  [].slice
    .call(document.querySelectorAll(".progress-button"))
    .forEach(function(bttn, pos) {
      new UIProgressButton(bttn, {
        callback: function(instance) {
          var progress = 0,
            interval = setInterval(function() {
              progress = Math.min(progress + Math.random() * 0.1, 1);
              instance.setProgress(progress);

              if (progress === 1) {
                instance.stop(pos === 1 || pos === 3 ? -1 : 1);
                clearInterval(interval);
              }
            }, 150);
        }
      });
    });

  //////////
  // POPUP
  //////////

  function initPopups() {
    var startWindowScroll = 0;
    $("[js-popup]").magnificPopup({
      type: "inline",
      fixedContentPos: true,
      fixedBgPos: true,
      overflowY: "auto",
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 500,
      mainClass: "popup-buble",
      callbacks: {
        beforeOpen: function() {
          startWindowScroll = _window.scrollTop();
          this.st.mainClass = this.st.el.attr("data-effect");
          // $('html').addClass('mfp-helper');
        },
        close: function() {
          // $('html').removeClass('mfp-helper');
          _window.scrollTop(startWindowScroll);
        }
      }
    });
  }

  //////////
  // SLIDERS
  //////////

  function initSliders() {
    // var swiperAnimation = new SwiperAnimation();

    // EXAMPLE SWIPER
    var projectsSwiper = new Swiper("[js-slider-projects]", {
      // Optional parameters
      direction: "horizontal",
      slidesPerView: 3,
      spaceBetween: 30,
      loop: false,
      // pagination: ".swiper-pagination",
      // paginationClickable: true,
      parallax: true,
      effect: "slide",
      scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true
      },
      breakpoints: {
        // when window width is <= 320px
        520: {
          slidesPerView: 1,
          spaceBetween: 0
        },
        // when window width is <= 480px
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        }
      }
    });

    var servicesSwiper = new Swiper("[js-slider-services]", {
      // Optional parameters
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      slidesPerView: 1,
      paginationClickable: true,
      spaceBetween: 30,
      loop: true,
      mousewheelControl: true,
      effect: "fade",
      // fadeEffect: {
      //   crossFade: true
      // },
      // speed: 600,
      speed: 300,
      on: {
        init: function() {
          // swiperAnimation.init(this).animate();
        },
        slideChange: function() {
          // swiperAnimation.init(this).animate();

          if (!servicesSwiper) return;
          var curSlide = servicesSwiper.realIndex + 1;
          var linkedControl = $(
            '[js-services-nav] a[data-target="' + curSlide + '"]'
          );
          linkedControl.siblings().removeClass("is-active");
          linkedControl.addClass("is-active");
        }
      }
    });

    $("[js-services-nav] a").on("click", function() {
      var index = parseInt($(this).data("target"), 10);
      servicesSwiper.slideTo(index);
    });

    var stagesSwiper = new Swiper("[js-slider-stages]", {
      // Optional parameters
      // pagination: {
      //   el: ".swiper-pagination",
      //   clickable: true,
      //   renderBullet: function(index, className) {
      //     return '<span class="' + className + '">' + (index + 1) + "</span>";
      //   }
      // },
      draggable: false,
      simulateTouch: false,
      slidesPerView: 1,
      paginationClickable: true,
      spaceBetween: 30,
      autoHeight: true,
      loop: true,
      mousewheelControl: true,
      effect: "fade",
      fadeEffect: {
        crossFade: true
      },
      speed: 300,
      on: {
        slideChange: function() {
          if (!stagesSwiper) return;
          var curSlide = stagesSwiper.realIndex + 1;
          var linkedControl = $(
            '[js-stages-nav] a[data-target="' + curSlide + '"]'
          );
          linkedControl.siblings().removeClass("is-active");
          linkedControl.addClass("is-active");
        }
      }
    });

    $("[js-stages-nav] a").on("click", function() {
      var index = parseInt($(this).data("target"), 10);
      stagesSwiper.slideTo(index);
    });

    var gallerySwiper = new Swiper("[js-slider-team-main]", {
      loop: false,
      watchOverflow: false,
      setWrapperSize: true,
      spaceBetween: 0,
      slidesPerView: 1,
      effect: "fade",
      fadeEffect: {
        crossFade: true
      },
      speed: 300,
      on: {
        slideChange: function() {
          if (!gallerySwiper) return;
          var curSlide = gallerySwiper.realIndex;
          $("[js-slider-preview]").slick("slickGoTo", curSlide);
        }
      }
    });

    $("[js-slider-preview]").slick({
      accessibility: false,
      arrows: true,
      infinite: true,
      // infinite: false,
      slidesToShow: 2,
      slidesToScroll: 1,
      vertical: true,
      verticalSwiping: true
    });

    // click to slide for slick fix
    $("[js-slider-preview] .swiper-slide").on("click", function() {
      var index = $(this).data("slide");
      $("[js-slider-preview]").slick("slickGoTo", index - 1);
    });

    $("[js-slider-preview]").on("beforeChange", function(
      event,
      slick,
      currentSlide,
      nextSlide
    ) {
      gallerySwiper.slideTo(nextSlide);
    });

    // var thumbsSwiper = new Swiper("[js-slider-preview]", {
    //   direction: "vertical",
    //   slidesPerView: 2,
    //   // setWrapperSize: true,
    //   autoHeight: true,
    //   // centeredSlides: true,
    //   loop: false,
    //   spaceBetween: 10,
    //   // slideToClickedSlide: true,
    //   slideActiveClass: "is-active",
    //   navigation: {
    //     nextEl: ".swiper-button-next",
    //     prevEl: ".swiper-button-prev"
    //   }
    // });

    // if ($("[js-slider-team-main]").length > 0) {
    //   gallerySwiper.controller.control = thumbsSwiper;
    //   thumbsSwiper.controller.control = gallerySwiper;
    // }
  }

  //////////
  // PARALLAX
  /////////
  function initParallax() {
    $("[js-parallax-scene]").each(function(i, scene) {
      var parallax = new Parallax(scene);
    });
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
      $(form)
        .find("input")
        .val("");
      // initSubmit();
      // $.ajax({
      //   type: "POST",
      //   url: $(form).attr("action"),
      //   data: $(form).serialize(),
      //   success: function(response) {
      //     $(form).removeClass("loading");
      //     var data = $.parseJSON(response);
      //     if (data.status == "success") {
      //       // do something I can't test
      //     } else {
      //       $(form)
      //         .find("[data-error]")
      //         .html(data.message)
      //         .show();
      //     }
      //   }
      // });
    };

    /////////////////////
    // LEAD FORM
    ////////////////////

    function emailIsValid(value) {
      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(value);
    }

    function phoneIsValid(value) {
      // https://www.regextester.com/99415
      var phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
      return phoneRegex.test(value);
    }

    $.validator.addMethod("isPhoneMail", function(value, element) {
      return emailIsValid(value) || phoneIsValid(value);
    });

    $(".js-lead-form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        name: "required",
        phonemail: {
          required: true,
          isPhoneMail: true
        }
      },
      messages: {
        name: "Необходимо заполнить",
        phonemail: {
          required: "Необходимо заполнить",
          isPhoneMail: function(value, element) {
            var value = $(element).val();
            var errMessage;

            if (value.indexOf("@") !== -1) {
              errMessage = emailIsValid() ? false : "Неверный формат почты";
            } else {
              errMessage = phoneIsValid() ? false : "Неверный формат телефона";
            }

            return errMessage;
          }
        }
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
