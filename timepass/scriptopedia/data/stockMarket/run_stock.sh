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
TARGET_PATH="/home/piklu/scripts/stockMarket/stock_app.py"

LIVE_EMOJI="\U2B24"
DASH_EMOJI="\U2699"
START_EMOJI="\U1F680"

TIMESTAMP=$(date "+%d-%b-%Y %H:%M:%S %p")

# Navigate to the project directory
cd /home/piklu/scripts/stockMarket

# Check if the python script is running from that EXACT path
if pgrep -f "$TARGET_PATH" > /dev/null
then
    # It is running from the correct path, do nothing
    clear
    printf "\n"
    printf "$ADVGREY$DASH_EMOJI  CLIENT-SIDE-DASHBOARD $RESET\n"
    printf " $ADVRED(ALREADY RUNNING)$RESET\n"
    printf "$ADVBLINKGREEN $LIVE_EMOJI$RESET$ADVGREEN Script already running (on PID below)$RESET\n"
    printf " $ADVYELLOW\u2193$RESET\n"
    printf "$ADVBLUE"

    pgrep -af "/home/piklu/scripts/stockMarket/stock_app.py"
    printf "$RESET\n"
    exit 0
else
    # It is NOT running from that path, start it
    python3 -m streamlit run /home/piklu/scripts/stockMarket/stock_app.py --server.port 7010 --client.toolbarMode=developer > /dev/null 2>&1 &
    #pgrep -af "/home/piklu/scripts/webLocal/appLocal.py"

    clear
    printf "\n"
    printf "$ADVGREY$START_EMOJI CLIENT-SIDE-DASHBOARD $RESET\n"
    printf " $ADVGREEN[STARTED @ $TIMESTAMP]$RESET\n"
    printf "$ADVBLUE Check Browser with URL : $RESET \U27A1 ${ADVGREEN} http://127.0.0.1:7010 ${RESET}\n"
    printf "\n"
fi
