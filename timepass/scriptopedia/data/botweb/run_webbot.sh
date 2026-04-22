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
ADVBLINKGREEN="\e[48;5;236;32;5m"
ADVBLUE="\e[0;33;1;44m"
BLUE="\e[34m"
RESET="\e[0m"


# Define the target path and script name
TARGET_PATH="/home/piklu/scripts/botweb/app.py"

LIVE_EMOJI="\U2B24"
DASH_EMOJI="\U2699"
START_EMOJI="\U1F680"

TIMESTAMP=$(date "+%d-%b-%Y %H:%M:%S %p")

# Navigate to the project directory
cd /home/piklu/scripts/webDev

# Check if the python script is running from that EXACT path
if pgrep -f "$TARGET_PATH" > /dev/null
then
    # It is running from the correct path, do nothing
    clear
    printf "\n"
    printf "$ADVGREY$DASH_EMOJI  TERMINAL BOT (WEB-VERSION) $RESET\n"
    printf " $ADVRED(ALREADY RUNNING)$RESET\n"
    printf "$ADVBLINKGREEN $LIVE_EMOJI$RESET$ADVGREEN Script already running (on PID below)$RESET\n"
    printf " $ADVYELLOW\u2193$RESET\n"
    printf "$ADVBLUE"

    pgrep -af "/home/piklu/scripts/botweb/app.py"
    printf "$RESET\n"
    exit 0
else
    # It is NOT running from that path, start it
    # -u ensures output is unbuffered, helpful for background tasks
    python3 -u /home/piklu/scripts/botweb/app.py > /dev/null 2>&1 &
    #pgrep -af "/home/piklu/scripts/botweb/app.py"

    clear
    printf "\n"
    printf "$ADVGREY$START_EMOJI TERMINAL BOT (WEB-VERSION) $RESET\n"
    printf " $ADVGREEN[STARTED @ $TIMESTAMP]$RESET\n"
    printf "$ADVBLUE Check Browser with URL : $RESET \U27A1 ${ADVGREEN} http://127.0.0.1:8020 ${RESET}\n"
    printf "\n"
fi
