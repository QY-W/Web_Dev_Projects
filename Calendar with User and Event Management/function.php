
<?php
function json_error_msg($staBool, $msg)
{
    echo json_encode(array(
        "success" => $staBool,
        "message" => $msg,
    ));
}

?>