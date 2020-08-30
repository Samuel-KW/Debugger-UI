class ScriptEditor {
    constructor () {

        this.selected = undefined;

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

    select(id) {
        
    }

    refresh_scripts(scripts) {
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

    save_script(id) {
        if (id === undefined) return;

        let code = editor.cm.getValue();

        this.update_script(id, { code });
    }

    update_script(id, settings={}) {

        // Handle creating new scripts
        if (scripts[id] === undefined) {
            scripts[id] = {
                name: settings.name ?? 'Unknown Script',
                desc: settings.desc ?? 'No description here D;',
                author: settings.author ?? 'anonymous',
                code: settings.code ?? '// Write your code here!\n\nconsole.log("Hello World!");',
                active: settings.active ?? false,
                updated: Date.now()
            };
        } else {

            // Replace old values with new ones
            for (let key in settings)
                scripts[id][key] = settings[key];
        }

        save_scripts();
    }

    get_script(id) {
        return scripts[id];
    }

    remove_script(id) {
        //this.scripts = this.scripts.filter(e => e.id != id);
    }
}

(function (html) {
    
    let container = tab.add('Editor', 'Edit custom scripts', html);
    

    // Create new script editor
    window.editor = new ScriptEditor();

    // Handle refreshing
    container.onrefresh = () => {
        editor.cm.display.wrapper.style.height = ( window.innerHeight - 41 ) + 'px';
        editor.cm.refresh();
    };

    // Set theme
    document.getElementById('inp-theme').addEventListener('change', function () {
        set_theme(this.value);
        set('theme', this.value);
    });

    // Set current script
    document.getElementById('inp-selected-script').addEventListener('change', function () {
        editor.cm.setValue(`fetch('scripts/${this.value}');`);
    });

})(`<div class="main">
<textarea id="ta-selected-script"></textarea>
</div>

<div class="sidebar">
<h2 class="header" class="sidebar-header">Settings</h2>
<div class="settings">

    <div>
        <label for="inp-selected-script">Script</label>
        <select id="inp-selected-script">
            <option value="moniter_eval.js" title="Log all eval related scripts">Moniter Eval</option>
            <option value="open_svg.js" title="Ctrl + click SVGs to open in new tab">Open SVG</option>
            <option value="socketio_debug.js" title="Enable / disable socket.io debugging">Socket.io Debugger</option>
            <option value="paste_files_anywhere.js" title="Ctrl + v to paste instead of selecting file">Paste Anywhere</option>
            <option value="voice_commands.js" title="Basic voice command demo">Voice Commands</option>
        </select>
    </div>

    <div>
        <label for="inp-theme">Theme</label>
        <select id="inp-theme">
            <option value="3024-day">3024-day</option>
            <option value="3024-night">3024-night</option>
            <option value="abcdef">abcdef</option>
            <option value="ambiance">ambiance</option>
            <option value="ayu-dark">ayu-dark</option>
            <option value="ayu-mirage">ayu-mirage</option>
            <option value="base16-dark">base16-dark</option>
            <option value="base16-light">base16-light</option>
            <option value="bespin">bespin</option>
            <option value="blackboard">blackboard</option>
            <option value="cobalt">cobalt</option>
            <option value="colorforth">colorforth</option>
            <option value="darcula">darcula</option>
            <option value="dracula">dracula</option>
            <option value="duotone-dark">duotone-dark</option>
            <option value="duotone-light">duotone-light</option>
            <option value="eclipse">eclipse</option>
            <option value="elegant">elegant</option>
            <option value="erlang-dark">erlang-dark</option>
            <option value="gruvbox-dark">gruvbox-dark</option>
            <option value="hopscotch">hopscotch</option>
            <option value="icecoder">icecoder</option>
            <option value="idea">idea</option>
            <option value="isotope">isotope</option>
            <option value="lesser-dark">lesser-dark</option>
            <option value="liquibyte">liquibyte</option>
            <option value="lucario">lucario</option>
            <option value="material">material</option>
            <option value="material-darker">material-darker</option>
            <option value="material-ocean">material-ocean</option>
            <option value="material-palenight">material-palenight</option>
            <option value="mbo">mbo</option>
            <option value="mdn-like">mdn-like</option>
            <option value="midnight">midnight</option>
            <option value="monokai">monokai</option>
            <option value="moxer">moxer</option>
            <option value="neat">neat</option>
            <option value="neo">neo</option>
            <option value="night">night</option>
            <option value="nord">nord</option>
            <option value="oceanic-next">oceanic-next</option>
            <option value="panda-syntax">panda-syntax</option>
            <option value="paraiso-dark">paraiso-dark</option>
            <option value="paraiso-light">paraiso-light</option>
            <option value="pastel-on-dark">pastel-on-dark</option>
            <option value="railscasts">railscasts</option>
            <option value="rubyblue">rubyblue</option>
            <option value="seti">seti</option>
            <option value="shadowfox">shadowfox</option>
            <option value="solarized">solarized</option>
            <option value="ssms">ssms</option>
            <option value="the-matrix">the-matrix</option>
            <option value="tomorrow-night-bright">tomorrow-night-bright</option>
            <option value="tomorrow-night-eighties">tomorrow-night-eighties</option>
            <option value="ttcn">ttcn</option>
            <option value="twilight">twilight</option>
            <option value="vibrant-ink">vibrant-ink</option>
            <option value="vscode-dark" selected="selected">vscode-dark</option>
            <option value="xq-dark">xq-dark</option>
            <option value="xq-light">xq-light</option>
            <option value="yeti">yeti</option>
            <option value="yonce">yonce</option>
            <option value="zenburn">zenburn</option>
        </select>
    </div>
</div>

<h2 class="header" class="sidebar-header">Hello World Script</h2>
<div class="script-description s-pad">A "Hello, World!" program generally is a computer program that outputs or displays the message "Hello, World!". Such a program is very simple in most programming languages, and is often used to illustrate the basic syntax of a programming language. It is often the first program written by people learning to code.</div>
<div class="created-date">Thu Aug 20 2020 21:22:18 GMT-0700 (Pacific Daylight Time)</div>
<div class="updated-date">Fri Aug 21 2020 17:14:49 GMT-0700 (Pacific Daylight Time)</div>
<div class="s-pad"><label for="edit-script-active">Active</label><input id="edit-script-active" type="checkbox" checked="true"></div>
</div>`);





