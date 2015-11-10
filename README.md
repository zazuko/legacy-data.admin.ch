# data.admin.ch-site

This provides a server for the domain [data.admin.ch](http://data.admin.ch). By default the serve listens to port 8080.

## Requirements

You need to have [docker](https://docker.com/) installed.

## Building

    docker build -t dadmin .
    
## Running

    docker run --rm -p 80:80 dadmin
    
