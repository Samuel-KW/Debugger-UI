let requests = new Tab('Requests', 'View and modify outgoing requests');
requests.html = `<div class="main">
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

</div>`;