var l_LoginForm    = document.getElementById("login-form");
var l_RegisterForm = document.getElementById("register-form");
var l_LoginAjax    = null;
var l_RegisterAjax = null;


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

if (l_RegisterForm)
{
    l_RegisterForm.addEventListener("submit", function(p_RegisterForm)
    {
        p_RegisterForm.preventDefault();

        l_Elements = FindElements("text,password", l_RegisterForm);

        ChangeBoolElement("disabled", true, l_Elements);

        l_RegisterAjax = new Ajax("Server/Login.php", "POST", "text", "json", GetURLDataFromForm(l_RegisterForm, "text,password"), function(p_Event) 
        {
            if (Ready(p_Event.target))
            {
                if (CheckHTTPStatus(p_Event.target))
                {
                    var l_Response = GetResponse(p_Event.target);

                    if (!IsSuccess(l_Response))
                    {
                        switch(l_Response.data.error)
                        {
                            case 0: ///< Account created
                                window.location.href = "index.php";
                                break;
                            case 1: ///< Username error
                                document.getElementById("requirement-username").innerHTML = l_Response.data.error_message;
                                break;
                            case 2: ///< Password Error
                                document.getElementById("requirement-password").innerHTML = l_Response.data.error_message;
                                break;
                            case 3: ///< Confirm Password Error
                                document.getElementById("requirement-confirmpassword").innerHTML = l_Response.data.error_message;
                                break;
                            case 4: ///< Account already exists
                                document.getElementById("requirement-username").innerHTML = l_Response.data.error_message;
                                break;
                        }
                        
                    }
                }
            }
        });
    
        l_RegisterAjax.Always(function () {
            ChangeBoolElement("disabled", false, l_Elements);
        });
    });
}

if (l_LoginForm)
{
    l_LoginForm.addEventListener("submit", function(p_LoginForm)
    {
        p_LoginForm.preventDefault();

        l_Elements = FindElements("text,password", l_LoginForm);

        ChangeBoolElement("disabled", "true", l_Elements);

        l_LoginAjax = new Ajax("Server/Login.php", "POST", "text", "json", GetURLDataFromForm(l_LoginForm, "text,password"), function(p_Event) 
        {
            if (Ready(p_Event.target))
            {
                if (CheckHTTPStatus(p_Event.target))
                {
                    var l_Response = GetResponse(p_Event.target);
    
                    if (IsSuccess(l_Response))
                    {
                        window.location.href = "index.php";     
                    }
                    else 
                    {
                        document.getElementById("requirement-login").innerHTML = l_Response.data.error_message;
                    }
                }
            }
        });
    
        l_LoginAjax.Always(function () {
            ChangeBoolElement("disabled", false, l_Elements);
        });
    });
}