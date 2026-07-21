const catMeowContext = new (window.AudioContext || window.webkitAudioContext)();

function playCatMeow() {
    if (catMeowContext.state === 'suspended') {
        catMeowContext.resume();
    }

    const length = Math.round(catMeowContext.sampleRate * 0.8);
    const buffer = catMeowContext.createBuffer(1, length, catMeowContext.sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
        const t = i / length;
        const sweep = 650 + 420 * (1 - t) * t;
        const phase = 2 * Math.PI * sweep * (i / catMeowContext.sampleRate);
        const voice = Math.sin(phase);
        const hiss = (Math.random() * 2 - 1) * 0.16;
        const envelope = Math.pow(1 - t, 2) * Math.exp(-2.2 * t);
        channelData[i] = envelope * (voice * 0.78 + hiss * 0.24);
    }

    const source = catMeowContext.createBufferSource();
    source.buffer = buffer;
    source.connect(catMeowContext.destination);
    source.start();
}

function attachCatMeows() {
    const catNodes = document.querySelectorAll('.cat10, .cat11, .cat12');
    catNodes.forEach(node => {
        node.addEventListener('click', () => {
            playCatMeow();
            node.classList.add('meow-hit');
            window.setTimeout(() => node.classList.remove('meow-hit'), 180);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachCatMeows);
} else {
    attachCatMeows();
}
