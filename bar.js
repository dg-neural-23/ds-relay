const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@testing-library/dom@latest/dist/@testing-library/dom.umd.min.js';
document.head.appendChild(script);

last = x => x[x.length - 1];
answers = () => document.querySelectorAll('.ds-markdown')

script.onload = () => {
  const { fireEvent } = window.TestingLibraryDom;
  const input = document.getElementById('chat-input');

  ask = async text => {
    fireEvent.change(input, { target: { value: text } });
    fireEvent.keyDown(input, { key: 'Enter' });
    let ac = answers().length;
    return new Promise(resolve => {
      setTimeout(() => {
        const iv = setInterval(() => {
          if (input.parentElement.parentElement
              .querySelectorAll('svg')
              .length == 4
              && answers().length > ac) {
            clearInterval(iv);
            resolve(last(answers()).innerText);
          }
        }, 100);
      }, 100);
    });
  };
};

const ws = new WebSocket('ws://localhost:8765');
ws.onmessage = async e => await ask(e.data);


(function () {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        let prevLength = 0; // Track previous response length
        if (url.includes('completion')) {
            this.addEventListener('progress', function () {
                const newText = this.responseText.slice(prevLength); // Get only new content
                if (newText) {
                    ws.send(newText);
                    prevLength = this.responseText.length; // Update previous length
                }
            });
        }
        originalOpen.apply(this, arguments);
    };
})();
