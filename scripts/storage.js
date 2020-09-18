const random_nouns = [ 'Machine', 'Programmer', 'Script', 'Code', 'Bug', 'Computer', 'Editor' ];
const random_adjs = [ 'Angry', 'Happy', 'Buggy', 'Working', 'Annoyed', 'Snappy', 'Cool' ]; 

class StorageHandler {
    constructor () {

    }

    reset () {
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
    
        this.set('active', true);
        this.set('theme', 'vscode-dark');
        this.set('scripts', scripts);
    
        this.set('filter_regex', '');
        this.set('catch_regex', '(?!)');
        this.set('hooking_requests', true);
        this.set('hooking_fetch', true);
        this.set('logging_requests', true);
        this.set('catching_all', false);
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

    save_scripts() {
        set('scripts', scripts);
    }

    update_script(id, key, value) {
        scripts[id][key] = value;
    }

    update_desc(id, value) {
        scripts[id].desc = value;
        this.visuals_change();
    }

    update_name(id, value) {
        scripts[id].name = value;
        this.visuals_change();
    }

    update_author(id, value) {
        scripts[id].author = value;
        this.visuals_change();
    }

    update_code(id, value) {
        scripts[id].code = value;
        this.visuals_change();
    }

    visuals_change() {

        // Update scripts and editor tab
        viewer.update_scripts(scripts);
        editor.refresh_scripts(scripts);
    }

    create_script() {
        let id = get_uid();

        // Create a new empty script
        scripts[id] = {
            name: random_adjs[Math.floor(Math.random() * random_adjs.length)] + ' ' + random_nouns[Math.floor(Math.random() * random_nouns.length)],
            desc: 'No description here D:',
            author: 'anonymous',
            code: '// Write your code here!\n\nconsole.log("Hello World!");',
            active: false,
            updated: Date.now()
        };

        // Update scripts and editor tab
        editor.refresh_scripts(scripts);
        viewer.update_scripts(scripts);

        // Select the script
        editor.select(id);
        viewer.select(document.getElementById(id));

        return id;
    }

    remove_script(id) {

        // Remove the script from scripts object
        delete scripts[id];

        // Update scripts and editor tab
        viewer.update_scripts(scripts);
        this.refresh_scripts(scripts);

        // Save scripts
        save_scripts();
    }

    load_libs() {
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
}

let storage = new StorageHandler();

// Get saved data
const get = storage.get;

// Set saved data
const set = storage.set;

// Save scripts
const save_scripts = storage.save_scripts;

// Handle page load events
window.addEventListener('load', function() {

    // Detect and load scripts
    get('scripts').then(data => {

        scripts = data;

        // Make sure there is always one script
        if (!data) storage.reset_settings();

        // Update scripts and editor tab
        storage.visuals_change();
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
