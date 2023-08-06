- [Codeholics Static Pelican Site](#codeholics-static-pelican-site)
  - [Clone Projects](#clone-projects)
  - [Docker Setup](#docker-setup)
    - [Build Docker Image](#build-docker-image)
    - [Run Docker Container](#run-docker-container)
  - [Manual Setup](#manual-setup)
    - [Install pip](#install-pip)
    - [Install Venv](#install-venv)
    - [Setup Venv](#setup-venv)
    - [Activate Venvu Enviornment](#activate-venvu-enviornment)
    - [Install Python Requirements:](#install-python-requirements)
    - [Build Site](#build-site)
    - [Run Dev Server](#run-dev-server)
  - [Update Site Dependencies](#update-site-dependencies)
  - [Directory Structure](#directory-structure)
  - [Resources](#resources)



# Codeholics Static Pelican Site

Codeholics.com static site generated with Pelican

![Website Status](https://img.shields.io/website?down_color=Red&down_message=Offline&up_color=Green&up_message=Online&url=https%3A%2F%2Fcodeholics.com)
![UptimeRobot Monitor](https://img.shields.io/uptimerobot/ratio/m779006273-e90d9df1ef96145a1e1b0bcc)
![Github Repo Size](https://img.shields.io/github/repo-size/codeholics/codeholics)
![mozilla-observatory](https://img.shields.io/mozilla-observatory/grade-score/codeholics.com?publish)
![W3C Validation](https://img.shields.io/w3c-validation/html?targetUrl=https%3A%2F%2Fcodeholics.com)
![libraries.io Dependencies](https://img.shields.io/librariesio/github/codeholics/codeholics)





## Clone Projects

```
# clone main project
git clone git@github.com:Codeholics/codeholics.git

# clone pelican plugins
git clone git@github.com:Codeholics/pelican-plugins.git
```


<br>


## Docker Setup

If you use Docker, otherwise follow the manual process

### Build Docker Image

```
docker-compose -f docker/docker-compose.yml build
```

### Run Docker Container

```
docker-compose -f docker/docker-compose.yml up
```


<br>



## Manual Setup

### Install pip

```python
python -m pip install
```

### Install Venv

```
pip install venv
```

### Setup Venv

You should create this under the root project folder. If you're using GitHub, make sure to exclude this directory in your gitignore file. It's also best practice to `CD C:\Code\codeholics` into the directory before running this command. This will create the directory `C:\Code\codeholics\venvu`

```
python -m venv C:\Code\codeholics
```

### Activate Venvu Enviornment

```
`C:\Code\codeholics\venv\Scripts\Activate.ps1`
```

### Install Python Requirements:

```
cd codeholics
pip install -r requirements.txt
```

### Build Site

This step will build the site so you can view it with the dev server.

Content `C:\Code\codeholics\Content` is where all of your markdown documents are stored.

Output `C:\Code\codeholics\output` is where the final html version will be saved to.

```
pelican C:\Code\codeholics\Content
```

### Run Dev Server

Start the dev server

```
pelican --listen # creates a server on port 8080
```

By default you should now see a message in the console 

`Server site at:` [http://127.0.0.1:8000](http://127.0.0.1:8000)


<br>

## Update Site Dependencies

This will generate the requirements.txt from the requirements.in file

```
pip install pip-tools
pip-compile --update
```

<br>

## Directory Structure

```
- codeholics
  - .github
  - content
  - docker
  - include
  - output
  - themes
  - venv
```

<br>

## Resources

- [Pelican Website Generator](https://getpelican.com/)
