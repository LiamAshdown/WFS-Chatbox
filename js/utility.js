/// Get URL data from input
/// @p_Input : Input
function GetURLDataFromInput(p_Input)
{
    return p_Input + "=" + document.getElementById(p_Input).value;
}

function GetURLDataFromForm(p_Form, p_Types)
{
    var l_Data = "";
    var l_Types = p_Types.split(',');

    for (var l_I = 0; l_I < p_Form.elements.length; l_I++) 
    {
        var l_Element = p_Form.elements[l_I];
        for (var l_J = 0; l_J < l_Types.length; l_J++)
        {
            if (l_Element.type == l_Types[l_J])
            {
                l_Data = l_Data + l_Element.id + '=' + l_Element.value + '&';
            }
        }
    }

    return l_Data;
}

/// Find elements by specific type
/// @p_Types : Types
/// @p_Form : Form being searched
function FindElements(p_Types, p_Form)
{
    var l_Elements = Array();
    var l_Types = p_Types.split(',');

    for (var l_I = 0; l_I < p_Form.elements.length; l_I++) 
    {
        var l_Element = p_Form.elements[l_I];
        console.log(l_Element);
        for (var l_J = 0; l_J < l_Types.length; l_J++)
        {
            console.log(l_Types[l_J]);
            if (l_Element.type == l_Types[l_J])
            {
                l_Elements.push(l_Element);
            }
        }
    }

    return l_Elements;
}

/// Change element behaviour
/// @p_Change   : Type of change
/// @p_Value    : Enable or disable the change
/// @p_Elements : Elements array
function ChangeBoolElement(p_Change, p_Value, p_Elements)
{
    for (var l_I = 0; l_I < p_Elements.length; l_I++)
    {
        if (p_Value == false)
        {
            p_Elements[l_I].removeAttribute(p_Change);
        }
        else 
        {
            p_Elements[l_I].setAttribute(p_Change, true);
        }

    }
}