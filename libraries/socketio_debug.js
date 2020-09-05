let debug = true;

debug ? localStorage.setItem('debug', 'socket.io-client:socket') : localStorage.removeItem('debug');