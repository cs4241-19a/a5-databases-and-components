
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/App.svelte generated by Svelte v3.12.1 */

    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	var div4, h1, t1, p, t3, div3, div1, input0, t4, label0, t6, br0, t7, input1, t8, label1, t10, br1, t11, input2, t12, label2, t14, br2, t15, input3, t16, label3, t18, br3, t19, input4, t20, label4, t22, br4, t23, input5, t24, label5, t26, br5, t27, input6, t28, label6, t30, br6, t31, input7, t32, br7, t33, button, t35, br8, t36, div0, t37, div2, canvas, t38, script, t40, br9, dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Shader Editor";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Welcome! Play with the sliders to change shader variables";
    			t3 = space();
    			div3 = element("div");
    			div1 = element("div");
    			input0 = element("input");
    			t4 = space();
    			label0 = element("label");
    			label0.textContent = "Red";
    			t6 = space();
    			br0 = element("br");
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			label1 = element("label");
    			label1.textContent = "Green";
    			t10 = space();
    			br1 = element("br");
    			t11 = space();
    			input2 = element("input");
    			t12 = space();
    			label2 = element("label");
    			label2.textContent = "Blue";
    			t14 = space();
    			br2 = element("br");
    			t15 = space();
    			input3 = element("input");
    			t16 = space();
    			label3 = element("label");
    			label3.textContent = "Sin";
    			t18 = space();
    			br3 = element("br");
    			t19 = space();
    			input4 = element("input");
    			t20 = space();
    			label4 = element("label");
    			label4.textContent = "Tan";
    			t22 = space();
    			br4 = element("br");
    			t23 = space();
    			input5 = element("input");
    			t24 = space();
    			label5 = element("label");
    			label5.textContent = "Absolute";
    			t26 = space();
    			br5 = element("br");
    			t27 = space();
    			input6 = element("input");
    			t28 = space();
    			label6 = element("label");
    			label6.textContent = "Frequency";
    			t30 = space();
    			br6 = element("br");
    			t31 = space();
    			input7 = element("input");
    			t32 = space();
    			br7 = element("br");
    			t33 = space();
    			button = element("button");
    			button.textContent = "Save shader values";
    			t35 = space();
    			br8 = element("br");
    			t36 = space();
    			div0 = element("div");
    			t37 = space();
    			div2 = element("div");
    			canvas = element("canvas");
    			t38 = space();
    			script = element("script");
    			script.textContent = "const pixiCanvas = document.getElementById('pixi');\n          const sliders = document.querySelectorAll('.slider');\n\n\n          const pixiApp = new PIXI.Application({\n              view: pixiCanvas,\n              width: 700,\n              height: 500\n          });\n\n          const renderer = new PIXI.Renderer({});\n\n          let vShader = `\n                  attribute vec2 aVertexPosition;\n                  attribute vec2 aTextureCoord;\n\n                  uniform mat3 projectionMatrix;\n                  varying vec2 vTextureCoord;\n\n                  void main(void){\n                      gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n                      vTextureCoord = aTextureCoord;\n                  }`;\n          let fShader = `\n                  varying vec2 vTextureCoord;\n                  uniform sampler2D uSampler;\n                  uniform float uTime;\n                  uniform float redSlider;\n                  uniform float greenSlider;\n                  uniform float blueSlider;\n                  uniform float sinSlider;\n                  uniform float tanSlider;\n                  uniform float absSlider;\n                  uniform float freqSlider;\n\n\n\n                  void main(void){\n                      vec4 color = texture2D(uSampler, vTextureCoord);\n                      float waveX = sin(uTime + (vTextureCoord.x * 3.0)) - sinSlider;\n                      float waveY = tan(uTime + (vTextureCoord.y * 3.0));\n\n                      if(color.b > 0.9 && tanSlider > 0.0){\n\n                        color = vec4(vec3(waveY), tan(uTime + tanSlider));\n                      }\n\n                      if(color.b > 0.9 && sinSlider > 0.0){\n\n                        color = vec4(vec3(waveX), 1);\n                      }\n\n\n                      if(absSlider > 0.0){\n                              color.r = abs(color.r) / absSlider;\n                              color.g = abs(color.g) / absSlider;\n                              color.b = abs(color.b) / absSlider;\n                          }\n                      color.r = color.r * redSlider;\n                      color.g = color.g * greenSlider;\n                      color.b = color.b * blueSlider;\n\n\n                      gl_FragColor = color;\n                  }`;\n\n\n          let uniforms = {\n              uTime: 0,\n              redSlider: 1.0,\n              blueSlider: 1.0,\n              greenSlider: 1.0,\n              sinSlider: 0,\n              tanSlider: 0,\n              absSlider: 0.5,\n              freqSlider: 1\n          };\n\n          const slide = function(event){\n\n              if(event.target.matches('.red')){\n                  uniforms.redSlider = event.target.value;\n              }\n              if(event.target.matches('.green')){\n                  uniforms.greenSlider = event.target.value;\n              }\n              if(event.target.matches('.blue')){\n                  uniforms.blueSlider = event.target.value;\n              }\n              if(event.target.matches('.sin')){\n                  uniforms.sinSlider = event.target.value;\n              }\n              if(event.target.matches('.abs')){\n                  uniforms.absSlider = event.target.value;\n              }\n              if(event.target.matches('.freq')){\n                  uniforms.freqSlider = event.target.value;\n              }\n              if(event.target.matches('.tan')){\n                  uniforms.tanSlider = event.target.value;\n              }\n          };\n\n\n          const myFilter = new PIXI.Filter(vShader, fShader, uniforms);\n\n          const texture = PIXI.Texture.from('https://cdn.glitch.com/4dd0b763-d029-4fb7-9d05-a13adddc61f2%2Fhusky_copy.png?v=1568561412816');\n          const husky = new PIXI.Sprite(texture);\n\n          husky.x = pixiApp.renderer.width / 2;\n          husky.y = pixiApp.renderer.height / 2;\n          husky.anchor.x = 0.5;\n          husky.anchor.y = 0.5;\n          husky.scale.x = 1.5;\n          husky.scale.y = 1.5;\n\n          husky.filters = [myFilter];\n\n          pixiApp.stage.addChild(husky);\n          pixiApp.ticker.add(animate);\n\n          // This function is not attached to a const to define it at the top of the script\n          function animate() {\n              uniforms.uTime += (0.005 * (uniforms.freqSlider + 5));\n              husky.angle += 1;\n          }\n\n          // Event listner\n          sliders.forEach(slider => slider.addEventListener('input', slide));";
    			t40 = space();
    			br9 = element("br");
    			attr_dev(h1, "class", "mt-4");
    			add_location(h1, file, 108, 4, 2954);
    			attr_dev(p, "class", "lead mb-3");
    			set_style(p, "font-size", "1.6em");
    			add_location(p, file, 109, 4, 2994);
    			attr_dev(input0, "class", "slider red svelte-vuw5b4");
    			attr_dev(input0, "type", "range");
    			attr_dev(input0, "name", "red");
    			attr_dev(input0, "min", "0");
    			attr_dev(input0, "max", "1");
    			attr_dev(input0, "step", "0.01");
    			add_location(input0, file, 115, 10, 3196);
    			attr_dev(label0, "for", "red");
    			set_style(label0, "color", "red");
    			attr_dev(label0, "class", "svelte-vuw5b4");
    			add_location(label0, file, 116, 10, 3285);
    			add_location(br0, file, 117, 10, 3343);
    			attr_dev(input1, "class", "slider green svelte-vuw5b4");
    			attr_dev(input1, "type", "range");
    			attr_dev(input1, "name", "green");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "max", "1");
    			attr_dev(input1, "step", "0.01");
    			add_location(input1, file, 118, 10, 3358);
    			attr_dev(label1, "for", "green");
    			set_style(label1, "color", "green");
    			attr_dev(label1, "class", "svelte-vuw5b4");
    			add_location(label1, file, 119, 10, 3451);
    			add_location(br1, file, 120, 10, 3515);
    			attr_dev(input2, "class", "slider blue svelte-vuw5b4");
    			attr_dev(input2, "type", "range");
    			attr_dev(input2, "name", "blue");
    			attr_dev(input2, "min", "0");
    			attr_dev(input2, "max", "1");
    			attr_dev(input2, "step", "0.01");
    			add_location(input2, file, 121, 10, 3530);
    			attr_dev(label2, "for", "blue");
    			set_style(label2, "color", "blue");
    			attr_dev(label2, "class", "svelte-vuw5b4");
    			add_location(label2, file, 122, 10, 3621);
    			add_location(br2, file, 123, 10, 3682);
    			attr_dev(input3, "class", "slider sin svelte-vuw5b4");
    			attr_dev(input3, "type", "range");
    			attr_dev(input3, "name", "sin");
    			attr_dev(input3, "min", "0");
    			attr_dev(input3, "max", "1");
    			attr_dev(input3, "step", "0.01");
    			input3.value = "0";
    			add_location(input3, file, 124, 10, 3697);
    			attr_dev(label3, "for", "sin");
    			set_style(label3, "color", "#E87C27");
    			attr_dev(label3, "class", "svelte-vuw5b4");
    			add_location(label3, file, 125, 10, 3796);
    			add_location(br3, file, 126, 10, 3858);
    			attr_dev(input4, "class", "slider tan svelte-vuw5b4");
    			attr_dev(input4, "type", "range");
    			attr_dev(input4, "name", "tan");
    			attr_dev(input4, "min", "0");
    			attr_dev(input4, "max", "1");
    			attr_dev(input4, "step", "0.01");
    			input4.value = "0";
    			add_location(input4, file, 127, 10, 3873);
    			attr_dev(label4, "for", "tan");
    			set_style(label4, "color", "yellow");
    			attr_dev(label4, "class", "svelte-vuw5b4");
    			add_location(label4, file, 128, 10, 3972);
    			add_location(br4, file, 129, 10, 4033);
    			attr_dev(input5, "class", "slider abs svelte-vuw5b4");
    			attr_dev(input5, "type", "range");
    			attr_dev(input5, "name", "abs");
    			attr_dev(input5, "min", "0");
    			attr_dev(input5, "max", "1");
    			attr_dev(input5, "step", "0.01");
    			add_location(input5, file, 130, 10, 4048);
    			attr_dev(label5, "for", "abs");
    			set_style(label5, "color", "cyan");
    			attr_dev(label5, "class", "svelte-vuw5b4");
    			add_location(label5, file, 131, 10, 4137);
    			add_location(br5, file, 132, 10, 4201);
    			attr_dev(input6, "class", "slider freq svelte-vuw5b4");
    			attr_dev(input6, "type", "range");
    			attr_dev(input6, "name", "freq");
    			attr_dev(input6, "min", "1");
    			attr_dev(input6, "max", "5");
    			attr_dev(input6, "step", "0.1");
    			add_location(input6, file, 133, 10, 4216);
    			attr_dev(label6, "for", "freq");
    			set_style(label6, "color", "purple");
    			attr_dev(label6, "class", "svelte-vuw5b4");
    			add_location(label6, file, 134, 10, 4306);
    			add_location(br6, file, 135, 10, 4374);
    			attr_dev(input7, "type", "name");
    			attr_dev(input7, "id", "name");
    			attr_dev(input7, "name", "name");
    			attr_dev(input7, "placeholder", "Shader name");
    			attr_dev(input7, "class", "svelte-vuw5b4");
    			add_location(input7, file, 136, 10, 4389);
    			add_location(br7, file, 137, 10, 4468);
    			set_style(button, "width", "200px");
    			add_location(button, file, 140, 10, 4485);
    			add_location(br8, file, 143, 8, 4597);
    			attr_dev(div0, "id", "savedShaders");
    			add_location(div0, file, 144, 8, 4610);
    			attr_dev(div1, "class", "shader column svelte-vuw5b4");
    			add_location(div1, file, 113, 6, 3156);
    			attr_dev(canvas, "id", "pixi");
    			set_style(canvas, "margin-left", "60px");
    			add_location(canvas, file, 150, 8, 4724);
    			attr_dev(script, "type", "text/javascript");
    			add_location(script, file, 151, 8, 4786);
    			attr_dev(div2, "class", "column pixi");
    			set_style(div2, "flex", "50%");
    			add_location(div2, file, 149, 6, 4670);
    			attr_dev(div3, "class", "row");
    			set_style(div3, "display", "flex");
    			add_location(div3, file, 111, 4, 3108);
    			add_location(br9, file, 285, 2, 9311);
    			attr_dev(div4, "class", "pixi-shaders");
    			add_location(div4, file, 107, 0, 2923);
    			dispose = listen_dev(button, "click", ctx.handleClick);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, h1);
    			append_dev(div4, t1);
    			append_dev(div4, p);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, input0);
    			append_dev(div1, t4);
    			append_dev(div1, label0);
    			append_dev(div1, t6);
    			append_dev(div1, br0);
    			append_dev(div1, t7);
    			append_dev(div1, input1);
    			append_dev(div1, t8);
    			append_dev(div1, label1);
    			append_dev(div1, t10);
    			append_dev(div1, br1);
    			append_dev(div1, t11);
    			append_dev(div1, input2);
    			append_dev(div1, t12);
    			append_dev(div1, label2);
    			append_dev(div1, t14);
    			append_dev(div1, br2);
    			append_dev(div1, t15);
    			append_dev(div1, input3);
    			append_dev(div1, t16);
    			append_dev(div1, label3);
    			append_dev(div1, t18);
    			append_dev(div1, br3);
    			append_dev(div1, t19);
    			append_dev(div1, input4);
    			append_dev(div1, t20);
    			append_dev(div1, label4);
    			append_dev(div1, t22);
    			append_dev(div1, br4);
    			append_dev(div1, t23);
    			append_dev(div1, input5);
    			append_dev(div1, t24);
    			append_dev(div1, label5);
    			append_dev(div1, t26);
    			append_dev(div1, br5);
    			append_dev(div1, t27);
    			append_dev(div1, input6);
    			append_dev(div1, t28);
    			append_dev(div1, label6);
    			append_dev(div1, t30);
    			append_dev(div1, br6);
    			append_dev(div1, t31);
    			append_dev(div1, input7);
    			append_dev(div1, t32);
    			append_dev(div1, br7);
    			append_dev(div1, t33);
    			append_dev(div1, button);
    			append_dev(div1, t35);
    			append_dev(div1, br8);
    			append_dev(div1, t36);
    			append_dev(div1, div0);
    			append_dev(div3, t37);
    			append_dev(div3, div2);
    			append_dev(div2, canvas);
    			append_dev(div2, t38);
    			append_dev(div2, script);
    			append_dev(div4, t40);
    			append_dev(div4, br9);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div4);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self) {
    	let savedShaders = [];

        //const sliders = document.querySelectorAll('.slider');

        function handleClick(event) {
            let sliderValues = [];
            const shaderName = document.getElementById('name');
            const shader = {};

            for (let i = 0; i < sliders.length; i+=1){
                sliderValues.push(sliders[i].value);

            }
            shader.red = sliderValues[0];
            shader.green = sliderValues[1];
            shader.blue = sliderValues[2];
            shader.sin = sliderValues[3];
            shader.tan = sliderValues[4];
            shader.abs = sliderValues[5];
            shader.frequency = sliderValues[6];
            shader.name = shaderName.value.toString();

            saveShader(shader);
            shaderName.value = "";
            //console.log(sliderValues);

        }

        function loadShader(shaderName) {
            const sliders = document.querySelectorAll('.slider');
            const shaderButton = document.getElementById(shaderName);
            //console.log("shader:" + shaderButton);

            for(let i = 0; i < savedShaders.length; i+=1){
                if(savedShaders[i].name === shaderName){
                    sliders[0].value = savedShaders[i].red;
                    uniforms.redSlider = savedShaders[i].red;

                    sliders[1].value = savedShaders[i].green;
                    uniforms.greenSlider = savedShaders[i].green;

                    sliders[2].value = savedShaders[i].blue;
                    uniforms.blueSlider = savedShaders[i].blue;

                    sliders[3].value = savedShaders[i].sin;
                    uniforms.sinSlider = savedShaders[i].sin;

                    sliders[4].value = savedShaders[i].tan;
                    uniforms.tanSlider = savedShaders[i].tan;

                    sliders[5].value = savedShaders[i].abs;
                    uniforms.absSlider = savedShaders[i].abs;

                    sliders[6].value = savedShaders[i].frequency;
                    uniforms.freqSlider = savedShaders[i].frequency;


                }
            }
            //console.log(savedShaders);


        }

        function saveShader(shader){

            const shaderButtons = document.getElementById('savedShaders');
            savedShaders.push(shader);

            shaderButtons.innerHTML += `
        <button class="shaderButton" id="${shader.name}" style="width: 200px; background: red;">${shader.name}</button>
        `;

            const button = document.getElementById(shader.name);
            button.addEventListener('click', () => {
                loadShader(button.innerText);
                //console.log(button.innerText);
            });


        }

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('savedShaders' in $$props) savedShaders = $$props.savedShaders;
    	};

    	return { handleClick };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment.name });
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
