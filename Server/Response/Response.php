<?php

class ResponseBuilder
{
    /// Send Response
    static public function AccountAlreadyExists()
    {
        $l_ErrorMessage = array();
        $l_ErrorMessage["error"] = 4;
        $l_ErrorMessage["error_message"] = "Account Already Exists!";

        self::Response(200, false, false, "", $l_ErrorMessage, false);
    }

    /// Send Response
    static public function AccountCreated()
    {
        $l_ErrorMessage = array();
        $l_ErrorMessage["error"] = 0;
        $l_ErrorMessage["error_message"] = "Account Created!";
        
        self::Response(200, true, false, "", $l_ErrorMessage, false);
    }

    /// Send Response
    static public function IncorrectDetails()
    {
        $l_ErrorMessage = array();
        $l_ErrorMessage["error"] = 1;
        $l_ErrorMessage["error_message"] = "Incorrect username or password";

        self::Response(200, true, false, "", $l_ErrorMessage, false);
    }

    /// Send Response
    static public function LoggedIn()
    {
        $l_ErrorMessage = array();
        $l_ErrorMessage["error"] = 0;
        $l_ErrorMessage["error_message"] = "Logged in successfully!";

        self::Response(200, true, false, "", $l_ErrorMessage, false);
    }

    /// Send Response
    /// @p_Data : Response Content
    static public function ValidationError(array $p_Data)
    {
        self::Response(200, false, false, "", $p_Data, false);
    }

    /// Send Response
    /// @p_Data : Response Content
    static public function UserList(array $p_Data)
    {
        self::Response(200, true, true, "", $p_Data, false);
    }

    /// Send Response
    /// @p_Data : Response Content
    static public function MessageList(array $p_Data)
    {
        self::Response(200, true, true, "", $p_Data, false);
    }

    /// Create and send response
    /// @p_HTTPStatusCode : HTTP Status Code
    /// @p_Success 		  : Response is successful or not
    /// @p_Cache 		  : For the client to cache the response
    /// @p_Data 		  : Array of data
    /// @p_Message 		  : Message
    /// @p_Assert		  : Stop PHP script executing
    static private function Response(int $p_HTTPStatusCode, bool $p_Success, bool $p_Cache, string $p_Message, array $p_Data, bool $p_Assert)
    {
        $l_Response = new Response($p_HTTPStatusCode, $p_Success, $p_Cache, $p_Data, $p_Message);
        $l_Response->Send();

        /// Stop PHP script from running
        if ($p_Assert)
        {
            exit();
        }
    }
}


/// Responsible for containing the data to be sent to client
class Response 
{
    /// Constructor
    /// @p_HTTPStatusCode : HTTP Status Code
    /// @p_Success 		  : Response is successful or not
    /// @p_Cache 		  : For the client to cache the response
    /// @p_Data 		  : Array of data
    /// @p_Message 		  : Array of data
    public function __construct(int $p_HTTPStatusCode, bool $p_Success, bool $p_Cache, array $p_Data, string $p_Message) 
    {
        $this->m_HTTPStatusCode = $p_HTTPStatusCode;
        $this->m_Success 		= $p_Success;
        $this->m_CanCache 	    = $p_Cache;
        $this->m_Data 			= $p_Data;
        $this->m_Message 		= $p_Message;
    }
    /// Deconstructor
    public function __deconstruct()
    {

    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    /// Send the response
    public function Send()
    {
        /// We must set the header type, if we don't the browser will automatically assume the file is a text/html file.
        /// We want the browser to recongnise it's a json file
        header('Content-type: application/json/charset=utf-8');

        if ($this->m_CanCache)
        {
            /// Client is allowed to cache the response for a duration of x seconds
            header('Cache-control: max-age=60');
        }
        else
        {
            /// Client is not allowed to cache the response
            /// Note:
            /// - no-cache: the client will not cache the response
            /// - no-store: the client requires the resource to be requested and downloaded from the server each time (used for important information)
            header('Cache-control: no-cache, no-store');
        }

        /// If success is not set nor status code is not a valid integer
        /// send a internal server response - if this happens, we messed up someone on server side
        if (!isset($this->m_Success) || !is_numeric($this->m_HTTPStatusCode))
        {
            http_response_code(500);

            $this->m_ResponseData['statusCode'] = 500;
            $this->m_ResponseData['success'] 	= false;
            $this->m_ResponseData['message'] 	= $this->m_Message;
        }
        else ///< We are all good, continue with the successfull response
        {
            http_response_code($this->m_HTTPStatusCode);
            $this->m_ResponseData['statusCode'] = $this->m_HTTPStatusCode;
            $this->m_ResponseData['success'] 	= $this->m_Success;
            $this->m_ResponseData['message'] 	= $this->m_Message;
            $this->m_ResponseData['data'] 		= $this->m_Data;
        }

        /// Encode our response data into a JSON format
        echo json_encode($this->m_ResponseData);
    }
    
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    
    private $m_Success;
    private $m_HTTPStatusCode;
    private $m_Message;
    private $m_Data;
    private $m_CanCache;
}

?>