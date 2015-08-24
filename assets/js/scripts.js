!function ($) {

  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  DOM Event Listeners

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  $(document).ready(function() {

    init();

  });

  $(window).on("load", function() {

    // init();

  });



  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Initialize

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function init() {

    /* ----------------------------------------------------------------------------------------------------
    Define Namespace
    ---------------------------------------------------------------------------------------------------- */

    $.app = {};

    $.app.canvas = $("#canvas");

    $.app.scrollbar_width = get_scrollbar_width();



    /* ----------------------------------------------------------------------------------------------------
    Initialize Dynamically Positioned/Resized Elements
    ---------------------------------------------------------------------------------------------------- */

    $('.fill-vertical').fillVertical();
    $('.size-to-fit').sizeToFit();
    $('.center-vertical').centerVertical();
    $('.center-horizontal').centerHorizontal();
    $('.vertically-balanced').verticallyBalanced();



    /* ----------------------------------------------------------------------------------------------------
    Define window resize event listener
    ---------------------------------------------------------------------------------------------------- */

    $(window).resize(function () {

      window_resize();

    });

    window_resize();



    /* ----------------------------------------------------------------------------------------------------
    Define window scroll event listener
    ---------------------------------------------------------------------------------------------------- */

    $(window).scroll(function () {

      window_scroll();

    });

    window_scroll();



    /* ----------------------------------------------------------------------------------------------------
    Click Based Events
    ---------------------------------------------------------------------------------------------------- */

    scroll_on_click();
    focus_on_click();



    /* ----------------------------------------------------------------------------------------------------
    Simulate placeholder text
    ---------------------------------------------------------------------------------------------------- */

    simulate_placeholders();

    window.simulate_placeholders = simulate_placeholders;



    /* ----------------------------------------------------------------------------------------------------
    Google Code Pretty Print
    ---------------------------------------------------------------------------------------------------- */

    //window.prettyPrint && prettyPrint();



    /* ----------------------------------------------------------------------------------------------------
    Initialize Scrollbars
    ---------------------------------------------------------------------------------------------------- */

    $('.container-scrollable').perfectScrollbar();



    /* ----------------------------------------------------------------------------------------------------
    Initialize Backstretch
    ---------------------------------------------------------------------------------------------------- */

    init_backstretch('.backstretch');



    /* ----------------------------------------------------------------------------------------------------
    Initialize Bootstrap Tooltip Plugin
    ---------------------------------------------------------------------------------------------------- */

    init_tooltips();



    /* ----------------------------------------------------------------------------------------------------
    Initialize Carousel
    ---------------------------------------------------------------------------------------------------- */

    init_tooltips();


    // Setup Announcements Carousel

    $(".carousel").carousel({

      speed                         :  10000,
      class_active                  :  'active',
      class_inactive                :  'inactive',
      slide_animate_callback        :  function() {},
      navigation_option_previous    :  null,
      navigation_option_next        :  null,
      pagination                    :  true,
      pagination_navigation         :  false,
      child_selector                :  '.carousel-item'

    });



    /* ----------------------------------------------------------------------------------------------------
    Listen For Image Load and Call Window Resize()
    ---------------------------------------------------------------------------------------------------- */

    $("img").on('load', function () {

      window_resize();

    });



    /* ----------------------------------------------------------------------------------------------------
    Allow modal backdrop click to trigger close
    ---------------------------------------------------------------------------------------------------- */

    $(document.body).on('click','> .modal-backdrop',function() {

      $('.modal').modal('hide');

    });



    /* ----------------------------------------------------------------------------------------------------
    Fire Adjust Video on Modal Shown
    ---------------------------------------------------------------------------------------------------- */

    // Move All Modals outside of Canvas

    $('#canvas').find('.modal').each(function() {

      var $modal = $(this);
      $('#canvas').after($modal);

    });

    $('.modal').on('show.bs.modal', function (e) {

    });

    $('.modal').on('shown.bs.modal', function (e) {

    });

    $('.modal').on('hide.bs.modal', function (e) {

      // Animate out modal backdrop on hide

      $('.modal-backdrop').removeClass('in');

    });

    $('.modal').on('hidden.bs.modal', function (e) {

    });

    $.each(['show','hide','css','toggle'], function(i, fn) {

      var o = $.fn[fn];

      $.fn[fn] = function() {

        this.each(function() {

          var $this = $(this);
          var isHidden = $this.is(':hidden');

          setTimeout(function() {

            if (isHidden !== $this.is(':hidden')) {

              $this.trigger('showhide', isHidden);

            }

          }, 4);

        });

        return o.apply(this, arguments);

      };

    });

    $('.modal').on('showhide', function(e, visible) {

      if (visible) {

        // play or create video when the modal opens

        $(this).find(".youtube-player[data-video]").each(function() {

          if($(this).is("iframe")){

            $(this).data('player').playVideo();

          } else {

            window.init_videos($(this));

          }

        });

        adjust_fluid_videos();

        modal_resize();

      } else {

        // pause videos playing in a modal when they close

        $(this).find(".youtube-player[data-video]").each(function() {

          if ($(this).is("iframe") && ($(this).data('player') != null)) {

            $(this).data('player').pauseVideo();

          }

        });

      }

    });

    /* ----------------------------------------------------------------------------------------------------
    Trigger Enterprise Modal from Cloud Modal
    ---------------------------------------------------------------------------------------------------- */

    $("#modal-prompt-product-cloud-trigger-enterprise").click(function(e) {

      e.preventDefault();

      $("#modal-prompt-product-cloud").modal('hide');
      $("#modal-prompt-product-enterprise").modal('show');

    })

    /* ----------------------------------------------------------------------------------------------------
    Initialize Header Canvas Sidebar Toggle
    ---------------------------------------------------------------------------------------------------- */

    $('.canvas-sidebar-toggle').click(function(e) {

      e.preventDefault();
      canvas_sidebar_toggle();

    });



    /* ----------------------------------------------------------------------------------------------------
    Initialize Videos
    ---------------------------------------------------------------------------------------------------- */

    init_video('.load-video');



    /* ----------------------------------------------------------------------------------------------------
    Initialize Views
    ---------------------------------------------------------------------------------------------------- */

    views_init();



    /* ----------------------------------------------------------------------------------------------------
    Initialize Views
    ---------------------------------------------------------------------------------------------------- */

    form_handlers_init();

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Initialize: Views

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function views_init() {

    if($.app.canvas.hasClass("home")) {

      view_home_init();

    }

    if($.app.canvas.hasClass("learn")) {

      view_learn_init();

    }

    if($.app.canvas.hasClass("product")) {

      view_product_init();

    }

    if($.app.canvas.hasClass("team")) {

      view_team_init();

    }

    if($.app.canvas.hasClass("about")) {

      view_about_init();

    }

    if($.app.canvas.hasClass("contact")) {

      view_contact_init();

    }

    if($('#modal-prompt-amazon-cloudformation').length) {

      view_modal_prompt_amazon_cloudformation_init();

    }

  }




  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Initialize: View (About)

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function view_about_init() {

    // Populate Job Listings

    var $about_career_openings_listings = $("#about-career-openings-listings");

    if ($about_career_openings_listings.length > 0) {

      $.ajax({

        dataType: "jsonp",

        success: function(data) {

          var openings = "";

          data.jobs.forEach(function(job) {

            openings += job_opening_template(job);

          });

          $about_career_openings_listings.html(openings);

        },

        url: "https://api.greenhouse.io/v1/boards/mesosphere/embed/jobs"

      })

    }

    function job_opening_template(job){

      // props
      // id,title,updated_at,location,absolute_url

      var template = " \
        <li class='col-sm-4 panel panel-team'> \
          <a href='<%=absolute_url%>'> \
            <h4 class='flush-top flush-bottom'> \
              <%=title%> \
            </h4> \
            <button class='button button-small button-primary' type='button'>Apply</button> \
          </a> \
        </li>";

      for(prop in job) {

        template = template.replace("<%="+prop+"%>", job[prop]);

      }

      return template;

    }

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Initialize: View (Home)

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function view_home_init() {

    // Setup Announcements Carousel

    $(".home-announcements-collection").carousel({

      speed                         :  4000,
      class_active                  :  'active',
      class_inactive                :  'inactive',
      slide_animate_callback        :  function() {},
      navigation_option_previous    :  null,
      navigation_option_next        :  null,
      pagination                    :  true,
      pagination_navigation         :  false,
      child_selector                :  '.home-announcements-collection-item'

    });

    // Setup Device Interface Slider

    $('#home-interface-device-slider-content').mousemove(function(e){

      var x = e.pageX - $(this).offset().left;
      var y = e.pageY - $(this).offset().top;
      var width = $(this).width();
      var screen_left = $(this).find('.device-browser-content-screen-left');
      var screen_width = ((x / width) * 100) + "%";

      screen_left.width(screen_width);

    });

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Initialize: View (Features)

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function view_learn_init() {

    $("#learn-services-type").typed({

      strings: [

        "spark",
        "kubernetes",
        "jenkins",
        "hdfs"

      ],
      typeSpeed: 50,
      startDelay: 0,
      backDelay: 1000,
      loop: true,
      onStringTyped: function() {

        //$("#learn-services-type").data('text', $("#learn-services-type").text());

      },

    });

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Initialize: View (Product)

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function view_product_init() {

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Initialize: View (Contact)

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function view_contact_init() {

    $(window).scroll(function () {

    });

    $(window).resize(function () {

    });

    view_contact_draw_map();

  }



  /* --------------------------------------------------
  View (Contact) Draw Map
  -------------------------------------------------- */

  function view_contact_draw_map() {

    // Draw San Francisco Map

    var element = document.getElementById("contact-location-map-san-francisco");
    var latitude = 37.7893041;
    var longitude = -122.4003783;
    var tooltip_content =
      "<div id='content'>"+
        "<h5 class='flush-top short'>Mesosphere San Francisco Office</h5>" +
        "<p class='flush-bottom'>" +
          "88 Stevenson St</br>" +
          "San Francisco, CA 94107" +
        "</p>" +
      "</div>";

    draw_map(element, latitude, longitude, tooltip_content);

    // Draw Hamburg Map

    element = document.getElementById("contact-location-map-germany");
    latitude = 53.54386;
    longitude = 10.02979;
    tooltip_content =
      "<div id='content'>"+
        "<h5 class='flush-top short'>Mesosphere Hamburg Office</h5>" +
        "<p class='flush-bottom'>" +
          "Friesenstraße 13, 20097</br>" +
          "Hamburg, Germany" +
        "</p>" +
      "</div>";

    draw_map(element, latitude, longitude, tooltip_content);

    // Draw NY Map

    element = document.getElementById("contact-location-map-new-york");
    latitude = 40.7483005;
    longitude = -73.990655;
    tooltip_content =
      "<div id='content'>"+
        "<h5 class='flush-top short'>Mesosphere New York Office</h5>" +
        "<p class='flush-bottom'>" +
          "132 West 31st St</br>" +
          "New York, NY 10001" +
        "</p>" +
      "</div>";

    draw_map(element, latitude, longitude, tooltip_content);

  }

  function draw_map(element, latitude, longitude, tooltip_content) {

    // Initialize Google Maps

    var map_options = {

      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      zoomControl: false,
      draggable: false,
      scrollwheel: false,
      styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]

    }

    // Draw San Francisco Map

    var map_position = new google.maps.LatLng(latitude, longitude);

    map_options.center = map_position;

    var map = new google.maps.Map(element, map_options);

    var map_window = new google.maps.InfoWindow({

      content: tooltip_content

    });

    google.maps.event.addDomListener(window, "resize", function() {

        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);

    });

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Initialize: View (Modal, Amazon CloudFormation)

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function view_modal_prompt_amazon_cloudformation_init() {

    $("#modal-prompt-amazon-cloudformation-aws-region").change(function() {

      view_modal_prompt_amazon_cloudformation_update_button()

    });

    $("input[name='modal-prompt-amazon-cloudformation-stack-configuration']").change(function() {

      $('#modal-prompt-amazon-cloudformation-stack-configuration').find('input[type=radio]').each(function(){

        if ($(this).attr('checked')) {

          $(this).parent().removeClass("button-stroke");

        } else {

          $(this).parent().addClass("button-stroke");

        }

      });

      view_modal_prompt_amazon_cloudformation_update_button();

    });

    view_modal_prompt_amazon_cloudformation_update_button();

  }

  function view_modal_prompt_amazon_cloudformation_update_button() {

    var cloudformation_stack_configuration = $("input[name='modal-prompt-amazon-cloudformation-stack-configuration']:checked").val();
    var cloudformation_aws_region = $("#modal-prompt-amazon-cloudformation-aws-region").val();
    var cloudformation_button_link = "https://console.aws.amazon.com/cloudformation/home?region=" + cloudformation_aws_region + "#/stacks/new?templateURL=https://s3.amazonaws.com/downloads.mesosphere.io/dcos/stable/" + cloudformation_stack_configuration + ".cloudformation.json";

    $("#modal-prompt-amazon-cloudformation-button").attr("href", cloudformation_button_link);

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Initialize: Form Handlers

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function form_handlers_init() {

    // Register Modal Show Event for analytics

    $("#modal-beta-signup").on("showhide", function (e, visible) {

      if (visible) {

        analytics.track("Sign up beta modal shown.");

      }

    });

    $("form").each(function(i, el) {
      var name = $(el).find("input[type=hidden]").attr("name");

      $(el).submit(function() {
        analytics.track("contact-form", {
          name: name
        });
      });

      var track = function(ev) {

        analytics.track(ev, {
          name: name,
          source: window.location.toString(),
          input: $(this).attr("name")
        });

      };

      $(el).find("input").focus(
        _.partial(track, "form-input-focus")).focusout(
        _.partial(track, "form-input-focusout"));

    });

    $("[data-toggle=modal]").click(function() {
      var title = $(this).attr("data-target")

      analytics.page({
        title: title,
        url: window.location.toString() + title,
        path: window.location.pathname + title,
        referrer: window.location.toString()
      });

      analytics.track("open-modal", {
        title: title,
        source: window.location.toString()
      });

    });

    form_handler($('#form-contact-product-azure'));
    form_handler($('#form-contact-product-enterprise'));
    form_handler($('#form-contact-product-launchpad'));
    form_handler($('#form-contact-product-mesos-upgrade'));
    form_handler($('#form-contact-product-support'));
    form_handler($('#form-contact-product-google'));

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Initialize: Form Handler (Contact Form Product Enterprise)

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function form_handler(form) {

    form.submit(function(e) {

      e.preventDefault();

      var email = form.find("input[name=email]").val();
      var confirmation = $(form.data('on-submit-show'));
      var salesforce_source = "website";

      analytics.identify(email, _.reduce(form.find("input,textarea"), function(acc, el) {

        acc[$(el).attr("name")] = $(el).val();
        return acc;

      }, {

        "LeadSource": salesforce_source,
        "path": window.location.toString()

      }), {

        'Salesforce': true

      });

      form.addClass("hide");
      confirmation.removeClass("hide");

      modal_resize();

      return false;

    });

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Scroll To Element On Click

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function scroll_on_click() {

    $('.scroll-on-click').on('click', function(event) {

      var target = $($(this).attr('href'));
      var target_focus = null;

      if ($(this).hasClass('focus-on-click')) {

        var target_focus = $($(this).data('focus-element'));

      }

      if (target.length) {

        event.preventDefault();

        $('html, body').animate({

          scrollTop: target.offset().top

        }, {

          duration: 1000,
          complete: function(){

            if (target_focus.length) {

              target_focus.focus();

            }

          }

        });

      }

    });

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Focus On Element On Click

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function focus_on_click() {

    $('.focus-on-click').on('click', function(event) {

      var target = $($(this).data('focus-element'));

      if (!$(this).hasClass('scroll-on-click') && (target.length)) {

        target.focus();

      }

    });

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Event Handler: Window Resize

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function window_resize() {

    var responsive_viewport = $(window).width() + $.app.scrollbar_width;

    if (responsive_viewport < 481) {

    }

    if (responsive_viewport > 481) {

    }

    if (responsive_viewport < 768) {

    }

    if (responsive_viewport >= 768) {

      canvas_sidebar_close();

    }



    /* ----------------------------------------------------------------------------------------------------
    Adjust Wordpress Admin Bar
    ---------------------------------------------------------------------------------------------------- */

    var wordpress_admin_bar = $('#wpadminbar');

    if (wordpress_admin_bar.length) {

      wordpress_admin_bar.css({

        'position'  :   'absolute',
        'top'       :   (-1 * wordpress_admin_bar.height())

      });

    }



    /* ----------------------------------------------------------------------------------------------------
    Invoke Window Scroll method
    ---------------------------------------------------------------------------------------------------- */

    window_scroll();



    /* ----------------------------------------------------------------------------------------------------
    Video Resize
    ---------------------------------------------------------------------------------------------------- */

    adjust_fluid_videos();



    /* ----------------------------------------------------------------------------------------------------
    Adjust Page Header Video Width
    ---------------------------------------------------------------------------------------------------- */

    var page_header_background_video = $("#page-header-background-video");
    var page_header_background_video_width = page_header_background_video.width();
    var page_header_background_video_height = page_header_background_video.height();

    var page_header_background_video_player = $("#page-header-background-video video");
    var page_header_background_video_player_width = 1280;
    var page_header_background_video_player_height = 720;

    var page_header_background_video_player_width_new = page_header_background_video_width;
    var page_header_background_video_player_height_new = (page_header_background_video_player_width_new / page_header_background_video_player_width) * page_header_background_video_player_height;

    if (page_header_background_video_player_height_new < page_header_background_video_height) {

      var page_header_background_video_player_height_new = page_header_background_video_height;
      var page_header_background_video_player_width_new = (page_header_background_video_player_height_new / page_header_background_video_player_height) * page_header_background_video_player_width;

    }

    page_header_background_video_player.css({

      'width'      :  page_header_background_video_player_width_new,
      'height'      :  page_header_background_video_player_height_new,
      'position'    :  'absolute',
      'top'      :  '50%',
      'left'      :  '50%',
      'margin-left'  :  (-1 * (page_header_background_video_player_width_new / 2)),
      'margin-top'    :  (-1 * (page_header_background_video_player_height_new / 2))

    });



    /* ----------------------------------------------------------------------------------------------------
    Initialize Dynamically Positioned/Resized Elements
    ---------------------------------------------------------------------------------------------------- */

    $('.fill-vertical').fillVertical();
    $('.size-to-fit').sizeToFit();
    $('.center-vertical').centerVertical();
    $('.center-horizontal').centerHorizontal();
    $('.vertically-balanced').verticallyBalanced();



    /* ----------------------------------------------------------------------------------------------------
    Resize Modal
    ---------------------------------------------------------------------------------------------------- */

    modal_resize();

  }

  window.window_resize = window_resize;






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Event Handler: Modal Resize

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function modal_resize() {

    $('.modal').each(function(index, value) {

      if($(this).hasClass('fade') && !$(this).hasClass('in')) {

        $(this).css({

          display:    'block'

        });

      }

      var modal_content = $(this).find('.modal-content');
      var modal_content_inner = $(this).find('.modal-content-inner');

      var window_height = $(window).height();
      var modal_content_height = modal_content.height();
      var modal_content_inner_height = modal_content_inner.outerHeight();
      var modal_horizontal_offset = $(this).css('left');
      var modal_margins = 12;

      if (modal_horizontal_offset > 0) {

        var modal_margins = modal_horizontal_offset;

      }

      if ((modal_content_inner_height + (2 * modal_margins)) > window_height) {

        modal_content.css({

          'height'  :  window_height - (2 * modal_margins)

        });

      } else {

        modal_content.css({

          'height'  :  modal_content_inner_height

        });

      }

      $(this).css({

        'margin-top'  :  -1 * ($(this).outerHeight() / 2)

      });

      // Remove display:block for resizing calculations to avoid element covering screen

      if($(this).hasClass('fade') && !$(this).hasClass('in')) {

        $(this).css({

          display:    'none'

        });

      }

    });

  }

  window.modal_resize = modal_resize;






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Event Handler: Window Scroll

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function window_scroll() {

    var scroll_top = $(window).scrollTop() - $('#canvas').offset().top;

    // Show/Hide Header

    var header_sidebar_toggle = $('.canvas-sidebar-toggle');

    if (scroll_top > 0) {

      header_sidebar_toggle.addClass('fade');

    } else {

      header_sidebar_toggle.removeClass('fade');

    }

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Canvas Sidebar Toggle

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function canvas_sidebar_toggle() {

    if($('body').hasClass("canvas-sidebar-open")) {

      canvas_sidebar_close();

    } else {

      canvas_sidebar_open();

    }

  }

  function canvas_sidebar_open() {

    $('body').addClass("canvas-sidebar-open");

  }

  function canvas_sidebar_close() {

    $('body').removeClass("canvas-sidebar-open");

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Initialize Video

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  window.init_videos = function(element) {

    $(function(){

      if (element.is(".youtube-player[data-video]")) {

        init_video(element);

      } else {

        element.find(".youtube-player[data-video]").each(function() {

          init_video($(this));

        });

      }

      function init_video(element) {

        var video = element.data('video');
        var id = video + "-" + (1000 * Math.random());

        element.attr('id', id);

        var player = new YT.Player(id, {

          videoId: video,
          events: {

            'onReady':  onPlayerReady

          }

        });

        function onPlayerReady(event) {

          $(event.target.getIframe()).data('player',event.target);
          adjust_fluid_videos();

        }

        adjust_fluid_videos();

      };

    });

  }

  window.onYouTubeIframeAPIReady = function(){

    window.init_videos($('body'));

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Adjust Fluid Videos

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function adjust_fluid_videos() {

    $("iframe[src*='//player.vimeo.com'], iframe[src*='//www.youtube.com'], object, embed").each(function() {

      var $video = $(this);

      var video_width_new = $video.parent().width();

      var aspect_ratio = $(this).attr('data-aspect-ratio');

      if ((aspect_ratio == null) || (aspect_ratio == "")) {

        $(this).attr('data-aspect-ratio', this.height / this.width).removeAttr('height').removeAttr('width');

        aspect_ratio = $(this).attr('data-aspect-ratio');

      }

      $video.width(video_width_new).height(video_width_new * $video.attr('data-aspect-ratio'));

    });

  }

  window.adjust_fluid_videos = adjust_fluid_videos;







  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Simulate input placeholder

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function simulate_placeholders() {

    var input = document.createElement("input");

    if(('placeholder' in input) == false) {

      $('[placeholder]').focus(function() {

        var i = $(this);

        if(i.val() == i.attr('placeholder')) {

          i.val('').removeClass('placeholder');

          if(i.hasClass('password')) {

            i.removeClass('password');
            this.type='password';

          }

        }

      }).blur(function() {

        var i = $(this);

        if(i.val() == '' || i.val() == i.attr('placeholder')) {

          if(this.type=='password') {

            i.addClass('password');
            this.type='text';

          }

          i.addClass('placeholder').val(i.attr('placeholder'));

        }

      }).blur().parents('form').submit(function() {

        $(this).find('[placeholder]').each(function() {

          var i = $(this);

          if(i.val() == i.attr('placeholder')) {

            i.val('');

          }

        })

      });

    }

  }



  /* --------------------------------------------------
  Initialize Backstretch
  -------------------------------------------------- */

  function init_backstretch(selector) {

    $(selector).each(function() {

      if($(this).data('backstretch-image')) {

        $(this).backstretch($(this).data('backstretch-image'));

        if($(this).data('backstretch-image-retina')) {

          $(this).find('img').retina('@2x');

        }

      }

    });

  }



  /* --------------------------------------------------
  Initialize Backstretch
  -------------------------------------------------- */

  function init_video(selector) {

    $(selector).each(function() {

      var src_webm = $(this).data('video-webm');
      var src_ogg = $(this).data('video-ogg');
      var src_mp4 = $(this).data('video-mp4');
      var src_swf = $(this).data('video-swf');
      var image_path = $(this).data('video-image-path');
      var autoplay = $(this).data('video-autoplay');

      var video = '';
      var video_swf = '';



      if(((src_webm != '') && (src_webm != null)) || ((src_ogg != '') && (src_ogg != null)) || ((src_mp4 != '') && (src_mp4 != null))) {

        video = $('<video preload="auto" autoplay="' + autoplay + '" loop="" muted=""><source src="' + src_webm + '" type="video/webm"><source src="' + src_ogg + '" type="video/ogg; codecs=&quot;theora, vorbis&quot;"><source src="' + src_mp4 + '" type="video/mp4"></video>');

        if((image_path != '') && (image_path != null)) {

          video.attr('poster', '/wp-content/themes/mesosphere/library/images/layout/page-header/transparent.png');

          video.css({

            'background-image': 'url(' + image_path + ')',

          });

        }

      }

      if((src_swf != '') && (src_swf != null)) {

        video_swf = $('<object scale="noborder" type="application/x-shockwave-flash" data="' + src_swf + '" id="page-header-background-video-swf" name="page-header-background-video-swf" height="100%" width="100%"><param name="movie" value="' + src_swf + '"><param name="allowScriptAccess" value="always"><param name="allowNetworking" value="all"><param name="wmode" value="opaque"></object>');

      }

      $(this).append(video);
      $(this).append(video_swf);

    });

    window_resize();

  }



  /* --------------------------------------------------
  Initialize Tooltips
  -------------------------------------------------- */

  function init_tooltips() {

    $('.has-tooltip').each(function() {

      if($(this).hasClass('tooltip-on-focus')) {

        $(this).tooltip({

          'html'    :  true,
          'trigger'  :  'focus',
          'container'  :  '#canvas',
          'delay'    :  {

            show  :  200,
            hide  :  100

          }

        });

      } else {

        $(this).tooltip({

          'html'    :   true,
          'trigger'  :  'hover',
          'container'  :  '#canvas',
          'delay'    :  {

            show  :  200,
            hide  :  100

          }

        });

      }

    });

  }

  window.init_tooltips = init_tooltips;



  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Get Browser Dimensions

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function get_browser_dimensions() {

    var dimensions = {

      width: 0,
      height: 0

    };

    if ($(window)) {

      dimensions.width = $(window).width();
      dimensions.height = $(window).height();

    }

    return dimensions;

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Get Scrollbar Width

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  function get_scrollbar_width() {

      var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div></div>');
      $('body').append(div);
      var w1 = $('div', div).innerWidth();
      div.css('overflow-y', 'auto');
      var w2 = $('div', div).innerWidth();
      $(div).remove();
      return (w1 - w2);

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Fill Element Vertically

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  $.fn.fillVertical = function() {

    var html_offset = parseInt($('html').css('margin-top'));

    return this.each(function(i) {

      var element = $(this);
      var element_new_height = 0;
      var element_inner_height = element.height();
      var element_padding_height = element.outerHeight() - element_inner_height;
      var element_children_height = 0;
      var element_height_min = null;
      var element_height_max = null;
      var responsive_viewport = $(window).width() + $.app.scrollbar_width;

      element.children().each(function() {

        element_children_height = element_children_height + $(this).outerHeight();

      });

      element_new_height = $(window).height() - html_offset - element_padding_height;

      if (element.data('fill-vertical-min') || element.data('fill-vertical-max')) {

        if (element.data('fill-vertical-min')) {

          element_height_min = element.data('fill-vertical-min');

        }

        if (element.data('fill-vertical-max')) {

          element_height_max = element.data('fill-vertical-max');

        }

      }

      if (responsive_viewport >= 480) {

        if (element.data('fill-vertical-min-screen-size-mini') || element.data('fill-vertical-max-screen-size-mini')) {

          if (element.data('fill-vertical-min-screen-size-mini')) {

            element_height_min = element.data('fill-vertical-min-screen-size-mini');

          }

          if (element.data('fill-vertical-max-screen-size-mini')) {

            element_height_max = element.data('fill-vertical-max-screen-size-mini');

          }

        }

      }

      if (responsive_viewport >= 768) {

        if (element.data('fill-vertical-min-screen-size-small') || element.data('fill-vertical-max-screen-size-small')) {

          if (element.data('fill-vertical-min-screen-size-small')) {

            element_height_min = element.data('fill-vertical-min-screen-size-small');

          }

          if (element.data('fill-vertical-max-screen-size-small')) {

            element_height_max = element.data('fill-vertical-max-screen-size-small');

          }

        }

      }

      if (responsive_viewport >= 992) {

        if (element.data('fill-vertical-min-screen-size-medium') || element.data('fill-vertical-max-screen-size-medium')) {

          if (element.data('fill-vertical-min-screen-size-medium')) {

            element_height_min = element.data('fill-vertical-min-screen-size-medium');

          }

          if (element.data('fill-vertical-max-screen-size-medium')) {

            element_height_max = element.data('fill-vertical-max-screen-size-medium');

          }

        }

      }

      if (responsive_viewport >= 1400) {

        if (element.data('fill-vertical-min-screen-size-large') || element.data('fill-vertical-max-screen-size-large')) {

          if (element.data('fill-vertical-min-screen-size-large')) {

            element_height_min = element.data('fill-vertical-min-screen-size-large');

          }

          if (element.data('fill-vertical-max-screen-size-large')) {

            element_height_max = element.data('fill-vertical-max-screen-size-large');

          }

        }

      }

      if ((element_new_height > (element_height_max - element_padding_height)) && (element_height_max != null)) {

        element_new_height = element_height_max - element_padding_height;

      }

      if (element_new_height < element_children_height) {

        element_new_height = element_children_height;

      }

      if ((element_new_height < (element_height_min - element_padding_height)) && (element_height_min != null)) {

        element_new_height = element_height_min - element_padding_height;

      }

      element.height(element_new_height);

    });

  }






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Vertically Center Element Relative To Parent

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  $.fn.centerVertical = function() {

    var responsive_viewport = $(window).width() + $.app.scrollbar_width;

    return this.each(function(i) {

        var center_vertical_screen_size_min = 0;
        var element_parent = $(this).parent();

        if($(this).data('center-vertical-screen-size-min')) {

          center_vertical_screen_size_min = $(this).data('center-vertical-screen-size-min');

        }

        // If Viewport is less than vertically_balanced_screen_size_min

        if (responsive_viewport < center_vertical_screen_size_min) {

          $(this).css({

            "margin-top":  "auto",
            "top":      "auto",
            "position":    "relative"

          });

          element_parent.css({

            "position":    "relative"

          });

        }

        // If Viewport is above or equal to vertically_balanced_screen_size_min

        if (responsive_viewport >= center_vertical_screen_size_min) {

        var element_height = $(this).height();
        var element_height_outer = $(this).outerHeight();
        var element_margin_top = (element_height + (element_height_outer - element_height)) / 2;

        if ($(this).data('size-to-fit-respect-padding')) {

          var element_padding_offset_top = parseInt(element_parent.css('padding-top')) / 2;
          var element_padding_offset_bottom = parseInt(element_parent.css('padding-bottom')) / 2;

          element_margin_top = element_margin_top - element_padding_offset_top + element_padding_offset_bottom;

        }

        $(this).css({

          "margin-top":  "-" + element_margin_top + "px",
          "top":      "50%",
          "position":    "absolute"

        });

        element_parent.css({

          "position":    "relative"

        });

      }

    });

  };






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Horizontally Center Element Relative To Parent

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  $.fn.centerHorizontal = function() {

    return this.each(function(i) {

      var parent = $(this).parent();
      var w = $(this).width();
      var ow = $(this).outerWidth();
      var ml = (w + (ow - w)) / 2;

      $(this).css({

        "margin-left":  "-" + ml + "px",
        "left":      "50%",
        "position":    "absolute"

      });

      parent.css({

        "position":    "relative"

      });

    });

  };






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Scale Element to Fit While Retaining Original Aspect Ratio

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  $.fn.sizeToFit = function() {

    return this.each(function(i){

      var ratio = $(this).data('size-to-fit-ratio');

      switch ($(this).data('size-to-fit')) {

        case 'height':

          var padding_offset = 0;

          if ($(this).data('size-to-fit-respect-padding')) {

            padding_offset = $(this).parent().paddingTop() - $(this).parent().paddingBottom();
          }

          var new_height = $(this).parent().height() - padding_offset;
          var new_width = new_height * ratio;

          break;

        case 'width':
        default:

          var padding_offset = 0;

          if ($(this).data('size-to-fit-respect-padding')) {

            padding_offset = $(this).parent().paddingLeft() - $(this).parent().paddingRight();
          }

          var new_width = $(this).parent().width() - padding_offset;
          var new_height = new_width * ratio;

          break;

      };

      $(this).css("width", new_width);
      $(this).css("height", new_height);

    });

  };






  /* ----------------------------------------------------------------------------------------------------
  -------------------------------------------------------------------------------------------------------

  Adjust Heights of Columns Content to Match Tallest Element

  -------------------------------------------------------------------------------------------------------
  ---------------------------------------------------------------------------------------------------- */

  $.fn.verticallyBalanced = function() {

      // Get Viewport width

      var responsive_viewport = $(window).width() + $.app.scrollbar_width;

    return this.each(function(i){

      var vertically_balanced_columns = $(this).find('.vertically-balanced-column');

        var vertically_balanced_screen_size_min = 0;

        if($(this).data('vertically-balanced-screen-size-min')) {

          vertically_balanced_screen_size_min = $(this).data('vertically-balanced-screen-size-min')

        }

      // If Viewport is less than 768px

        if (responsive_viewport < vertically_balanced_screen_size_min) {

        vertically_balanced_columns.each(function() {

          $(this).css({

            'height':  'auto'

          });

          if($(this).hasClass('vertically-balanced-column-center-vertical')) {

            var vertically_balanced_column_inner = $(this).find('.vertically-balanced-column-inner');

            vertically_balanced_column_inner.css({

              "margin-top":  "auto",
              "top":      "none",
              "position":    "relative"

            });

          }

        });

        }

        // If Viewport is above or equal to vertically_balanced_screen_size_min

        if (responsive_viewport >= vertically_balanced_screen_size_min) {

        var vertically_balanced_columns_height_max = 0;

        vertically_balanced_columns.each(function() {

          var vertically_balanced_column_inner = $(this).find('.vertically-balanced-column-inner');

          if (!vertically_balanced_column_inner.length) {

            $(this).wrapInner("<div class='vertically-balanced-column-inner'></div>");

            vertically_balanced_column_inner = $(this).find('.vertically-balanced-column-inner');

          }

          if (vertically_balanced_column_inner.height() > vertically_balanced_columns_height_max) {

            vertically_balanced_columns_height_max = vertically_balanced_column_inner.height();

          }

        });

        vertically_balanced_columns.each(function() {

          var offset_h = $(this).outerHeight() - $(this).height();

          $(this).css({

            'height':  vertically_balanced_columns_height_max + offset_h

          });

          if($(this).hasClass('vertically-balanced-column-center-vertical')) {

            var vertically_balanced_column_inner = $(this).find('.vertically-balanced-column-inner');

            var vertically_balanced_column_inner_height = vertically_balanced_column_inner.height();
            var vertically_balanced_column_inner_outer_height = vertically_balanced_column_inner.outerHeight();
            var vertically_balanced_column_inner_margin_top = (vertically_balanced_column_inner_height + (vertically_balanced_column_inner_outer_height - vertically_balanced_column_inner_height)) / 2;

            vertically_balanced_column_inner.css({

              "margin-top":  "-" + vertically_balanced_column_inner_margin_top + "px",
              "top":      "50%",
              "position":    "absolute",
              "width":    '100%'

            });

            $(this).css({

              "position":    "relative"

            });

          }

        });

        }

    });

  };

} (window.jQuery)
