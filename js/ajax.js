class Ajax
{
    constructor(p_Url, p_Method, p_DataType, p_Data, p_Function = null, p_Asynchronous = true)
    {
        this.Url           = p_Url;
        this.Method        = p_Method;
        this.DataType      = p_DataType;
        this.Data          = p_Data;
        this.Function      = p_Function;
        this.Asynchronous  = p_Asynchronous;
        
        this.ValidAjax     = true;
        this.XML           = new XMLHttpRequest();
        this.RequestHeader = Array();

        if (this.FormHeaderMethod())
        {
            if (this.FormBody())
            {
                this.Send();
            }
        }
    }

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
                if (this.DataType === "json")
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
    
    FormBody()
    {
        if (this.Method === "POST")
        {
            if (this.DataType === "json")
            {
                this.Data = JSON.stringify(this.Data);
            }
            else
            {
                var l_Data = "";

                for (var l_Itr in this.Data)
                {
                    l_Data = l_Data + l_Itr + "=" + encodeURIComponent(l_Itr[l_Itr]) + '&';
                }

                l_Data = l_Data.substr(0, (l_Data.length - 1));
            }
        }

        return true;
    }

    Send()
    {
        this.XML.open(this.Method, this.Url);

        if (this.RequestHeader)
        {
            this.XML.setRequestHeader(this.RequestHeader[0], this.RequestHeader[1]);
        }

        alert(this.Data);
        this.XML.send(this.Data);

        if (this.Function)
        {
            this.XML.onreadystatechange = this.Function(this);
        }
    }

    Ready()
    {
        switch (this.XML.readyState)
        {
            case XMLHttpRequest.DONE:
            {
                if (this.GetResponse() != null)
                {
                    return true;
                }
            }
            break;
            case XMLHttpRequest.HEADERS_RECEIVED:
            case XMLHttpRequest.OPENED:
            case XMLHttpRequest.UNSENT:
                return false;
            break;
            default:
                console.log("Ready: Recieved undefined HTTP Request");
                return false;
                break;
        }

        return false;
    }

    GetResponse()
    {
        switch (this.DataType)
        {
            case "json":
            {
                this.Data = JSON.parse(this.XML.data);
            }
            default:
            {
                this.Data = this.XML.data;
            }
        }

        return this.Data;
    }
}

function Test(p_Ajax)
{
    if (p_Ajax.Ready())
    {
        alert("ready!");
    }
}

new Ajax("Server/Login.php", "POST", "text", "login-username=Quadral&login-password=dassdas", Test);

(function() {
    function ajax(option) {
        function isEmpty(obj) {
            for (var x in obj) {
                if (obj.hasOwnProperty(x)) {
                    return false;
                }
            }
           return true;
        }
        var setting, method, url, data, xhr, success;
        if (option) {
            setting = option;
        } else {
            return console.error('not set arguments');
        }
        if (setting.method) {
            method = setting.method;
        } else {
            return console.error('not set method');
        }
        if (setting.url) {
            url = setting.url;
        } else {
            return console.error('not set url');
        }
        if (setting.success) {
            success = setting.success;
        } else {
            return console.error('not set success callback');
        }
        data = setting.data || '';
        if (setting.method === 'GET' && data && !isEmpty(data)) {
            url = url + '?' + formUrlEncode(data);
        }

        function formUrlEncode(obj) {
            if (!obj) {
                return '';
            }
            var urlData = '';
            for (var x in obj) {
                alert(x);
                urlData = urlData + x + '=' + encodeURIComponent(obj[x]) + '&';
            }
            urlData = urlData.substr(0, (urlData.length - 1));
            return urlData;
        }

        // handle IE8 IE9 CORS
        if (typeof(XDomainRequest) !== 'undefined') {
            var host = location.host,
                matchUrl = url.replace('https://', '').replace('http://', '');
                matchUrl = matchUrl.slice(0, matchUrl.indexOf('/'));
            if (url.indexOf('//') === 0 || matchUrl !== host) {
                var xdr = new XDomainRequest();
                xdr.open(method, url);
                xdr.onprogress = function () {
                    // console.log('progress');
                };
                xdr.ontimeout = function () {
                    // console.log('timeout');
                };
                xdr.onerror = function () {
                    // console.log('error');
                };
                xdr.onload = function() {
                    // console.log('onload');
                    success(JSON.parse(xdr.responseText));
                };
                setTimeout(function () {
                    xdr.send();
                }, 0);

                return;
            }
        }
        // handle IE8 IE9 CORS end

        xhr = new XMLHttpRequest();
        xhr.open(method, url);
        if (setting.setRequestHeader) {
            for (var key in setting.setRequestHeader) {
                xhr.setRequestHeader(key, setting.setRequestHeader[key]);
            }
        }
        if (setting.withCredentials) {
            xhr.withCredentials = true;
        }
        if (setting.method !== 'GET') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        alert(formUrlEncode(data));
        xhr.send(formUrlEncode(data));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var response;
                    switch (setting.response) {
                        case 'json':
                            response = JSON.parse(xhr.responseText);
                            break;
                        case 'xml':
                            response = xhr.responseXML;
                            break;
                        default:
                            response = JSON.parse(xhr.responseText);
                            break;
                    }
                    success(response);
                } else {
                    if (setting.error) {
                        setting.error(xhr.status, xhr.responseText);
                    } else {
                        return console.error('xhr.status', xhr.status);
                    }
                }
            }
        };
    }

    window.ajax = ajax;
})();

ajax({
    method: 'POST',
    url: 'Server/Login.php',
    data: {
        user: 'TED',
        password: 'carbon12'
    },
    response: 'json',
    success: function (data) {
        console.log(data);
    },
    error: function(status, data) {
        // status = http status
        // do something
    }
});