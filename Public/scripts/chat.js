function Chat(host) {
    var chat = this;
	var name = '';
    chat.ws = new WebSocket('ws://' + host);
    chat.ws.onopen = function() {
        chat.askUsername();
	chat.askChatname();
    };

	chat.askUsername = function() {
        name = prompt('Enter your TextCast UserName:');
	chat.join(name);
    }
	chat.askChatname = function() {
        chat_name = prompt('Enter your Log name:');
	chat.join_name(chat_name);
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

   $('form').on('log', function(e) {
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

    chat.join_name = function(name) {
        chat.ws.send(JSON.stringify({
            'chat_name': name
        }));
    }


	chat.join = function(name) {
        chat.ws.send(JSON.stringify({
            'username': name
        }));
    }
};
