<?php
// logout_ajax.php
//header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
ini_set("session.cookie_httponly", 1);
session_start();
$_SESSION['user_id'] = "";
$_SESSION['user_name'] = "";

session_destroy();
echo json_encode(array(
    "success" => true,
    "message" => "Success, you are logged out.",
));
exit();
// header('refresh:5, url = login_page.php');
