class Ajax
{
    /// @p_Url             : Url
    /// @p_Method          : Method
    /// @p_SendDataType    : Send Data Type
    /// @p_RecieveDataType : Recieve Data Type
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
        
        this.ValidAjax     = true;
        this.XML           = new XMLHttpRequest();
        this.RequestHeader = Array();

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
                break;
            default:
            {
                console.error("Ajax: Cannot form method. Method type is invalid.");
                return false;
                break;
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

        /// Apply our request headers, since we are dealing with
        /// Ajax we need to send our own header
        if (this.RequestHeader)
        {
            this.XML.setRequestHeader(this.RequestHeader[0], this.RequestHeader[1]);
        }

        /// Call function if one is provided
        if (this.Function)
        {
            this.XML.onreadystatechange = this.Function;
        }

        /// We don't need to send seperate send function for POST and GET,
        /// as this function does the checking already
        this.XML.send(this.Data);
    }

    ConvertToJson(p_Data)
    {
        var l_Json      = Array();
        var l_Hashes    = p_Data.split('&');
        
        for (var l_I = 0; l_I < l_Hashes.length; l_I++)
        {
            var l_Hash = l_Hashes[l_I].split('=');
            l_Json[l_Hash[0]] = l_Hash[1];
        }

        return l_Json;
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

/// Check whether the response is ready to be processed
/// @p_Event : XMLHTTPRequest
function Ready(p_Event)
{
    if (p_Event.readyState === XMLHttpRequest.DONE)
    {
        return true;
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
function CheckHTTPStatus(p_Event)
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