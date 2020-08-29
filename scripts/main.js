const tabs = {
    requests: document.querySelector('.tab.requests'),
    websockets: document.querySelector('.tab.websockets'),
    scripts: document.querySelector('.tab.scripts'),
    editor: document.querySelector('.tab.editor'),
    libraries: document.querySelector('.tab.libraries')
};

const valid_tabs = [ 'requests', 'websockets', 'scripts', 'editor', 'libraries' ];

const methods = [ 'GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE', 'COPY', 'OPTIONS', 'LINK', 'UNLINK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND', 'VIEW', 'TRACE' ];

const elem = {
    requests: document.getElementById('request-container'),
    nav: document.getElementById('nav'),
    tab: document.getElementById('content')
};

// Get session unique ID
const get_sid = () => ++id_index;

// Get random ID
const get_uid = () => Date.now() + '-' + Math.random().toString(36).substr(2, 9);


let current = 'requests',
    id_index = 0,
    scripts = {};


class Tab {

    constructor (name, desc) {

        this.container = document.createElement('div');
        this.container.className = name + ' tab hidden';
        elem.tab.appendChild(this.container);

        this.title = document.createElement('a');
        this.title.textContent = name;
        this.title.id = 'nav-' + name;
        this.title.title = desc;
        elem.nav.appendChild(this.title);
    }

    hide () {
        this.container.classList.add('hidden');
        this.title.classList.remove('selected');
        return this;
    }

    show () {
        this.container.classList.remove('hidden');
        this.title.classList.add('selected');
        return this;
    }


    get html () { return this.container.innerHTML; }
    set html (html) { this.container.innerHTML = html; }

}

class TabHandler {
    constructor () {
        this.selected = undefined;
        this.tabs = {};
    }

    add (name, desc, html) {

        let tab = new Tab(name, desc);
        tab.html = html;

        tab.title.addEventListener('click', () => this.select(name));

        this.tabs[name] = tab;
        if (this.selected === undefined) this.select(name);

        return this.tabs[name];
    }

    select (name) {
        let old = this.tabs[this.selected],
            selected = this.tabs[name];

        if (old) old.container.classList.add('hidden');

        selected.classList.remove('hidden');

        this.selected = name;
    }
}

let tab = new TabHandler();

// Select new tab
function select (tab) {
    let elem = tabs[tab];
    
    if (elem === undefined) return;

    // Hide old tab
    tabs[current].classList.add('hidden');

    // Show new tab
    elem.classList.remove('hidden');

    // Refresh codemirror display
    if (tab === 'editor') editor.cm.refresh();
    if (tab === 'scripts') viewer.cm.refresh();

    // Remove old selected tab
    document.getElementById('nav-' + current)?.classList.remove('selected');

    // Show current tab as selected
    document.getElementById('nav-' + tab)?.classList.add('selected');

    // Update current variable
    current = tab;

    // Update window hash
    window.location.hash = tab;
}

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

    editor.cm.setOption('theme', theme);
    viewer.cm.setOption('theme', theme);
}

// Create accordian elements
function accordion (elem, child) {
    child.style.overflow = 'hidden';
    child.style.transition = 'max-height 200ms ease-out';
    child.style.maxHeight = '0px';

    elem.addEventListener('mousedown', function (e) {
        this.classList.toggle('active');

        if (child.style.maxHeight != '0px') child.style.maxHeight = '0px';
        else child.style.maxHeight = child.scrollHeight + 'px';

        // Prevent user from selecting the URL when clicking
        e.preventDefault();
    });
}

// Handle resize
function handle_resize () {
    editor.cm.display.wrapper.style.height = ( window.innerHeight - 41 ) + 'px';
    viewer.cm.display.wrapper.style.height = ( window.innerHeight - 41 ) + 'px';
}

// Get saved data
function get (key) {
    return new Promise((resolve, reject) => {

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
            try { resp = JSON.parse(resp); } catch(e) {}
            
            resolve(resp);
        }
    });
}

// Set saved data
function set (key, value) {

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


class URLHandler {
    constructor (url='') {

        this.id = get_sid();

        this.header = document.createElement('div');
        this.header.className = 'domain accordion';
        this.header.textContent = url;
        this.header.title = url;

        this.container = document.createElement('div');
        this.container.className = 'container';
        this.container.setAttribute('id', this.id);

        elem.requests.appendChild(this.header);
        elem.requests.appendChild(this.container);
        
        accordion(this.header, this.container);
    }

    add_request (data={}) {

        const id = data.id ?? get_sid();

        let parent = document.createElement('div');
        parent.className = 'request';
        parent.setAttribute('id', id);

        let method = document.createElement('span');
        method.className = 'method';
        method.classList.add(data.method.toLowerCase());

        let url = document.createElement('span');
        url.className = 'url';
        url.textContent = data.path;
        url.title = data.path;

        parent.appendChild(method);
        parent.appendChild(url);

        this.container.appendChild(parent);

        return id;
    }

    remove_request(id) {
        this.container.querySelector(`.request[id="${id}"]`)?.remove();
    }

    remove() {
        this.container.remove();
        this.header.remove();
    }
}

class ScriptEditor {
    constructor () {

        // Create editor from textarea
        this.cm = CodeMirror.fromTextArea(document.getElementById('ta-selected-script'), {
            highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            extraKeys: {
                'Esc': cm => {
                    if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false); 
                },
                'F11': cm => cm.setOption('fullScreen', !cm.getOption('fullScreen')),
                'Ctrl-Q': cm => cm.foldCode(cm.getCursor()),
                'Ctrl-S': cm => this.save_script(),
                'Alt-F': 'findPersistent'
            },
            autoCloseBrackets: true,
            styleActiveLine: true,
            indentWithTabs: false,
            theme: 'vscode-dark',
            lineWrapping: true,
            mode: 'javascript',
            lineNumbers: true,
            spellcheck: true,
            foldGutter: true,
            indentUnit: 4,
            tabSize: 4
        });

        // Set a placeholder value
        this.cm.setValue('console.log("Hello world!");');
    }

    update_scripts(scripts) {
        let parent = document.getElementById('inp-selected-script');

        while (parent.firstChild)
            parent.removeChild(parent.lastChild);

        for (let i = 0; i < scripts.length; ++i) {
            let script = scripts[i],
                elem = document.createElement('option');

            elem.value = script.src;
            elem.title = script.desc;
            elem.textContent = script.name;

            parent.appendChild(elem);
        }
    }

    save_script() {
        let code = editor.cm.getValue();

        // TODO Save code somewhere
    }

    update_script(id, content='console.log(\'Hello World!\');', name='New Script', active=true) {
        let script = {
            updated: Date.now(),
            script: content,
            name: name,
            desc: '',
            active,
            id,
        };

        // TODO Replace saved script with this
    }

    get_script(id, callback=()=>{}) {
        //return this.scripts[id] 
    }

    remove_script(id) {
        //this.scripts = this.scripts.filter(e => e.id != id);
    }
}

class ScriptViewer {
    constructor () {

        this.selected = '';
        this.scripts = {};

        // Create editor from textarea
        this.cm = CodeMirror.fromTextArea(document.getElementById('ta-viewing-script'), {
            highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            extraKeys: {
                'Esc': cm => {
                    if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false); 
                },
                'F11': cm => cm.setOption('fullScreen', !cm.getOption('fullScreen')),
                'Alt-F': 'findPersistent'
            },
            autoCloseBrackets: true,
            styleActiveLine: true,
            indentWithTabs: false,
            theme: 'vscode-dark',
            readOnly: 'nocursor',
            lineWrapping: true,
            mode: 'javascript',
            lineNumbers: true,
            spellcheck: true,
            foldGutter: true,
            indentUnit: 4,
            tabSize: 4
        });

        // Set a placeholder value
        this.cm.setValue('console.log("Pre-made script goes here");');
    }

    update_scripts(scripts) {
        this.scripts = scripts;

        let parent = document.getElementById('script-container');

        while (parent.firstChild)
            parent.removeChild(parent.lastChild);

        for (let id in scripts) {
            let script = scripts[id],
                elem = document.createElement('div'),
                content = document.createElement('span');

            elem.onclick = () => this.select_script(elem);
            elem.className = 'script';
            elem.setAttribute('id', id);

            content.textContent = script.name;
            content.title = script.desc;

            elem.appendChild(content);
            parent.appendChild(elem);
        }

        let selected = parent.firstChild;
        if (selected) this.select_script(selected);
    }

    select_script(selected) {
        let parent = document.getElementById('script-container'),
            prev = parent.querySelector(`div[id="${this.selected}"]`),
            id = selected.getAttribute('id'),
            script = this.scripts[id];

        // Remove old
        prev?.classList?.remove('selected');

        // Add new class
        selected.classList.add('selected');
        
        // Set value of viewer
        this.cm.setValue(script.code);

        this.selected = id;
    }
}


// Handle window resizing
window.addEventListener('resize', handle_resize);

// Add listener to request tab
document.getElementById('nav-requests').addEventListener('click', function () {
    select('requests');
});

// Demo content code
let url = new URLHandler('https://www.youtube.com/watch?v=1yQGkVhO6mQ');

url.add_request({ method: 'GET', path: '/api/v2/views.php/api/v2/views.php/api/v2/views.php/api/v2/views.php/api/v2/views.php/api/v2/views.php' });
url.add_request({ method: 'POST', path: '/api/v2/get_current_location.php' });
url.add_request({ method: 'PATCH', path: '/api/v2/access.php' });
url.add_request({ method: 'PUT', path: '/api/v2/subscribe/users/6247' });
url.add_request({ method: 'DELETE', path: '/api/v2/like/users/4241' });

let url1 = new URLHandler('https://www.youtube.com/watch?v=YOlUqfWrGls');

url1.add_request({ method: 'GET', path: '/api/v2/views.php' });
url1.add_request({ method: 'POST', path: '/api/v2/get_current_location.php' });
url1.add_request({ method: 'PATCH', path: '/api/v2/access.php' });
url1.add_request({ method: 'PUT', path: '/api/v2/subscribe/users/1' });
url1.add_request({ method: 'DELETE', path: '/api/v2/follow/users/321' });

let url2 = new URLHandler('https://www.youtube.com/watch?v=n78Gg6_zEQg');

url2.add_request({ method: 'GET', path: '/api/v2/views.php' });
url2.add_request({ method: 'POST', path: '/api/v2/get_current_location.php' });
url2.add_request({ method: 'PATCH', path: '/api/v2/access.php' });
url2.add_request({ method: 'PUT', path: '/api/v2/subscribe/users/4325' });
url2.add_request({ method: 'DELETE', path: '/api/v2/follow/users/623624' });



// Create new script editor
let editor = new ScriptEditor();




// Set theme
document.getElementById('inp-theme').addEventListener('change', function () {
    set_theme(this.value);
    set('theme', this.value);
});




// Set current script
document.getElementById('inp-selected-script').addEventListener('change', function () {
    editor.cm.setValue(`fetch('scripts/${this.value}');`);
});



// Add listener to navigation tab
document.getElementById('nav-editor').addEventListener('click', function () {

    // Select the editor tab
    select('editor');
});



// Add listener to websocket tab
document.getElementById('nav-websockets').addEventListener('click', function () { select('websockets'); });



let viewer = new ScriptViewer();

// Add listener to scripts tab
document.getElementById('nav-scripts').addEventListener('click', function () { select('scripts'); });



// Add listener to libraries tab
document.getElementById('nav-libraries').addEventListener('click', function () {
    select('libraries');
});



// Keep tab opened when page is reloaded
let hash = window.location.hash.slice(1);
if (valid_tabs.includes(hash)) current = hash;
select(current);



// Resize everything initially
handle_resize();


// Page is active
set('active', true);

// Load theme on page load
get('theme').then(theme => {
    theme = theme ?? 'vscode-dark';

    document.getElementById('inp-theme').value = theme;
    set_theme(theme);
});

// Detect and load scripts
get('scripts').then(scripts => {

    // Make sure there is always one script
    if (!scripts) {
        scripts = {
            '1598326646634-6wvbxj8v6': {
                name: 'Hello World Script',
                desc: 'A "Hello, World!" program generally is a computer program that outputs or displays the message "Hello, World!". Such a program is very simple in most programming languages, and is often used to illustrate the basic syntax of a programming language. It is often the first program written by people learning to code.',
                author: 'Samuel Walls',
                updated: 1598326712028,
                code: '// Hello World!\n\nconsole.log("Hello World!");',
                active: false
            }
        };
        
        set('scripts', scripts);
    }

    //editor.update_scripts(scripts);
    viewer.update_scripts(scripts);
});



// When the page is closed
window.onbeforeunload = () => {
    set('active', false);
};


// Testing scripts
set('scripts', scripts = {
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