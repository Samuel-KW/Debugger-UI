let pasted = [];

class _DataTransfer {
    constructor () {
        return new ClipboardEvent('').clipboardData || new DataTransfer();
    }
}

function dataURItoFile(dataURI) {

    let byteString;

    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0],
        data = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; ++i)
        data[i] = byteString.charCodeAt(i);

    let name = 'clipboard.' + mimeString.split('/')[1];

    return new File([data], name, { type: mimeString });
}

window.addEventListener('paste', function (event) {
    let items = (event.clipboardData || event.originalEvent.clipboardData).items;

    for (let index in items) {
        let item = items[index];

        if (item.kind === 'file') {

            let blob = item.getAsFile(),
                reader = new FileReader();

            reader.onload = e => {

                // Parse the pasted data into a file
                pasted.push(dataURItoFile(e.target.result));

                let elems = document.querySelectorAll('input[type=file]');
    
                // Loop over all file inputs
                for (let i = 0; i < elems.length; ++i) {

                    let elem = elems[i],
                        dt = new _DataTransfer(),
                        multiple = elem.getAttribute('multiple');

                    // Continue if nothing has been pasted
                    if (!pasted.length) continue;

                    // Test if the attribute is valid
                    if (multiple == '' || multiple == 'true') {

                        // Add multiple files
                        for (let file of pasted) 
                            dt.items.add(file);

                    } else {

                        // Add a single file
                        dt.items.add(pasted[0]);

                    }
                    
                    // Only change the files if clipboard has pasted valid content
                    if (dt.files.length) {
                        elem.files = dt.files;
                        elem.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            };

            reader.readAsDataURL(blob);
        }
    }
});
