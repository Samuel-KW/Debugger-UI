let distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);

// Attempt to get game canvas by finding the largest canvas
let get_canvas = function () {
    let elems = document.getElementsByTagName('canvas');

    let largest = {
        size: 0,
        elem: undefined
    };
    
    for (let i = 0; i < elems.length; ++i) {
		let width = elems[i].width || 0,
        	height = elems[i].height || 0;
        
        if ((width + height) > largest.size) largest = { size: width + height, elem: elems[i] };
    }
    
    return largest.elem;
};

// Handle game animation
let animation_loop = function () {
    
    if (!canvas) canvas = get_canvas();
    if (canvas) {

        // Dimensions of the objects
        let dimensions = {
            width: 50,
            height: 20
        };

        // Closest object placeholder
        let closest = {
            x: 0,
            y: 0,
            dist: Infinity
        };

        let ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';

        for (let i = 0; i < watching.length; ++i) {
            let obj = watching[i];

            // Draw rectangle around target element
            ctx.fillRect(obj.x, obj.y, 100, 100);

            if (obj.dist < closest.dist) closest = obj;
        }

        // Enable mouse if no target is found
        if (closest.dist == Infinity) disable_mouse = false;
        else disable_mouse = true;

        // Get center position
        let target_x = closest.x + dimensions.height,
            target_y = closest.y - dimensions.height;

        // Create mouse event
        let event = new MouseEvent('mousemove', { clientX: target_x, clientY: target_y });

        // Change position of aimbot element
        aimbot_elem.style.left = (target_x - (dimensions.width / 2)) + 'px';
        aimbot_elem.style.top = (target_y - (dimensions.height / 2)) + 'px';

        // Dispatch event if script is active
        if (active && disable_mouse)
            document.dispatchEvent(event);
    }

    // Reset objects to follow
    watching = [];
    
    window.requestAnimationFrame(animation_loop);
};

let center = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

// Variables
let canvas = get_canvas(),
    active = false,
    watching = [],
    disable_mouse = false,
    aimbot_elem = document.createElement('div');

aimbot_elem.style = `position: fixed; top: -100px; left: -100px; z-index: 2147483647; width: 40px; height: 20px; border-radius: 50%; border: 2px solid red; background-color: transparent;`;
window.addEventListener('load', () => { document.body.appendChild(aimbot_elem); });

// Start animation loop
window.requestAnimationFrame(animation_loop);

// Add listeners
window.addEventListener('keydown', e => {
    if (e.keyCode == 17) {
        active = !active;
        disable_mouse = false;
    }
});

// Hook drawing rectangles
Session.hook([CanvasRenderingContext2D.prototype, 'strokeRect'], function (args, func) {

    if (this.strokeStyle == '#ffffff') {
        
        // Get current canvas transformations
        let tranformation = this.getTransform(),
            top_x = -tranformation.e,
            top_y = -tranformation.f;

        // Get position of elements
        let x = (args[0] - top_x),
            y = (args[1] - top_y),
            dist = distance(x, y, center.x, center.y);

        // Make sure to not select own player
        if (distance(center.x, center.y, x, y) > 50) watching.push({ x, y, dist });
    }

    return func.apply(this, args);
});