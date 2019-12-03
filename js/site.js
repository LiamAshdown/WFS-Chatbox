/// Show and hide an element
/// @p_Hide : Element to hide
/// @p_Show : Element to show
function ShowElement(p_Hide, p_Show)
{
    document.getElementById(p_Hide).style.display = "none";
    document.getElementById(p_Show).style.display = "block";
}

/// Validate username
/// @p_Username : Username being checked
function ValidateUsername(p_Username)
{
    var l_Requirement = document.getElementById("requirement-username");
    var l_UsernameInput = document.getElementById("register-username");

    if (p_Username.length < 3)
    {
        l_UsernameInput.style.height += "100px";
        l_UsernameInput.style.align = "0";
        l_Requirement.innerHTML = "wtf";
    }
    else
    {
        l_Requirement.innerHTML = "";
    }
}