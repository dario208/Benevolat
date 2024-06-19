#! /usr/bin/bash

echo "Starting [Jeunes-Sesame]..."
docker-compose -f docker-compose.yml up --build -d

sleep 3

echo "Containers logs..."
docker-compose -f docker-compose.yml logs -f
