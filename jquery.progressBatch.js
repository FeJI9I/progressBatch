(function ($) {

    $.progressBatch = function(el, options) {

        var _this = this;
        this.el = el;
        this.$el = $(el);
        this.$el.data("progressBatch", this);

        this.init = function () {
            _this.options = $.extend({}, $.progressBatch.defaultOptions, options);
            _this.percent = 0;
            if (_this.options.autoStart) {
                _this.timer = setTimeout(function () {
                    _this.sendPing();
                }, _this.options.delay);
            }
            return _this;
        };

        this.destroy = function () {

        };

        this.setProgress = function (percent) {
            _this.percent = parseFloat(percent) || 0;
            if (_this.options.updateCallback) {
                _this.options.updateCallback(percent, _this);
            }
        };

        this.startMonitoring = function () {
            this.sendPing();
        };

        this.stopMonitoring = function () {
            clearTimeout(_this.timer);
        };

        this.sendPing = function () {
            if (_this.timer) {
                clearTimeout(_this.timer);
            }
            if (_this.options.uri) {
                var pb = _this;
                // When doing a post request, you need non-null data. Otherwise a
                // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
                $.ajax({
                    type: _this.options.method,
                    url: _this.options.uri,
                    data: '',
                    dataType: 'json',
                    success: function (progress) {
                        // Display errors.
                        if (progress.status == 0) {
                            pb.displayError(progress.data);
                            return;
                        }
                        // Update display.
                        pb.setProgress(progress.percent, progress.message);
                        // Schedule next timer.
                        pb.timer = setTimeout(function () {
                            pb.sendPing();
                        }, pb.options.delay);
                    },
                    error: function (xmlhttp) {
                        pb.displayError(xmlhttp);
                    }
                });
            }
        };

        this.displayError = function (string) {
            if (_this.options.errorCallback) {
                _this.options.errorCallback(this);
            }
        };

        return this.init();
    };

    $.progressBatch.defaultOptions = {
        'updateCallback': $.noop,
        'errorCallback': $.noop,
        'method': 'GET',
        'uri': '',
        'delay': 5000,
        'autoStart': false
    };

    $.fn.progressBatch = function (options) {
        return $.each(this, function(i, el) {
            var $el, instanceOptions;
            $el = $(el);
            if (!$el.data('progressBatch')) {
                instanceOptions = $.extend({}, options, $el.data());
                return $el.data('progressBatch', new $.progressBatch(el, instanceOptions));
            }
        });

    };

    return void 0;

})(jQuery);