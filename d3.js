!function() {
    var d3 = {
        version: "3.5.17"
    };
    function d3_class(ctor, properties) {
        for (var key in properties) {
            Object.defineProperty(ctor.prototype, key, {
                value: properties[key],
                enumerable: false
            });
        }
    }
    function d3_map_has(key) {
        return d3_map_escape(key) in this._;
    }
    var d3_map_proto = "__proto__", d3_map_zero = "\x00";
    function d3_map_escape(key) {
        return (key += "") === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + key : key;
    }
    function d3_map_remove(key) {
        return (key = d3_map_escape(key)) in this._ && delete this._[key];
    }
    function d3_map_keys() {
        var keys = [];
        for (var key in this._) keys.push(d3_map_unescape(key));
        return keys;
    }
    function d3_map_size() {
        var size = 0;
        for (var key in this._) ++size;
        return size;
    }
    function d3_map_empty() {
        for (var key in this._) return false;
        return true;
    }
    function d3_map_unescape(key) {
        return (key += "")[0] === d3_map_zero ? key.slice(1) : key;
    }
    d3_class(d3_Map, {
        has: d3_map_has,
        get: function(key) {
            return this._[d3_map_escape(key)];
        },
        set: function(key, value) {
            return this._[d3_map_escape(key)] = value;
        },
        remove: d3_map_remove,
        keys: d3_map_keys,
        values: function() {
            var values = [];
            for (var key in this._) values.push(this._[key]);
            return values;
        },
        entries: function() {
            var entries = [];
            for (var key in this._) entries.push({
                key: d3_map_unescape(key),
                value: this._[key]
            });
            return entries;
        },
        size: d3_map_size,
        empty: d3_map_empty,
        forEach: function(f) {
            for (var key in this._) f.call(this, d3_map_unescape(key), this._[key]);
        }
    });
    function d3_identity(d) {
        return d;
    }
    var d3_scale_niceIdentity = {
        floor: d3_identity,
        ceil: d3_identity
    };
    function d3_scale_niceStep(step) {
        return step ? {
            floor: function(x) {
                return Math.floor(x / step) * step;
            },
            ceil: function(x) {
                return Math.ceil(x / step) * step;
            }
        } : d3_scale_niceIdentity;
    }
    function d3_scale_nice(domain, nice) {
        var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], dx;
        if (x1 < x0) {
            dx = i0, i0 = i1, i1 = dx;
            dx = x0, x0 = x1, x1 = dx;
        }
        domain[i0] = nice.floor(x0);
        domain[i1] = nice.ceil(x1);
        return domain;
    }
    function d3_scaleExtent(domain) {
        var start = domain[0], stop = domain[domain.length - 1];
        return start < stop ? [ start, stop ] : [ stop, start ];
    }
    function d3_scale_linearTickRange(domain, m) {
        if (m == null) m = 10;
        var extent = d3_scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step;
        if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;
        extent[0] = Math.ceil(extent[0] / step) * step;
        extent[1] = Math.floor(extent[1] / step) * step + step * .5;
        extent[2] = step;
        return extent;
    }
    function d3_scale_linearNice(domain, m) {
        d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
        d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
        return domain;
    }
    function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {
        var u = [], i = [], j = 0, k = Math.min(domain.length, range.length) - 1;
        if (domain[k] < domain[0]) {
            domain = domain.slice().reverse();
            range = range.slice().reverse();
        }
        while (++j <= k) {
            u.push(uninterpolate(domain[j - 1], domain[j]));
            i.push(interpolate(range[j - 1], range[j]));
        }
        return function(x) {
            var j = d3.bisect(domain, x, 1, k) - 1;
            return i[j](u[j](x));
        };
    }
    function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {
        var u = uninterpolate(domain[0], domain[1]), i = interpolate(range[0], range[1]);
        return function(x) {
            return i(u(x));
        };
    }
    function d3_uninterpolateClamp(a, b) {
        b = (b -= a = +a) || 1 / b;
        return function(x) {
            return Math.max(0, Math.min(1, (x - a) / b));
        };
    }
    function d3_uninterpolateNumber(a, b) {
        b = (b -= a = +a) || 1 / b;
        return function(x) {
            return (x - a) / b;
        };
    }
    d3.interpolateRound = d3_interpolateRound;
    function d3_interpolateRound(a, b) {
        b -= a;
        return function(t) {
            return Math.round(a + b * t);
        };
    }
    function d3_scale_linearTicks(domain, m) {
        return d3.range.apply(d3, d3_scale_linearTickRange(domain, m));
    }
    function d3_scale_linearPrecision(value) {
        return -Math.floor(Math.log(value) / Math.LN10 + .01);
    }
    var d3_scale_linearFormatSignificant = {
        s: 1,
        g: 1,
        p: 1,
        r: 1,
        e: 1
    };
    function d3_scale_linearFormatPrecision(type, range) {
        var p = d3_scale_linearPrecision(range[2]);
        return type in d3_scale_linearFormatSignificant ? Math.abs(p - d3_scale_linearPrecision(Math.max(abs(range[0]), abs(range[1])))) + +(type !== "e") : p - (type === "%") * 2;
    }
    var d3_format_re = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i;
    function d3_scale_linearTickFormat(domain, m, format) {
        var range = d3_scale_linearTickRange(domain, m);
        if (format) {
            var match = d3_format_re.exec(format);
            match.shift();
            if (match[8] === "s") {
                var prefix = d3.formatPrefix(Math.max(abs(range[0]), abs(range[1])));
                if (!match[7]) match[7] = "." + d3_scale_linearPrecision(prefix.scale(range[2]));
                match[8] = "f";
                format = d3.format(match.join(""));
                return function(d) {
                    return format(prefix.scale(d)) + prefix.symbol;
                };
            }
            if (!match[7]) match[7] = "." + d3_scale_linearFormatPrecision(match[8], range);
            format = match.join("");
        } else {
            format = ",." + d3_scale_linearPrecision(range[2]) + "f";
        }
        return d3.format(format);
    }
    function d3_scale_linear(domain, range, interpolate, clamp) {
        var output, input;
        function rescale() {
            var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear, uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;
            output = linear(domain, range, uninterpolate, interpolate);
            input = linear(range, domain, uninterpolate, d3_interpolate);
            return scale;
        }
        function scale(x) {
            return output(x);
        }
        scale.invert = function(y) {
            return input(y);
        };
        scale.domain = function(x) {
            if (!arguments.length) return domain;
            domain = x.map(Number);
            return rescale();
        };
        scale.range = function(x) {
            if (!arguments.length) return range;
            range = x;
            return rescale();
        };
        scale.rangeRound = function(x) {
            return scale.range(x).interpolate(d3_interpolateRound);
        };
        scale.clamp = function(x) {
            if (!arguments.length) return clamp;
            clamp = x;
            return rescale();
        };
        scale.interpolate = function(x) {
            if (!arguments.length) return interpolate;
            interpolate = x;
            return rescale();
        };
        scale.ticks = function(m) {
            return d3_scale_linearTicks(domain, m);
        };
        scale.tickFormat = function(m, format) {
            return d3_scale_linearTickFormat(domain, m, format);
        };
        scale.nice = function(m) {
            d3_scale_linearNice(domain, m);
            return rescale();
        };
        scale.copy = function() {
            return d3_scale_linear(domain, range, interpolate, clamp);
        };
        return rescale();
    }
    d3.interpolate = d3_interpolate;
    function d3_interpolate(a, b) {
        var i = d3.interpolators.length, f;
        while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;
        return f;
    }
    d3.scale = {};
    d3.scale.linear = function() {
        return d3_scale_linear([ 0, 1 ], [ 0, 1 ], d3_interpolate, false);
    };
    var d3_category10 = [ 2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175 ].map(d3_rgbString);
    d3.scale.category10 = function() {
        return d3.scale.ordinal().range(d3_category10);
    };
    function d3_scale_ordinal(domain, ranger) {
        var index, range, rangeBand;
        function scale(x) {
            return range[((index.get(x) || (ranger.t === "range" ? index.set(x, domain.push(x)) : NaN)) - 1) % range.length];
        }
        function steps(start, step) {
            return d3.range(domain.length).map(function(i) {
                return start + step * i;
            });
        }
        scale.domain = function(x) {
            if (!arguments.length) return domain;
            domain = [];
            index = new d3_Map();
            var i = -1, n = x.length, xi;
            while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));
            return scale[ranger.t].apply(scale, ranger.a);
        };
        scale.range = function(x) {
            if (!arguments.length) return range;
            range = x;
            rangeBand = 0;
            ranger = {
                t: "range",
                a: arguments
            };
            return scale;
        };
        scale.rangePoints = function(x, padding) {
            if (arguments.length < 2) padding = 0;
            var start = x[0], stop = x[1], step = domain.length < 2 ? (start = (start + stop) / 2,
                0) : (stop - start) / (domain.length - 1 + padding);
            range = steps(start + step * padding / 2, step);
            rangeBand = 0;
            ranger = {
                t: "rangePoints",
                a: arguments
            };
            return scale;
        };
        scale.rangeRoundPoints = function(x, padding) {
            if (arguments.length < 2) padding = 0;
            var start = x[0], stop = x[1], step = domain.length < 2 ? (start = stop = Math.round((start + stop) / 2),
                0) : (stop - start) / (domain.length - 1 + padding) | 0;
            range = steps(start + Math.round(step * padding / 2 + (stop - start - (domain.length - 1 + padding) * step) / 2), step);
            rangeBand = 0;
            ranger = {
                t: "rangeRoundPoints",
                a: arguments
            };
            return scale;
        };
        scale.rangeBands = function(x, padding, outerPadding) {
            if (arguments.length < 2) padding = 0;
            if (arguments.length < 3) outerPadding = padding;
            var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding);
            range = steps(start + step * outerPadding, step);
            if (reverse) range.reverse();
            rangeBand = step * (1 - padding);
            ranger = {
                t: "rangeBands",
                a: arguments
            };
            return scale;
        };
        scale.rangeRoundBands = function(x, padding, outerPadding) {
            if (arguments.length < 2) padding = 0;
            if (arguments.length < 3) outerPadding = padding;
            var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding));
            range = steps(start + Math.round((stop - start - (domain.length - padding) * step) / 2), step);
            if (reverse) range.reverse();
            rangeBand = Math.round(step * (1 - padding));
            ranger = {
                t: "rangeRoundBands",
                a: arguments
            };
            return scale;
        };
        scale.rangeBand = function() {
            return rangeBand;
        };
        scale.rangeExtent = function() {
            return d3_scaleExtent(ranger.a[0]);
        };
        scale.copy = function() {
            return d3_scale_ordinal(domain, ranger);
        };
        return scale.domain(domain);
    }
    d3.scale.ordinal = function() {
        return d3_scale_ordinal([], {
            t: "range",
            a: [ [] ]
        });
    };
    function d3_rgb_parseNumber(c) {
        var f = parseFloat(c);
        return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
    }
    function d3_Map() {
        this._ = Object.create(null);
    }
    d3.map = function(object, f) {
        var map = new d3_Map();
        if (object instanceof d3_Map) {
            object.forEach(function(key, value) {
                map.set(key, value);
            });
        } else if (Array.isArray(object)) {
            var i = -1, n = object.length, o;
            if (arguments.length === 1) while (++i < n) map.set(i, object[i]); else while (++i < n) map.set(f.call(object, o = object[i], i), o);
        } else {
            for (var key in object) map.set(key, object[key]);
        }
        return map;
    };
    var d3_rgb_names = d3.map({
        aliceblue: 15792383,
        antiquewhite: 16444375,
        aqua: 65535,
        aquamarine: 8388564,
        azure: 15794175,
        beige: 16119260,
        bisque: 16770244,
        black: 0,
        blanchedalmond: 16772045,
        blue: 255,
        blueviolet: 9055202,
        brown: 10824234,
        burlywood: 14596231,
        cadetblue: 6266528,
        chartreuse: 8388352,
        chocolate: 13789470,
        coral: 16744272,
        cornflowerblue: 6591981,
        cornsilk: 16775388,
        crimson: 14423100,
        cyan: 65535,
        darkblue: 139,
        darkcyan: 35723,
        darkgoldenrod: 12092939,
        darkgray: 11119017,
        darkgreen: 25600,
        darkgrey: 11119017,
        darkkhaki: 12433259,
        darkmagenta: 9109643,
        darkolivegreen: 5597999,
        darkorange: 16747520,
        darkorchid: 10040012,
        darkred: 9109504,
        darksalmon: 15308410,
        darkseagreen: 9419919,
        darkslateblue: 4734347,
        darkslategray: 3100495,
        darkslategrey: 3100495,
        darkturquoise: 52945,
        darkviolet: 9699539,
        deeppink: 16716947,
        deepskyblue: 49151,
        dimgray: 6908265,
        dimgrey: 6908265,
        dodgerblue: 2003199,
        firebrick: 11674146,
        floralwhite: 16775920,
        forestgreen: 2263842,
        fuchsia: 16711935,
        gainsboro: 14474460,
        ghostwhite: 16316671,
        gold: 16766720,
        goldenrod: 14329120,
        gray: 8421504,
        green: 32768,
        greenyellow: 11403055,
        grey: 8421504,
        honeydew: 15794160,
        hotpink: 16738740,
        indianred: 13458524,
        indigo: 4915330,
        ivory: 16777200,
        khaki: 15787660,
        lavender: 15132410,
        lavenderblush: 16773365,
        lawngreen: 8190976,
        lemonchiffon: 16775885,
        lightblue: 11393254,
        lightcoral: 15761536,
        lightcyan: 14745599,
        lightgoldenrodyellow: 16448210,
        lightgray: 13882323,
        lightgreen: 9498256,
        lightgrey: 13882323,
        lightpink: 16758465,
        lightsalmon: 16752762,
        lightseagreen: 2142890,
        lightskyblue: 8900346,
        lightslategray: 7833753,
        lightslategrey: 7833753,
        lightsteelblue: 11584734,
        lightyellow: 16777184,
        lime: 65280,
        limegreen: 3329330,
        linen: 16445670,
        magenta: 16711935,
        maroon: 8388608,
        mediumaquamarine: 6737322,
        mediumblue: 205,
        mediumorchid: 12211667,
        mediumpurple: 9662683,
        mediumseagreen: 3978097,
        mediumslateblue: 8087790,
        mediumspringgreen: 64154,
        mediumturquoise: 4772300,
        mediumvioletred: 13047173,
        midnightblue: 1644912,
        mintcream: 16121850,
        mistyrose: 16770273,
        moccasin: 16770229,
        navajowhite: 16768685,
        navy: 128,
        oldlace: 16643558,
        olive: 8421376,
        olivedrab: 7048739,
        orange: 16753920,
        orangered: 16729344,
        orchid: 14315734,
        palegoldenrod: 15657130,
        palegreen: 10025880,
        paleturquoise: 11529966,
        palevioletred: 14381203,
        papayawhip: 16773077,
        peachpuff: 16767673,
        peru: 13468991,
        pink: 16761035,
        plum: 14524637,
        powderblue: 11591910,
        purple: 8388736,
        rebeccapurple: 6697881,
        red: 16711680,
        rosybrown: 12357519,
        royalblue: 4286945,
        saddlebrown: 9127187,
        salmon: 16416882,
        sandybrown: 16032864,
        seagreen: 3050327,
        seashell: 16774638,
        sienna: 10506797,
        silver: 12632256,
        skyblue: 8900331,
        slateblue: 6970061,
        slategray: 7372944,
        slategrey: 7372944,
        snow: 16775930,
        springgreen: 65407,
        steelblue: 4620980,
        tan: 13808780,
        teal: 32896,
        thistle: 14204888,
        tomato: 16737095,
        turquoise: 4251856,
        violet: 15631086,
        wheat: 16113331,
        white: 16777215,
        whitesmoke: 16119285,
        yellow: 16776960,
        yellowgreen: 10145074
    });
    d3_rgb_names.forEach(function(key, value) {
        d3_rgb_names.set(key, d3_rgbNumber(value));
    });
    function d3_rgb_parse(format, rgb, hsl) {
        var r = 0, g = 0, b = 0, m1, m2, color;
        m1 = /([a-z]+)\((.*)\)/.exec(format = format.toLowerCase());
        if (m1) {
            m2 = m1[2].split(",");
            switch (m1[1]) {
                case "hsl":
                {
                    return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
                }

                case "rgb":
                {
                    return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));
                }
            }
        }
        if (color = d3_rgb_names.get(format)) {
            return rgb(color.r, color.g, color.b);
        }
        if (format != null && format.charAt(0) === "#" && !isNaN(color = parseInt(format.slice(1), 16))) {
            if (format.length === 4) {
                r = (color & 3840) >> 4;
                r = r >> 4 | r;
                g = color & 240;
                g = g >> 4 | g;
                b = color & 15;
                b = b << 4 | b;
            } else if (format.length === 7) {
                r = (color & 16711680) >> 16;
                g = (color & 65280) >> 8;
                b = color & 255;
            }
        }
        return rgb(r, g, b);
    }
    d3.rgb = d3_rgb;
    function d3_rgb(r, g, b) {
        return this instanceof d3_rgb ? void (this.r = ~~r, this.g = ~~g, this.b = ~~b) : arguments.length < 2 ? r instanceof d3_rgb ? new d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb, d3_hsl_rgb) : new d3_rgb(r, g, b);
    }
    function d3_rgbNumber(value) {
        return new d3_rgb(value >> 16, value >> 8 & 255, value & 255);
    }
    function d3_rgbString(value) {
        return d3_rgbNumber(value) + "";
    }
    if (typeof define === "function" && define.amd) this.d3 = d3, define(d3); else if (typeof module === "object" && module.exports) module.exports = d3; else this.d3 = d3;
}();