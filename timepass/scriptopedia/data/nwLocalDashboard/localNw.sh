#!/bin/bash

#colors
GREEN="\e[32m"
RED="\e[31m"
YELLOW="\e[33m"
ADVRED="\e[41;1;37m"
ADVGREEN="\e[48;5;236;32m"
ADVGREY="\e[48;5;236;1m"
ADVYELLOW="\e[48;5;236;33m"
BLACKYELLOW="\e[0;4;30;46;44;43m"
ADVBLINKGREEN="\e[48;5;236;32;1m"
ADVBLUE="\e[0;33;1;44m"
BLUE="\e[34m"
RESET="\e[0m"


# Define the target path and script name
TARGET_PATH="/home/piklu/scripts/webLocal/appLocal.py"

LIVE_EMOJI="⬤"

# Navigate to the project directory
cd /home/piklu/scripts/webDev

# Check if the python script is running from that EXACT path
if pgrep -f "$TARGET_PATH" > /dev/null
then
    # It is running from the correct path, do nothing
    clear
    printf "\n"
    printf "\e[48;5;236;32;5m $LIVE_EMOJI Script already running (on PID below)\e[0m\n"
    printf " \u2193\n"

    pgrep -af "/home/piklu/scripts/webLocal/appLocal.py"
    printf "\n"
    exit 0
else
    # It is NOT running from that path, start it
    # -u ensures output is unbuffered, helpful for background tasks
    python3 -u /home/piklu/scripts/webLocal/appLocal.py > /dev/null 2>&1 &
    #pgrep -af "/home/piklu/scripts/webLocal/appLocal.py"
    
    clear
    printf "\n"
    printf "\e${ADVBLUE}Check Browser with URL : ${RESET} \U27A1 ${ADVGREEN} http://127.0.0.1:7000 ${RESET}\n"
    printf "\n"
fi
