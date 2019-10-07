
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
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
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

    /* src\App.svelte generated by Svelte v3.12.1 */

    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	var h20, t1, input0, t2, h21, t4, input1, input1_updating = false, t5, h22, t7, input2, input2_updating = false, t8, button, t10, div, table, tr, th0, t12, th1, t14, th2, t16, th3, dispose;

    	function input1_input_handler() {
    		input1_updating = true;
    		ctx.input1_input_handler.call(input1);
    	}

    	function input2_input_handler() {
    		input2_updating = true;
    		ctx.input2_input_handler.call(input2);
    	}

    	const block = {
    		c: function create() {
    			h20 = element("h2");
    			h20.textContent = "Enter Boatname:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			h21 = element("h2");
    			h21.textContent = "Enter Meters Traveled:";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			h22 = element("h2");
    			h22.textContent = "Enter Time in Seconds:";
    			t7 = space();
    			input2 = element("input");
    			t8 = space();
    			button = element("button");
    			button.textContent = "Add Row";
    			t10 = space();
    			div = element("div");
    			table = element("table");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Boat Name";
    			t12 = space();
    			th1 = element("th");
    			th1.textContent = "Meters Travelled (m)";
    			t14 = space();
    			th2 = element("th");
    			th2.textContent = "Time Elapsed (sec)";
    			t16 = space();
    			th3 = element("th");
    			th3.textContent = "Split Per 500m (sec/m)";
    			attr_dev(h20, "class", "svelte-s2whn8");
    			add_location(h20, file, 77, 0, 991);
    			attr_dev(input0, "type", "string");
    			add_location(input0, file, 78, 0, 1016);
    			attr_dev(h21, "class", "svelte-s2whn8");
    			add_location(h21, file, 79, 0, 1060);
    			attr_dev(input1, "type", "number");
    			add_location(input1, file, 80, 0, 1092);
    			attr_dev(h22, "class", "svelte-s2whn8");
    			add_location(h22, file, 81, 0, 1134);
    			attr_dev(input2, "type", "number");
    			add_location(input2, file, 82, 0, 1166);
    			add_location(button, file, 84, 0, 1207);
    			attr_dev(th0, "class", "svelte-s2whn8");
    			add_location(th0, file, 89, 10, 1343);
    			attr_dev(th1, "class", "svelte-s2whn8");
    			add_location(th1, file, 90, 10, 1372);
    			attr_dev(th2, "class", "svelte-s2whn8");
    			add_location(th2, file, 91, 10, 1412);
    			attr_dev(th3, "class", "svelte-s2whn8");
    			add_location(th3, file, 92, 10, 1450);
    			set_style(tr, "font-weight", "bold");
    			add_location(tr, file, 88, 8, 1302);
    			attr_dev(table, "id", "rows");
    			attr_dev(table, "class", "svelte-s2whn8");
    			add_location(table, file, 87, 6, 1276);
    			attr_dev(div, "id", "results");
    			attr_dev(div, "class", "svelte-s2whn8");
    			add_location(div, file, 86, 0, 1251);

    			dispose = [
    				listen_dev(input0, "input", ctx.input0_input_handler),
    				listen_dev(input1, "input", input1_input_handler),
    				listen_dev(input2, "input", input2_input_handler),
    				listen_dev(button, "click", ctx.addRow)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input0, anchor);

    			set_input_value(input0, ctx.boatName);

    			insert_dev(target, t2, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, input1, anchor);

    			set_input_value(input1, ctx.meters);

    			insert_dev(target, t5, anchor);
    			insert_dev(target, h22, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, input2, anchor);

    			set_input_value(input2, ctx.time);

    			insert_dev(target, t8, anchor);
    			insert_dev(target, button, anchor);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t12);
    			append_dev(tr, th1);
    			append_dev(tr, t14);
    			append_dev(tr, th2);
    			append_dev(tr, t16);
    			append_dev(tr, th3);
    		},

    		p: function update(changed, ctx) {
    			if (changed.boatName) set_input_value(input0, ctx.boatName);
    			if (!input1_updating && changed.meters) set_input_value(input1, ctx.meters);
    			input1_updating = false;
    			if (!input2_updating && changed.time) set_input_value(input2, ctx.time);
    			input2_updating = false;
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(h20);
    				detach_dev(t1);
    				detach_dev(input0);
    				detach_dev(t2);
    				detach_dev(h21);
    				detach_dev(t4);
    				detach_dev(input1);
    				detach_dev(t5);
    				detach_dev(h22);
    				detach_dev(t7);
    				detach_dev(input2);
    				detach_dev(t8);
    				detach_dev(button);
    				detach_dev(t10);
    				detach_dev(div);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let boatName;
    	let meters;
    	let time;
    	let rows =[];

    	function addRow(){
    	{
    			console.log("hi");
    	    var rows= document.getElementById("rows");
    	    var newRow = rows.insertRow();
    	    var boat = newRow.insertCell(0);
    	    var distance = newRow.insertCell(1);
    	    var sec = newRow.insertCell(2);
    	    var split = newRow.insertCell(3);
    	    var edit = newRow.insertCell(4);
    	    var del = newRow.insertCell(5);
    			console.log(boatName);
    	    boat.innerHTML = boatName;
    	    distance.innerHTML = meters;
    	    sec.innerHTML = time;
    	    split.innerHTML= time*(meters/500);
    	  }
    	}

    	function input0_input_handler() {
    		boatName = this.value;
    		$$invalidate('boatName', boatName);
    	}

    	function input1_input_handler() {
    		meters = to_number(this.value);
    		$$invalidate('meters', meters);
    	}

    	function input2_input_handler() {
    		time = to_number(this.value);
    		$$invalidate('time', time);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('boatName' in $$props) $$invalidate('boatName', boatName = $$props.boatName);
    		if ('meters' in $$props) $$invalidate('meters', meters = $$props.meters);
    		if ('time' in $$props) $$invalidate('time', time = $$props.time);
    		if ('rows' in $$props) rows = $$props.rows;
    	};

    	return {
    		boatName,
    		meters,
    		time,
    		addRow,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	};
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
