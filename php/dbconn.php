<?php

/**
 * @fileName dbconn
 * @author Ameer <amirsanni@gmail.com>
 * @date 05-Jan-2017
 */

$db = new PDO('mysql:host=localhost;dbname=calendar;charset=utf8mb4', 
        'root', 
        '', 
        [PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);