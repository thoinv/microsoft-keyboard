webpackJsonp([0], {
    0: function(e, t, n) {
        "use strict";
        var r = n(1),
            a = n(30),
            o = n(163);
        a.render(r.createElement(o, null), document.getElementById("calculator"))
    },
    163: function(e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function a(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var i = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                    }
                }
                return function(t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t
                }
            }(),
            l = n(1),
            c = n(164),
            u = c.StyleSheet,
            p = n(185),
            s = p.View,
            f = n(193),
            y = f.components,
            m = f.consts,
            d = y.Keypad,
            E = y.KeypadInput,
            b = function(e) {
                function t() {
                    var e, n, o, i;
                    r(this, t);
                    for (var l = arguments.length, c = Array(l), u = 0; u < l; u++) c[u] = arguments[u];
                    return n = o = a(this, (e = t.__proto__ || Object.getPrototypeOf(t)).call.apply(e, [this].concat(c))), o.state = {
                        keypadElement: null,
                        value: "",
                        keypadType: m.KeypadTypes.EXPRESSION
                    }, o.handleChange = function(e) {
                        o.state.keypadElement.configure({
                            keypadType: e.target.value,
                            extraKeys: ["x", "y", "PI", "THETA"]
                        }), o.setState({
                            keypadType: e.target.value
                        })
                    }, i = n, a(o, i)
                }
                return o(t, e), i(t, [{
                    key: "render",
                    value: function() {
                        var e = this;
                        return l.createElement(s, null, l.createElement(s, {
                            style: h.container
                        }, l.createElement(E, {
                            value: this.state.value,
                            keypadElement: this.state.keypadElement,
                            onChange: function(t, n) {
                                console.log("KEYBOARD_CLICK:" + t);
                                return e.setState({
                                    value: t
                                }, n)
                            },
                            onFocus: function() {
                                return e.state.keypadElement.activate()
                            },
                            onBlur: function() {
                                return e.state.keypadElement.dismiss()
                            }
                        }), l.createElement("div", {
                            id: "example_box"
                        })), l.createElement(d, {
                            onElementMounted: function(t) {
                                t && !e.state.keypadElement && e.setState({
                                    keypadElement: t
                                })
                            }
                        }))
                    }
                }]), t
            }(l.Component),
            h = u.create({
                container: {
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    marginBottom: 40
                },
                selectContainer: {
                    marginTop: 16,
                    flexDirection: "row"
                }
            });

            document.addEventListener('readystatechange', event => {
                if (event.target.readyState === "complete") {
//                    document.getElementsByClassName("mq-editable-field")[0].click();
                }
            });
        e.exports = b
    }
});