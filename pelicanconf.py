#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'vesc'
SITENAME = '# Codeholics'
SITEURL = 'https://codeholics.com'

PATH = 'content'
STATIC_PATHS = ['images']

TIMEZONE = 'US/Eastern'

DEFAULT_LANG = 'en'

# Theme
THEME = "themes/pelican-theme-codeholics"
CUSTOM_JS = "theme/js/youtube.js"
# Plugins
PLUGIN_PATHS = ['../pelican-plugins']
PLUGINS = [
    #'assets',
    'gzip_cache',
    'liquid_tags.bootstrap_youtube',
    'liquid_tags.youtube_thumbnail',
    'tipue_search', # for theme search
    'i18n_subsites', # for theme
    'tag_cloud', # for theme
]

# Plugin Configs
# Assets
#ASSET_CONFIG = (
#    ('closure_compressor_optimization', 'WHITESPACE_ONLY'),
#    ('less_bin', 'lessc.cmd'),
#)

# For Theme
DIRECT_TEMPLATES = ['index', 'tags', 'categories', 'authors', 'archives', 'search']
I18N_TEMPLATES_LANG = 'en'
JINJA_ENVIRONMENT = {'extensions': ['jinja2.ext.i18n']}

# Markdown Extensions:
MARKDOWN = {
    'extension_configs': {
        'markdown.extensions.codehilite': {'css_class': 'highlight'},
        'markdown.extensions.extra': {},
        'markdown.extensions.meta': {},
        'markdown.extensions.toc': {},
    },
    'output_format': 'html5',
}

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = 'feeds/all.atom.xml'
CATEGORY_FEED_ATOM = 'feeds/%s.atom.xml'
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

DISPLAY_CATEGORIES_ON_MENU = False

MENUITEMS = [
    ('~/', '/'),
    ('Coding', '/tag/coding.html'),
    ('SysAdmin', '/tag/sysadmin.html'),
    ('InfoSec', '/tag/infosec.html'),
    ('OS', '/tag/os.html'),
    ('Hardware', '/tag/hardware.html'),
    ('Reviews', '/tag/review.html')
]

# Social widget
SOCIAL = (('Twitter', 'https://twitter.com/root_codeholics'),
          ('Facebook', 'https://www.facebook.com/RootCodeholics'),
          ('Github', 'https://www.github.com/Codeholics'))

DEFAULT_PAGINATION = 10

# Theme specific options
DISPLAY_TAGS_ON_SIDEBAR = True
TAG_CLOUD_MAX_ITEMS = 10
GITHUB_USER = 'codeholics'
GITHUB_REPO_COUNT = 5
# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
