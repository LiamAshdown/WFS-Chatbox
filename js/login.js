var l_LoginAjax    = null;

/// Show and hide an element
/// @p_Hide : Element to hide
/// @p_Show : Element to show
function ShowElement(p_Hide, p_Show)
{
    $(p_Hide).GetId().GetElement().style.display = "none";
    $(p_Show).GetId().GetElement().style.display = "block";

    /// Register form has more fields - so increase the height size
    if (p_Show === "register-form")
    {
        $("#login-box").GetId().GetElement().style.height = "620px";
    }
    else ///< login form
    {
        $("login-box").GetId().GetElement().style.height = "500px";
    }
}

/// Submit Listener
/// @p_Event : Event of form
/// @p_Form  : SteerForm class
$("#login-form").Submit(function(p_Event, p_Form)
{
    /// If true, means we are already in the process of sending an AJAX request
    if (l_LoginAjax)
    {
        return;
    }

    /// Disable login action
    p_Event.preventDefault();

    /// Get the inputs
    var l_Inputs = p_Form.Inputs("text, password");

    /// Set the inputs disabled
    l_Inputs.SetAttribute("disabled", true);

    l_LoginAjax = new Ajax("Server/Login.php", "POST", "text", "json", l_Inputs.GetValues(), function(p_Event) 
    {
        if (IsValidHTTPStatus(p_Event.target))
        {
            var l_Response = GetResponse(p_Event.target);

            if (IsSuccess(l_Response))
            {
                /// Store username
                sessionStorage.setItem("username", $("#login-username").GetId().GetElement().value);

                window.location.href = "index.php"; ///< Redirect to Messenger.php (chat box)   
            }
            else 
            {
                document.getElementById("requirement-login").innerHTML = l_Response.data.error_message;
            }
        }
    });

    /// Re-enable the inputs
    l_LoginAjax.Always(function () {
        l_Inputs.SetAttribute("disabled", false);
    });
});

/// Submit Listener
/// @p_Event : Event of form
/// @p_Form  : SteerForm class
$("#register-form").Submit(function(p_Event, p_Form)
{
    /// If true, means we are already in the process of sending an AJAX request
    if (l_LoginAjax)
    {
        return;
    }

    /// Disable login action
    p_Event.preventDefault();

    /// Get the inputs
    var l_Inputs = p_Form.Inputs("text, password");

    /// Set the inputs disabled
    l_Inputs.SetAttribute("disabled", true);

    l_LoginAjax = new Ajax("Server/Login.php", "POST", "text", "json", l_Inputs.GetValues(), function(p_Event) 
    {
        if (IsValidHTTPStatus(p_Event.target))
        {
            var l_Response = GetResponse(p_Event.target);

            if (IsSuccess(l_Response))
            {
                window.location.href = "index.php";
            }
            else 
            {
                switch(l_Response.data.error)
                {
                    case 0: ///< Account created
                    {
                        /// Store username
                        sessionStorage.setItem("username", $("#register-username").GetId().GetElement().value);

                        window.location.href = "index.php";
                    }
                    break;
                    case 1: ///< Username error
                        $("#requirement-username").GetId().GetElement().innerHTML        = l_Response.data.error_message;
                        break;
                    case 2: ///< Password Error
                        $("#requirement-password").GetId().GetElement().innerHTML        = l_Response.data.error_message;
                        break;
                    case 3: ///< Confirm Password Error
                        $("#requirement-confirmpassword").GetId().GetElement().innerHTML = l_Response.data.error_message;
                        break;
                    case 4: ///< Account already exists
                        $("#requirement-username").GetId().GetElement().innerHTML        = l_Response.data.error_message;
                        break;
                }    
            } 
        }
    });

    /// Re-enable the inputs
    l_LoginAjax.Always(function () {
        l_Inputs.SetAttribute("disabled", false);

        /// Reenable form
        l_LoginAjax = null;
    });
});