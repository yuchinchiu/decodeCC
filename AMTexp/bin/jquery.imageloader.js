//image loader
(function($) {
    $.fn.imageloader = function(method, allcomplete) {
        var self = this;
        var methods = {
            init: function(options) {
                if ($.isFunction(options)) {
                    options = {
                        allcomplete: options,
                        all: true
                    };
                }
                self.options = $.extend({}, options);
                self._loaded = 0;
                self._errored = 0;
                self.images = [];
                self.$images = [];
                this.each(function(i, e) {
                    if (typeof e === 'string') {
                        self.images.push(e);
                        self.$images.push($('<img src="' + e + '"/>'));
                    } else if (self.options.all) {
                        if ($(e).is('img')) {
                            self.images.push($(e).attr('src'));
                            self.$images.push($(e));
                        } else {
                            $(e).find('img').each(function(j, img) {
                                self.images.push($(img).attr('src'));
                                self.$images.push($(img));
                            });
                        }
                    } else {
                        self.images.push(methods._img(i).attr('src'));
                        self.$images.push(methods._img(i));
                    }
                });
                $.each(self.$images, function(i, e) {
                    if ((i < self.images.length) && ((self.options.async === true || i === 0) || i < parseInt(self.options.async, 10))) {
                        methods._loadImg(i);
                    }
                });
            },
            destroy: function() {
                return this.each(function() {});
            },
            _img: function(i) {
                var $img = $(self[i]);
                if (!$img.is('img')) {
                    if ($.isFunction(self.options.get_image)) {
                        $img = self.options.get_image($img);
                    }
                    else {
                        $img = $img.find('img:first');
                    }
                }
                return $img;
            },
            _getdata: function(i) {
                return {
                    el: self.options.all ? self.$images[i] : (typeof self[i] === 'string' ? self.$images[i] : self[i]),
                    img: self.$images[i],
                    index: i,
                    loaded: self._loaded,
                    errored: self._errored,
                    allcomplete: (self._loaded + self._errored) === self.images.length
                };
            },
            _success: function(i, image) {
                $img = self.$images[i];
                self._loaded++;
                var data = methods._getdata(i);
                var wait;
                if ($.isFunction(self.options.complete)) {
                    wait = self.options.complete(data);
                }
                methods._complete(i, image, data, wait);
            },
            _error: function(i, image, a) {
                $img = self.$images[i];
                self._errored++;
                var data = methods._getdata(i);
                data.error = a;
                if ($.isFunction(self.options.error)) {
                    self.options.error(data);
                }
                methods._complete(i, image, data);
            },
            _complete: function(i, image, data, wait) {
                if ($.isFunction(self.options.allcomplete) && (self._loaded + self._errored) === self.images.length) {
                    self.options.allcomplete(data);
                }
                if (!self.options.async || typeof self.options.async === "number") {
                    setTimeout(function() {
                        var next = methods._next(i);
                        if (next && next !== 0) {
                            methods._loadImg(next);
                        }
                    }, wait ? wait : 0);
                }
            },
            _next: function(j) {
                for (i = 0; i < self.images.length; i++) {
                    if (i !== j && !self.$images[i].data('imageloader-started')) {
                        return i;
                    }
                }
                return false;
            },
            _loadImg: function(i) {
                $img = self.$images[i];
                var data = methods._getdata(i);
                $img.data('imageloader-started', true);
                if ($.isFunction(self.options.start)) {
                    self.options.start(data);
                }
                setTimeout(function() {
                    var src = self.images[i];
                    var image = new Image();
                    image.src = src;
                    image.onload = function() {
                        if (image.width < 1) {
                            methods._error(i, image, arguments);
                        }
                        else {
                            methods._success(i, image);
                        }
                    };
                    image.onerror = function() {
                        methods._error(i, image, arguments);
                    };
                    if (image.complete || image.width) {
                        return methods._success(i, image);
                    }
                }, 15);
            }
        };

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method || $.isFunction(method)) {
            if ($.isFunction(allcomplete) && typeof method === 'object') {
                object.allcomplete = allcomplete;
            }
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + method + ' does not exist on jQuery.imageloader');
        }
    };
})(jQuery);