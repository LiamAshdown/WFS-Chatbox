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