class StorageHandler {
    constructor () {

    }

    get (key) {
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

    set (key, value) {
        
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

// TODO Remove updating scripts on save to improve speed
// Save scripts to storage
function save_scripts() {
    set('scripts', scripts);

    // Update scripts and editor tab
    viewer.update_scripts(scripts);
    editor.refresh_scripts(scripts);
}

function create_script() {
    
}

// Load library scripts
function load_libs() {

    // Fetch default scripts
    fetch('libraries/files.json').then(e => e.json()).then(json => {

        let requests = [];
    
        // Create an array of fetch requests to pass into Promise.all
        for (let id in json) {
    
            let script = json[id];
    
            requests.push(fetch('libraries/' + script.src)
                .then(e => e.text())
                .then(e => {
                    delete script.src;

                    script.code = e;
                    script.id = id;

                    return script;
                }));
    
        }
    
        // Wait until all requests have finished
        Promise.all(requests).then(json => {

            // Merge scripts
            for (let i = 0; i < json.length; ++i) {
                let id = json[i].id;

                scripts[id] = json[i];
                delete scripts[id].id;
            }

            save_scripts();
        });
    });
}

// Reset settings
function reset_settings () {
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

    set('active', true);
    set('theme', 'vscode-dark');
    set('scripts', scripts);

    set('filter_regex', '');
    set('catch_regex', '(?!)');
    set('hooking_requests', true);
    set('hooking_fetch', true);
    set('logging_requests', true);
    set('catching_all', false);
}