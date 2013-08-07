# Connecting a HomeMatic CCU 1

## Prerequisites

1. Install SSH: http://www.homematic-inside.de/software/addons/item/dropbear
2. Install curl: http://homematic-forum.de/forum/viewtopic.php?f=19&t=5414&start=8

## Script

    string stdout; 
    string stderr; 
    string url="http://pidevice.fritz.box:8000/leds";
    system.Exec ("curl -X PUT -H 'Content-Type: application/json' -d '{" # '"' # "colour" # '"' # ": " # '"' # "#ffff00" # '"' # ", " # '"' # "brightness" # '"' # ": 0.2}' " # url, &stdout, &stderr);
