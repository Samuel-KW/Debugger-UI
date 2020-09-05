
let monitering = ['map', 'every', 'filter', 'forEach', 'find'];

for (let i = 0; i < monitering.length; ++i) {
    Session.hook([Array.prototype, monitering[i]], function (args, func) {
        let output = func.apply(this, args);
      
        log(monitering[i], args[0], this);
    
        return output;
    });
}

function log(type, data, output) {
    console.groupCollapsed(type);
    console.log(data);
    console.log(output);
    console.groupEnd();
}