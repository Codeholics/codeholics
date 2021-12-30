Title: Moving a website from Wordpress to Pelican
Author: vesc
Date: 2019-03-01 20:43
Category: Coding
Tags: coding, python, docker, wordpress, pelican
Slug: moving_a_website_from_wordpress_to_pelican
State: published

Codeholics has been using Wordpress for its site since its launch back somewhere around 2013. It was great for its time but over the years we have had a number of issues. Plainly put the entire site management and work flow needed to be simplified.  
  
Intro: Pelican
  
Pelican is a static site generator written in Python.  
  
First thoughts when people think static site is bringing it back to dialup days but that is not the case with HTML5 and CORS one really dose not need a overly complicated backend to share content with the world.  
  
Pelican has a very active community with lots of plugins and themes to choose from. The theme system is very simple as it uses Jinja2 templates and the plugins are just small Python functions that register with the Pelican API. Content for Pelican can be written in REstructured text or Markdown.
  
Since our last issue with backups I had already started writing things in Markdown and using Pandocs to convert that into HTML. Then I would take that and put it into the an article in wpadmin. A clunky workflow for sure but I knew my content was safely tucked away in a personal git server. The most clunky thing about it was formatting after the conversion. Simply, none of this made for a good experience to publish content.
  
Pelican dose a really nice job of converting Markdown with syntax highlighting and table formatting.  
  
Lets now get into using Pelican and porting over WordPress content.
  
Since this is Python it's always a good idea to setup a virtual environment:
```
mkdir codeholics
cd codeholics
python3 -m venv env
source env/bin/activate
```
Now that the site project directory is set up let's install Pelican and initialize the Pelican site.
```
pip install pelican markdown beautifulsoup4 lxml
pelican-quickstart
```
Next let's pull in the content from WordPress first you will need to extract the xml backup from your WordPress site by going to *my site->settings->export*. Once this is done run the pelican-import command.
```
pelican-import --wpfile site.xml --wp-attach --markdown
```

`--wp-attach` will attempt to go out and get all the article images

`--markdown` export files in markdown format
  
Now that the content is imported in to the content folder we can transpile the site.
```
pelican content/
```
This command will generate the static site in the output directory. This can now be published or we can run a local Dev server.
```
pelican listen
```
This will create a Dev server on `localhost:8000`

There could be some issues with posts having WordPress plugin globs that didn't convert properly but that can be cleaned up fairly easy.

At this point it's time to customize the configurations, theme and plugins.

The Pelican configuration file is in the root of the project folder named `pelicanconf.py`. Here is were the defualts, themes, plugins and other conf8guration variables are set. 

The `pelican-quickstart` app pre populates a few of the defaults like AUTHOR and SITENAME.

To get started using plugins you will need to first clone the pelican-plugins repo. I set this up in the parent directory to the project.

```
git clone https://github.com/getpelican/pelican-plugins.git
```
Then add the following two variables to `pelicanconf.py`

```
# Plugins
PLUGIN_PATHS = ['../pelican-plugins']
PLUGINS = [
    'assets',
    'gzip_cache',
    ...
]
```

There are a lot of plugins for Pelican and if you cant find what you are looking for it is not to hard to modify or write a plugin.

Last part is picking a theme. A large list of themes can be found at http://www.pelicanthemes.com and the full repository of themes can be found on github 
https://github.com/getpelican/pelican-themes

Pelican provides `pelican-themes` a cli tool to help a user manage installed themes but it is not required to use the cli. You can also provide the path directly to the theme.
```
THEME="/path/to/theme"
# or
THEME="<name>"
```
To get a list of installed themes `pelican-themes -l`

More configuration variables can be found in the Pelican docs.

That completes the migration last thing to do is push The new site out to production by uploading the generated content in `output` or building it into a docker image. Here is a quick and easy `Dockerfile` to build a Pelican site into a Nginx image.

```
FROM nginx:alpine
RUN apk update && \                                                                   apk upgrade
COPY ./output /usr/share/nginx/html
```
Combine that with this `docker-compose.yml` and you get a quick dev deployment.
```
version: '3.4'
services:
    codeholics:
        container_name: codeholics_static
        build:               
          context: ..
        dockerfile: docker/Dockerfile
        image: codeholics/codeholics_static
        ports:
          - "8080:80"
```
To build the image:  
`docker-compose -f docker-compose.yml build`
  
Run the service:  
`docker-compose -f docker-compose.yml up`
  
Deploy on a swarm:  
`docker stack deploy -c docker-compose.yml codeholics`

Hope everyone enjoys the new site and content that follow.

Happy Hacking!