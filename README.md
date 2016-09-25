#loalhost-rewriting branch 

run with -p 8080:80 and access data.admin.ch data on localhost:8080


# data.admin.ch-site

This provides a server for the domain [data.admin.ch](http://data.admin.ch). 

## Requirements

You need to have [docker](https://docker.com/) installed.

## Building

    docker build -t dadmin .
    
## Running

    docker run --rm -p 80:80 dadmin
    
