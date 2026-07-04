#!/bin/bash

# Define the target path and Java main class match pattern
PROJECT_DIR="/home/piklu/scripts/docSearch/"
TARGET_MATCH="javaApp.App"

# Colors
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

LIVE_EMOJI="\U2B24"
DASH_EMOJI="\U2699"
START_EMOJI="\U1F680"

TIMESTAMP=$(date "+%d-%b-%Y %H:%M:%S %p")

# Navigate to the project directory
cd "$PROJECT_DIR" || exit 1

# Check if the Java process matching the main class is running
if pgrep -f "$TARGET_MATCH" > /dev/null
then
    # It is running, do nothing but output dashboard status
    clear
    printf "\n"
    printf "$ADVGREY$DASH_EMOJI  JAVA-ANALYTICS-ENGINE $RESET\n"
    printf " $ADVRED(ALREADY RUNNING)$RESET\n"
    printf "$ADVBLINKGREEN $LIVE_EMOJI$RESET$ADVGREEN Process already running (on PID below)$RESET\n"
    printf " $ADVYELLOW\u2193$RESET\n"
    printf "$ADVBLUE "
    pgrep -af "$TARGET_MATCH"
    printf "$RESET\n"
    exit 0
else
    # It is NOT running, compile and kickstart background launch
    clear
    printf "\n"
    
    # Optional compile step ensuring latest UI changes are bundled
    javac javaApp/App.java > /dev/null 2>&1
    
    # Start Java application in background detached from console inputs
    java javaApp.App > /dev/null 2>&1 &
    
    # Give the engine a quick 150ms spin-up slice before validation readouts
    sleep 0.15

    printf "$ADVGREY$START_EMOJI JAVA-ANALYTICS-ENGINE $RESET\n"
    printf " $ADVGREEN[STARTED @ $TIMESTAMP]$RESET\n"
    printf "$ADVBLUE Check Browser with URL : $RESET \U27A1 $ADVGREEN http://127.0.0.1:8040 $RESET\n"
    printf "\n"
fi
