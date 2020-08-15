const tabs = {
    requests: document.querySelector('.tab.requests'),
    websockets: document.querySelector('.tab.websockets'),
    scripts: document.querySelector('.tab.scripts'),
    editor: document.querySelector('.tab.editor'),
    libraries: document.querySelector('.tab.libraries')
};

const methods = [ 'GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE', 'COPY', 'OPTIONS', 'LINK', 'UNLINK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND', 'VIEW', 'TRACE' ];

const elem = {
    requests: document.getElementById('request-container'),
};

let id_index = 0;
const get_id = () => ++id_index;

let current = 'requests';

// Add listeners to nav bar
document.getElementById('nav-requests')  .addEventListener('click', function () { select('requests',   this); });
document.getElementById('nav-websockets').addEventListener('click', function () { select('websockets', this); });
document.getElementById('nav-scripts')   .addEventListener('click', function () { select('scripts',    this); });
document.getElementById('nav-editor')    .addEventListener('click', function () { select('editor',     this); });
document.getElementById('nav-libraries') .addEventListener('click', function () { select('libraries',  this); });

function select(tab, that) {
    let elem = tabs[tab];
    
    if (elem === undefined) return;

    // Hide old tab
    tabs[current].classList.add('hidden');

    // Show new tab
    elem.classList.remove('hidden');

    // Remove old selected tab
    document.getElementById('nav-' + current)?.classList.remove('selected');

    // Show current tab as selected
    that.classList.add('selected');

    // Update current variable
    current = tab;
}

function accordion(elem, child) {
    child.style.overflow = 'hidden';
    child.style.transition = 'max-height 200ms ease-out';
    child.style.maxHeight = '0px';

    elem.addEventListener('mousedown', function (e) {
        this.classList.toggle('active');

        if (child.style.maxHeight != '0px') child.style.maxHeight = '0px';
        else child.style.maxHeight = child.scrollHeight + 'px';

        // Prevent user from selecting the URL when clicking
        e.preventDefault();
    });
}

class URLHandler {
    constructor (url='') {

        this.id = get_id();

        this.header = document.createElement('div');
        this.header.className = 'domain accordion';
        this.header.textContent = url;
        this.header.title = url;

        this.container = document.createElement('div');
        this.container.className = 'container';
        this.container.setAttribute('id', this.id);

        elem.requests.appendChild(this.header);
        elem.requests.appendChild(this.container);
        
        accordion(this.header, this.container);
    }

    add_request (data={}) {

        const id = data.id ?? get_id();

        let parent = document.createElement('div');
        parent.className = 'request';
        parent.setAttribute('id', id);

        let method = document.createElement('span');
        method.className = 'method';
        method.classList.add(data.method.toLowerCase());

        let url = document.createElement('span');
        url.className = 'url';
        url.textContent = data.path;
        url.title = data.path;

        parent.appendChild(method);
        parent.appendChild(url);

        this.container.appendChild(parent);

        return id;
    }

    remove_request(id) {
        this.container.querySelector(`.request[id="${id}"]`)?.remove();
    }

    remove() {
        this.container.remove();
        this.header.remove();
    }
}

let url = new URLHandler('https://www.youtube.com/watch?v=1yQGkVhO6mQ');

url.add_request({ method: 'GET', path: '/api/v2/views.php/api/v2/views.php/api/v2/views.php/api/v2/views.php/api/v2/views.php/api/v2/views.php' });
url.add_request({ method: 'POST', path: '/api/v2/get_current_location.php' });
url.add_request({ method: 'PATCH', path: '/api/v2/access.php' });
url.add_request({ method: 'PUT', path: '/api/v2/subscribe/users/6247' });
url.add_request({ method: 'DELETE', path: '/api/v2/like/users/4241' });

let url1 = new URLHandler('https://www.youtube.com/watch?v=YOlUqfWrGls');

url1.add_request({ method: 'GET', path: '/api/v2/views.php' });
url1.add_request({ method: 'POST', path: '/api/v2/get_current_location.php' });
url1.add_request({ method: 'PATCH', path: '/api/v2/access.php' });
url1.add_request({ method: 'PUT', path: '/api/v2/subscribe/users/1' });
url1.add_request({ method: 'DELETE', path: '/api/v2/follow/users/321' });

let url2 = new URLHandler('https://www.youtube.com/watch?v=n78Gg6_zEQg');

url2.add_request({ method: 'GET', path: '/api/v2/views.php' });
url2.add_request({ method: 'POST', path: '/api/v2/get_current_location.php' });
url2.add_request({ method: 'PATCH', path: '/api/v2/access.php' });
url2.add_request({ method: 'PUT', path: '/api/v2/subscribe/users/4325' });
url2.add_request({ method: 'DELETE', path: '/api/v2/follow/users/623624' });
