#!/bin/bash

session_name="run"
current_directory=$(pwd)


if tmux has-session -t $session_name 2>/dev/null; then
	tmux send-keys -t $session_name C-c
	tmux kill-session -t $session_name
	echo "Killed existing tmux session."
fi

echo "Starting a new tmux session..."
tmux new-session -d -s $session_name
tmux send-keys -t $session_name "cd $current_directory" C-m
tmux ls
./monitor.sh &

tmux send-keys -t $session_name "./setup.sh" C-m
tmux attach-session -t run
tmux detach -s $session_name
