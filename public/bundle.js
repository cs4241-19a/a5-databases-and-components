
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
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
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
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

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.chat = list[i];
    	return child_ctx;
    }

    // (63:4) {#each chats as chat}
    function create_each_block(ctx) {
    	var tr, th0, t0_value = ctx.chat.name + "", t0, t1, th1, t2_value = ctx.chat.content + "", t2, t3, th2, t4_value = ctx.chat.time.toLocaleDateString() + "", t4, t5, br, t6, t7_value = ctx.chat.time.toLocaleTimeString() + "", t7, t8;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th0 = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			th1 = element("th");
    			t2 = text(t2_value);
    			t3 = space();
    			th2 = element("th");
    			t4 = text(t4_value);
    			t5 = space();
    			br = element("br");
    			t6 = space();
    			t7 = text(t7_value);
    			t8 = space();
    			attr_dev(th0, "class", "chat-username svelte-1ggwyi6");
    			add_location(th0, file, 64, 8, 1310);
    			attr_dev(th1, "class", "chat-contents svelte-1ggwyi6");
    			add_location(th1, file, 65, 8, 1361);
    			add_location(br, file, 66, 68, 1475);
    			attr_dev(th2, "class", "chat-timestamp svelte-1ggwyi6");
    			add_location(th2, file, 66, 8, 1415);
    			add_location(tr, file, 63, 6, 1297);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th0);
    			append_dev(th0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(th1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(th2, t4);
    			append_dev(th2, t5);
    			append_dev(th2, br);
    			append_dev(th2, t6);
    			append_dev(th2, t7);
    			append_dev(tr, t8);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.chats) && t0_value !== (t0_value = ctx.chat.name + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((changed.chats) && t2_value !== (t2_value = ctx.chat.content + "")) {
    				set_data_dev(t2, t2_value);
    			}

    			if ((changed.chats) && t4_value !== (t4_value = ctx.chat.time.toLocaleDateString() + "")) {
    				set_data_dev(t4, t4_value);
    			}

    			if ((changed.chats) && t7_value !== (t7_value = ctx.chat.time.toLocaleTimeString() + "")) {
    				set_data_dev(t7, t7_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(tr);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(63:4) {#each chats as chat}", ctx });
    	return block;
    }

    function create_fragment(ctx) {
    	var main, h1, t1, table, t2, input0, t3, input1, t4, button, dispose;

    	let each_value = ctx.chats;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "ChatSvelte";
    			t1 = space();
    			table = element("table");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			input1 = element("input");
    			t4 = space();
    			button = element("button");
    			button.textContent = "Send";
    			attr_dev(h1, "class", "svelte-1ggwyi6");
    			add_location(h1, file, 59, 2, 1215);
    			attr_dev(table, "id", "chat-contents");
    			attr_dev(table, "class", "svelte-1ggwyi6");
    			add_location(table, file, 61, 2, 1238);
    			attr_dev(input0, "maxlength", "100");
    			attr_dev(input0, "placeholder", "Username");
    			add_location(input0, file, 71, 2, 1557);
    			attr_dev(input1, "maxlength", "100");
    			attr_dev(input1, "placeholder", "Chat contents");
    			add_location(input1, file, 72, 2, 1629);
    			add_location(button, file, 73, 2, 1706);
    			attr_dev(main, "class", "svelte-1ggwyi6");
    			add_location(main, file, 58, 0, 1206);

    			dispose = [
    				listen_dev(input0, "input", ctx.input0_input_handler),
    				listen_dev(input1, "input", ctx.input1_input_handler),
    				listen_dev(button, "click", ctx.addNewChat)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, table);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			append_dev(main, t2);
    			append_dev(main, input0);

    			set_input_value(input0, ctx.username);

    			append_dev(main, t3);
    			append_dev(main, input1);

    			set_input_value(input1, ctx.contents);

    			append_dev(main, t4);
    			append_dev(main, button);
    		},

    		p: function update(changed, ctx) {
    			if (changed.chats) {
    				each_value = ctx.chats;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(table, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			if (changed.username && (input0.value !== ctx.username)) set_input_value(input0, ctx.username);
    			if (changed.contents && (input1.value !== ctx.contents)) set_input_value(input1, ctx.contents);
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(main);
    			}

    			destroy_each(each_blocks, detaching);

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let chats = [
    		{"name": "ChatBot", "content": "Yo what is up!", "time": new Date()},
    		{"name": "ChatBot", "content": "I fully remade PermChat using just Svelte.", "time": new Date()},
    		{"name": "ChatBot", "content": "Except I totally cheated and I didn't actually add the 'perm' part...", "time": new Date()},
    		{"name": "ChatBot", "content": "Enjoy your stay and check out my README.md on github!\nhttps://github.com/thearst3rd/a5-databases-and-components", "time": new Date()},
    	];
    	
    	let username = "";
    	let contents = "";
    	
    	function addNewChat()
    	{
    		const chat = {"name": username, "content": contents, "time": new Date()};
    		$$invalidate('chats', chats = [...chats, chat]);
    		$$invalidate('contents', contents = "");
    	}

    	function input0_input_handler() {
    		username = this.value;
    		$$invalidate('username', username);
    	}

    	function input1_input_handler() {
    		contents = this.value;
    		$$invalidate('contents', contents);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('chats' in $$props) $$invalidate('chats', chats = $$props.chats);
    		if ('username' in $$props) $$invalidate('username', username = $$props.username);
    		if ('contents' in $$props) $$invalidate('contents', contents = $$props.contents);
    	};

    	return {
    		chats,
    		username,
    		contents,
    		addNewChat,
    		input0_input_handler,
    		input1_input_handler
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment.name });
    	}
    }

    const app = new App(
    {
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
