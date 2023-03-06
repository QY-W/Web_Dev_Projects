<?php
include 'function.php';
// HTTP-Only Cookies
ini_set("session.cookie_httponly", 1);
session_start();
header("Content-Type: application/json");
// check SESSION in php
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_name']) || !isset($_SESSION['token'])) {
    json_error_msg(false, "Missing _SESSION");
    exit;
} else {
    echo json_encode(array(
        "success" => true,
        "userid" => $_SESSION['user_id'],
        "username" => $_SESSION['user_name'],
        "token" => $_SESSION['token'],
    ));
    exit;
}
exit;
