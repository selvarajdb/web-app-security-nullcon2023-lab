#!/bin/bash

# Name of the tmux session to monitor
session_name="run"

# Message to search for
target_message="Server started at http://localhost:5555"

# Check if the session exists
if tmux has-session -t $session_name 2>/dev/null; then
    # Monitor the session for the target message
    while :; do
        message=$(tmux capture-pane -t $session_name -p | grep -m 1 "$target_message")
        if [ ! -z "$message" ]; then
            # If the target message is found, detach from the session
            tmux detach -s $session_name
	    echo "The servers are ready. Start hacking! Good luck."
            break
        fi
        sleep 1 # Check every 1 second
    done
else
    echo "Tmux session '$session_name' does not exist."
fi

