<?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "cvisit";
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

    $sql = "UPDATE visitor SET visits = visits+1 WHERE id = 1";
    $conn->query($sql);

    $sql = "SELECT visits FROM visitor WHERE id = 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $visits = $row["visits"];
        }
    } else {
        echo "no results";
    }
    
    $conn->close();
?>