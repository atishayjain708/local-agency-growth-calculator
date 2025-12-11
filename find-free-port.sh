#!/bin/bash

# Find a free port in a given range
# Usage: ./find-free-port.sh [start_port] [end_port]
# Returns the first free port found

START_PORT=${1:-3001}
END_PORT=${2:-3010}

find_free_port() {
    local start=$1
    local end=$2
    
    for port in $(seq $start $end); do
        if ! sudo lsof -i :$port > /dev/null 2>&1; then
            echo $port
            return 0
        fi
    done
    
    echo ""
    return 1
}

FREE_PORT=$(find_free_port $START_PORT $END_PORT)

if [ -z "$FREE_PORT" ]; then
    echo "ERROR: No free ports found in range $START_PORT-$END_PORT" >&2
    exit 1
else
    echo $FREE_PORT
    exit 0
fi

