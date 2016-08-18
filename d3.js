!function() {
    var d3 = {
        version: "3.5.17"
    };
    var ε = 1e-6, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2;
    var d3_select = function(s, n) {
        return n.querySelector(s);
    }, d3_selectMatches = function(n, s) {
        var d3_selectMatcher = n.matches || n[d3_vendorSymbol(n, "matchesSelector")];
        d3_selectMatches = function(n, s) {
            return d3_selectMatcher.call(n, s);
        };
        return d3_selectMatches(n, s);
    };
    var d3_vendorPrefixes = [ "webkit", "ms", "moz", "Moz", "o", "O" ];
    function d3_vendorSymbol(object, name) {
        if (name in object) return name;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
            var prefixName = d3_vendorPrefixes[i] + name;
            if (prefixName in object) return prefixName;
        }
    }
    var d3_document = this.document;
    if (d3_document) {
        try {
            d3_array(d3_document.documentElement.childNodes)[0].nodeType;
        } catch (e) {
            d3_array = function(list) {
                var i = list.length, array = new Array(i);
                while (i--) array[i] = list[i];
                return array;
            };
        }
    }
    function d3_documentElement(node) {
        return node && (node.ownerDocument || node.document || node).documentElement;
    }
    var d3_subclass = {}.__proto__ ? function(object, prototype) {
        object.__proto__ = prototype;
    } : function(object, prototype) {
        for (var property in prototype) object[property] = prototype[property];
    };
    var d3_selectionPrototype = d3.selection.prototype = [];
    function d3_selection_selector(selector) {
        return typeof selector === "function" ? selector : function() {
            return d3_select(selector, this);
        };
    }
    d3_selectionPrototype.select = function(selector) {
        var subgroups = [], subgroup, subnode, group, node;
        selector = d3_selection_selector(selector);
        for (var j = -1, m = this.length; ++j < m; ) {
            subgroups.push(subgroup = []);
            subgroup.parentNode = (group = this[j]).parentNode;
            for (var i = -1, n = group.length; ++i < n; ) {
                if (node = group[i]) {
                    subgroup.push(subnode = selector.call(node, node.__data__, i, j));
                    if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
                } else {
                    subgroup.push(null);
                }
            }
        }
        return d3_selection(subgroups);
    };
    function d3_selection(groups) {
        d3_subclass(groups, d3_selectionPrototype);
        return groups;
    }
    d3.select = function(node) {
        var group;
        if (typeof node === "string") {
            group = [ d3_select(node, d3_document) ];
            group.parentNode = d3_document.documentElement;
        } else {
            group = [ node ];
            group.parentNode = d3_documentElement(node);
        }
        return d3_selection([ group ]);
    };
    d3.svg = {};
    var d3_svg_arcAuto = "auto";
    function d3_svg_arcInnerRadius(d) {
        return d.innerRadius;
    }
    function d3_svg_arcOuterRadius(d) {
        return d.outerRadius;
    }
    function d3_svg_arcStartAngle(d) {
        return d.startAngle;
    }
    function d3_svg_arcEndAngle(d) {
        return d.endAngle;
    }
    function d3_svg_arcPadAngle(d) {
        return d && d.padAngle;
    }
    function d3_zero() {
        return 0;
    }
    function d3_asin(x) {
        return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
    }
    function d3_svg_arcSweep(x0, y0, x1, y1) {
        return (x0 - x1) * y0 - (y0 - y1) * x0 > 0 ? 0 : 1;
    }
    function d3_geom_polygonIntersect(c, d, a, b) {
        var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
        return [ x1 + ua * x21, y1 + ua * y21 ];
    }
    function d3_svg_arcCornerTangents(p0, p1, r1, rc, cw) {
        var x01 = p0[0] - p1[0], y01 = p0[1] - p1[1], lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x1 = p0[0] + ox, y1 = p0[1] + oy, x2 = p1[0] + ox, y2 = p1[1] + oy, x3 = (x1 + x2) / 2, y3 = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, d2 = dx * dx + dy * dy, r = r1 - rc, D = x1 * y2 - x2 * y1, d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D)), cx0 = (D * dy - dx * d) / d2, cy0 = (-D * dx - dy * d) / d2, cx1 = (D * dy + dx * d) / d2, cy1 = (-D * dx + dy * d) / d2, dx0 = cx0 - x3, dy0 = cy0 - y3, dx1 = cx1 - x3, dy1 = cy1 - y3;
        if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
        return [ [ cx0 - ox, cy0 - oy ], [ cx0 * r1 / r, cy0 * r1 / r ] ];
    }
    d3.svg.arc = function() {
        var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, cornerRadius = d3_zero, padRadius = d3_svg_arcAuto, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle, padAngle = d3_svg_arcPadAngle;
        function arc() {
            var r0 = Math.max(0, +innerRadius.apply(this, arguments)), r1 = Math.max(0, +outerRadius.apply(this, arguments)), a0 = startAngle.apply(this, arguments) - halfπ, a1 = endAngle.apply(this, arguments) - halfπ, da = Math.abs(a1 - a0), cw = a0 > a1 ? 0 : 1;
            if (r1 < r0) rc = r1, r1 = r0, r0 = rc;
            if (da >= τε) return circleSegment(r1, cw) + (r0 ? circleSegment(r0, 1 - cw) : "") + "Z";
            var rc, cr, rp, ap, p0 = 0, p1 = 0, x0, y0, x1, y1, x2, y2, x3, y3, path = [];
            if (ap = (+padAngle.apply(this, arguments) || 0) / 2) {
                rp = padRadius === d3_svg_arcAuto ? Math.sqrt(r0 * r0 + r1 * r1) : +padRadius.apply(this, arguments);
                if (!cw) p1 *= -1;
                if (r1) p1 = d3_asin(rp / r1 * Math.sin(ap));
                if (r0) p0 = d3_asin(rp / r0 * Math.sin(ap));
            }
            if (r1) {
                x0 = r1 * Math.cos(a0 + p1);
                y0 = r1 * Math.sin(a0 + p1);
                x1 = r1 * Math.cos(a1 - p1);
                y1 = r1 * Math.sin(a1 - p1);
                var l1 = Math.abs(a1 - a0 - 2 * p1) <= π ? 0 : 1;
                if (p1 && d3_svg_arcSweep(x0, y0, x1, y1) === cw ^ l1) {
                    var h1 = (a0 + a1) / 2;
                    x0 = r1 * Math.cos(h1);
                    y0 = r1 * Math.sin(h1);
                    x1 = y1 = null;
                }
            } else {
                x0 = y0 = 0;
            }
            if (r0) {
                x2 = r0 * Math.cos(a1 - p0);
                y2 = r0 * Math.sin(a1 - p0);
                x3 = r0 * Math.cos(a0 + p0);
                y3 = r0 * Math.sin(a0 + p0);
                var l0 = Math.abs(a0 - a1 + 2 * p0) <= π ? 0 : 1;
                if (p0 && d3_svg_arcSweep(x2, y2, x3, y3) === 1 - cw ^ l0) {
                    var h0 = (a0 + a1) / 2;
                    x2 = r0 * Math.cos(h0);
                    y2 = r0 * Math.sin(h0);
                    x3 = y3 = null;
                }
            } else {
                x2 = y2 = 0;
            }
            if (da > ε && (rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments))) > .001) {
                cr = r0 < r1 ^ cw ? 0 : 1;
                var rc1 = rc, rc0 = rc;
                if (da < π) {
                    var oc = x3 == null ? [ x2, y2 ] : x1 == null ? [ x0, y0 ] : d3_geom_polygonIntersect([ x0, y0 ], [ x3, y3 ], [ x1, y1 ], [ x2, y2 ]), ax = x0 - oc[0], ay = y0 - oc[1], bx = x1 - oc[0], by = y1 - oc[1], kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2), lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
                    rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
                    rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
                }
                if (x1 != null) {
                    var t30 = d3_svg_arcCornerTangents(x3 == null ? [ x2, y2 ] : [ x3, y3 ], [ x0, y0 ], r1, rc1, cw), t12 = d3_svg_arcCornerTangents([ x1, y1 ], [ x2, y2 ], r1, rc1, cw);
                    if (rc === rc1) {
                        path.push("M", t30[0], "A", rc1, ",", rc1, " 0 0,", cr, " ", t30[1], "A", r1, ",", r1, " 0 ", 1 - cw ^ d3_svg_arcSweep(t30[1][0], t30[1][1], t12[1][0], t12[1][1]), ",", cw, " ", t12[1], "A", rc1, ",", rc1, " 0 0,", cr, " ", t12[0]);
                    } else {
                        path.push("M", t30[0], "A", rc1, ",", rc1, " 0 1,", cr, " ", t12[0]);
                    }
                } else {
                    path.push("M", x0, ",", y0);
                }
                if (x3 != null) {
                    var t03 = d3_svg_arcCornerTangents([ x0, y0 ], [ x3, y3 ], r0, -rc0, cw), t21 = d3_svg_arcCornerTangents([ x2, y2 ], x1 == null ? [ x0, y0 ] : [ x1, y1 ], r0, -rc0, cw);
                    if (rc === rc0) {
                        path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t21[1], "A", r0, ",", r0, " 0 ", cw ^ d3_svg_arcSweep(t21[1][0], t21[1][1], t03[1][0], t03[1][1]), ",", 1 - cw, " ", t03[1], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
                    } else {
                        path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
                    }
                } else {
                    path.push("L", x2, ",", y2);
                }
            } else {
                path.push("M", x0, ",", y0);
                if (x1 != null) path.push("A", r1, ",", r1, " 0 ", l1, ",", cw, " ", x1, ",", y1);
                path.push("L", x2, ",", y2);
                if (x3 != null) path.push("A", r0, ",", r0, " 0 ", l0, ",", 1 - cw, " ", x3, ",", y3);
            }
            path.push("Z");
            return path.join("");
        }
        function circleSegment(r1, cw) {
            return "M0," + r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + -r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + r1;
        }
        arc.innerRadius = function(v) {
            if (!arguments.length) return innerRadius;
            innerRadius = d3_functor(v);
            return arc;
        };
        arc.outerRadius = function(v) {
            if (!arguments.length) return outerRadius;
            outerRadius = d3_functor(v);
            return arc;
        };
        arc.cornerRadius = function(v) {
            if (!arguments.length) return cornerRadius;
            cornerRadius = d3_functor(v);
            return arc;
        };
        arc.padRadius = function(v) {
            if (!arguments.length) return padRadius;
            padRadius = v == d3_svg_arcAuto ? d3_svg_arcAuto : d3_functor(v);
            return arc;
        };
        arc.startAngle = function(v) {
            if (!arguments.length) return startAngle;
            startAngle = d3_functor(v);
            return arc;
        };
        arc.endAngle = function(v) {
            if (!arguments.length) return endAngle;
            endAngle = d3_functor(v);
            return arc;
        };
        arc.padAngle = function(v) {
            if (!arguments.length) return padAngle;
            padAngle = d3_functor(v);
            return arc;
        };
        arc.centroid = function() {
            var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - halfπ;
            return [ Math.cos(a) * r, Math.sin(a) * r ];
        };
        return arc;
    };
    var d3_svg_lineInterpolators = d3.map({
        linear: d3_svg_lineLinear,
        "linear-closed": d3_svg_lineLinearClosed,
        step: d3_svg_lineStep,
        "step-before": d3_svg_lineStepBefore,
        "step-after": d3_svg_lineStepAfter,
        basis: d3_svg_lineBasis,
        "basis-open": d3_svg_lineBasisOpen,
        "basis-closed": d3_svg_lineBasisClosed,
        bundle: d3_svg_lineBundle,
        cardinal: d3_svg_lineCardinal,
        "cardinal-open": d3_svg_lineCardinalOpen,
        "cardinal-closed": d3_svg_lineCardinalClosed,
        monotone: d3_svg_lineMonotone
    });
    function d3_svg_lineLinearClosed(points) {
        return points.join("L") + "Z";
    }
    function d3_svg_lineHermite(points, tangents) {
        if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {
            return d3_svg_lineLinear(points);
        }
        var quad = points.length != tangents.length, path = "", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;
        if (quad) {
            path += "Q" + (p[0] - t0[0] * 2 / 3) + "," + (p[1] - t0[1] * 2 / 3) + "," + p[0] + "," + p[1];
            p0 = points[1];
            pi = 2;
        }
        if (tangents.length > 1) {
            t = tangents[1];
            p = points[pi];
            pi++;
            path += "C" + (p0[0] + t0[0]) + "," + (p0[1] + t0[1]) + "," + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
            for (var i = 2; i < tangents.length; i++, pi++) {
                p = points[pi];
                t = tangents[i];
                path += "S" + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
            }
        }
        if (quad) {
            var lp = points[pi];
            path += "Q" + (p[0] + t[0] * 2 / 3) + "," + (p[1] + t[1] * 2 / 3) + "," + lp[0] + "," + lp[1];
        }
        return path;
    }
    function d3_svg_lineSlope(p0, p1) {
        return (p1[1] - p0[1]) / (p1[0] - p0[0]);
    }
    function d3_svg_lineFiniteDifferences(points) {
        var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = d3_svg_lineSlope(p0, p1);
        while (++i < j) {
            m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
        }
        m[i] = d;
        return m;
    }
    function d3_svg_lineMonotoneTangents(points) {
        var tangents = [], d, a, b, s, m = d3_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1;
        while (++i < j) {
            d = d3_svg_lineSlope(points[i], points[i + 1]);
            if (abs(d) < ε) {
                m[i] = m[i + 1] = 0;
            } else {
                a = m[i] / d;
                b = m[i + 1] / d;
                s = a * a + b * b;
                if (s > 9) {
                    s = d * 3 / Math.sqrt(s);
                    m[i] = s * a;
                    m[i + 1] = s * b;
                }
            }
        }
        i = -1;
        while (++i <= j) {
            s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
            tangents.push([ s || 0, m[i] * s || 0 ]);
        }
        return tangents;
    }
    function d3_svg_lineMonotone(points) {
        return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));
    }
    function d3_svg_lineStep(points) {
        var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
        while (++i < n) path.push("H", (p[0] + (p = points[i])[0]) / 2, "V", p[1]);
        if (n > 1) path.push("H", p[0]);
        return path.join("");
    }
    function d3_svg_lineStepBefore(points) {
        var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
        while (++i < n) path.push("V", (p = points[i])[1], "H", p[0]);
        return path.join("");
    }
    function d3_svg_lineStepAfter(points) {
        var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
        while (++i < n) path.push("H", (p = points[i])[0], "V", p[1]);
        return path.join("");
    }
    function d3_svg_lineLinear(points) {
        return points.length > 1 ? points.join("L") : points + "Z";
    }
    function d3_geom_pointX(d) {
        return d[0];
    }
    function d3_geom_pointY(d) {
        return d[1];
    }
    function d3_functor(v) {
        return typeof v === "function" ? v : function() {
            return v;
        };
    }
    function d3_svg_lineCardinalTangents(points, tension) {
        var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length;
        while (++i < n) {
            p0 = p1;
            p1 = p2;
            p2 = points[i];
            tangents.push([ a * (p2[0] - p0[0]), a * (p2[1] - p0[1]) ]);
        }
        return tangents;
    }
    function d3_svg_lineCardinal(points, tension) {
        return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension));
    }
    function d3_svg_lineCardinalOpen(points, tension) {
        return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, -1), d3_svg_lineCardinalTangents(points, tension));
    }
    function d3_svg_lineCardinalClosed(points, tension) {
        return points.length < 3 ? d3_svg_lineLinearClosed(points) : points[0] + d3_svg_lineHermite((points.push(points[0]),
            points), d3_svg_lineCardinalTangents([ points[points.length - 2] ].concat(points, [ points[1] ]), tension));
    }
    function d3_svg_lineDot4(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }
    var d3_svg_lineBasisBezier1 = [ 0, 2 / 3, 1 / 3, 0 ], d3_svg_lineBasisBezier2 = [ 0, 1 / 3, 2 / 3, 0 ], d3_svg_lineBasisBezier3 = [ 0, 1 / 6, 2 / 3, 1 / 6 ];
    function d3_svg_lineBasisBezier(path, x, y) {
        path.push("C", d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));
    }
    function d3_svg_lineBasis(points) {
        if (points.length < 3) return d3_svg_lineLinear(points);
        var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [ x0, x0, x0, (pi = points[1])[0] ], py = [ y0, y0, y0, pi[1] ], path = [ x0, ",", y0, "L", d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
        points.push(points[n - 1]);
        while (++i <= n) {
            pi = points[i];
            px.shift();
            px.push(pi[0]);
            py.shift();
            py.push(pi[1]);
            d3_svg_lineBasisBezier(path, px, py);
        }
        points.pop();
        path.push("L", pi);
        return path.join("");
    }
    function d3_svg_lineBasisOpen(points) {
        if (points.length < 4) return d3_svg_lineLinear(points);
        var path = [], i = -1, n = points.length, pi, px = [ 0 ], py = [ 0 ];
        while (++i < 3) {
            pi = points[i];
            px.push(pi[0]);
            py.push(pi[1]);
        }
        path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + "," + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));
        --i;
        while (++i < n) {
            pi = points[i];
            px.shift();
            px.push(pi[0]);
            py.shift();
            py.push(pi[1]);
            d3_svg_lineBasisBezier(path, px, py);
        }
        return path.join("");
    }
    function d3_svg_lineBasisClosed(points) {
        var path, i = -1, n = points.length, m = n + 4, pi, px = [], py = [];
        while (++i < 4) {
            pi = points[i % n];
            px.push(pi[0]);
            py.push(pi[1]);
        }
        path = [ d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
        --i;
        while (++i < m) {
            pi = points[i % n];
            px.shift();
            px.push(pi[0]);
            py.shift();
            py.push(pi[1]);
            d3_svg_lineBasisBezier(path, px, py);
        }
        return path.join("");
    }
    function d3_svg_lineBundle(points, tension) {
        var n = points.length - 1;
        if (n) {
            var x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1, p, t;
            while (++i <= n) {
                p = points[i];
                t = i / n;
                p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);
                p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);
            }
        }
        return d3_svg_lineBasis(points);
    }
    function d3_svg_line(projection) {
        var x = d3_geom_pointX, y = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, tension = .7;
        function line(data) {
            var segments = [], points = [], i = -1, n = data.length, d, fx = d3_functor(x), fy = d3_functor(y);
            function segment() {
                segments.push("M", interpolate(projection(points), tension));
            }
            while (++i < n) {
                if (defined.call(this, d = data[i], i)) {
                    points.push([ +fx.call(this, d, i), +fy.call(this, d, i) ]);
                } else if (points.length) {
                    segment();
                    points = [];
                }
            }
            if (points.length) segment();
            return segments.length ? segments.join("") : null;
        }
        line.x = function(_) {
            if (!arguments.length) return x;
            x = _;
            return line;
        };
        line.y = function(_) {
            if (!arguments.length) return y;
            y = _;
            return line;
        };
        line.defined = function(_) {
            if (!arguments.length) return defined;
            defined = _;
            return line;
        };
        line.interpolate = function(_) {
            if (!arguments.length) return interpolateKey;
            if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
            return line;
        };
        line.tension = function(_) {
            if (!arguments.length) return tension;
            tension = _;
            return line;
        };
        return line;
    }
    d3.svg.line = function() {
        return d3_svg_line(d3_identity);
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
    d3.set = function(array) {
        var set = new d3_Set();
        if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);
        return set;
    };
    function d3_Set() {
        this._ = Object.create(null);
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
    d3.extent = function(array, f) {
        var i = -1, n = array.length, a, b, c;
        if (arguments.length === 1) {
            while (++i < n) if ((b = array[i]) != null && b >= b) {
                a = c = b;
                break;
            }
            while (++i < n) if ((b = array[i]) != null) {
                if (a > b) a = b;
                if (c < b) c = b;
            }
        } else {
            while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
                a = c = b;
                break;
            }
            while (++i < n) if ((b = f.call(array, array[i], i)) != null) {
                if (a > b) a = b;
                if (c < b) c = b;
            }
        }
        return [ a, c ];
    };
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
    function d3_range_integerScale(x) {
        var k = 1;
        while (x * k % 1) k *= 10;
        return k;
    }
    var abs = Math.abs;
    d3.range = function(start, stop, step) {
        if (arguments.length < 3) {
            step = 1;
            if (arguments.length < 2) {
                stop = start;
                start = 0;
            }
        }
        if ((stop - start) / step === Infinity) throw new Error("infinite range");
        var range = [], k = d3_range_integerScale(abs(step)), i = -1, j;
        start *= k, stop *= k, step *= k;
        if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k);
        return range;
    };
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
    var d3_interpolate_numberA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, d3_interpolate_numberB = new RegExp(d3_interpolate_numberA.source, "g");
    d3.round = function(x, n) {
        return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
    };
    function d3_rgb_hex(v) {
        return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
    }
    d3.interpolate = d3_interpolate;
    d3.interpolateRgb = d3_interpolateRgb;
    function d3_interpolateRgb(a, b) {
        a = d3.rgb(a);
        b = d3.rgb(b);
        var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;
        return function(t) {
            return "#" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));
        };
    }
    d3.interpolateNumber = d3_interpolateNumber;
    function d3_interpolateNumber(a, b) {
        a = +a, b = +b;
        return function(t) {
            return a * (1 - t) + b * t;
        };
    }
    d3.interpolateString = d3_interpolateString;
    function d3_interpolateString(a, b) {
        var bi = d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
        a = a + "", b = b + "";
        while ((am = d3_interpolate_numberA.exec(a)) && (bm = d3_interpolate_numberB.exec(b))) {
            if ((bs = bm.index) > bi) {
                bs = b.slice(bi, bs);
                if (s[i]) s[i] += bs; else s[++i] = bs;
            }
            if ((am = am[0]) === (bm = bm[0])) {
                if (s[i]) s[i] += bm; else s[++i] = bm;
            } else {
                s[++i] = null;
                q.push({
                    i: i,
                    x: d3_interpolateNumber(am, bm)
                });
            }
            bi = d3_interpolate_numberB.lastIndex;
        }
        if (bi < b.length) {
            bs = b.slice(bi);
            if (s[i]) s[i] += bs; else s[++i] = bs;
        }
        return s.length < 2 ? q[0] ? (b = q[0].x, function(t) {
            return b(t) + "";
        }) : function() {
            return b;
        } : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
        });
    }
    d3.color = d3_color;
    function d3_color() {}
    d3_color.prototype.toString = function() {
        return this.rgb() + "";
    };
    d3.rgb = d3_rgb;
    function d3_rgb(r, g, b) {
        return this instanceof d3_rgb ? void (this.r = ~~r, this.g = ~~g, this.b = ~~b) : arguments.length < 2 ? r instanceof d3_rgb ? new d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb, d3_hsl_rgb) : new d3_rgb(r, g, b);
    }
    var d3_rgbPrototype = d3_rgb.prototype = new d3_color();
    d3_rgbPrototype.brighter = function(k) {
        k = Math.pow(.7, arguments.length ? k : 1);
        var r = this.r, g = this.g, b = this.b, i = 30;
        if (!r && !g && !b) return new d3_rgb(i, i, i);
        if (r && r < i) r = i;
        if (g && g < i) g = i;
        if (b && b < i) b = i;
        return new d3_rgb(Math.min(255, r / k), Math.min(255, g / k), Math.min(255, b / k));
    };
    d3_rgbPrototype.darker = function(k) {
        k = Math.pow(.7, arguments.length ? k : 1);
        return new d3_rgb(k * this.r, k * this.g, k * this.b);
    };
    d3_rgbPrototype.toString = function() {
        return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);
    };
    function d3_rgbNumber(value) {
        return new d3_rgb(value >> 16, value >> 8 & 255, value & 255);
    }
    function d3_rgbString(value) {
        return d3_rgbNumber(value) + "";
    }
    d3.interpolateArray = d3_interpolateArray;
    function d3_interpolateArray(a, b) {
        var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i;
        for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]));
        for (;i < na; ++i) c[i] = a[i];
        for (;i < nb; ++i) c[i] = b[i];
        return function(t) {
            for (i = 0; i < n0; ++i) c[i] = x[i](t);
            return c;
        };
    }
    d3.interpolateObject = d3_interpolateObject;
    function d3_interpolateObject(a, b) {
        var i = {}, c = {}, k;
        for (k in a) {
            if (k in b) {
                i[k] = d3_interpolate(a[k], b[k]);
            } else {
                c[k] = a[k];
            }
        }
        for (k in b) {
            if (!(k in a)) {
                c[k] = b[k];
            }
        }
        return function(t) {
            for (k in i) c[k] = i[k](t);
            return c;
        };
    }
    d3.interpolators = [ function(a, b) {
        var t = typeof b;
        return (t === "string" ? d3_rgb_names.has(b.toLowerCase()) || /^(#|rgb\(|hsl\()/i.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_color ? d3_interpolateRgb : Array.isArray(b) ? d3_interpolateArray : t === "object" && isNaN(b) ? d3_interpolateObject : d3_interpolateNumber)(a, b);
    } ];
    function d3_interpolate(a, b) {
        var i = d3.interpolators.length, f;
        while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;
        return f;
    }
    d3.scale = {};
    d3.scale.linear = function() {
        return d3_scale_linear([ 0, 1 ], [ 0, 1 ], d3_interpolate, false);
    };
    d3.scale.category10 = function() {
        return d3.scale.ordinal().range(d3_category10);
    };
    var d3_category10 = [ 2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175 ].map(d3_rgbString);
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
    function d3_hsl_rgb(h, s, l) {
        var m1, m2;
        h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
        s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
        l = l < 0 ? 0 : l > 1 ? 1 : l;
        m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
        m1 = 2 * l - m2;
        function v(h) {
            if (h > 360) h -= 360; else if (h < 0) h += 360;
            if (h < 60) return m1 + (m2 - m1) * h / 60;
            if (h < 180) return m2;
            if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
            return m1;
        }
        function vv(h) {
            return Math.round(v(h) * 255);
        }
        return new d3_rgb(vv(h + 120), vv(h), vv(h - 120));
    }
    var d3_time = d3.time = {}, d3_date = Date;
    function d3_time_interval_utc(method) {
        return function(date, k) {
            try {
                d3_date = d3_date_utc;
                var utc = new d3_date_utc();
                utc._ = date;
                return method(utc, k)._;
            } finally {
                d3_date = Date;
            }
        };
    }
    function d3_time_interval(local, step, number) {
        function round(date) {
            var d0 = local(date), d1 = offset(d0, 1);
            return date - d0 < d1 - date ? d0 : d1;
        }
        function ceil(date) {
            step(date = local(new d3_date(date - 1)), 1);
            return date;
        }
        function offset(date, k) {
            step(date = new d3_date(+date), k);
            return date;
        }
        function range(t0, t1, dt) {
            var time = ceil(t0), times = [];
            if (dt > 1) {
                while (time < t1) {
                    if (!(number(time) % dt)) times.push(new Date(+time));
                    step(time, 1);
                }
            } else {
                while (time < t1) times.push(new Date(+time)), step(time, 1);
            }
            return times;
        }
        function range_utc(t0, t1, dt) {
            try {
                d3_date = d3_date_utc;
                var utc = new d3_date_utc();
                utc._ = t0;
                return range(utc, t1, dt);
            } finally {
                d3_date = Date;
            }
        }
        local.floor = local;
        local.round = round;
        local.ceil = ceil;
        local.offset = offset;
        local.range = range;
        var utc = local.utc = d3_time_interval_utc(local);
        utc.floor = utc;
        utc.round = d3_time_interval_utc(round);
        utc.ceil = d3_time_interval_utc(ceil);
        utc.offset = d3_time_interval_utc(offset);
        utc.range = range_utc;
        return local;
    }
    d3_time.year = d3_time_interval(function(date) {
        date = d3_time.day(date);
        date.setMonth(0, 1);
        return date;
    }, function(date, offset) {
        date.setFullYear(date.getFullYear() + offset);
    }, function(date) {
        return date.getFullYear();
    });
    d3_time.years = d3_time.year.range;
    d3_time.years.utc = d3_time.year.utc.range;
    d3_time.day = d3_time_interval(function(date) {
        var day = new d3_date(2e3, 0);
        day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        return day;
    }, function(date, offset) {
        date.setDate(date.getDate() + offset);
    }, function(date) {
        return date.getDate() - 1;
    });
    d3_time.days = d3_time.day.range;
    d3_time.days.utc = d3_time.day.utc.range;
    d3_time.dayOfYear = function(date) {
        var year = d3_time.year(date);
        return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
    };
    [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ].forEach(function(day, i) {
        i = 7 - i;
        var interval = d3_time[day] = d3_time_interval(function(date) {
            (date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);
            return date;
        }, function(date, offset) {
            date.setDate(date.getDate() + Math.floor(offset) * 7);
        }, function(date) {
            var day = d3_time.year(date).getDay();
            return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);
        });
        d3_time[day + "s"] = interval.range;
        d3_time[day + "s"].utc = interval.utc.range;
        d3_time[day + "OfYear"] = function(date) {
            var day = d3_time.year(date).getDay();
            return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7);
        };
    });
    d3_time.week = d3_time.sunday;
    d3_time.weeks = d3_time.sunday.range;
    d3_time.weeks.utc = d3_time.sunday.utc.range;
    d3_time.weekOfYear = d3_time.sundayOfYear;
    var d3_time_prototype = Date.prototype;
    function d3_date_utc() {
        this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]);
    }
    d3_date_utc.prototype = {
        getDate: function() {
            return this._.getUTCDate();
        },
        getDay: function() {
            return this._.getUTCDay();
        },
        getFullYear: function() {
            return this._.getUTCFullYear();
        },
        getHours: function() {
            return this._.getUTCHours();
        },
        getMilliseconds: function() {
            return this._.getUTCMilliseconds();
        },
        getMinutes: function() {
            return this._.getUTCMinutes();
        },
        getMonth: function() {
            return this._.getUTCMonth();
        },
        getSeconds: function() {
            return this._.getUTCSeconds();
        },
        getTime: function() {
            return this._.getTime();
        },
        getTimezoneOffset: function() {
            return 0;
        },
        valueOf: function() {
            return this._.valueOf();
        },
        setDate: function() {
            d3_time_prototype.setUTCDate.apply(this._, arguments);
        },
        setDay: function() {
            d3_time_prototype.setUTCDay.apply(this._, arguments);
        },
        setFullYear: function() {
            d3_time_prototype.setUTCFullYear.apply(this._, arguments);
        },
        setHours: function() {
            d3_time_prototype.setUTCHours.apply(this._, arguments);
        },
        setMilliseconds: function() {
            d3_time_prototype.setUTCMilliseconds.apply(this._, arguments);
        },
        setMinutes: function() {
            d3_time_prototype.setUTCMinutes.apply(this._, arguments);
        },
        setMonth: function() {
            d3_time_prototype.setUTCMonth.apply(this._, arguments);
        },
        setSeconds: function() {
            d3_time_prototype.setUTCSeconds.apply(this._, arguments);
        },
        setTime: function() {
            d3_time_prototype.setTime.apply(this._, arguments);
        }
    };
    d3_time.second = d3_time_interval(function(date) {
        return new d3_date(Math.floor(date / 1e3) * 1e3);
    }, function(date, offset) {
        date.setTime(date.getTime() + Math.floor(offset) * 1e3);
    }, function(date) {
        return date.getSeconds();
    });
    d3_time.seconds = d3_time.second.range;
    d3_time.seconds.utc = d3_time.second.utc.range;
    d3_time.minute = d3_time_interval(function(date) {
        return new d3_date(Math.floor(date / 6e4) * 6e4);
    }, function(date, offset) {
        date.setTime(date.getTime() + Math.floor(offset) * 6e4);
    }, function(date) {
        return date.getMinutes();
    });
    d3_time.minutes = d3_time.minute.range;
    d3_time.minutes.utc = d3_time.minute.utc.range;
    d3_time.hour = d3_time_interval(function(date) {
        var timezone = date.getTimezoneOffset() / 60;
        return new d3_date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);
    }, function(date, offset) {
        date.setTime(date.getTime() + Math.floor(offset) * 36e5);
    }, function(date) {
        return date.getHours();
    });
    d3_time.hours = d3_time.hour.range;
    d3_time.hours.utc = d3_time.hour.utc.range;
    d3_time.month = d3_time_interval(function(date) {
        date = d3_time.day(date);
        date.setDate(1);
        return date;
    }, function(date, offset) {
        date.setMonth(date.getMonth() + offset);
    }, function(date) {
        return date.getMonth();
    });
    d3_time.months = d3_time.month.range;
    d3_time.months.utc = d3_time.month.utc.range;
    function d3_true() {
        return true;
    }
    function d3_locale_timeFormat(locale) {
        var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_days = locale.days, locale_shortDays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths;
        function d3_time_format(template) {
            var n = template.length;
            function format(date) {
                var string = [], i = -1, j = 0, c, p, f;
                while (++i < n) {
                    if (template.charCodeAt(i) === 37) {
                        string.push(template.slice(j, i));
                        if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);
                        if (f = d3_time_formats[c]) c = f(date, p == null ? c === "e" ? " " : "0" : p);
                        string.push(c);
                        j = i + 1;
                    }
                }
                string.push(template.slice(j, i));
                return string.join("");
            }
            format.parse = function(string) {
                var d = {
                    y: 1900,
                    m: 0,
                    d: 1,
                    H: 0,
                    M: 0,
                    S: 0,
                    L: 0,
                    Z: null
                }, i = d3_time_parse(d, template, string, 0);
                if (i != string.length) return null;
                if ("p" in d) d.H = d.H % 12 + d.p * 12;
                var localZ = d.Z != null && d3_date !== d3_date_utc, date = new (localZ ? d3_date_utc : d3_date)();
                if ("j" in d) date.setFullYear(d.y, 0, d.j); else if ("W" in d || "U" in d) {
                    if (!("w" in d)) d.w = "W" in d ? 1 : 0;
                    date.setFullYear(d.y, 0, 1);
                    date.setFullYear(d.y, 0, "W" in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7);
                } else date.setFullYear(d.y, d.m, d.d);
                date.setHours(d.H + (d.Z / 100 | 0), d.M + d.Z % 100, d.S, d.L);
                return localZ ? date._ : date;
            };
            format.toString = function() {
                return template;
            };
            return format;
        }
        function d3_time_parse(date, template, string, j) {
            var c, p, t, i = 0, n = template.length, m = string.length;
            while (i < n) {
                if (j >= m) return -1;
                c = template.charCodeAt(i++);
                if (c === 37) {
                    t = template.charAt(i++);
                    p = d3_time_parsers[t in d3_time_formatPads ? template.charAt(i++) : t];
                    if (!p || (j = p(date, string, j)) < 0) return -1;
                } else if (c != string.charCodeAt(j++)) {
                    return -1;
                }
            }
            return j;
        }
        d3_time_format.utc = function(template) {
            var local = d3_time_format(template);
            function format(date) {
                try {
                    d3_date = d3_date_utc;
                    var utc = new d3_date();
                    utc._ = date;
                    return local(utc);
                } finally {
                    d3_date = Date;
                }
            }
            format.parse = function(string) {
                try {
                    d3_date = d3_date_utc;
                    var date = local.parse(string);
                    return date && date._;
                } finally {
                    d3_date = Date;
                }
            };
            format.toString = local.toString;
            return format;
        };
        function d3_time_formatMulti(formats) {
            var n = formats.length, i = -1;
            while (++i < n) formats[i][0] = this(formats[i][0]);
            return function(date) {
                var i = 0, f = formats[i];
                while (!f[1](date)) f = formats[++i];
                return f[0](date);
            };
        }
        d3_time_format.multi = d3_time_format.utc.multi = d3_time_formatMulti;
        var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
        d3.requote = function(s) {
            return s.replace(d3_requote_re, "\\$&");
        };
        function d3_time_formatRe(names) {
            return new RegExp("^(?:" + names.map(d3.requote).join("|") + ")", "i");
        }
        function d3_time_formatLookup(names) {
            var map = new d3_Map(), i = -1, n = names.length;
            while (++i < n) map.set(names[i].toLowerCase(), i);
            return map;
        }
        var d3_time_periodLookup = d3.map(), d3_time_dayRe = d3_time_formatRe(locale_days), d3_time_dayLookup = d3_time_formatLookup(locale_days), d3_time_dayAbbrevRe = d3_time_formatRe(locale_shortDays), d3_time_dayAbbrevLookup = d3_time_formatLookup(locale_shortDays), d3_time_monthRe = d3_time_formatRe(locale_months), d3_time_monthLookup = d3_time_formatLookup(locale_months), d3_time_monthAbbrevRe = d3_time_formatRe(locale_shortMonths), d3_time_monthAbbrevLookup = d3_time_formatLookup(locale_shortMonths);
        locale_periods.forEach(function(p, i) {
            d3_time_periodLookup.set(p.toLowerCase(), i);
        });
        function d3_time_formatPad(value, fill, width) {
            var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
            return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
        }
        function d3_time_zone(d) {
            var z = d.getTimezoneOffset(), zs = z > 0 ? "-" : "+", zh = abs(z) / 60 | 0, zm = abs(z) % 60;
            return zs + d3_time_formatPad(zh, "0", 2) + d3_time_formatPad(zm, "0", 2);
        }
        var d3_time_formats = {
            a: function(d) {
                return locale_shortDays[d.getDay()];
            },
            A: function(d) {
                return locale_days[d.getDay()];
            },
            b: function(d) {
                return locale_shortMonths[d.getMonth()];
            },
            B: function(d) {
                return locale_months[d.getMonth()];
            },
            c: d3_time_format(locale_dateTime),
            d: function(d, p) {
                return d3_time_formatPad(d.getDate(), p, 2);
            },
            e: function(d, p) {
                return d3_time_formatPad(d.getDate(), p, 2);
            },
            H: function(d, p) {
                return d3_time_formatPad(d.getHours(), p, 2);
            },
            I: function(d, p) {
                return d3_time_formatPad(d.getHours() % 12 || 12, p, 2);
            },
            j: function(d, p) {
                return d3_time_formatPad(1 + d3_time.dayOfYear(d), p, 3);
            },
            L: function(d, p) {
                return d3_time_formatPad(d.getMilliseconds(), p, 3);
            },
            m: function(d, p) {
                return d3_time_formatPad(d.getMonth() + 1, p, 2);
            },
            M: function(d, p) {
                return d3_time_formatPad(d.getMinutes(), p, 2);
            },
            p: function(d) {
                return locale_periods[+(d.getHours() >= 12)];
            },
            S: function(d, p) {
                return d3_time_formatPad(d.getSeconds(), p, 2);
            },
            U: function(d, p) {
                return d3_time_formatPad(d3_time.sundayOfYear(d), p, 2);
            },
            w: function(d) {
                return d.getDay();
            },
            W: function(d, p) {
                return d3_time_formatPad(d3_time.mondayOfYear(d), p, 2);
            },
            x: d3_time_format(locale_date),
            X: d3_time_format(locale_time),
            y: function(d, p) {
                return d3_time_formatPad(d.getFullYear() % 100, p, 2);
            },
            Y: function(d, p) {
                return d3_time_formatPad(d.getFullYear() % 1e4, p, 4);
            },
            Z: d3_time_zone,
            "%": function() {
                return "%";
            }
        };
        var d3_time_formatPads = {
            "-": "",
            _: " ",
            "0": "0"
        }, d3_time_numberRe = /^\s*\d+/, d3_time_percentRe = /^%/;
        function d3_time_parseDay(date, string, i) {
            d3_time_numberRe.lastIndex = 0;
            var n = d3_time_numberRe.exec(string.slice(i, i + 2));
            return n ? (date.d = +n[0], i + n[0].length) : -1;
        }
        function d3_time_parseDayOfYear(date, string, i) {
            d3_time_numberRe.lastIndex = 0;
            var n = d3_time_numberRe.exec(string.slice(i, i + 3));
            return n ? (date.j = +n[0], i + n[0].length) : -1;
        }
        function d3_time_parseHour24(date, string, i) {
            d3_time_numberRe.lastIndex = 0;
            var n = d3_time_numberRe.exec(string.slice(i, i + 2));
            return n ? (date.H = +n[0], i + n[0].length) : -1;
        }
        function d3_time_parseMinutes(date, string, i) {
            d3_time_numberRe.lastIndex = 0;
            var n = d3_time_numberRe.exec(string.slice(i, i + 2));
            return n ? (date.M = +n[0], i + n[0].length) : -1;
        }
        function d3_time_parseMilliseconds(date, string, i) {
            d3_time_numberRe.lastIndex = 0;
            var n = d3_time_numberRe.exec(string.slice(i, i + 3));
            return n ? (date.L = +n[0], i + n[0].length) : -1;
        }
        function d3_time_parseMonthNumber(date, string, i) {
            d3_time_numberRe.lastIndex = 0;
            var n = d3_time_numberRe.exec(string.slice(i, i + 2));
            return n ? (date.m = n[0] - 1, i + n[0].length) : -1;
        }
        function d3_time_parseSeconds(date, string, i) {
            d3_time_numberRe.lastIndex = 0;
            var n = d3_time_numberRe.exec(string.slice(i, i + 2));
            return n ? (date.S = +n[0], i + n[0].length) : -1;
        }
        function d3_time_parseWeekNumberSunday(date, string, i) {
            d3_time_numberRe.lastIndex = 0;
            var n = d3_time_numberRe.exec(string.slice(i));
            return n ? (date.U = +n[0], i + n[0].length) : -1;
        }
        function d3_time_parseWeekdayNumber(date, string, i) {
            d3_time_numberRe.lastIndex = 0;
            var n = d3_time_numberRe.exec(string.slice(i, i + 1));
            return n ? (date.w = +n[0], i + n[0].length) : -1;
        }
        function d3_time_parseWeekNumberMonday(date, string, i) {
            d3_time_numberRe.lastIndex = 0;
            var n = d3_time_numberRe.exec(string.slice(i));
            return n ? (date.W = +n[0], i + n[0].length) : -1;
        }
        function d3_time_expandYear(d) {
            return d + (d > 68 ? 1900 : 2e3);
        }
        function d3_time_parseYear(date, string, i) {
            d3_time_numberRe.lastIndex = 0;
            var n = d3_time_numberRe.exec(string.slice(i, i + 2));
            return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1;
        }
        function d3_time_parseFullYear(date, string, i) {
            d3_time_numberRe.lastIndex = 0;
            var n = d3_time_numberRe.exec(string.slice(i, i + 4));
            return n ? (date.y = +n[0], i + n[0].length) : -1;
        }
        function d3_time_parseZone(date, string, i) {
            return /^[+-]\d{4}$/.test(string = string.slice(i, i + 5)) ? (date.Z = -string,
            i + 5) : -1;
        }
        function d3_time_parseLiteralPercent(date, string, i) {
            d3_time_percentRe.lastIndex = 0;
            var n = d3_time_percentRe.exec(string.slice(i, i + 1));
            return n ? i + n[0].length : -1;
        }
        var d3_time_parsers = {
            a: d3_time_parseWeekdayAbbrev,
            A: d3_time_parseWeekday,
            b: d3_time_parseMonthAbbrev,
            B: d3_time_parseMonth,
            c: d3_time_parseLocaleFull,
            d: d3_time_parseDay,
            e: d3_time_parseDay,
            H: d3_time_parseHour24,
            I: d3_time_parseHour24,
            j: d3_time_parseDayOfYear,
            L: d3_time_parseMilliseconds,
            m: d3_time_parseMonthNumber,
            M: d3_time_parseMinutes,
            p: d3_time_parseAmPm,
            S: d3_time_parseSeconds,
            U: d3_time_parseWeekNumberSunday,
            w: d3_time_parseWeekdayNumber,
            W: d3_time_parseWeekNumberMonday,
            x: d3_time_parseLocaleDate,
            X: d3_time_parseLocaleTime,
            y: d3_time_parseYear,
            Y: d3_time_parseFullYear,
            Z: d3_time_parseZone,
            "%": d3_time_parseLiteralPercent
        };
        function d3_time_parseWeekdayAbbrev(date, string, i) {
            d3_time_dayAbbrevRe.lastIndex = 0;
            var n = d3_time_dayAbbrevRe.exec(string.slice(i));
            return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
        }
        function d3_time_parseWeekday(date, string, i) {
            d3_time_dayRe.lastIndex = 0;
            var n = d3_time_dayRe.exec(string.slice(i));
            return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
        }
        function d3_time_parseMonthAbbrev(date, string, i) {
            d3_time_monthAbbrevRe.lastIndex = 0;
            var n = d3_time_monthAbbrevRe.exec(string.slice(i));
            return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
        }
        function d3_time_parseMonth(date, string, i) {
            d3_time_monthRe.lastIndex = 0;
            var n = d3_time_monthRe.exec(string.slice(i));
            return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
        }
        function d3_time_parseLocaleFull(date, string, i) {
            return d3_time_parse(date, d3_time_formats.c.toString(), string, i);
        }
        function d3_time_parseLocaleDate(date, string, i) {
            return d3_time_parse(date, d3_time_formats.x.toString(), string, i);
        }
        function d3_time_parseLocaleTime(date, string, i) {
            return d3_time_parse(date, d3_time_formats.X.toString(), string, i);
        }
        function d3_time_parseAmPm(date, string, i) {
            var n = d3_time_periodLookup.get(string.slice(i, i += 2).toLowerCase());
            return n == null ? -1 : (date.p = n, i);
        }
        return d3_time_format;
    }
    function d3_locale_numberFormat(locale) {
        var locale_decimal = locale.decimal, locale_thousands = locale.thousands, locale_grouping = locale.grouping, locale_currency = locale.currency, formatGroup = locale_grouping && locale_thousands ? function(value, width) {
            var i = value.length, t = [], j = 0, g = locale_grouping[0], length = 0;
            while (i > 0 && g > 0) {
                if (length + g + 1 > width) g = Math.max(1, width - length);
                t.push(value.substring(i -= g, i + g));
                if ((length += g + 1) > width) break;
                g = locale_grouping[j = (j + 1) % locale_grouping.length];
            }
            return t.reverse().join(locale_thousands);
        } : d3_identity;
        return function(specifier) {
            var match = d3_format_re.exec(specifier), fill = match[1] || " ", align = match[2] || ">", sign = match[3] || "-", symbol = match[4] || "", zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, prefix = "", suffix = "", integer = false, exponent = true;
            if (precision) precision = +precision.substring(1);
            if (zfill || fill === "0" && align === "=") {
                zfill = fill = "0";
                align = "=";
            }
            switch (type) {
                case "n":
                    comma = true;
                    type = "g";
                    break;

                case "%":
                    scale = 100;
                    suffix = "%";
                    type = "f";
                    break;

                case "p":
                    scale = 100;
                    suffix = "%";
                    type = "r";
                    break;

                case "b":
                case "o":
                case "x":
                case "X":
                    if (symbol === "#") prefix = "0" + type.toLowerCase();

                case "c":
                    exponent = false;

                case "d":
                    integer = true;
                    precision = 0;
                    break;

                case "s":
                    scale = -1;
                    type = "r";
                    break;
            }
            if (symbol === "$") prefix = locale_currency[0], suffix = locale_currency[1];
            if (type == "r" && !precision) type = "g";
            if (precision != null) {
                if (type == "g") precision = Math.max(1, Math.min(21, precision)); else if (type == "e" || type == "f") precision = Math.max(0, Math.min(20, precision));
            }
            type = d3_format_types.get(type) || d3_format_typeDefault;
            var zcomma = zfill && comma;
            return function(value) {
                var fullSuffix = suffix;
                if (integer && value % 1) return "";
                var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, "-") : sign === "-" ? "" : sign;
                if (scale < 0) {
                    var unit = d3.formatPrefix(value, precision);
                    value = unit.scale(value);
                    fullSuffix = unit.symbol + suffix;
                } else {
                    value *= scale;
                }
                value = type(value, precision);
                var i = value.lastIndexOf("."), before, after;
                if (i < 0) {
                    var j = exponent ? value.lastIndexOf("e") : -1;
                    if (j < 0) before = value, after = ""; else before = value.substring(0, j), after = value.substring(j);
                } else {
                    before = value.substring(0, i);
                    after = locale_decimal + value.substring(i + 1);
                }
                if (!zfill && comma) before = formatGroup(before, Infinity);
                var length = prefix.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = length < width ? new Array(length = width - length + 1).join(fill) : "";
                if (zcomma) before = formatGroup(padding + before, padding.length ? width - after.length : Infinity);
                negative += prefix;
                value = before + after;
                return (align === "<" ? negative + value + padding : align === ">" ? padding + negative + value : align === "^" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + fullSuffix;
            };
        };
    }
    d3.locale = function(locale) {
        return {
            numberFormat: d3_locale_numberFormat(locale),
            timeFormat: d3_locale_timeFormat(locale)
        };
    };
    var d3_locale_enUS = d3.locale({
        decimal: ".",
        thousands: ",",
        grouping: [ 3 ],
        currency: [ "$", "" ],
        dateTime: "%a %b %e %X %Y",
        date: "%m/%d/%Y",
        time: "%H:%M:%S",
        periods: [ "AM", "PM" ],
        days: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
        shortDays: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
        months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
        shortMonths: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
    });
    var d3_time_format = d3_time.format = d3_locale_enUS.timeFormat;
    var d3_time_scaleSteps = [ 1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6 ];
    var d3_time_scaleLocalMethods = [ [ d3_time.second, 1 ], [ d3_time.second, 5 ], [ d3_time.second, 15 ], [ d3_time.second, 30 ], [ d3_time.minute, 1 ], [ d3_time.minute, 5 ], [ d3_time.minute, 15 ], [ d3_time.minute, 30 ], [ d3_time.hour, 1 ], [ d3_time.hour, 3 ], [ d3_time.hour, 6 ], [ d3_time.hour, 12 ], [ d3_time.day, 1 ], [ d3_time.day, 2 ], [ d3_time.week, 1 ], [ d3_time.month, 1 ], [ d3_time.month, 3 ], [ d3_time.year, 1 ] ];
    var d3_time_scaleLocalFormat = d3_time_format.multi([ [ ".%L", function(d) {
        return d.getMilliseconds();
    } ], [ ":%S", function(d) {
        return d.getSeconds();
    } ], [ "%I:%M", function(d) {
        return d.getMinutes();
    } ], [ "%I %p", function(d) {
        return d.getHours();
    } ], [ "%a %d", function(d) {
        return d.getDay() && d.getDate() != 1;
    } ], [ "%b %d", function(d) {
        return d.getDate() != 1;
    } ], [ "%B", function(d) {
        return d.getMonth();
    } ], [ "%Y", d3_true ] ]);
    var d3_time_scaleMilliseconds = {
        range: function(start, stop, step) {
            return d3.range(Math.ceil(start / step) * step, +stop, step).map(d3_time_scaleDate);
        },
        floor: d3_identity,
        ceil: d3_identity
    };
    function d3_rebind(target, source, method) {
        return function() {
            var value = method.apply(source, arguments);
            return value === source ? target : value;
        };
    }
    d3.rebind = function(target, source) {
        var i = 1, n = arguments.length, method;
        while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
        return target;
    };
    function d3_scale_linearRebind(scale, linear) {
        return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp");
    }
    function d3_time_scaleDate(t) {
        return new Date(t);
    }
    function d3_bisector(compare) {
        return {
            left: function(a, x, lo, hi) {
                if (arguments.length < 3) lo = 0;
                if (arguments.length < 4) hi = a.length;
                while (lo < hi) {
                    var mid = lo + hi >>> 1;
                    if (compare(a[mid], x) < 0) lo = mid + 1; else hi = mid;
                }
                return lo;
            },
            right: function(a, x, lo, hi) {
                if (arguments.length < 3) lo = 0;
                if (arguments.length < 4) hi = a.length;
                while (lo < hi) {
                    var mid = lo + hi >>> 1;
                    if (compare(a[mid], x) > 0) hi = mid; else lo = mid + 1;
                }
                return lo;
            }
        };
    }
    d3.ascending = d3_ascending;
    function d3_ascending(a, b) {
        return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }
    d3.bisector = function(f) {
        return d3_bisector(f.length === 1 ? function(d, x) {
            return d3_ascending(f(d), x);
        } : f);
    };
    var d3_bisect = d3_bisector(d3_ascending);
    d3.bisectLeft = d3_bisect.left;
    d3.bisect = d3.bisectRight = d3_bisect.right;
    function d3_time_scale(linear, methods, format) {
        function scale(x) {
            return linear(x);
        }
        scale.invert = function(x) {
            return d3_time_scaleDate(linear.invert(x));
        };
        scale.domain = function(x) {
            if (!arguments.length) return linear.domain().map(d3_time_scaleDate);
            linear.domain(x);
            return scale;
        };
        function tickMethod(extent, count) {
            var span = extent[1] - extent[0], target = span / count, i = d3.bisect(d3_time_scaleSteps, target);
            return i == d3_time_scaleSteps.length ? [ methods.year, d3_scale_linearTickRange(extent.map(function(d) {
                return d / 31536e6;
            }), count)[2] ] : !i ? [ d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2] ] : methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i];
        }
        scale.nice = function(interval, skip) {
            var domain = scale.domain(), extent = d3_scaleExtent(domain), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" && tickMethod(extent, interval);
            if (method) interval = method[0], skip = method[1];
            function skipped(date) {
                return !isNaN(date) && !interval.range(date, d3_time_scaleDate(+date + 1), skip).length;
            }
            return scale.domain(d3_scale_nice(domain, skip > 1 ? {
                floor: function(date) {
                    while (skipped(date = interval.floor(date))) date = d3_time_scaleDate(date - 1);
                    return date;
                },
                ceil: function(date) {
                    while (skipped(date = interval.ceil(date))) date = d3_time_scaleDate(+date + 1);
                    return date;
                }
            } : interval));
        };
        scale.ticks = function(interval, skip) {
            var extent = d3_scaleExtent(scale.domain()), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" ? tickMethod(extent, interval) : !interval.range && [ {
                range: interval
            }, skip ];
            if (method) interval = method[0], skip = method[1];
            return interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip);
        };
        scale.tickFormat = function() {
            return format;
        };
        scale.copy = function() {
            return d3_time_scale(linear.copy(), methods, format);
        };
        return d3_scale_linearRebind(scale, linear);
    }
    d3_time.scale = function() {
        return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat);
    };
    if (typeof define === "function" && define.amd) this.d3 = d3, define(d3); else if (typeof module === "object" && module.exports) module.exports = d3; else this.d3 = d3;
}();