window.btoa_inputs = [];
window.atob_outputs = [];

Session.hook('btoa', function (args, func) {
    let output = func.apply(this, args);

    window.btoa_inputs.push(args[0]);
  
    return output;
});

Session.hook('atob', function (args, func) {
    let output = func.apply(this, args);

    window.atob_outputs.push(output);
  
    return output;
});