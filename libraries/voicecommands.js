let phrases = [{
    'phrase': 'coding time',
    'resp': 'what a no-life',
    'link': 'vscode:'
}, {
    'phrase': 'nice extension',
    'resp': 'lol u r bad',
    'link': 'chrome-extension://npbcojeahakmlnikdblijhipdpfkckgg/debugger/index.html'
}];

let synth = window.speechSynthesis;

function say(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.voice = synth.getVoices().find(e => e.voiceURI.includes('UK English Male'));
    speech.pitch = 1;
    speech.rate = 1;

    speech.onerror = function (e) { console.error('SpeechSynthesisUtterance.onerror:', e); };
    synth.speak(speech);

    return speech;
}

let recognition = new (webkitSpeechRecognition || SpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 1;
recognition.continuous = true;
recognition.start();

recognition.onresult = function(e) {
    let results = e.results,
        formatted = '';

    for (let i = 0; i < results.length; ++i)
        formatted += results[i][0].transcript;

    formatted = formatted.toLowerCase();

    for (let i = 0; i < phrases.length; ++i) {
        let data = phrases[i];

        if (formatted.includes(data.phrase)) {
            window.open(data.link);
            say(data.resp);
            recognition.abort();
            setTimeout(() => recognition.start(), 1000);
            return;
        }
    }
};

function edit(text) {
    let focused = document.activeElement;

    if (focused.contentEditable == 'true') focused.textContent = text;
    else if (focused.nodeName == 'INPUT') focused.value = text;
    else if (focused.nodeName == 'TEXTAREA') focused.value = text;
}