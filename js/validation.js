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
