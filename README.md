# Codeholics Static Pelican Site
Codeholics.com static site generated with Pelican

## Dev Env Setup
### Clone Projects
```
# clone main project
git clone git@github.com:Codeholics/codeholics.git

# clone pelican plugins
git clone git@github.com:Codeholics/pelican-plugins.git
```
### Install Python Requirements:
```
cd codeholics
pip install -r requirements.txt
```

### Build Site
```
pelican ./content
# static files are placed in ./output
```

### Run dev server
```
pelican --listen # creates a server on port 8080
```

### Build docker image
```
docker-compose -f docker/docker-compose.yml build
```

### Run docker container
```
docker-compose -f docker/docker-compose.yml up
```

### Update site dependencies
This will generate the requirements.txt from the requirements.in file
```
pip install pip-tools
pip-compile --upgrade
```
