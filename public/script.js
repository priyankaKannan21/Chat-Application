
(function(){
    const app = document.querySelector(".app");
    const socket = io();

    let uName;

    app.querySelector(".join-screen #join-user").addEventListener("click", function(){
        let userName = app.querySelector(".join-screen #username").value;
        if(userName.length == 0){
            return;
        }
        renderMessage("update", "You joined the conversation");
        socket.emit("newuser", userName);
        uName = userName;
        app.querySelector(".join-screen").classList.remove("active")
        app.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click", function() {
        let message = app.querySelector(".chat-screen #message-input").value;
        if(message.length == 0){
            return;
        }
        renderMessage("my", {
            username: uName,
            text:message
        });
        socket.emit("chat",{
            username: uName,
            text:message
        });
        app.querySelector(".chat-screen #message-input").value = "";
        console.log(app.querySelector(".chat-screen #message-input").value);
        socket.emit("userStoppedTyping", '');
    });

    app.querySelector(".chat-screen #message-input").addEventListener("input", function(e){
        socket.emit("userTyping",uName);
        if(e.target.value === ''){
            socket.emit("userStoppedTyping", '');
        }
    })

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        socket.emit("exituser",uName);
        window.location.href = window.location.href;
    });

    socket.on("update", update => {
        renderMessage("update",update);
    });

    socket.on("chat", message => {
        renderMessage("other", message);
    });

    socket.on("userTyping", message => {
        renderMessage("userTyping", message);  
    });

    socket.on("userStoppedTyping", value => {
        renderMessage("userStoppedTyping", value);  
    });

    function renderMessage(type, message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        let today = new Date().toLocaleString();
        today = today.split(",")[1];
        let am_pm = parseInt(today.split(":")[0]) >= 12 ? "PM" : "AM";
        let hour = today.split(":")[0] % 12 || 12;
        let time = hour + ":" + today.split(":")[1] + am_pm;
        if(type == "my"){
            let chatMessage = document.createElement("div");
            chatMessage.setAttribute("class", "message my-message");
            
            chatMessage.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                    <div class="time">${time}</div>
                </div>
            `;
            messageContainer.appendChild(chatMessage);
        }else if(type == "other"){
            let chatMessage = document.createElement("div");
            chatMessage.setAttribute("class", "message other-message");
            chatMessage.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                    <div class="time">${time}</div>
                </div>
            `;
            messageContainer.appendChild(chatMessage);
        }else if(type == "update"){
            let updateMessage = document.createElement("div");
            updateMessage.setAttribute("class","update");
            updateMessage.innerText = message;
            messageContainer.appendChild(updateMessage);
        }else if(type == "userTyping"){
            document.querySelector(".typing").innerHTML = message;

        }else if(type == "userStoppedTyping"){
            document.querySelector(".chat-screen .typing").innerHTML = '';
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();