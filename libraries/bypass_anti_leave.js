let block = ['blur', 'visibilitychange', 'mozvisibilitychange', 'webkitvisibilitychange', 'msvisibilitychange'];

// Hook addEventListener
Session.hook([Window.prototype, 'addEventListener'], function (args, func) {
    if (block.includes(args[0])) return;
    
    let output = func.apply(this, args);
    return output;
});

Session.hook([Document.prototype, 'addEventListener'], function (args, func) {
    if (block.includes(args[0])) return;
    
    let output = func.apply(this, args);
    return output;
});

// Hook document.hasFocus()
Session.hook([document, 'hasFocus'], () => true);

// Hook document.onblur
Object.defineProperty(HTMLDocument.prototype, 'onblur', { set: () => {} });

// Hook window.onblur
Object.defineProperty(window, 'onblur', { set: () => {} });

// Hook document.onpagehide
Object.defineProperty(HTMLDocument.prototype, 'onpagehide', { set: () => {} });

// Hook window.onpagehide
Object.defineProperty(window, 'onpagehide', { set: () => {} });

// Hook document.onfocusout
Object.defineProperty(HTMLDocument.prototype, 'onfocusout', { set: () => {} });

// Hook window.onfocusout
Object.defineProperty(window, 'onfocusout', { set: () => {} });

// Hook the visibility state of the document
Object.defineProperties(document, { visibilityState: { get: () => 'visible' }});

// Hook document.hidden
Object.defineProperties(document, { hidden: { get: () => false }});

// Tests
/*
window.addEventListener('blur', () => { debugger; });
window.addEventListener('visibilitychange', () => { debugger; });
window.addEventListener('mozvisibilitychange', () => { debugger; });
window.addEventListener('webkitvisibilitychange', () => { debugger; });
window.addEventListener('msvisibilitychange', () => { debugger; });

document.addEventListener('blur', () => { debugger; });
document.addEventListener('visibilitychange', () => { debugger; });
document.addEventListener('mozvisibilitychange', () => { debugger; });
document.addEventListener('webkitvisibilitychange', () => { debugger; });
document.addEventListener('msvisibilitychange', () => { debugger; });

document.onfocusout = () => { debugger; };
document.onpagehide = document.onblur = () => { debugger; };

window.onfocusout = () => { debugger; };
window.onpagehide = window.onblur = () => { debugger; };

setInterval(() => {
    console.assert(document.hasFocus());
    console.assert(document.visibilityState == 'visible');
    console.assert(!document.hidden);
}, 500);
*/