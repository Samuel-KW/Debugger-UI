window.json_parses = [];
window.json_stringifies = [];

Session.hook([JSON, 'parse'], function (args, func) {
    let output = func.apply(JSON, args);

    window.json_parses.push(args[0]);
  
    return output;
});

Session.hook([JSON, 'stringify'], function (args, func) {
    let output = func.apply(JSON, args);

    window.json_stringifies.push(output);
  
    return output;
});