let rgbToHex = (r, g, b) => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

function pick_color (canvas) {
    
    let context = canvas.getContext('2d');

    let parent = document.createElement('div');
    parent.style = 'position: fixed; top: 0; left: 0; z-index: 2147483647; background: rgba(0, 0, 0, 0.7);';

    let c = document.createElement('canvas'),
        ctx = c.getContext('2d');

    c.style = 'cursor: crosshair; margin: auto; background-color: #000; pointer-events: auto;';

    c.width = canvas.width;
    c.height = canvas.height;

    let mouse = { x: 0, y: 0, active: false };

    let image_data = context.getImageData(0, 0, canvas.width, canvas.width);
    ctx.putImageData(image_data, 0, 0);

    let color_elem = document.createElement('span');
    color_elem.style = 'min-width: 67px; padding: 3px; font-size: 16px; font-weight: 300; font-family: consolas, serif; position: absolute; top: 0; left: 0; background: #fff; color: #000; outline: #000 solid 1px; border-bottom: 10px solid #fff; user-select: text; pointer-events: auto;';

    parent.appendChild(c);
    parent.appendChild(color_elem);
    document.body.appendChild(parent);

    let handle_pos = function (e) {
        let rect = c.getBoundingClientRect();

        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    let get_color = function () {
        let data = image_data.data,
            x = mouse.x,
            y = mouse.y;

        if (x > c.width || y > c.height || x < 0 || y < 0) return;

        let red = data[((c.width * y) + x) * 4],
            green = data[((c.width * y) + x) * 4 + 1],
            blue = data[((c.width * y) + x) * 4 + 2];

        let color = rgbToHex(red, green, blue);
        if (color === '#aN') return;

        color_elem.textContent = color;
        color_elem.style.borderBottom = '10px solid ' + color;
    };

    get_color();

    let handle_keys = function (e) {
        let key = e.keyCode || e.which;
        
        if (key != 27) return;

        parent.remove();
        window.removeEventListener('keydown', handle_keys);
    };

    window.addEventListener('keydown', handle_keys);

    c.addEventListener('mouseup', () => { mouse.active = false; });

    c.addEventListener('mousedown', e => {
        mouse.active = true;

        handle_pos(e);
        get_color();
    });

    c.addEventListener('mousemove', e => {
        handle_pos(e);
        if (mouse.active) get_color();
    });
}