let msgpack={};!function(){function t(t,e,s){for(var i=0,f=0,r=s.length;f<r;f++)(i=s.charCodeAt(f))<128?t.setUint8(e++,i):i<2048?(t.setUint8(e++,192|i>>6),t.setUint8(e++,128|63&i)):i<55296||i>=57344?(t.setUint8(e++,224|i>>12),t.setUint8(e++,128|i>>6&63),t.setUint8(e++,128|63&i)):(f++,i=65536+((1023&i)<<10|1023&s.charCodeAt(f)),t.setUint8(e++,240|i>>18),t.setUint8(e++,128|i>>12&63),t.setUint8(e++,128|i>>6&63),t.setUint8(e++,128|63&i))}function e(t){if(this.offset=0,t instanceof ArrayBuffer)this.buffer=t,this.view=new DataView(this.buffer);else{if(!ArrayBuffer.isView(t))throw new Error("Invalid argument");this.buffer=t.buffer,this.view=new DataView(this.buffer,t.byteOffset,t.byteLength)}}msgpack.encode=function(e){var s=[],i=[],f=function t(e,s,i){var f=typeof i,r=0,h=0,n=0,o=0,a=0,u=0;if("string"===f){if((a=function(t){for(var e=0,s=0,i=0,f=t.length;i<f;i++)(e=t.charCodeAt(i))<128?s+=1:e<2048?s+=2:e<55296||e>=57344?s+=3:(i++,s+=4);return s}(i))<32)e.push(160|a),u=1;else if(a<256)e.push(217,a),u=2;else if(a<65536)e.push(218,a>>8,a),u=3;else{if(!(a<4294967296))throw new Error("String too long");e.push(219,a>>24,a>>16,a>>8,a),u=5}return s.push({str:i,length:a,offset:e.length}),u+a}if("number"===f)return Math.floor(i)===i&&isFinite(i)?i>=0?i<128?(e.push(i),1):i<256?(e.push(204,i),2):i<65536?(e.push(205,i>>8,i),3):i<4294967296?(e.push(206,i>>24,i>>16,i>>8,i),5):(n=i/Math.pow(2,32)>>0,o=i>>>0,e.push(207,n>>24,n>>16,n>>8,n,o>>24,o>>16,o>>8,o),9):i>=-32?(e.push(i),1):i>=-128?(e.push(208,i),2):i>=-32768?(e.push(209,i>>8,i),3):i>=-2147483648?(e.push(210,i>>24,i>>16,i>>8,i),5):(n=Math.floor(i/Math.pow(2,32)),o=i>>>0,e.push(211,n>>24,n>>16,n>>8,n,o>>24,o>>16,o>>8,o),9):(e.push(203),s.push({float:i,length:8,offset:e.length}),9);if("object"===f){if(null===i)return e.push(192),1;if(Array.isArray(i)){if((a=i.length)<16)e.push(144|a),u=1;else if(a<65536)e.push(220,a>>8,a),u=3;else{if(!(a<4294967296))throw new Error("Array too large");e.push(221,a>>24,a>>16,a>>8,a),u=5}for(r=0;r<a;r++)u+=t(e,s,i[r]);return u}if(i instanceof Date){var g=i.getTime();return n=Math.floor(g/Math.pow(2,32)),o=g>>>0,e.push(215,0,n>>24,n>>16,n>>8,n,o>>24,o>>16,o>>8,o),10}if(i instanceof ArrayBuffer){if((a=i.byteLength)<256)e.push(196,a),u=2;else if(a<65536)e.push(197,a>>8,a),u=3;else{if(!(a<4294967296))throw new Error("Buffer too large");e.push(198,a>>24,a>>16,a>>8,a),u=5}return s.push({bin:i,length:a,offset:e.length}),u+a}if("function"==typeof i.toJSON)return t(e,s,i.toJSON());var w=[],p="",c=Object.keys(i);for(r=0,h=c.length;r<h;r++)"function"!=typeof i[p=c[r]]&&w.push(p);if((a=w.length)<16)e.push(128|a),u=1;else if(a<65536)e.push(222,a>>8,a),u=3;else{if(!(a<4294967296))throw new Error("Object too large");e.push(223,a>>24,a>>16,a>>8,a),u=5}for(r=0;r<a;r++)u+=t(e,s,p=w[r]),u+=t(e,s,i[p]);return u}if("boolean"===f)return e.push(i?195:194),1;if("undefined"===f)return e.push(212,0,0),3;throw new Error("Could not encode")}(s,i,e),r=new ArrayBuffer(f),h=new DataView(r),n=0,o=0,a=-1;i.length>0&&(a=i[0].offset);for(var u,g=0,w=0,p=0,c=s.length;p<c;p++)if(h.setUint8(o+p,s[p]),p+1===a){if(g=(u=i[n]).length,w=o+a,u.bin)for(var v=new Uint8Array(u.bin),l=0;l<g;l++)h.setUint8(w+l,v[l]);else u.str?t(h,w,u.str):void 0!==u.float&&h.setFloat64(w,u.float);o+=g,i[++n]&&(a=i[n].offset)}return r},e.prototype.array=function(t){for(var e=new Array(t),s=0;s<t;s++)e[s]=this.parse();return e},e.prototype.map=function(t){for(var e={},s=0;s<t;s++)e[this.parse()]=this.parse();return e},e.prototype.str=function(t){var e=function(t,e,s){for(var i="",f=0,r=e,h=e+s;r<h;r++){var n=t.getUint8(r);if(0!=(128&n))if(192!=(224&n))if(224!=(240&n)){if(240!=(248&n))throw new Error("Invalid byte "+n.toString(16));(f=(7&n)<<18|(63&t.getUint8(++r))<<12|(63&t.getUint8(++r))<<6|(63&t.getUint8(++r))<<0)>=65536?(f-=65536,i+=String.fromCharCode(55296+(f>>>10),56320+(1023&f))):i+=String.fromCharCode(f)}else i+=String.fromCharCode((15&n)<<12|(63&t.getUint8(++r))<<6|(63&t.getUint8(++r))<<0);else i+=String.fromCharCode((31&n)<<6|63&t.getUint8(++r));else i+=String.fromCharCode(n)}return i}(this.view,this.offset,t);return this.offset+=t,e},e.prototype.bin=function(t){var e=this.buffer.slice(this.offset,this.offset+t);return this.offset+=t,e},e.prototype.parse=function(){var t,e=this.view.getUint8(this.offset++),s=0,i=0,f=0,r=0;if(e<192)return e<128?e:e<144?this.map(15&e):e<160?this.array(15&e):this.str(31&e);if(e>223)return-1*(255-e+1);switch(e){case 192:return null;case 194:return!1;case 195:return!0;case 196:return s=this.view.getUint8(this.offset),this.offset+=1,this.bin(s);case 197:return s=this.view.getUint16(this.offset),this.offset+=2,this.bin(s);case 198:return s=this.view.getUint32(this.offset),this.offset+=4,this.bin(s);case 199:return s=this.view.getUint8(this.offset),i=this.view.getInt8(this.offset+1),this.offset+=2,[i,this.bin(s)];case 200:return s=this.view.getUint16(this.offset),i=this.view.getInt8(this.offset+2),this.offset+=3,[i,this.bin(s)];case 201:return s=this.view.getUint32(this.offset),i=this.view.getInt8(this.offset+4),this.offset+=5,[i,this.bin(s)];case 202:return t=this.view.getFloat32(this.offset),this.offset+=4,t;case 203:return t=this.view.getFloat64(this.offset),this.offset+=8,t;case 204:return t=this.view.getUint8(this.offset),this.offset+=1,t;case 205:return t=this.view.getUint16(this.offset),this.offset+=2,t;case 206:return t=this.view.getUint32(this.offset),this.offset+=4,t;case 207:return f=this.view.getUint32(this.offset)*Math.pow(2,32),r=this.view.getUint32(this.offset+4),this.offset+=8,f+r;case 208:return t=this.view.getInt8(this.offset),this.offset+=1,t;case 209:return t=this.view.getInt16(this.offset),this.offset+=2,t;case 210:return t=this.view.getInt32(this.offset),this.offset+=4,t;case 211:return f=this.view.getInt32(this.offset)*Math.pow(2,32),r=this.view.getUint32(this.offset+4),this.offset+=8,f+r;case 212:return i=this.view.getInt8(this.offset),this.offset+=1,0===i?void(this.offset+=1):[i,this.bin(1)];case 213:return i=this.view.getInt8(this.offset),this.offset+=1,[i,this.bin(2)];case 214:return i=this.view.getInt8(this.offset),this.offset+=1,[i,this.bin(4)];case 215:return i=this.view.getInt8(this.offset),this.offset+=1,0===i?(f=this.view.getInt32(this.offset)*Math.pow(2,32),r=this.view.getUint32(this.offset+4),this.offset+=8,new Date(f+r)):[i,this.bin(8)];case 216:return i=this.view.getInt8(this.offset),this.offset+=1,[i,this.bin(16)];case 217:return s=this.view.getUint8(this.offset),this.offset+=1,this.str(s);case 218:return s=this.view.getUint16(this.offset),this.offset+=2,this.str(s);case 219:return s=this.view.getUint32(this.offset),this.offset+=4,this.str(s);case 220:return s=this.view.getUint16(this.offset),this.offset+=2,this.array(s);case 221:return s=this.view.getUint32(this.offset),this.offset+=4,this.array(s);case 222:return s=this.view.getUint16(this.offset),this.offset+=2,this.map(s);case 223:return s=this.view.getUint32(this.offset),this.offset+=4,this.map(s)}throw new Error("Could not parse")},msgpack.decode=function(t){var s=new e(t),i=s.parse();if(s.offset!==t.byteLength)throw new Error(t.byteLength-s.offset+" trailing bytes");return i}}();

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function join_buffers (buffer1, buffer2) {
    let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);

    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);

    return tmp.buffer;
};

let packets = [
    'open',
    'close',
    'ping',
    'pong',
    'message',
    'upgrade',
    'noop'
];

class Player {
    constructor (socket) {

        this.socket = socket;
        this.room = undefined;

        this.game = {};

        this.logging = {
            sent: true,
            recieved: true
        };

        this.balance = 0;
        this.questions = [];
        this.running = false;
        this.name = 'Player [Still Entering Name]';

        this.auto_upgrade = true;
        this.auto_answer = true;

        // Current upgrades
        this.upgrades = {
            'Money Per Question': 1,
            'Streak Bonus': 1,
            'Multiplier': 1,
            'Insurance': 1
        };

        // TODO Current powerups
        // -1  - Unavaliable
        //  0  - Not purchased
        //  1  - Purchased
        //  2  - Active
        this.powerups = {
            'Mega Bonus': 0,
            'Mini Bonus': 0,
            'repurchasePowerups': 0
        };

        // Speed (in MS) between answered questions
        this.speed = {
            min: 1000,
            max: 1250
        };

        // 100 - every question is correct
        this.accuracy = 95;

        // Start answer loop
        setTimeout(() => { this.interval(); }, random(this.speed.min, this.speed.max));

        // Setup the socket connection
        this.setup_socket(socket);
    }

    interval () {

        // Make sure player is connected to a room, the game is running, the socket is open, and auto answering is true
        if (this.room && this.running && this.socket.readyState == this.socket.OPEN && this.auto_answer) {

            // Answer a question
            this.answer_question();

        }

        // Restart answering loop
        setTimeout(() => { this.interval(); }, random(this.speed.min, this.speed.max));
    }

    setup_socket (socket) {
        socket.addEventListener('message', e => {
            if (e.data instanceof ArrayBuffer) {
    
                let buffer = e.data,
                    array = new Uint8Array(buffer),
                    type = packets[array[0]],
                    rest = buffer.slice(1);
    
                if (type == 'message') {
                    let data = msgpack.decode(rest);
    
                    if (data && data.constructor === Object && data.data[1].constructor === Object) {
    
                        let initial_data = data.data[1],
                            key = initial_data.key,
                            value = initial_data.data;

                        if (key == 'STATE_UPDATE') this.handle_state_update(value.type, value.value);
                        else if (key == 'PLAYER_JOINS_STATIC_STATE') this.game = value;
                        else if (key == 'blueboat_REMOVED_FROM_ROOM') this.running = false;

                        if (this.logging.recieved) console.log('%cIN  %c=>', 'color: #00baf2;', 'color: #fff;', key, value);
                    }
                }
            }
        });
    }

    handle_before_send (type, data) {
        if (this.logging.sent) console.log('%cOUT %c<=', 'color: #ff4a36;', 'color: #fff;', type, data);

        if (data.key == 'ASSIGNMENT_STARTED') this.running = true;
        if (data.room) this.room = data.room;
    }

    handle_state_update (type, data) {

        switch (type) {
            case 'GAME_QUESTIONS':
                this.questions = data;
                break;

            case 'BALANCE':
                
                if (this.auto_upgrade) {
                    this.purchase_upgrade('Streak Bonus', 2) ||
                    this.purchase_upgrade('Money Per Question', 3) ||
                    this.purchase_upgrade('Streak Bonus', 3) ||
                    this.purchase_upgrade('Multiplier', 3) ||
                    this.purchase_upgrade('Streak Bonus', 4) ||
                    this.purchase_upgrade('Multiplier', 4) ||
                    this.purchase_upgrade('Money Per Question', 5) ||
                    this.purchase_upgrade('Streak Bonus', 5) ||
                    this.purchase_upgrade('Multiplier', 5) ||
                    this.purchase_upgrade('Money Per Question', 6) ||
                    this.purchase_upgrade('Multiplier', 6) ||
                    this.purchase_upgrade('Streak Bonus', 6) ||
                    this.purchase_upgrade('Streak Bonus', 7) ||
                    this.purchase_upgrade('Streak Bonus', 8) ||
                    this.purchase_upgrade('Multiplier', 7) ||
                    this.purchase_upgrade('Money Per Question', 9) ||
                    this.purchase_upgrade('Multiplier', 8) ||
                    this.purchase_upgrade('Streak Bonus', 9) ||
                    this.purchase_upgrade('Multiplier', 9) ||
                    this.purchase_upgrade('Streak Bonus', 10) ||
                    this.purchase_upgrade('Money Per Question', 10) ||
                    this.purchase_upgrade('Multiplier', 10);
                }

                this.balance = data;
                break;

            case 'UPGRADE_LEVELS':
                if (data.insurance) this.upgrades['Insurance'] = data.insurance;
                if (data.moneyPerQuestion) this.upgrades['Money Per Question'] = data.moneyPerQuestion;
                if (data.multiplier) this.upgrades['Multiplier'] = data.multiplier;
                if (data.streakBonus) this.upgrades['Streak Bonus'] = data.streakBonus;

                break;

            case 'PURCHASED_POWERUPS':
                for (let i = 0; i < data.length; ++i)
                    this.powerups[data[i]] = 1;

                break;

            case 'PERSONAL_ACTIVE_POWERUPS':
                for (let name in this.powerups) {
                    if (this.powerups[name] == 2) this.powerups[name] = -1
                    if (data.includes(name)) this.powerups[name] = 2;
                }

                break;

            case 'USED_POWERUPS':
                if (data.includes('repurchasePowerups'))
                    for (let i = 0; i < data.length; ++i) this.powerups[data[i]] = 0;

                break;

            case 'COMPLETED_ASSIGNMENT':
                this.running = !data;
                break;

            case 'GAME_STATUS':
                if (data == 'gameplay') this.running = true;
                else if (data == 'results') {
                    this.running = false;
                    this.clap(-420.69);
                }
                break;

            case 'THEME':
                this.theme = data;
                break;

            case 'NAME':
                this.name = data;
                break;
        }

    }

    answer_question () {
        let question = this.questions[Math.floor(Math.random() * this.questions.length)],
            answer = question.answers.find(e => e.correct);

        if (this.accuracy / 100 < Math.random()) answer = question.answers.find(e => !e.correct)

        if (answer) {
            this.send_data([ 'blueboat_SEND_MESSAGE', {
                room: this.room,
                key: 'QUESTION_ANSWERED',
                data: {
                    questionId: question._id,
                    answer: question.type == 'text' ? answer.text : answer._id
                }
            }]);
        }
    }

    purchase_powerup (powerup) {
        this.send_data([ 'blueboat_SEND_MESSAGE', {
            data: powerup,
            key: 'POWERUP_PURCHASED',
            room: this.room
        }]);

        this.powerups[powerup] = 1;
    }

    clap (amount=-Infinity) {
        this.send_data([ 'blueboat_SEND_MESSAGE', {
            data: { amount },
            key: 'CLAP',
            room: this.room
        }]);
    }

    change_name (name='Dave', groupId, groupMemberId) {
        this.send_data([ 'blueboat_SEND_MESSAGE', {
            data: { name, groupId, groupMemberId },
            key: 'PLAYER_USER_DETAILS',
            room: this.room
        }]);
    }

    purchase_upgrade (upgrade, level) {

        // Find the upgrade from the upgrades supplied from the server
        let upgrades = this.game.upgrades,
            selected = upgrades.find(e => e.name == upgrade);

        // Make sure the upgrade is found AND you don't already have a better upgrade
        if (selected && this.upgrades[upgrade] < level) {

            // Find the price of the upgrade
            let price = selected.levels[level - 1].price;

            // Make sure you have enough money
            if (price <= this.balance) {

                // Send the request
                this.send_data([ 'blueboat_SEND_MESSAGE', {
                    data: {
                        level,
                        upgradeName: upgrade
                    },
                    key: 'UPGRADE_PURCHASED',
                    room: this.room
                }]);
        
                // Update the upgrades client-side
                if (this.upgrades[upgrade] == undefined) this.upgrades[upgrade] = 1;
                this.upgrades[upgrade]++;

                return true;
            }
        }

        return false;
    }

    activate_powerup (powerup) {
        this.send_data([ 'blueboat_SEND_MESSAGE', {
            data: powerup,
            key: 'POWERUP_PURCHASED',
            room
        }]);

        this.powerups[powerup] = 0;
    }

    send_data (data) {
        let msg = {
            type: 2,
            data,
            options: { 'compress': true },
            nsp :'/'
        };

        let encoded = join_buffers(new Uint8Array([4]), msgpack.encode(msg));
        this.socket.send(encoded);
    }
}

// Expose private variables globally
window.sockets = [];
window.msgpack = msgpack;

Session.hook([WebSocket.prototype, 'send'], function (args, func, options) {

    // Detect REDBOAT packets and prevent it from going through
    try {

        let decoded = msgpack.decode(args[0].slice(1)).data,
            type = decoded[0],
            data = decoded[1];
        
        if (this.player) this.player.handle_before_send(type, data);

        if (data.key.toLowerCase().includes('redboat')) {

            console.warn('Anti-cheat has been bypassed!');

            debugger;
            return;
        }

    } catch (e) {}
    
    let output = func.apply(this, args);
    
    return output;
});

Session.hook('WebSocket', function (args, func, options) {
    let socket;

    if (options.target) socket = new func(...args);
    else socket = func.apply(this, args);

    // Create new socket handler
    socket.player = new Player(socket);

    window.sockets.push(socket);
    return socket;
});