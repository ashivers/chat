function Chat(host) {
    var chat = this;
	var name = '';
    chat.ws = new WebSocket('ws://' + host);
    chat.ws.onopen = function() {
        chat.askUsername();
    };

	chat.askUsername = function() {
        name = prompt('Enter you TextCast UserName:');

        $.get('https://api.github.com/users/' + name, function(data) {
            chat.join(name);
        }).fail(function() {
            alert('Invalid username');
            chat.askUsername();
        });
    }

    chat.imageCache = {};

    $('form').on('submit', function(e) {
        e.preventDefault();

        var message = $('.message-input').val();

        if (message.length == 0 || message.length >= 256) {
            return;
        }

        chat.send(message);
        $('.message-input').val('');
    });

    chat.ws.onmessage = function(event) {
        var message = JSON.parse(event.data);
        console.log('[' + name + '] ' + message);
        chat.bubble(message.message, message.username);
    }

    chat.send = function(message) {
        chat.ws.send(JSON.stringify({
            'message': message
        }));

        chat.bubble(message);
    }

    chat.bubble = function(message, username) {
        var bubble = $('<div>')
            .addClass('message')
            .addClass('new');

        if (username) {
            var lookup = username;

            if (lookup == 'Bot') {
                lookup = 'qutheory';
            }
            bubble.attr('data-username', lookup);
	}

        var text = $('<span>')
            .addClass('text');

        if (username) {
            text.text(username + ': ' + message);
        } else {
           bubble.addClass('personal');
	console.log(name);
            text.text(name+': '+message);
       }


        bubble.append(text);


        $('.messages').append(bubble);

        var objDiv = $('.messages')[0];
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    chat.join = function(name) {
        chat.ws.send(JSON.stringify({
            'username': name
        }));
    }
};
