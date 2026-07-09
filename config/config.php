<?php
// Prevent direct access
if (basename($_SERVER['PHP_SELF']) === 'config.php') {
    http_response_code(403); // Forbidden
    exit('Direct access not allowed');
}


// Firebase configuration
$firebaseConfig = [
    "apiKey" => "AIzaSyCN2ge6apKzfN-6ne20Hw0UM0It8fn83Z8",
    "authDomain" => "rexcouriers-e7506.firebaseapp.com",
    "databaseURL" => "https://rexcouriers-e7506-default-rtdb.firebaseio.com",
    "projectId" => "rexcouriers-e7506",
    "storageBucket" => "rexcouriers-e7506.firebasestorage.app",
    "messagingSenderId" => "1029171038929",
    "appId" => "1:1029171038929:web:bbb75678fdf112b32813f0",
    "measurementId" => "G-FHK2QJ1HKN"
    
    
];
?>




