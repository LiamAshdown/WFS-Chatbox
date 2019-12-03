<?php

class Time
{
    /// Get Current time date
    /// Returns YYY-mm-dd HH:ii:ss
    static public function GetDateTime() : string
    {
        return (new \DateTimeImmutable('now'))->format('Y-m-d H:i:s');
    }
}

?>