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
    nav: document.getElementById('nav')
};

const get_id = () => ++id_index;

let current = 'requests',
    id_index = 0;


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
            
            resolve(localStorage.getItem(key));
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

        localStorage.setItem(key, value);
    }
}


class URLHandler {
    constructor (url='') {

        this.id = get_id();

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

        const id = data.id ?? get_id();

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
        let parent = document.getElementById('script-container');

        while (parent.firstChild)
            parent.removeChild(parent.lastChild);

        for (let i = 0; i < scripts.length; ++i) {
            let script = scripts[i],
                elem = document.createElement('div'),
                content = document.createElement('span');

            elem.className = 'script';

            content.setAttribute('src', script.src);
            content.textContent = script.name;
            content.title = script.desc;

            elem.appendChild(content);
            parent.appendChild(elem);
        }

        parent.firstChild.classList.add('selected');
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

// Load theme on page load
get('theme').then(theme => {
    theme = theme ?? 'vscode-dark';

    document.getElementById('inp-theme').value = theme;
    set_theme(theme);
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