(function ($) {
  "use strict";

  var language = localStorage.getItem("language");
  // Default Language
  var default_lang = "eng";

  function setLanguage(lang) {
    if (lang == "eng") {
      document.getElementById("header-lang-img").src =
        "assets/images/flags/us.jpg";
    } else if (lang == "sp") {
      document.getElementById("header-lang-img").src =
        "assets/images/flags/spain.jpg";
    } else if (lang == "gr") {
      document.getElementById("header-lang-img").src =
        "assets/images/flags/germany.jpg";
    } else if (lang == "it") {
      document.getElementById("header-lang-img").src =
        "assets/images/flags/italy.jpg";
    } else if (lang == "ru") {
      document.getElementById("header-lang-img").src =
        "assets/images/flags/russia.jpg";
    }
    localStorage.setItem("language", lang);
    language = localStorage.getItem("language");
    getLanguage();
  }

  // Multi language setting
  function getLanguage() {
    language == null ? setLanguage(default_lang) : false;
    $.getJSON("assets/lang/" + language + ".json", function (lang) {
      $("html").attr("lang", language);
      $.each(lang, function (index, val) {
        index === "head" ? $(document).attr("title", val["title"]) : false;
        $("[key='" + index + "']").text(val);
      });
    });
  }

  function initMetisMenu() {
    //metis menu
    $("#side-menu").metisMenu();
  }

  function initLeftMenuCollapse() {
    $("#vertical-menu-btn").on("click", function (event) {
      event.preventDefault();
      $("body").toggleClass("sidebar-enable");
      if ($(window).width() >= 992) {
        $("body").toggleClass("vertical-collpsed");
      } else {
        $("body").removeClass("vertical-collpsed");
      }
    });
  }

  function initActiveMenu() {
    // === following js will activate the menu in left side bar based on url ====
    $("#sidebar-menu a").each(function () {
      var pageUrl = window.location.href.split(/[?#]/)[0];
      if (this.href == pageUrl) {
        $(this).addClass("active");
        $(this).parent().addClass("mm-active"); // add active to li of the current link
        $(this).parent().parent().addClass("mm-show");
        $(this).parent().parent().prev().addClass("mm-active"); // add active class to an anchor
        $(this).parent().parent().parent().addClass("mm-active");
        $(this).parent().parent().parent().parent().addClass("mm-show"); // add active to li of the current link
        $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .addClass("mm-active");
      }
    });
  }

  function initMenuItemScroll() {
    // focus active menu in left sidebar
    $(document).ready(function () {
      if (
        $("#sidebar-menu").length > 0 &&
        $("#sidebar-menu .mm-active .active").length > 0
      ) {
        var activeMenu = $("#sidebar-menu .mm-active .active").offset().top;
        if (activeMenu > 300) {
          activeMenu = activeMenu - 300;
          $(".simplebar-content-wrapper").animate(
            { scrollTop: activeMenu },
            "slow"
          );
        }
      }
    });
  }

  function initHoriMenuActive() {
    $(".navbar-nav a").each(function () {
      var pageUrl = window.location.href.split(/[?#]/)[0];
      if (this.href == pageUrl) {
        $(this).addClass("active");
        $(this).parent().addClass("active");
        $(this).parent().parent().addClass("active");
        $(this).parent().parent().parent().addClass("active");
        $(this).parent().parent().parent().parent().addClass("active");
        $(this).parent().parent().parent().parent().parent().addClass("active");
      }
    });
  }

  function initFullScreen() {
    $('[data-toggle="fullscreen"]').on("click", function (e) {
      e.preventDefault();
      $("body").toggleClass("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */ !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    });
    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("mozfullscreenchange", exitHandler);
    function exitHandler() {
      if (
        !document.webkitIsFullScreen &&
        !document.mozFullScreen &&
        !document.msFullscreenElement
      ) {
        console.log("pressed");
        $("body").removeClass("fullscreen-enable");
      }
    }
  }

  function initRightSidebar() {
    // right side-bar toggle
    $(".right-bar-toggle").on("click", function (e) {
      $("body").toggleClass("right-bar-enabled");
    });

    $(document).on("click", "body", function (e) {
      if ($(e.target).closest(".right-bar-toggle, .right-bar").length > 0) {
        return;
      }

      $("body").removeClass("right-bar-enabled");
      return;
    });
  }

  function initDropdownMenu() {
    $(".dropdown-menu a.dropdown-toggle").on("click", function (e) {
      if (!$(this).next().hasClass("show")) {
        $(this)
          .parents(".dropdown-menu")
          .first()
          .find(".show")
          .removeClass("show");
      }
      var $subMenu = $(this).next(".dropdown-menu");
      $subMenu.toggleClass("show");

      return false;
    });
  }

  function initComponents() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });

    $(function () {
      $('[data-toggle="popover"]').popover();
    });
  }

  function initPreloader() {
    $(window).on("load", function () {
      $("#status").fadeOut();
      $("#preloader").delay(350).fadeOut("slow");
    });
  }

  function initSettings() {
    if (window.sessionStorage) {
      var alreadyVisited = sessionStorage.getItem("is_visited");
      if (!alreadyVisited) {
        sessionStorage.setItem("is_visited", "light-mode-switch");
      } else {
        $(".right-bar input:checkbox").prop("checked", false);
        $("#" + alreadyVisited).prop("checked", true);
        updateThemeSetting(alreadyVisited);
      }
    }
    $("#light-mode-switch, #dark-mode-switch, #rtl-mode-switch").on(
      "change",
      function (e) {
        updateThemeSetting(e.target.id);
      }
    );
  }

  function updateThemeSetting(id) {
    if (
      $("#light-mode-switch").prop("checked") == true &&
      id === "light-mode-switch"
    ) {
      $("#dark-mode-switch").prop("checked", false);
      $("#rtl-mode-switch").prop("checked", false);
      $("#bootstrap-style").attr("href", "assets/css/bootstrap.min.css");
      $("#app-style").attr("href", "assets/css/app.min.css");
      sessionStorage.setItem("is_visited", "light-mode-switch");
    } else if (
      $("#dark-mode-switch").prop("checked") == true &&
      id === "dark-mode-switch"
    ) {
      $("#light-mode-switch").prop("checked", false);
      $("#rtl-mode-switch").prop("checked", false);
      $("#bootstrap-style").attr("href", "assets/css/bootstrap-dark.min.css");
      $("#app-style").attr("href", "assets/css/app-dark.min.css");
      sessionStorage.setItem("is_visited", "dark-mode-switch");
    } else if (
      $("#rtl-mode-switch").prop("checked") == true &&
      id === "rtl-mode-switch"
    ) {
      $("#light-mode-switch").prop("checked", false);
      $("#dark-mode-switch").prop("checked", false);
      $("#bootstrap-style").attr("href", "assets/css/bootstrap.min.css");
      $("#app-style").attr("href", "assets/css/app-rtl.min.css");
      sessionStorage.setItem("is_visited", "rtl-mode-switch");
    }
  }

  // function initLanguage() {
  //   // Auto Loader
  //   if (language != null && language !== default_lang)
  //     console.log("lang", language);
  //   setLanguage(language);
  //   $(".language").on("click", function (e) {
  //     setLanguage($(this).attr("data-lang"));
  //   });
  // }

  function convert() {
    if (typeof currencies !== "undefined") {
      setTimeout(() => {
        let currencyId = $("[name='method']:checked").val();
        let converted = parseFloat(
          parseFloat($("#usdBalance").val())  / (10000 * currencies[currencyId]["price"])
        ).toFixed(8);
        $("#converted").val(converted);
      }, 50);
    }
  }

  function updateMinWithdrawals() {
    if (typeof currencies !== "undefined") {
      let currencyId = $("[name='method']:checked").val();
      $("#minimumWithdrawal").html(
        `Minimum withdrawal is ${currencies[currencyId]["minimumWithdrawal"]} ${website_coin}`
      );
      $("#usdBalance").attr("min", currencies[currencyId]["minimumWithdrawal"]);
    }
  }

  function converter() {
    $("#usdBalance").keypress(() => {
      convert();
    });

    $("[name='method']").click(() => {
      if ($("#usdBalance").val() !== "") {
        convert();
      }
      updateMinWithdrawals();
    });
  }

  //
  function dconvert() {
      setTimeout(() => {
        let dconverted = $("#beeamount").val() / 10000;
        $("#dconverted").val(dconverted);
      }, 50);

  }


  function dconverter() {

    $("#beeamount").keypress(() => {
      dconvert();
    });

 }

 //

  function lottery() {
    $("#lotteryAmount").keypress(() => {
      setTimeout(() => {
        let amount = parseInt($("#lotteryAmount").val());
        let total = amount * lotteryPrice;
        let mochax = amount < 2 ? "ticket" : "tickets";
        $("#buyButton").html(`Buy ${amount} ${mochax} with ${total} ${website_coin}`);
      }, 50);
    });
  }

  function readNotification() {
    $("#page-header-notifications-dropdown").click(function () {
      $.get(site_url + "dashboard/read_notifications", function (data) {});
    });
  }

  function init() {
    initMetisMenu();
    initLeftMenuCollapse();
    initActiveMenu();
    initMenuItemScroll();
    initHoriMenuActive();
    initFullScreen();
    initRightSidebar();
    initDropdownMenu();
    initComponents();
    initSettings();
    // initLanguage();
    initPreloader();
    convert();
    dconvert();
    converter();
    dconverter();
    lottery();
    updateMinWithdrawals();
    readNotification();
    Waves.init();
  }

  init();
})(jQuery);

document.addEventListener('DOMContentLoaded', () => {
  const applicationServerKey = 'BL0KhKoR4-iywyr87A1Q5ZfQcEozO2cdUEZGhxGKm4raROAZgU1sluwh90rOB5bAX-jKjGnIAc8Cxj4T_cHfwOg';

  const pushButton = document.querySelector('#push-subscription-button');
  if (!pushButton) {
    return;
  }

  pushButton.addEventListener('click', function() {
    push_subscribe();
  });

  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported by this browser');
    changePushButtonState('incompatible');
    return;
  }

  if (!('PushManager' in window)) {
    console.warn('Push notifications are not supported by this browser');
    changePushButtonState('incompatible');
    return;
  }

  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    console.warn('Notifications are not supported by this browser');
    changePushButtonState('incompatible');
    return;
  }

  // Check the current Notification permission.
  // If its denied, the button should appears as such, until the user changes the permission manually
  if (Notification.permission === 'denied') {
    console.warn('Notifications are denied by the user');
    changePushButtonState('incompatible');
    return;
  }

  navigator.serviceWorker.register('serviceWorker.js').then(
    () => {
      console.log('[SW] Service worker has been registered');
      // push_updateSubscription();
    },
    e => {
      console.error('[SW] Service worker registration failed', e);
      changePushButtonState('incompatible');
    }
  );

  function changePushButtonState(state) {
    switch (state) {
      case 'enabled':
        pushButton.disabled = false;
        pushButton.textContent = 'Disable Push notifications';
        isPushEnabled = true;
        break;
      case 'disabled':
        pushButton.disabled = false;
        pushButton.textContent = 'Enable Push notifications';
        isPushEnabled = false;
        break;
      case 'computing':
        pushButton.disabled = true;
        pushButton.textContent = 'Loading...';
        break;
      case 'incompatible':
        pushButton.disabled = true;
        pushButton.textContent = 'Push notifications are not compatible with this browser';
        break;
      default:
        console.error('Unhandled push button state', state);
        break;
    }
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function checkNotificationPermission() {
    return new Promise((resolve, reject) => {
      if (Notification.permission === 'denied') {
        return reject(new Error('Push messages are blocked.'));
      }

      if (Notification.permission === 'granted') {
        return resolve();
      }

      if (Notification.permission === 'default') {
        return Notification.requestPermission().then(result => {
          if (result !== 'granted') {
            reject(new Error('Bad permission result'));
          } else {
            resolve();
          }
        });
      }

      return reject(new Error('Unknown permission'));
    });
  }

  function push_subscribe() {
    changePushButtonState('computing');

    return checkNotificationPermission()
      .then(() => navigator.serviceWorker.ready)
      .then(serviceWorkerRegistration =>
        serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
        })
      )
      .then(subscription => {
        // Subscription was successful
        // create subscription on your server
        return push_sendSubscriptionToServer(subscription, 'POST');
      })
      .then(subscription => subscription && location.reload()) // update your UI
      .catch(e => {
        if (Notification.permission === 'denied') {
          // The user denied the notification permission which
          // means we failed to subscribe and the user will need
          // to manually change the notification permission to
          // subscribe to push messages
          console.warn('Notifications are denied by the user.');
          changePushButtonState('incompatible');
        } else {
          // A problem occurred with the subscription; common reasons
          // include network errors or the user skipped the permission
          console.error('Impossible to subscribe to push notifications', e);
          changePushButtonState('disabled');
        }
      });
  }

  function push_sendSubscriptionToServer(subscription, method) {
    const key = subscription.getKey('p256dh');
    const token = subscription.getKey('auth');
    const contentEncoding = (PushManager.supportedContentEncodings || ['aesgcm'])[0];


    return $.ajax({
      url: 'push_subscription',
      method: 'POST',
      data: {
        endpoint: subscription.endpoint,
        publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
        authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
        contentEncoding,
      }
    }).then(() => subscription);
  }
});