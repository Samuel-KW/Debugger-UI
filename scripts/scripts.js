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

(function (html) {

    let container = tab.add('Scripts', 'View and edit premade scripts', html);

    window.viewer = new ScriptViewer();

    // Handle refresh
    container.onrefresh = () => {
        viewer.cm.display.wrapper.style.height = ( window.innerHeight - nav_height ) + 'px';
        viewer.cm.refresh();
    };
    
})(`<div class="main">
<textarea id="ta-viewing-script"></textarea>
</div>

<div class="sidebar">
<h2 class="header" class="sidebar-header">Scripts</h2>
<div class="settings" id="script-container">

    <div class="script selected"><span>moniter_eval.js</span></div>
    <div class="script"><span>open_svg.js</span></div>
    <div class="script"><span>paste_files_anywhere.js</span></div>
    <div class="script"><span>socketio_debug.js</span></div>
    <div class="script"><span>voice_commands.js</span></div>
</div>

<h2 class="header" class="sidebar-header">Insane Script Helper</h2>
<div class="script-description s-pad">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam laoreet rutrum urna at lobortis. Cras ut est at risus vulputate facilisis interdum in nulla. Sed ut bibendum orci. Sed lorem dui, ultricies non libero eleifend, vestibulum sodales nulla. Nullam at mi id lacus consequat finibus quis eget urna. Nulla urna orci, sodales at scelerisque non, aliquet at justo. Morbi posuere tellus eu erat ornare fermentum. Vivamus rutrum justo pellentesque ante venenatis, nec molestie lorem pulvinar. In vitae libero non tortor malesuada feugiat. Mauris in dolor eget nunc porta tempus eu sed sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam a risus at nisl ultricies pellentesque eu sed ante.</div>
<div class="created-date">Thu Aug 20 2020 21:22:18 GMT-0700 (Pacific Daylight Time)</div>
<div class="updated-date">Fri Aug 21 2020 17:14:49 GMT-0700 (Pacific Daylight Time)</div>
<div class="s-pad"><label for="view-script-active">Active</label><input id="view-script-active" type="checkbox" checked="true"></div>
</div>`);





