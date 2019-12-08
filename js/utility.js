/// https://gist.github.com/joyrexus/7307312
/// http://youmightnotneedjquery.com/

class SteerDocument
{
    /// Constructor
    /// @p_Document
    constructor(p_Document)
    {
        this.Document = p_Document;
    }

    /// Is Document ready
    IsReady()
    {
        return this.Document.readyState === 'complete';
    }

    /// Listener for ready
    /// @p_Function : Function which will be executed
    Ready(p_Function)
    {
        this.Document.addEventListener('DOMContentLoaded', function() {
            p_Function();
        });
    }
}

class SteerElement
{
    /// Constructor
    /// @p_Element : Element
    constructor(p_Element)
    {
        this.Element = p_Element;
    }

    /// Set Attribute
    /// @p_Attribute : Type of attribute
    /// @p_Value     : Value
    SetAttribute(p_Attribute, p_Value)
    {
        this.Element.setAttribute(p_Attribute, p_Value);
    }

    /// Remove Attribute
    /// @p_Attribute
    RemoveAttribute(p_Attribute)
    {
        this.Element.removeAttribute(p_Attribute);
    }

    /// Get Value from element
    GetValue()
    {
        return this.Element.id + "=" + this.Element.value;
    }

    /// Get Element property
    GetElement()
    {
        return this.Element;
    }
}

class SteerElements
{
    /// Constructor
    /// @p_Elements : Elements
    constructor(p_Elements)
    {
        this.Elements = p_Elements;
    }

    /// Set Attribute
    /// @p_Attribute : Type of attribute
    /// @p_Value     : Value
    SetAttribute(p_Attribute, p_Value)
    {
        for (var l_I = 0; l_I < this.Elements.length; l_I++)
        {
            if (p_Value == false)
            {
                this.Elements[l_I].removeAttribute(p_Attribute);
                continue;
            }

            this.Elements[l_I].setAttribute(p_Attribute, p_Value);
        }
    }

    /// Remove Attribute
    /// @p_Attribute
    RemoveAttribute(p_Attribute)
    {
        for (var l_I = 0; l_I < this.Elements.length; l_I++)
        {
            this.Elements[l_I].removeAttribute(p_Attribute);
        }
    }

    /// Get Values from elements
    GetValues()
    {
        var l_Data = "";
        for (var l_I = 0; l_I < this.Elements.length; l_I++) 
        {
            l_Data = l_Data + this.Elements[l_I].id + '=' + this.Elements[l_I].value + '&';
        }
    
        return l_Data;
    }
}

class Steer
{
    /// Constructor
    /// @p_Id : Document Id
    constructor(p_Id)
    {
        this.Id = new SteerElement(document.getElementById(p_Id));
    }

    /// Listener for submit
    /// @p_Function : Function which will be executed
    Submit(p_Function)
    {
        this.Id.Element.addEventListener("submit", function(p_Event) { 
            p_Function(p_Event, this);
        }.bind(this));
    }

    /// Listener for click
    /// @p_Function : Function which will be executed
    Click(p_Function)
    {
        this.Id.Element.addEventListener("click", function(p_Event) {
            p_Function(p_Event, this);
        }).bind(this);
    }

    /// Animate
    /// @p_Interval : Interval
    /// @p_X        : X
    /// @p_Y        : Y
    /// @p_Function : Function which will be executed
    Animate(p_Interval, p_X, p_Y, p_Function)
    {
        var l_Animate = 
        { 
             X: p_X,
             Y: p_Y, 
             CurrentX: "0", 
             CurrentY: "0" 
        };

        var l_Interval = setInterval(function() {
            if (!p_Function(l_Animate, this))
            {
                clearInterval(l_Interval);
            }
        }.bind(this), p_Interval);
    }

    /// Access Id Element property
    GetId()
    {
        return this.Id;
    }

    /// Get Inputs from form
    /// @p_Types : Types of inputs to search for
    Inputs(p_Types)
    {
        var l_Elements = Array();
        
        /// Remove white spaces
        p_Types = p_Types.replace(/\s/g, '');

        var l_Types = p_Types.split(',');
    
        for (var l_I = 0; l_I < this.Id.Element.elements.length; l_I++) 
        {
            var l_Element = this.Id.Element.elements[l_I];
            for (var l_J = 0; l_J < l_Types.length; l_J++)
            {
                if (l_Element.type == l_Types[l_J])
                {
                    l_Elements.push(l_Element);
                }
            }
        }
    
        return new SteerElements(l_Elements);
    }
}

/// Get Element Id
/// @p_Id : Id element
function $(p_Id) 
{
    /// Id element
    if (p_Id.toString().charAt(0) == "#")
    {
        return new Steer(p_Id.toString().substring(1));
    }
    /// Global Document
    else if (p_Id == "[object HTMLDocument]")
    {
        return new SteerDocument(document);
    }

    return new Steer(p_Id); 
}