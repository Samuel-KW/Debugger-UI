Session.hook([AudioContext.prototype, 'createScriptProcessor'], function (args, func) {
    let output = func.apply(this, args);
    console.log('createScriptProcessor', output);

    output.addEventListener('audioprocess', e => {

        const output = e.outputBuffer.getChannelData(0);
        // loop through the 4096 samples
        for (let i = 0; i < output.length; ++i) {
            output[i] = (Math.random() - 0.5) * 0.5;
        }
    });

    return output;
});

// Create new input device
Session.hook([navigator.mediaDevices, 'enumerateDevices'], function (args, func) {

    return new Promise(function (resolve, reject) {
        func.apply(navigator.mediaDevices, args)
            .then(function (devices) {

                // Add custom input device
                devices.push({
                    deviceId: 'dbe6c63c8d454987ad05d33b34ab062fdae5fc60de9e865d4a49d0b291da0c23',
                    groupId: 'fb335be1f801738841cdbdd22cade6f0b5b8e3602efdbf7f0f8182e33c58a51c',
                    kind: 'audioinput',
                    label: 'Sound Modifier'
                });

                resolve(devices);
            })
            .catch(reject);
    });
});