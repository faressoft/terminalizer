/**
 * Terminalizer Web Plugin
 * https://terminalizer.com
 * 
 * @author Mohammad Fares <faressoft.com@gmail.com>
 */

(function($) {

  $.fn.terminalizer = function(options) {

    /**
     * The target object
     * @type {Object}
     */
    var self = this;

    /**
     * The terminal instance
     * @type {Object}
     */
    var term = null;

    /**
     * Recording file
     * @type {Object}
     */
    var data = null;

    /**
     * HTML template code
     * @type {String}
     */
    var template = '<div class="terminalizer">' +
      '<div class="terminalizer-frame"><div class="terminalizer-titlebar">' +
      '<div class="buttons"><div class="close"></div><div class="minimize">' +
      '</div><div class="maximize"></div></div><div class="title"></div>' + 
      '</div><div class="terminalizer-body"></div></div></div>';

    // Default options
    options = $.extend({
      recordingFile: null,
      realTiming: false,
      speedFactor: 1.0,
      beforeMiddleware: null,
      afterMiddleware: null
    }, options);

    // Load the recording file
    loadJSON(options.recordingFile).then(function(result) {

      // Cache the data
      data = result;

      // Marge the plugin's options with recording file's configs
      options = $.extend(data.config, options);

      // Terminal
      term = new Terminal({
        cols: options.cols,
        rows: options.rows,
        cursorStyle: options.cursorStyle,
        fontFamily: options.fontFamily,
        fontSize: options.fontSize,
        lineHeight: options.lineHeight,
        letterSpacing: options.letterSpacing,
        allowTransparency: true,
        theme: options.theme
      });

      // Insert the HTML template
      self.html($(template));

      if (options.frameBox.type) {
        self.find('.terminalizer-frame').addClass('terminalizer-' + options.frameBox.type);
      }

      if (options.frameBox.type && options.frameBox.title) {
        self.find('.terminalizer-frame .title').text(options.frameBox.title);
      }

      self.find('.terminalizer-frame').css(options.frameBox.style);

      // Open the terminal
      term.open(self.find('.terminalizer-body')[0]);
      term.focus();

      // Add a watermark
      if (options.watermark.imagePath) {
        return self._addWatermark(options.watermark);
      }

    }).then(function() {
      
      // Play
      play(data.records, self._playCallback, self._doneCallback, options);

    }).catch(function(error) {

      console.error(error);
      
    });

    /**
     * Add a watermark and wait until it is fully loaded
     *
     * @param  {Object}  watermarkConfig {imagePath, style}
     * @return {Promise}
     */
    this._addWatermark = function(watermarkConfig) {
      
      var watermarkImg = document.createElement('img');

      $(watermarkImg).addClass('terminalizer-watermark');
      $(watermarkImg).attr('src', watermarkConfig.imagePath);
      $(watermarkImg).css(watermarkConfig.style);

      this.find('.terminalizer-frame').prepend(watermarkImg);

      return new Promise(function(resolve, reject) {

        $('.terminalizer-watermark').on('load', resolve);
        
      });

    };

    /**
     * Executed after all frames are played
     */
    this._doneCallback = function() {

      self.trigger('playingDone');

    };

    /**
     * Print the passed record's content
     * 
     * @param {String}   record
     * @param {Function} callback
     */
    this._playCallback = function(record, callback) {

      var tasks = [];

      // The beforeMiddleware is set
      if (options.beforeMiddleware) {

        tasks.push(function(callback) {
          options.beforeMiddleware.call(self, record, callback.bind(null, null, null));
        });

      }

      // Rendering
      tasks.push(function(callback) {

        term.write(record.content);

        // Workaround since xterm doesn't provide a rendered event
        var renderCheckTimer = setInterval(function() {

          if (term.writeInProgress) {
            return;
          }

          clearInterval(renderCheckTimer);
          callback();


        }, 1);

      });

      // The afterMiddleware is set
      if (options.afterMiddleware) {

        tasks.push(function(callback) {
          options.afterMiddleware.call(self, record, callback.bind(null, null, null));
        });

      }

      async.series(tasks, function(error, result) {

        callback();
        
      });

    };

    return this;

  };

  /**
   * Load, and parse JSON files
   * 
   * @param  {String}  url
   * @return {Promise}
   */
  function loadJSON(url) {

    return new Promise(function(resolve, reject) {

      $.getJSON(url).done(resolve).fail(function(jqxhr, textStatus, error) {
        reject('Failed to load ' + url);
      });
      
    });

  }

  /**
   * Play recording records
   * 
   * Options:
   * 
   * - frameDelay (default: auto)
   *   - Delay between frames in ms
   *   - If the value is `auto` use the actual recording delays
   *   
   * - maxIdleTime (default: 2000)
   *   - Maximum delay between frames in ms
   *   - Ignored if the `frameDelay` isn't set to `auto`
   *   - Set to `auto` to prevent limiting the max idle time
   * 
   * - speedFactor (default: 1)
   *   - Multiply the frames delays by this factor
   * 
   * @param {Array}         records
   * @param {Function}      playCallback
   * @param {Function|Null} doneCallback
   * @param {Object}        options      (optional)
   */
  function play(records, playCallback, doneCallback, options) {

    var tasks = [];

    // Default value for options
    if (typeof options === 'undefined') {
      options = {};
    }

    // Default value for options.frameDelay
    if (typeof options.frameDelay === 'undefined') {
      options.frameDelay = 'auto';
    }

    // Default value for options.maxIdleTime
    if (typeof options.maxIdleTime === 'undefined') {
      options.maxIdleTime = 2000;
    }

    // Default value for options.speedFactor
    if (typeof options.speedFactor === 'undefined') {
      options.speedFactor = 1;
    }

    // Foreach record
    records.forEach(function(record, index) {

      // Create a task to handle each frame
      tasks.push(function(callback) {

        var delay = record.delay;

        // Adjust the delay according to the options
        if (options.frameDelay != 'auto') {
          delay = options.frameDelay;
        } else if (options.maxIdleTime != 'auto' && delay > options.maxIdleTime) {
          delay = options.maxIdleTime;
        }

        // Apply speedFactor
        delay = delay * options.speedFactor;

        // Add an index to the record object
        record.index = index;

        setTimeout(function() {
          playCallback(record, callback);
        }, delay);
        
      });
      
    });

    async.series(tasks, function(error, results) {

      if (doneCallback) {
        doneCallback();
      }

    });
    
  }

}(jQuery));
