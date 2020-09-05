
Session.hook('Function', function (args, func, options) {
    let output;

    if (options.target) output = new func(...args);
    else output = func.apply(this, args);
  
    log('new Function', args[0], output);

    return output;
});

Session.hook('eval', function (args, func) {
    let output = func.apply(this, args);
  
    log('eval', args[0], output);

    return output;
});

Session.hook([document, 'write'], function (args, func) {
    let output = func.apply(document, args);
  
    log('document.write', args[0], output);

    return output;
});

Session.hook([document, 'createElement'], function (args, func) {
    let output = func.apply(document, args);
  
    try {

        if (args[0].toLowerCase() == 'script')
            log('document.createElement', output);

    } catch(e) {}

    return output;
});

function log(type, data, output) {
    console.groupCollapsed(type);
    console.log(data);
    console.log(output);
    console.groupEnd();
}

