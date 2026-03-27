#!/bin/bash

# Define the target path and script name
TARGET_PATH="/home/piklu/scripts/webDev/app.py"

# Navigate to the project directory
cd /home/piklu/scripts/webDev

# Check if the python script is running from that EXACT path
if pgrep -f "$TARGET_PATH" > /dev/null
then
    # It is running from the correct path, do nothing
    exit 0
else
    # It is NOT running from that path, start it
    # -u ensures output is unbuffered, helpful for background tasks
    python3 -u /home/piklu/scripts/webDev/app.py > /dev/null 2>&1 &
    pgrep -af "/home/piklu/scripts/webDev/app.py"
fi
