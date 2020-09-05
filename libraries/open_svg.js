window.addEventListener('click', e => {

    if (e.ctrlKey && e.target) {

        let svg = document.createElement('svg');

        for (let i = 0; i < e.path.length; ++i) {
            let node = e.path[i];

            if (node.nodeName.toLowerCase() == 'svg') {
                svg = node;
                break;
            }
        }

        let xml = new XMLSerializer().serializeToString(svg),
            image64 = 'data:image/svg+xml;base64,' + btoa(xml),
            win = window.open('about:blank');

        win.document.write('<img src="' + image64 + '">');
    }
});