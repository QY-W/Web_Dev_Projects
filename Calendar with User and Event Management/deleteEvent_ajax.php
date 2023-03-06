<?php
// login_ajax.php
require_once "database.php";
require_once "function.php";
ini_set("session.cookie_httponly", 1);
session_start();
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
//<!-- const data = {'event_id' : eid, 'token':token}; -->
$eventid = $json_obj['event_id'];
$token = $json_obj['token'];
$userid = $json_obj['user_id'];

$errorMSG = "Known Error";
if (isset($_SESSION['token'])) {
    if (!hash_equals($token, $_SESSION['token'])) {
        $errorMSG = "Error token. Request forgery detected";
        json_error_msg(false, $errorMSG);
        exit;
    }
    if ($userid != $_SESSION['user_id']) {
        $errorMSG = "Session hijack detected" . $_SESSION['user_id'];
        json_error_msg(false, $errorMSG);
        exit;
    }
} else {
    $errorMSG = "Please login first. You are guest account now.";
    json_error_msg(false, $errorMSG);
    exit;
}

//json_error_msg(false, $errorMSG);
// delete events in db
$stmt = $mysqli->prepare("delete from event where eid = ?");
if (!$stmt) {
    $errorMSG = "Query Prep Failed: %s\n" . $mysqli->error;
    json_error_msg(false, $errorMSG);
}

//uid,title,date,time,tags,detail
$stmt->bind_param('i', $eventid);

$stmt->execute();

if (!$stmt->errno) {
    echo json_encode(array(
        "success" => true,
        "message" => "Success, Event deleted",
    ));
    exit;
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Error, Event not deleted",
    ));
    exit;
}
$stmt->close();
