class URLHandler {
    constructor (url='') {

        this.id = get_sid();

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

        const id = data.id ?? get_sid();

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

    save_settings() {
        let filter_re = document.getElementById('inp-filterregex'),
            catch_re = document.getElementById('inp-catchregex'),
            hook_fetch = document.getElementById('inp-hookfetch'),
            logging = document.getElementById('inp-logging'),
            catch_all = document.getElementById('inp-catchall');

        set('filter_regex', filter_re.value);
        set('catch_regex', catch_re.value);
        set('hooking_fetch', hook_fetch.checked);
        set('logging_requests', logging.checked);
        set('catching_all', catch_all.checked);
    }
}

(function (html) {

    let container = tab.add('Requests', 'View and modify outgoing requests', html);


    elem.requests = document.getElementById('request-container');

    // Demo content code
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




})(`<div class="main">
<h1>Pending Requests</h1>
<div id="request-container"></div>
</div>

<div class="sidebar">
<h2 class="header" class="sidebar-header">Settings</h2>
<div class="settings">
    <div><label for="inp-filterregex">Filter</label><input id="inp-filterregex" type="text" placeholder="Filter Regex" value=""></div>
    <div><label for="inp-catchregex">Catch Regex</label><input id="inp-catchregex" type="text" value="(?!)"></div>
    <div><input id="inp-hookfetch" type="checkbox" checked="true"><label for="inp-hookfetch">Hook Fetch</label></div>
    <div><input id="inp-hookrequests" type="checkbox" checked="true"><label for="inp-hookrequests">Hook XHR</label></div>
    <div><input id="inp-logging" type="checkbox" checked="true"><label for="inp-logging">Logging</label></div>
    <div><input id="inp-catchall" type="checkbox"><label for="inp-catchall">Catch All</label></div>
</div>

</div>`);