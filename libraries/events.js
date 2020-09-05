
let original = EventTarget.prototype.addEventListener;

window.events = {};

// Hook for addEventListener
function addEventListener (type, listener, options={}) {
    events[type] ?? (events[type] = []);
    
    let settings = { listener, type, element: this },
        response = original.apply(this, arguments);
    
    if (typeof options === 'boolean') settings.capture = options;
    else {
        settings.once = options.once ?? false;
        settings.passive = options.passive ?? false;
        settings.useCapture = options.capture ?? false;
    }
    
    events[type].push(settings);
        
    return response;
}

EventTarget.prototype.addEventListener = addEventListener;

class FakeMouseEvent {
    constructor (type, target) {

        let event = new MouseEvent(type),
            rect = target.getBoundingClientRect(),
            x = rect.x + rect.width / 2,
            y = rect.y + rect.height / 2;

        this.altKey = false;
        this.bubbles = true;
        this.button = 0;
        this.buttons = 1;
        this.cancelBubble = false;
        this.cancelable = true;
        this.clientX = x;
        this.clientY = y;
        this.composed = true;
        this.ctrlKey = false;
        this.currentTarget = null;
        this.defaultPrevented = false;
        this.detail = 1;
        this.eventPhase = 0;
        this.fromElement = null;
        this.isTrusted = true;
        this.layerX = x;
        this.layerY = y;
        this.metaKey = false;
        this.movementX = 0;
        this.movementY = 0;
        this.offsetX = x;
        this.offsetY = y;
        this.pageX = x;
        this.pageY = y;
        this.path = [];
        this.relatedTarget = null;
        this.returnValue = true;
        this.screenX = x;
        this.screenY = y + 103;
        this.shiftKey = false;
        this.sourceCapabilities = event.sourceCapabilities;
        this.srcElement = null;
        this.target = target;
        this.timeStamp = event.timeStamp;
        this.toElement = null;
        this.type = type;
        this.view = window;
        this.which = 1;
        this.x = x;
        this.y = y;
    }
}
window.FakeMouseEvent = FakeMouseEvent;