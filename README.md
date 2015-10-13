# data.admin.ch-site
the data.admin.ch site

This provides a server sering the data.admin.ch ontology. By default the serve listens to port 8080.

## Requirements

You need to have [docker](https://docker.com/) installed.

## Building

    docker build -t dadmin .
    
## Running

    docker run --rm -p 80:80 dadmin
    
