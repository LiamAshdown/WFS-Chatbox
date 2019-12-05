var l_MessageCount = 0; ///< This is used to determine whether messages has been updated

/// Set scroll bar at the bottom chat
/// TODO; Find better way of handling this
setTimeout(function(){
    $('#chatter').scrollTop(1E10);
   }, 300);

/// Get User List
function GetUsers()
{      
    var l_Request = $.ajax({
        url: "Server/Messenger.php",
        type: "get",
        dataType: 'json',
        data:  "GetUserList",
        success: function(l_Json) {

            if (!l_Json.data.length)
            {
                return;
            }

            var l_List = document.getElementById("users").getElementsByTagName("ul")[0];
            l_List.innerHTML = ""; ///< Clear list

            for (var l_I = 0; l_I < l_Json.data.length; l_I++)
            {
                var l_Id       = l_Json.data[l_I].id;
                var l_Username = l_Json.data[l_I].username;

                var l_Row         = document.createElement("li");
                l_Row.textContent = l_Username + " (Id: " + l_Id + ")";

                l_List.appendChild(l_Row);
            }
        }
    });
}

/// Validate the session
function ValidateSession()
{
    var l_Request = $.ajax({
        url: "Server/Messenger.php",
        type: "get",
        dataType: 'json',
        data:  "ValidateSession",
        success: function(l_Json) {
            if (l_Json.message == 1) ///< Invalid session
            {
                location.reload();
            }
        }
    });
}

function GetMessages()
{
    var l_Request = $.ajax({
        url: "Server/Messenger.php",
        type: "get",
        dataType: 'json',
        data:  "GetMessages",
        success: function(l_Json) {

            /// Don't update message if there's no data
            if (!l_Json.data.length)
            {
                return;
            }

            /// If the message count is the same, don't update the message
            if (l_MessageCount == l_Json.data.length)
            {
                return;
            }
            else
            {
                l_MessageCount = l_Json.data.length;
            }

            var l_List = document.getElementById("chatter").getElementsByTagName("ul")[0];
            l_List.innerHTML = ""; ///< Clear list

            for (var l_I = 0; l_I < l_Json.data.length; l_I++)
            {
                var l_Id       = l_Json.data[l_I].id;
                var l_Username = l_Json.data[l_I].username;
                var l_Message  = l_Json.data[l_I].message;

                var l_Row = document.createElement("li");
                l_Row.textContent = "[" + l_Username + "]: " + l_Message;

                /// Every second row change colour - for easy readability
                if (l_I % 2)
                {

                    l_Row.style.background="#DCDCDC";
                }

                l_List.appendChild(l_Row);
            }

            /// Automatically scroll down when recieve new message
            var l_ScrollTop = document.getElementById("chatter").scrollTop;
            var l_ScrollHeight = document.getElementById("chatter").scrollHeight;
            var l_Total = Math.abs(l_ScrollTop - l_ScrollHeight);

            /// Thresh-hold incase the user wants to see previous messages
            if (l_Total <= 475)
            {
                document.getElementById("chatter").scrollTop = l_ScrollHeight;
            }
        }
    });
}

/// Listener for messenger form
$("#messenger-form").submit(function(p_Event) {

    p_Event.preventDefault();

    var l_MessageInput = document.getElementById("send-message");

    var l_Request = $.ajax({
        url: "Server/Messenger.php",
        type: "post",
        dataType: 'json',
        data:  $(this).serialize(),
        success: function(l_Json) {
            switch (parseInt(l_Json.message))
            {
                case 1: ///< Logout user
                    location.reload();
                    break;
                default:
                    l_MessageInput.value = "";
                    /// Set Input field focused again
                    l_MessageInput.focus();
                    l_MessageInput.scrollIntoView();
                    /// Automatically scroll down when user sends message
                    document.getElementById("chatter").scrollTop = document.getElementById("chatter").scrollHeight;
        
                    /// Get new message for instant feed back
                    GetMessages();
                    break;
            }
        }
    });
});

///////////////////////////////////////////
//              INTERVALS
///////////////////////////////////////////
setInterval(GetUsers, 1000);
setInterval(GetMessages, 1000);
setInterval(ValidateSession, 5000);