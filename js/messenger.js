var l_MessageCount          = 0; ///< This is used to determine whether messages has been updated
var l_GetUsersAjax          = null;
var l_ValidateSessionAjax   = null;
var l_GetMessagesAjax       = null;
var l_SubmitMessageAjax     = null;
var l_MessengerForm         = document.getElementById("messenger-form");

/// Get User List
function GetUsers()
{      
    l_GetUsersAjax = new Ajax("Server/Messenger.php", "GET", "text", "json", "GetUserList", function(p_Event) 
    {
        if (Ready(p_Event.target))
        {
            if (CheckHTTPStatus(p_Event.target))
            {
                var l_Response = GetResponse(p_Event.target);

                if (IsSuccess(l_Response))
                {
                    if (!l_Response.data.length)
                    {
                        return;
                    }
        
                    var l_List = document.getElementById("users").getElementsByTagName("ul")[0];
                    l_List.innerHTML = ""; ///< Clear list
        
                    for (var l_I = 0; l_I < l_Response.data.length; l_I++)
                    {
                        var l_Id       = l_Response.data[l_I].id;
                        var l_Username = l_Response.data[l_I].username;
        
                        var l_Row         = document.createElement("li");
                        l_Row.textContent = l_Username + " (Id: " + l_Id + ")";
        
                        l_List.appendChild(l_Row);
                    }
                }
            }
        }
    });
}

/// Validate the session
function ValidateSession()
{
    l_ValidateSessionAjax = new Ajax("Server/Messenger.php", "GET", "text", "json", "ValidateSession", function(p_Event) 
    {
        if (Ready(p_Event.target))
        {
            if (CheckHTTPStatus(p_Event.target))
            {
                var l_Response = GetResponse(p_Event.target);

                if (!IsSuccess(l_Response))
                {
                    location.reload();
                }
            }
        }
    });
}

function GetMessages()
{
    l_GetMessagesAjax = new Ajax("Server/Messenger.php", "GET", "text", "json", "GetMessages", function(p_Event) 
    {
        if (Ready(p_Event.target))
        {
            if (CheckHTTPStatus(p_Event.target))
            {
                var l_Response = GetResponse(p_Event.target);

                if (IsSuccess(l_Response))
                {
                    /// Don't update message if there's no data
                    if (!l_Response.data.length)
                    {
                        return;
                    }

                    /// If the message count is the same, don't update the message
                    if (l_MessageCount == l_Response.data.length)
                    {
                        return;
                    }
                    else
                    {
                        l_MessageCount = l_Response.data.length;
                    }

                    var l_List = document.getElementById("chatter").getElementsByTagName("ul")[0];
                    l_List.innerHTML = ""; ///< Clear list

                    for (var l_I = 0; l_I < l_Response.data.length; l_I++)
                    {
                        var l_Id       = l_Response.data[l_I].id;
                        var l_Username = l_Response.data[l_I].username;
                        var l_Message  = l_Response.data[l_I].message;

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
            }
        }
    });
}

if (l_MessengerForm)
{
    l_MessengerForm.addEventListener("submit", function(p_MessengerForm)
    {
        p_MessengerForm.preventDefault();

        l_SubmitMessageAjax = new Ajax("Server/Messenger.php", "POST", "text", "json", GetURLDataFromForm(l_MessengerForm, "text,password"), function(p_Event) 
        {
            if (Ready(p_Event.target))
            {
                if (CheckHTTPStatus(p_Event.target))
                {
                    var l_Response = GetResponse(p_Event.target);

                    if (IsSuccess(l_Response))
                    {
                        switch (parseInt(l_Response.message))
                        {
                            case 1: ///< Logout user
                                location.reload();
                                break;
                            default:
                            {
                                var l_MessageInput = document.getElementById("send-message");

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
                    }
                }
            }
        });

    });
}

///////////////////////////////////////////
//              INTERVALS
///////////////////////////////////////////
setInterval(GetUsers, 1000);
setInterval(GetMessages, 1000);
setInterval(ValidateSession, 5000);