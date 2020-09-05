
let _innerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;

Object.defineProperty(Element.prototype, 'innerHTML', {
    set: function (html) {
        
        console.groupCollapsed(this);
        console.log(html);
        
        let stack = new Error().stack;

        stack = stack.split('\n').slice(2).map(e => e.substr(7)).join('\n');
        
        console.log(stack);
        console.groupEnd();

        return _innerHTML.call(this, html);  
    }
});