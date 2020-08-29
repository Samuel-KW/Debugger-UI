(function (html) {

    let container = tab.add('WebSockets', 'View and debug active websocket connections', html);

})(`<div class="main">
<div class="section requests">
    <h2>Requests</h2>
    <div>
        <div>https://www.youtube.com/watch?v=1yQGkVhO6mQ</div>
        <div>https://www.youtube.com/watch?v=YOlUqfWrGls</div>
        <div>https://www.youtube.com/watch?v=n78Gg6_zEQg</div>
    </div>
</div>

<div class="section details">
    <h2>Details</h2>
    <div id="ws-created">10 minutes ago</div>
    <div id="ws-url">https://www.youtube.com/watch?v=1yQGkVhO6mQ</div>
    <div id="ws-host">www.youtube.com</div>
    <div id="ws-headers">
        <div><span class="header-type">Content-Type: </span><span class="header-value">application/json</span></div>
        <div><span class="header-type">User-Agent: </span><span class="header-value">Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0</span></div>
        <div><span class="header-type">Accept: </span><span class="header-value">text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8</span></div>
        <div><span class="header-type">Accept-Language: </span><span class="header-value">en-US,en;q=0.5</span></div>
        <div><span class="header-type">Referer: </span><span class="header-value">http://127.0.0.1:5501/index.html#websockets</span></div>
        <div><span class="header-type">Connection: </span><span class="header-value">keep-alive</span></div>
        <div><span class="header-type">Cache-Control: </span><span class="header-value">max-age=0</span></div>
    </div>
</div>
</div>

<div class="sidebar">
<h2 class="header" class="sidebar-header">Title</h2>
<div>Settings</div>
</div>`);