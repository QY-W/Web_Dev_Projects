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
$id = $json_obj['id'];
$date = $json_obj['date'];
$token = $json_obj['token'];
$errorMSG = "Known Error";
if (isset($_SESSION['token']) && isset($_SESSION['user_id'])) {
    if ($id != $_SESSION['user_id'] || !hash_equals($token, $_SESSION['token'])) {
        $errorMSG = "Error token. Request forgery detected";
        json_error_msg(false, $errorMSG);
        exit;
    }
    if ($id != $_SESSION['user_id']) {
        $errorMSG = "Session hijack detected" . $_SESSION['user_id'];
        json_error_msg(false, $errorMSG);
        exit;
    }
} else {
    $errorMSG = "Please login first. You are guest account now.";
    json_error_msg(false, $errorMSG);
    exit;
}
$id = $_SESSION['user_id'];
// check duplicated user name
$checkEvent = $mysqli->prepare("SELECT * from event WHERE uid = ? AND date = ?");
if (!$checkEvent) {
    $errorMSG = "User Query Prep Failed: %s\n" . $mysqli->error;
    json_error_msg(false, $errorMSG);
    exit;
}

$checkEvent->bind_param('is', $id, $date);
$checkEvent->execute();

if ($checkEvent->errno) {
    $errorMSG = "Failed to fetch";
    json_error_msg(false, $errorMSG);
    exit;
}

$checkEvent->bind_result($seid, $suid, $stitle, $sdate, $stime, $stags, $sdetails);
//$checkEvent->get_result();

$json_sending = array();
$event_count = 0;
while ($checkEvent->fetch()) {
    $event_count += 1;
    $eid = htmlspecialchars($seid);
    $uid = htmlspecialchars($suid);
    $title = htmlspecialchars($stitle);
    $date = htmlspecialchars($sdate);
    $time = htmlspecialchars($stime);
    $tags = htmlspecialchars($stags);
    $detail = htmlspecialchars($sdetails);

    $event_inst = array(
        'eid' => $eid,
        'uid' => $uid,
        'title' => $title,
        'date' => $date,
        'time' => $time,
        'tags' => $tags,
        'detail' => $detail,
    );
    array_push($json_sending, $event_inst);
}

echo json_encode(array(
    "success" => true,
    "message" => "Correct, User has been registered",
    "sent_data" => $json_sending,
));
exit;
