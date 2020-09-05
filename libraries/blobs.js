window.blob_inputs = [];

Session.hook('Blob', function (args, func, options) {
    let output;

    if (options.target) output = new func(...args);
    else output = func.apply(this, args);

    window.blob_inputs.push(args[0]);
  
    return output;
});