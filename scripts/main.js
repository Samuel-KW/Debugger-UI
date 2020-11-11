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

    // Hide container
    hide() {
        this.container.classList.add('hidden');
        this.title.classList.remove('selected');

        return this;
    }

    // Show container
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
    
    // Get all stylesheets
    let href = `codemirror/theme/${theme}.css`,
        elems = [...document.querySelectorAll('link[rel="stylesheet"]')];

    // Make sure the theme isn't already loaded
    if (!elems.find(e => e.href.includes(href))) {

        let style = document.createElement('link');
        style.href = href;
        style.rel = 'stylesheet';
        style.type = 'text/css';

        // Load the theme
        document.head.appendChild(style);
    }

    // Update the editors
    if (editor) editor.cm.setOption('theme', theme);
    if (viewer) viewer.cm.setOption('theme', theme);
}

// Create accordian elements
function accordion(elem, child) {
    child.style.overflow = 'hidden';
    child.style.transition = 'max-height 200ms ease-out';
    child.style.maxHeight = '0px';

    // Listen when the element is clicked
    elem.addEventListener('mousedown', function(e) {
        this.classList.toggle('active');

        // Toggle the accordian
        if (child.style.maxHeight != '0px') child.style.maxHeight = '0px';
        else child.style.maxHeight = child.scrollHeight + 'px';

        // Prevent user from selecting the URL when clicking
        e.preventDefault();
    });
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
    container.style = 'border-radius: 3px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; min-height: 40%; background-color: #282828; box-shadow: 0 0 25px rgba(0, 0, 0, 0.7); text-align: center; font-size: 20px; color: #fff; animation: 750ms ease float-up; max-width: 50%; max-height: 50%;';

    // Close the popup
    const close = () => parent.remove();

    // Create exit button
    let exit = document.createElement('span');
    exit.style = 'position: absolute; padding: 15px; cursor: pointer; color: #ababab; user-select: none; margin-left: 5px;';
    exit.innerHTML = '&times;';

    exit.setAttribute('aria-label', 'Close Account Info Modal Box');
    exit.addEventListener('click', close);

    // Header element
    let header = document.createElement('h2');
    header.style = 'padding: 15px; background-color: #303030; text-align: center; font-size: 24px; color: #d1d1d1; margin-bottom: 20px;';
    header.textContent = title;

    // Popup content
    let content = document.createElement('span');
    content.style = 'padding: 15px;';
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

// Page is active
set('active', true);

// When the page is closed
window.onbeforeunload = () => {
    set('active', false);
};
