const methods = ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE', 'COPY', 'OPTIONS', 'LINK', 'UNLINK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND', 'VIEW', 'TRACE'];

let elem = {
    nav: document.getElementById('nav'),
    tab: document.getElementById('content')
};

// Get session unique ID
const get_sid = () => ++id_index;

// Get random ID
const get_uid = () => Date.now() + '-' + Math.random().toString(36).substr(2, 9);

let nav_height = elem.nav.getBoundingClientRect().height || 41,
    id_index = 0,
    scripts = {};

class Tab {

    constructor(name, desc) {

        this.refreshfunc = undefined;

        this.container = document.createElement('div');
        this.container.className = name + ' tab hidden';
        elem.tab.appendChild(this.container);

        this.title = document.createElement('a');
        this.title.textContent = name;
        this.title.id = 'nav-' + name;
        this.title.title = desc;
        elem.nav.appendChild(this.title);

        window.addEventListener('resize', () => { this.title.classList.contains('hidden') || this.refresh(); });
    }

    hide() {
        this.container.classList.add('hidden');
        this.title.classList.remove('selected');

        return this;
    }

    show() {
        this.container.classList.remove('hidden');
        this.title.classList.add('selected');

        // Refresh content
        this.refresh();

        return this;
    }

    refresh() {
        if (typeof this.refreshfunc === 'function') this.refreshfunc();
    }

    get onrefresh() { return this.refreshfunc; }
    set onrefresh(func) { this.refreshfunc = func; func(); }

    get html() { return this.container.innerHTML; }
    set html(html) { this.container.innerHTML = html; }

}

class TabHandler {
    constructor() {
        this.selected = undefined;
        this.tabs = {};
    }

    add(name, desc, html) {

        if (this.tabs[name]) console.warn('Duplicate class name found:', name);

        let tab = new Tab(name, desc);
        tab.html = html;
        tab.title.addEventListener('click', () => this.select(name));

        this.tabs[name] = tab;

        if (this.selected === undefined) {
            this.selected = name;
            tab.show();
        }

        if (window.location.hash.slice(1) === name) this.select(name);

        return this.tabs[name];
    }

    select(name) {
        let old = this.tabs[this.selected],
            selected = this.tabs[name];

        // Deselect the old tab
        if (old) old.hide();

        // Select the new tab
        selected.show();

        // Change URL hash
        window.location.hash = name;

        this.selected = name;
    }
}

let tab = new TabHandler();

// Set codemirror theme
function set_theme(theme) {
    let href = `codemirror/theme/${theme}.css`;

    let elems = [...document.querySelectorAll('link[rel="stylesheet"]')];

    if (elems.filter(e => e.href.includes(href)).length === 0) {
        let style = document.createElement('link');
        style.href = href;
        style.rel = 'stylesheet';
        style.type = 'text/css';

        document.head.appendChild(style);
    }

    if (editor) editor.cm.setOption('theme', theme);
    if (viewer) viewer.cm.setOption('theme', theme);
}

// Create accordian elements
function accordion(elem, child) {
    child.style.overflow = 'hidden';
    child.style.transition = 'max-height 200ms ease-out';
    child.style.maxHeight = '0px';

    elem.addEventListener('mousedown', function(e) {
        this.classList.toggle('active');

        if (child.style.maxHeight != '0px') child.style.maxHeight = '0px';
        else child.style.maxHeight = child.scrollHeight + 'px';

        // Prevent user from selecting the URL when clicking
        e.preventDefault();
    });
}

// Get saved data
function get(key) {
    return new Promise(resolve => {

        // If ran from chrome extension
        if (chrome && chrome.storage && chrome.storage.local) {

            // Fetch key from local storage
            chrome.storage.local.get(key, data => {
                let content = data[key];
                resolve(content);
            });

        } else {
            let resp = localStorage.getItem(key);

            // Attempt to parse value
            try { resp = JSON.parse(resp); } catch (e) {}

            resolve(resp);
        }
    });
}

// Set saved data
function set(key, value) {

    // If ran from chrome extension
    if (chrome && chrome.storage && chrome.storage.local) {
        let json = {};

        json[key] = value;
        chrome.storage.local.set(json);

    } else {

        // Stringify objects
        if (typeof value == 'object') value = JSON.stringify(value);
        localStorage.setItem(key, value);
    }
}

// Save scripts to storage
function save_scripts() {
    set('scripts', scripts);
}

// Mini-notifications
function notification(message, duration=5000) {
    let elem = document.createElement('div');
    elem.textContent = message;
    elem.style = 'position: fixed; left: 10px; bottom: 10px; padding: 5px; font-size: 20px; color: #fff; background-color: #000; border-radius: 3px; z-index: 2147483647; transition: all 250ms; animation: 1s ease float-up;';

    document.body.appendChild(elem);

    setTimeout(() => { elem.style.opacity = 0; }, duration);
    setTimeout(() => elem.remove(), duration + 250);
}

// Popup messages
function popup(title='', body='', buttons=[]) {
    
    // Popup container
    let parent = document.createElement('div');
    parent.style = 'z-index: 2147483647; top: 0; left: 0; position: fixed; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background-color: rgba(61, 61, 61, 0.6);';

    // Content container
    let container = document.createElement('div');
    container.style = 'background-color: #282828; box-shadow: 0 0 25px rgba(0, 0, 0, 0.7); text-align: center; font-size: 20px; color: #fff; animation: 750ms ease float-up; max-width: 50%; max-height: 50%;';

    // Close the popup
    const close = () => parent.remove();

    // Create exit button
    let exit = document.createElement('span');
    exit.style = 'padding: 5px; float: right; cursor: pointer; color: #ababab;';
    exit.innerHTML = '&times;';

    exit.setAttribute('aria-label', 'Close Account Info Modal Box');
    exit.addEventListener('click', close);

    // Header element
    let header = document.createElement('h2');
    header.style = 'padding: 5px; background-color: #303030; text-align: center; font-size: 24px; color: #d1d1d1;';
    header.textContent = title;

    // Popup content
    let content = document.createElement('span');
    content.style = 'padding: 15px; white-space: pre-wrap;';
    content.textContent = body;

    // Container for button elements
    let btn_container = document.createElement('div');
    btn_container.style = 'margin: 15px 0; display: flex; align-items: center; justify-content: center;';

    // Add button elements
    buttons.forEach(options => {
        let btn = document.createElement('button');
        btn.textContent = options.content;
        btn.style = 'margin: 0 5px; width: 50px; height: 30px; border: none; outline: none; cursor: pointer; border-radius: 5px; background-color: #575757; color: #eee;'+ (options.style ?? '');
        btn.addEventListener('click', () => { if (typeof options.click === 'function') options.click.call(window, close); });

        btn_container.appendChild(btn);
    });

    // Add elements to container
    container.appendChild(exit);
    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(btn_container);

    parent.appendChild(container);

    document.body.appendChild(parent);

    return parent;
}

// Handle page load events
window.addEventListener('load', function() {

    // Detect and load scripts
    get('scripts').then(data => {

        // Make sure there is always one script
        if (!data) {
            data = {
                '1598326646634-6wvbxj8v6': {
                    name: 'Hello World Script',
                    desc: 'A "Hello, World!" program generally is a computer program that outputs or displays the message "Hello, World!". Such a program is very simple in most programming languages, and is often used to illustrate the basic syntax of a programming language. It is often the first program written by people learning to code.',
                    author: 'Samuel Walls',
                    updated: 1598326712028,
                    code: '// Hello World!\n\nconsole.log("Hello World!");',
                    active: false
                }
            };

            set('scripts', data);
        }

        scripts = data;

        // Update scripts and editor tab
        viewer.update_scripts(scripts);
        editor.refresh_scripts(scripts);
    });

    // Testing scripts
    /*set('scripts', scripts = {
        '1598326646634-6wvbxj8v6': {
            name: 'Andrew Gump P1',
            desc: 'Andrew Gump had always loved urban Sidney with its unkempt, ugly umbrellas. It was a place where he felt worried',
            author: 'Samuel Walls',
            updated: 1598326712028,
            code: '// The Gumpster is around, watch out!\n\nconsole.log("Hello you noodler!");',
            active: false
        },
        '1598326646611-2fvbxj8v6': {
            name: 'Andrew Gump P2',
            desc: 'He was a tactless, considerate, wine drinker with wide fingernails and brunette ankles. His friends saw him as a jealous, joyous juggler. Once, he had even brought a fair baby back from the brink of death. That\'s the sort of man he was.',
            author: 'Samuel Walls',
            updated: 1598326712125,
            code: '// Don\'t mess with Andrew Gump.\n\nconsole.log("Hello you noodler!");',
            active: true
        },
        '1598326646699-4fvbxjx8v6': {
            name: 'Andrew Gump P3',
            desc: 'Andrew walked over to the window and reflected on his sunny surroundings. The sleet rained like drinking lizards.',
            author: 'Samuel Walls',
            updated: 1598326712154,
            code: '// Andrew know everything he needs to know...\n\nconsole.log("Hello you noodler!");',
            active: true
        },
        '1598326646914-1fvbf3fx8v6': {
            name: 'Andrew Gump P4',
            desc: 'Then he saw something in the distance, or rather someone. It was the figure of Gregory Clifford. Gregory was an admirable dolphin with sloppy fingernails and beautiful ankles.',
            author: 'Samuel Walls',
            updated: 1598326712223,
            code: '// Gump is always watching...\n\nconsole.log("Hello you noodler!");',
            active: true
        },
        '1598326649182-534g53fx8v6': {
            name: 'Andrew Gump P5',
            desc: 'Andrew gulped. He was not prepared for Gregory. As Andrew stepped outside and Gregory came closer, he could see the cute glint in his eye.',
            author: 'Samuel Walls',
            updated: 1598326712279,
            code: '// Mr Gump is ready!\n\nconsole.log("Hello you noodler!");',
            active: true
        }
    });
    */
});

// Page is active
set('active', true);

// When the page is closed
window.onbeforeunload = () => {
    set('active', false);
};