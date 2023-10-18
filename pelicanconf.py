#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'vesc'
SITENAME = '# Codeholics'
#SITEURL = 'https://codeholics.com'
SITEURL = ''

PATH = 'content'
STATIC_PATHS = ['images']

TIMEZONE = 'US/Eastern'

DEFAULT_LANG = 'en'

# Theme
THEME = "themes/pelican-bootstrap-5"
# Plugins
# TODO: move to all namesapce plugins
PLUGIN_PATHS = ['../pelican-plugins']
PLUGINS = [
    'pelican.plugins.webassets',
    'pelican.plugins.liquid_tags',
    'pelican.plugins.tag_cloud',
    'gzip_cache',
    'tipue_search', # for theme search
    'i18n_subsites', # for theme
]
# Webassets Config
WEBASSETS_CONF = ['cache', 'False']
# Liquid Tag Settings
LIQUID_TAGS = ["img", "literal", "video", "youtube", "vimeo", "include_code"]
YOUTUBE_THUMB_ONLY = True
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
          ('Github', 'https://www.github.com/Codeholics'),
          ('RSS-fill', 'https://www.codeholics.com/feeds/all.atom.xml'))

DEFAULT_PAGINATION = 10

# Theme specific options
DISPLAY_TAGS_ON_SIDEBAR = True
TAG_CLOUD_MAX_ITEMS = 10
GITHUB_USER = 'codeholics'
GITHUB_REPO_COUNT = 5
# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
