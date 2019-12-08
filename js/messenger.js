var l_MessageCount          = 0; ///< This is used to determine whether messages has been updated
var l_SubmitMessageAjax     = null;

$(document).Ready(function() {

    /// Bring scroll bar to bottom of chat
    $("#chatter").Animate(500, 0, 0, function(p_Animate, p_Element) {
        p_Element.Id.scrollTop = p_Element.Id.scrollHeight;

        if (p_Element.Id.scrollTop > 0)
        {
            return false;
        }

        return true;
    });
});

/// Validate the session
function ValidateSession()
{
    new Ajax("Server/Messenger.php", "GET", "text", "json", "ValidateSession", function(p_Event) 
    {
        if (IsValidHTTPStatus(p_Event.target))
        {
            var l_Response = GetResponse(p_Event.target);

            if (!IsSuccess(l_Response))
            {
                location.reload();
            }
        }
    });
}

/// Get User List
function GetUsers()
{      
    new Ajax("Server/Messenger.php", "GET", "text", "json", "GetUserList", function(p_Event) 
    {
        if (IsValidHTTPStatus(p_Event.target))
        {
            var l_Response = GetResponse(p_Event.target);

            if (IsSuccess(l_Response))
            {
                /// Don't update if there's no data
                if (!l_Response.data.length)
                {
                    return;
                }
    
                var l_List = $("#users").GetId().GetElement().getElementsByTagName("ul")[0];

                l_List.innerHTML = ""; ///< Clear list
    
                for (var l_I = 0; l_I < l_Response.data.length; l_I++)
                {
                    var l_Id       = l_Response.data[l_I].id;
                    var l_Username = l_Response.data[l_I].username;
    
                    var l_Row         = document.createElement("li");
                    l_Row.className += "profile-tooltip";
                    l_Row.textContent = l_Username + " (Id: " + l_Id + ")"
                    
                    var l_Span = document.createElement("span");
                    l_Span.className += "profile-tooltip-dialog";
                    l_Span.textContent = "testinh ello";
                    l_Row.appendChild(l_Span);
    
                    l_List.appendChild(l_Row);
                }
            }
            else 
            {
                console.log("Failed to get user list");
            }
        }
    });
}

function GetMessages()
{
    new Ajax("Server/Messenger.php", "GET", "text", "json", "GetMessages", function(p_Event) 
    {
        if (IsValidHTTPStatus(p_Event.target))
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

                var l_List = $("#chatter").GetId().GetElement().getElementsByTagName("ul")[0];
                l_List.innerHTML = ""; ///< Clear list

                for (var l_I = 0; l_I < l_Response.data.length; l_I++)
                {
                    var l_Id       = l_Response.data[l_I].id;
                    var l_ToId     = l_Response.data[l_I].to_id;
                    var l_Username = l_Response.data[l_I].username;
                    var l_Message  = l_Response.data[l_I].message;

                    var l_Row = document.createElement("li");

                    if (l_ToId != 0)
                    {
                        l_Row.innerHTML = "[" + l_Username + "]: " + l_Message;
                    }
                    else 
                    {
                        l_Row.textContent = "[" + l_Username + "]: " + l_Message;
                    }


                    /// Every second row change colour - for easy readability
                    if (l_I % 2)
                    {
                        l_Row.style.background = "#DCDCDC";
                    }

                    l_List.appendChild(l_Row);
                }

                /// Automatically scroll down when recieve new message
                var l_ScrollTop = $("#chatter").GetId().GetElement().scrollTop;
                var l_ScrollHeight = $("#chatter").GetId().GetElement().scrollHeight;
                $("#chatter").GetId().GetElement().scrollTop = l_ScrollHeight;
            }
            else
            {
                console.log("Failed to retrieve messages");
            }
        }
        
    });
}

$("#messenger-form").Submit(function(p_Event, p_Form)
{
    /// If true, means we are already in the process of sending an AJAX request
    if (l_SubmitMessageAjax)
    {
        return;
    }

    p_Event.preventDefault();

    var l_Input = $("#send-message").GetId();

    /// Don't send if message is empty
    if (l_Input.GetElement().value == "")
    {
        return;
    }

    l_Input.SetAttribute("disabled", true);

    l_SubmitMessageAjax = new Ajax("Server/Messenger.php", "POST", "text", "json", l_Input.GetValue(), function(p_Event) 
    {
        if (IsValidHTTPStatus(p_Event.target))
        {
            var l_Response = GetResponse(p_Event.target);

            switch (parseInt(l_Response.message))
            {
                case 1: ///< Logout user
                location.reload();
                break;
                default:
                {
                    var l_MessageInput = $("#send-message").GetId().GetElement();

                    /// Empty the value
                    l_MessageInput.value = "";

                    /// Set Input field focused again
                    l_MessageInput.focus();
                    l_MessageInput.scrollIntoView();

                    /// Automatically scroll down when user sends message
                    $("#chatter").GetId().GetElement().scrollTop = $("#chatter").GetId().GetElement().scrollHeight;
        
                    /// Get new message for instant feed back
                    GetMessages();
                    break;
                }
            }
        }
    });

    /// Re-enable the inputs
    l_SubmitMessageAjax.Always(function () {
        l_Input.RemoveAttribute("disabled");

        /// Renable form
        l_SubmitMessageAjax = null;
    });
});


///////////////////////////////////////////
//              INTERVALS
///////////////////////////////////////////
setInterval(GetUsers, 1000);
setInterval(GetMessages, 1000);
setInterval(ValidateSession, 5000);