(function(document) {
  'use strict';

  // 4. Conditionally load webcomponentsjs polyfill.
  var webComponentsSupported = ('registerElement' in document &&
  'import' in document.createElement('link') &&
  'content' in document.createElement('template'));

  function finishLazyLoading() {
    // HTML Import's link element.
    var link = document.querySelector('#bundle');

    // 6. Remove skeleton.
    function onImportLoaded() {
      // var skeleton = document.getElementById('skeleton');
      // skeleton.remove();

      console.log('Elements are upgraded!');
    }

    // 5. Go if the async Import loaded quickly. Otherwise wait for it.
    if (link.import && link.import.readyState === 'complete') {
      console.log('async Import loaded too quickly! Please wait...');
      onImportLoaded();
    }else {
      console.log('Removing skeleton...');
      link.addEventListener('load', onImportLoaded);
    }
  }

  // check if Native Shadow DOM is supported on current running browser.
  if (!webComponentsSupported) {
    var script = document.createElement('script');
    script.async = true;
    script.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js';
    script.onload = finishLazyLoading;
    document.head.appendChild(script);
    console.log('web-components polyfill is needed!');
  }else {
    console.log('Native Shadow DOM supported! finishlazyLoading...');
    finishLazyLoading();
  }

  // run this when polyfill is needed.
  window.addEventListener('WebComponentsReady', function() {
    console.log('web-components-ready');
  });

  // We use Page.js for routing. This is a Micro
  // client-side router inspired by the Express router
  // More info: https://visionmedia.github.io/page.js/
  // Middleware

  var blog = document.querySelector('semafloor-app-page');

  /**
   * Utility function to listen to an event on a node once.
   */
  function once(node, event, fn, args) {
    /* jshint validthis: true */
    var _self = this;
    var listener = function() {
      fn.apply(_self, args);
      node.removeEventListener(event, listener, false);
    };
    node.addEventListener(event, listener, false);
  }

  /**
   * Routes
   */
  // page('/:category/list', function (ctx, next) {
  page('/:category/list', function(ctx) {
    console.log(ctx);
    var category = ctx.params.category;

    function setData() {

      blog.category = category;
      blog.page = category;
      window.scrollTo(0, 0);
    }

    // Check if element prototype has not been upgraded yet.
    if (!blog.upgraded) {
      once(blog, 'upgraded', setData);
    }else {
      setData();
    }
  });

  page('*', function() {
    console.log('Cant\'t find: ' +
    window.location.href +
    '. Redirected you to Home Page');
    page.redirect('/profile/list');
  });

  page({
    hashbang: true
  });
  // add #! before urls
  // try {
  // } catch (e) {
  //   console.log(e);
  // }

  // app.displayInstalledToast = function() {
  //   // Check to make sure caching is actually enabled—it won't be in the dev environment.
  //   if (!document.querySelector('platinum-sw-cache').disabled) {
  //     document.querySelector('#caching-complete').show();
  //   }
  // };
  // app.addEventListener('dom-change', function() {
  //   console.log('Our app is ready to rock!');
  // });
  //
  // // See https://github.com/Polymer/polymer/issues/1381
  // window.addEventListener('WebComponentsReady', function() {
  //   // imports are loaded and elements have been registered
  // });

})(document);
