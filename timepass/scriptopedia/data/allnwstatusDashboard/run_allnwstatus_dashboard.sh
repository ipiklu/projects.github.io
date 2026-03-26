#!/bin/bash

# Navigate to the project directory
cd /home/piklu/scripts/webDev

# Check if the python script is already running
if pgrep -f "app.py" > /dev/null
then
    # It is running, do nothing and exit
    exit 0
else
    # It is NOT running, start it
    python3 -u app.py > /dev/null 2>&1 &
fi
