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
//<!-- const data = {'event_id' : eid, 'add_id': userid, 'add_username':username,'add_date':date,'add_time':time,
//    'add_tag':selectedTags,'add_detail':detail, 'token':usertoken}; -->
$eventid = $json_obj['event_id'];
$userid = $json_obj['add_id'];
$title = $json_obj['add_title'];
$date = $json_obj['add_date'];
$time = $json_obj['add_time'];
$tags = $json_obj['add_tag'];
$detail = $json_obj['add_detail'];
$token = $json_obj['token'];

$errorMSG = "Known Error";
if (isset($_SESSION['token']) && isset($_SESSION['user_id'])) {
    if (!hash_equals($token, $_SESSION['token'])) {
        $errorMSG = $token . "Error token. Request forgery detected" . $_SESSION['token'];
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
// $stmt = $mysqli->prepare("update story set content=? where sid = ?");
//     if (!$stmt) {
//         printf("Edit Story Query Prep Failed: %s\n", $mysqli->error);
//         exit;
//     }

//     $stmt->bind_param('si', $newcontent, $storyid);
//     $stmt->execute();
//     $stmt->close();
// edit event in db
$stmt = $mysqli->prepare("update event set title = ?, date = ?, time = ?, tags = ?, detail = ? where eid = ?");
if (!$stmt) {
    $errorMSG = "Query Prep Failed: %s\n" . $mysqli->error;
    json_error_msg(false, $errorMSG);
}

//uid, title,date,time,tags,detail
$stmt->bind_param('sssssi', $title, $date, $time, $tags, $detail, $eventid);

$stmt->execute();

if (!$stmt->errno) {
    echo json_encode(array(
        "success" => true,
        "message" => "Success, Event is edited",
    ));
    exit;
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Error, Event not be edited",
    ));
    exit;
}
$stmt->close();
