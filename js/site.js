///////////////////////////////////////////
//          GLOBAL VARIABLES
///////////////////////////////////////////
var l_MessageCount = 0; ///< This is used to determine whether messages has been updated

///////////////////////////////////////////
//              LOGIN.PHP
///////////////////////////////////////////

/// Show and hide an element
/// @p_Hide : Element to hide
/// @p_Show : Element to show
function ShowElement(p_Hide, p_Show)
{
    document.getElementById(p_Hide).style.display = "none";
    document.getElementById(p_Show).style.display = "block";

    /// Register form has more fields - so increase the height size
    if (p_Show === "register-form")
    {
        document.getElementById("login-box").style.height = "620px";
    }
    else ///< login form
    {
        document.getElementById("login-box").style.height = "500px";
    }
}

/// Validate username
/// @p_Username : Username being checked
function ValidateUsername(p_Username)
{
    var l_Requirement       = document.getElementById("requirement-username");
    var l_SpecialCharacters = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    if (p_Username != "" && p_Username.length < 3)
    {
        l_Requirement.innerHTML = "Username must be longer than 3 characters!";

        return false;
    }
    else if (p_Username.length > 30)
    {
        l_Requirement.innerHTML = "Username must not be larger than 30 characters!"

        return false;
    }
    else if (l_SpecialCharacters.test(p_Username))
    {
        l_Requirement.innerHTML = "Username must not contain any special characters!";

        return false;
    }
    else
    {
        l_Requirement.innerHTML = "";
    }

    return true;
}

/// Validate password
/// @p_Password : Password being checked
function ValidatePassword(p_Password)
{
    var l_Requirement   = document.getElementById("requirement-password");
    var l_Numbers       = /[0-9]/;

    if (p_Password != "" && p_Password.length < 3)
    {
        l_Requirement.innerHTML = "Password must be longer than 3 characters!";

        return false;
    }
    else if (p_Password.length > 30)
    {
        l_Requirement.innerHTML = "Password must not be larger than 30 characters!";

        return false;
    }
    else if (!l_Numbers.test(p_Password))
    {
        l_Requirement.innerHTML = "Password must atleast contain 1 number!";

        return false;
    }
    else
    {
        l_Requirement.innerHTML = "";
    }

    return true;
}

/// Validate confirm password
/// @p_ConfirmPassword : Confirm Password being checked
function ValidateConfirmPassword(p_ConfirmPassword)
{
    var l_Password    = document.getElementById("register-password");
    var l_Requirement = document.getElementById("requirement-confirmpassword");
    if (l_Password.value != p_ConfirmPassword)
    {
        l_Requirement.innerHTML = "Confirm password does not match password!";

        return false;
    }
    else
    {
        l_Requirement.innerHTML = "";
    }

    return true;
}

/// Validate all input fields before sending post request
function ValidateRegisterForm()
{
    var l_Username        = document.getElementById("register-username");
    var l_Password        = document.getElementById("register-password");
    var l_ConfirmPassword = document.getElementById("register-confirmpassword");

    /// Prevent post request if any of the validations are invalid
    if (!ValidateUsername(l_Username.value) || !ValidatePassword(l_Password.value) || !ValidateConfirmPassword(l_ConfirmPassword.value))
    {
        return false;
    }
    
    return true;
}

/// Listener for Register form
$("#register-form").submit(function(p_Event) {

    p_Event.preventDefault();

    /// Check if all inputs are valid before we send AJAX request
    if (!ValidateRegisterForm())
    {
        return;
    }

    /// Get our inputs
    var $l_Inputs = $(this).find("input");

    /// Serialize our inputs
    var l_SerializeData = $(this).serialize();

    /// Disable the form inputs
    $l_Inputs.prop("disabled", true);

    var l_Request = $.ajax({
        url: "Server/Login.php",
        type: "post",
        dataType: 'json',
        data:  l_SerializeData,
        success: function(l_Json) {
            switch(l_Json.data.error)
            {
                case 0: ///< Account created
                    window.location.href = "index.php";
                    break;
                case 1: ///< Username error
                    document.getElementById("requirement-username").innerHTML = l_Json.data.error_message;
                    break;
                case 2: ///< Password Error
                    document.getElementById("requirement-password").innerHTML = l_Json.data.error_message;
                    break;
                case 3: ///< Confirm Password Error
                    document.getElementById("requirement-confirmpassword").innerHTML = l_Json.data.error_message;
                    break;
                case 4: ///< Account already exists
                    document.getElementById("requirement-username").innerHTML = l_Json.data.error_message;
                    break;
            }
        },
        error: function(data) {
            /// TODO; Log something here?
        }
    });

    l_Request.always(function () {
        // Reenable the inputs
        $l_Inputs.prop("disabled", false);
    });
});

/// Listener for Login form
$("#login-form").submit(function(p_Event) {

    p_Event.preventDefault();

    /// Get our inputs
    var $l_Inputs = $(this).find("input");

    /// Serialize our inputs
    var l_SerializeData = $(this).serialize();

    /// Disable the form inputs
    $l_Inputs.prop("disabled", true);

    var l_Request = $.ajax({
        url: "Server/Login.php",
        type: "post",
        dataType: 'json',
        data:  l_SerializeData,
        success: function(l_Json) {
            switch(l_Json.data.error)
            {
                case 0: ///< successfully logged in
                    window.location.href = "index.php";
                    break;
                case 1: ///< Incorrect account details
                    document.getElementById("requirement-login").innerHTML = l_Json.data.error_message;
                    break;
            }
        },
        error: function(data) {
            /// TODO; Log something here?
        }
    });

    l_Request.always(function () {
        // Reenable the inputs
        $l_Inputs.prop("disabled", false);
    });
});

///////////////////////////////////////////
//              MESSENGER.PHP
///////////////////////////////////////////

/// Get User List
function GetUsers()
{
    var l_Request = $.ajax({
        url: "Server/Messenger.php",
        type: "get",
        dataType: 'json',
        data:  "GetUserList",
        success: function(l_Json) {

            /// Reload webpage if our session is invalid (checks are done on server-side on User and message interval function)
            if (l_Json.message === "INVALID_SESSION")
            {
                location.reload();
            }

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
        },
        error: function(data) {
            /// TODO; Log something here?
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

            /// Reload webpage if our session is invalid (checks are done on server-side on User and message interval function)
            if (l_Json.message === "INVALID_SESSION")
            {
                location.reload();
            }

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
        },
        error: function(data) {
            /// TODO; Log something here?
        }
    });
}

/// Listener for messenger form
$("#messenger-form").submit(function(p_Event) {

    p_Event.preventDefault();

    /// Get our inputs
    var $l_Inputs = $(this).find("input");

    /// Serialize our inputs
    var l_SerializeData = $(this).serialize();

    var l_Request = $.ajax({
        url: "Server/Messenger.php",
        type: "post",
        dataType: 'json',
        data:  l_SerializeData,
        success: function(l_Json) {
            document.getElementById("send-message").value = "";
            /// Set Input field focused again
            document.getElementById("send-message").focus();
            document.getElementById("send-message").scrollIntoView();
            /// Automatically scroll down when user sends message
            document.getElementById("chatter").scrollTop = document.getElementById("chatter").scrollHeight;

            /// Get new message for instant feed back
            GetMessages();
        },
        error: function(data) {
            /// TODO; Log something here?
        }
    });
});

///////////////////////////////////////////
//              INTERVALS
///////////////////////////////////////////
setInterval(GetUsers, 1000);
setInterval(GetMessages, 1000);