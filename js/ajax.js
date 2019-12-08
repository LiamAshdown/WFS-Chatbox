class Ajax
{
    /// @p_Url             : Url
    /// @p_Method          : Method
    /// @p_DataType        : Data Type
    /// @p_Data            : Data
    /// @p_Function        : Function
    constructor(p_Url, p_Method, p_SendDataType, p_RecieveDataType, p_Data, p_Function = null, p_Asynchronous = true)
    {
        this.Url             = p_Url;
        this.Method          = p_Method;
        this.SendDataType    = p_SendDataType;
        this.RecieveDataType = p_RecieveDataType;
        this.Data            = p_Data;
        this.Function        = p_Function;
        this.Asynchronous    = p_Asynchronous;
        
        this.ValidAjax       = true;
        this.XML             = new XMLHttpRequest();
        this.RequestHeader   = Array();

        if (this.FormHeaderMethod())
        {
            this.FormBody();
            this.Send();
        }
    }

    /// Set the header for the response
    FormHeaderMethod()
    {
        switch (this.Method)
        {
            case "GET": ///< Content in URL
            {
                var l_Address = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
                this.Url = l_Address + "/" + this.Url + '?' + this.Data;
            }
            break;
            case "POST": ///< Content in Data
            {
                /// Request Header (what the body will contain)
                if (this.SendDataType.toLowerCase() === "json")
                {
                    this.RequestHeader[0] = "Content-Type";
                    this.RequestHeader[1] = "application/json; charset=utf-8";
                }
                else
                {
                    this.RequestHeader[0] = "Content-Type";
                    this.RequestHeader[1] = "application/x-www-form-urlencoded";
                }
            }
            break;
            case "PATCH":
                break; ///< TODO
            default:
            {
                console.error("Ajax: Cannot form method. Method type is invalid.");
                return false;
            }
        }

        return true;
    }
    
    /// Sort the data into required method
    FormBody()
    {
        if (this.Method === "POST")
        {
            /// If the response is json, then convert the data into json response
            if (this.SendDataType == "json")
            {
                this.Data = this.ConvertToJson(this.Data);
            }
        }
        else if (this.Method === "GET")
        {
            /// Encode the data - the reason why we do this is because
            /// if the body contains special characters the browser
            /// will think it's a request and not text
            this.Data = encodeURI(this.Data);
        }
    }

    /// Send the data to the server
    Send()
    {
        this.XML.open(this.Method, this.Url, this.Asynchronous);

        /// Send our Request Headers (so server knows how to deal with the response)
        if (this.RequestHeader)
        {
            this.XML.setRequestHeader(this.RequestHeader[0], this.RequestHeader[1]);
        }

        /// Call function if one is provided
        if (this.Function)
        {
            this.XML.onreadystatechange = function(p_Event) {

                if (this.Ready())
                {
                    this.Function(p_Event);
                }

            }.bind(this);
        }

        /// We don't need to send seperate send function for POST and GET,
        /// as this function does the checking already inside
        this.XML.send(this.Data);
    }

    /// Convert the data into JSON
    ConvertToJson(p_Data)
    {
        /// Check if last character contains & if so remove it, as this will corrupt the json response
        if (p_Data.charAt(p_Data.length - 1) == '&') /// last character is a null terminator which is why we subtract one
        {
            p_Data.substr(0, p_Data.length - 1);
        }

        var l_Json   = {};
        var l_Hashes = p_Data.split('&');
        
        for (var l_I = 0; l_I < l_Hashes.length; l_I++)
        {
            var l_Hash = l_Hashes[l_I].split('=');
            l_Json[l_Hash[0]] = l_Hash[1];
        }

        return JSON.stringify(l_Json);
    }

    /// Check whether the response is ready to be processed
    Ready()
    {
        if (this.XML.readyState === XMLHttpRequest.DONE)
        {
            return true;
        }
    }

    /// Always call the function regardless if the status is successful or not
    /// @p_Function : Function which will be executed
    Always(p_Function)
    {
        return p_Function();
    }

    /// Call the function is success is false
    /// @p_Function : Function which will be executed
    Fail(p_Function)
    {
        if (!IsSuccess(this.XML.response)) 
        {
            return p_Function();
        }

        return null;
    }

    /// Call the function if success is true
    /// @p_Function : Function which will be executed
    Success(p_Function)
    {
        if (IsSuccess(this.XML.response)) 
        {
            return p_Function();
        }

        return null;
    }
}

/// Get Response content
/// @p_Event : XMLHTTPRequest
function GetResponse(p_Event)
{
    if (p_Event.getResponseHeader("Content-Type") === "application/json/charset=utf-8")
    {
        return JSON.parse(p_Event.response);
    }
    else
    {
        console.log("GetResponse: Recieved undefined Content-Type");

        return p_Event.response;
    }
}

/// Check whether HTTP Status is valid
/// @p_Event : XMLHTTPRequest
function IsValidHTTPStatus(p_Event)
{
    switch (p_Event.status)
    {
        case 409: ///< Conflict
        case 406: /// Not Acceptable
        case 200: ///< OK
        {
            return true;
        }
        break;
        default:
            return false;
        break;
    }
}

/// Get Status code
/// @p_Event : XMLHTTPRequest
function GetStatusCode(p_Event)
{
    return p_Event.status;
}

/// Check whether the response is a successful response or not
/// @p_Response : Response
function IsSuccess(p_Response)
{
    if (p_Response.success == "true" || p_Response.success == "1")
    {
        return true;
    }

    return false;
}