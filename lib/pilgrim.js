//
// pilgrim - a stateful javascript REST library for the browser
//
var pilgrim = (function () {
    var exports = {};

    function merge(a, b) {
        for (var k in b) {
            if (b.hasOwnProperty(k)) {
                a[k] = b[k];
            }
        }
    };
    
    var context = {
        resource: function (name) {
            this._url.push(name);
            var that = this;
            return {
                name: name,
                host: that.host,
                id: function (id) {
                    that._url.push(id);
                    return that;
                },
            };
        },
        url: function () {
            return this.host + '/' + this._url.join('/');
        },
        request: function (method, data, headers) {
            var query = [], url = this.url();

            if (method === 'get' && data) {
                for (var k in data) {
                    query.push(k + '=' + data[k]); 
                }
                url += '?' + query.join('&')
                data = null;
            }

            return function (callback, errback) {
                return new(pilgrim.XHR)
                          (method, url, data, headers || {}).send(callback, errback);
            };
        },
    };

    ["get", "put", "post", "del"].forEach(function (m) {
        context[m] = function (data) {
            return context.request.call(context, m, data)
        };
        context[m + 'JSON'] = function (data) {
            return context.request.call(context, m, data, {accept: 'application/json'})
        };
        context[m + 'XML'] = function (data) {
            return context.request.call(context, m, data, {accept: 'application/xml'})
        };
    });

    var resource = {
        id: function (id) {
            var ctx = {};
            merge(ctx, context);
            ctx.id = id;
            ctx._url.push(id);
            return ctx; 
        }
    };

    //
    // Client
    //
    exports.Client = function Client(host, options) {
        options = options || {};
        merge(this, context);
        delete this.resource;
        context.headers = {accept: options.mime || 'application/json'};
        context.host = host ? 'http://' + host.replace('http://', '') : '';
    };
    exports.Client.prototype.resource = function (name) {
        context._url = [];
        return context.resource.call(context, name);
    };


    //
    // XHR
    //
    exports.XHR = function XHR(method, url, data, headers) {
        this.method = method.toLowerCase();
        this.url = url;
        this.data = data;
        this.xhr = new(XMLHttpRequest);
        this.headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json'
        };

        if (headers.accept) { this.headers['Accept'] = headers.accept }
    };
    exports.XHR.prototype.send = function (callback, errback) {
        var that = this;
        this.xhr.open(this.method, this.url, true);
        this.xhr.onreadystatechange = function () {
            if (this.readyState != 4) { return }

            that.body = this.responseText;
            that.xml = this.responseXML;

            // Success
            if (this.status >= 200 && this.status < 300) {
                if (typeof(callback) === 'function') {
                    callback(that.body); 
                }
            } else {
                if (typeof(errback) === 'function') {
                    errback(that.body);
                }
            }
        };

        if (this.method == 'post' || this.method == 'put') {
            this.headers['Content-Type'] = 'application/json';
        }

        for (k in this.headers) {
            this.xhr.setRequestHeader(k, this.headers[k]);
        }

        this.xhr.send(this.method === 'get' ? null : JSON.stringify(this.data));

        return this;
    };

    return exports;
})();
