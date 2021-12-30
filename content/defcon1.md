Title: Defcon1
Date: 2017-10-09 13:41
Author: vesc
Category: Coding
Tags: coding, mysql, python, sqlalchemy, sysadmin, sysadmin, wordpress
Slug: defcon1
Status: published


> If you have a backup and you never test that backup you do not have a backup. - Unknown

I do not remember where I read this quote but it always resonated with me. Especially sense disaster recovery was one of my major responsibilities for a globally used web application. Much like the mechanic with the broken car. I was a little less diligent adhering to this rule in my side projects.

Codeholics is a small side project between a few friends with a passion for technology. We like to share some of the knowledge and lessons learned (good or bad) we encounter along the way. As such, we use shared hosting because it is affordable and WordPress because its a simple platform to share information with a lot of plugins. We had constant issues with our last shared hosting provider Webhostingpad.com. With no response to our constant borage of tickets trying to get our site back online after they preformed a server migration to our account we finally decided it was time to try someone else.

We found a new home over at A2 Hosting and dumped and dropped all the databases from our Webhostingpad account. When we tried to restore the database to our new instance of Wordpress the instance would bottoming out. This lead to low level analysis of the table structure and the .sql dump file. Here is what we found:

The table structure in the backed up database and the newly created database had some major and alarming differences.

-   wp\_posts - missing from backup
-   wp\_users - missing from backup
-   assortment of extra tables created by plugs littered the old database

At this point I am grepping and scouring the .sql file for anything that might resemble post data. The thought was maybe one of these plugins moved the data into one of these random tables but it was no where to be found.

Now I am freaking out because to the fault of my own I wrote the post directly into Wordpress and lived in blissful ignorance until it was to late.

Right before passing out for the night with that pit in my stomach that all System Administrators know and hate of just getting caught with your pants down. I had a sudden idea: What if we check Archive.org to see if it has the site cached in the WayBackMachine. I grabbed my tablet that I keep next to my bed and started searching and seen they had a archive from April 30, 2016. This was older and we would lose a few posts but it was better than losing it all.

The next day I saved one of the posts and started examining it for the HTML tags that held the post content.

```HTML
<h1 class="entry-title"> - has the post title
<div class="td-post-content"> - has the body of the post 
<time class="enctry-date update td-module-date" datetime=""> - had the post time stamp
<link rel=canonical ...> - this had the post permalink title
```

At this point I had already decided I would not mind download the files by hand to see what was available but I was not willing to do all the rebuilding of the database by hand. This part of the job I would do with Python. The packages I used would be as follows:

Python:

-   Beautifulsoup - parse the HTML files
-   SQLAlchemy - to create a object relational map (ORM) between python and the MySQL database.
-   mysqlclient - client used by SQLAlchemy for mysql.

System:

-   libmysqlclient-devel - dependency of mysqlclient python package

The wordpress wp\_posts table structure is as follows:

  Field                     Type                  Null   Key   Default               Extra
  ------------------------- --------------------- ------ ----- --------------------- -----------------
  ID                        bigint(20) unsigned   NO     PRI   NULL                  auto\_increment
  post\_author              bigint(20) unsigned   NO     MUL   0                     
  post\_date                datetime              NO           0000-00-00 00:00:00   
  post\_date\_gmt           datetime              NO           0000-00-00 00:00:00   
  post\_content             longtext              NO           NULL                  
  post\_title               text                  NO           NULL                  
  post\_excerpt             text                  NO           NULL                  
  post\_status              varchar(20)           NO           publish               
  comment\_status           varchar(20)           NO           open                  
  ping\_status              varchar(20)           NO           open                  
  post\_password            varchar(255)          NO                                 
  post\_name                varchar(200)          NO     MUL                         
  to\_ping                  text                  NO           NULL                  
  pinged                    text                  NO           NULL                  
  post\_modified            datetime              NO           0000-00-00 00:00:00   
  post\_modified\_gmt       datetime              NO           0000-00-00 00:00:00   
  post\_content\_filtered   longtext              NO           NULL                  
  post\_parent              bigint(20) unsigned   NO     MUL   0                     
  guid                      varchar(255)          NO                                 
  menu\_order               int(11)               NO           0                     
  post\_type                varchar(20)           NO     MUL   post                  
  post\_mime\_type          varchar(100)          NO                                 
  comment\_count            bigint(20)            NO           0                     

My SQLAlchemy class to wrap this table:

```Python
Base = declarative_base()
#Post Object
class Post(Base):
    '''wpcp_posts table schema object'''
    __tablename__ = 'wp_posts'

    ID = Column(BigInteger, primary_key=True)
    post_author = Column(BigInteger, default=0)
    post_date = Column(DateTime, default='0000-00-00 00:00:00')
    post_date_gmt = Column(DateTime, default='0000-00-00 00:00:00')
    post_content = Column(String, default=None)
    post_title = Column(String, default=None)
    post_excerpt = Column(String, default='')
    post_status = Column(String, default='publish')
    comment_status = Column(String, default='open')
    ping_status = Column(String, default='open')
    post_password = Column(String, default='')
    post_name = Column(String, default='')
    to_ping = Column(String, default='')
    pinged = Column(String, default='')
    post_modified = Column(DateTime, default='0000-00-00 00:00:00') 
    post_modified_gmt = Column(DateTime, default='0000-00-00 00:00:00')
    post_content_filtered = Column(String, default='')
    post_parent = Column(BigInteger, default=0)
    guid = Column(String, default='')
    menu_order = Column(Integer, default=0)
    post_type = Column(String, default='post')
    post_mime_type = Column(String, default='')
    comment_count = Column(BigInteger, default=0)

    def __repr__(self):
        return "<Post(post_author='%s', post_date='%s', post_date_gmt='%s',   
               post_content='%s', post_title='%s', post_excerpt='%s', post_status='%s',   
               comment_status='%s', ping_status='%s', post_password='%s', post_name='%s',   
               to_ping='%s', pinged='%s', post_modified='%s', post_modified_gmt='%s',   
               post_content_filtered='%s', post_parent='%s', guid='%s', menu_order='%s'   
               post_type='%s', post_mime_type='%s', comment_count='%s')>" %   
               (self.post_author, self.post_date, self.post_date_gmt, self.post_content,
                 self.post_title, self.post_excerpt, self.post_status, self.comment_status,
                 self.ping_status, self.post_password, self.post_name, self.to_ping,
                 self.pinged, self.post_modified, self.post_modified_gmt,
                 self.post_content_filtered, self.post_parent, self.guid, self.menu_order,
                 self.post_type, self.post_mime_type, self.comment_count)
```

Now that I had my ORM to the database. I just needed to write a little code to look at each of the .html files in a path and grab the good stuff from them with beautifulsoup
```Python
...
    # list path html files and import them
    for html_page in os.scandir(path):
        # Beautiful Soup Setup (open html page)
        with open(os.path.abspath(os.path.join(path, html_page.name))) as html:
            page = BeautifulSoup(html, 'html.parser')

        # Title
        title = page.find('h1', {'class': 'entry-title'})
        # Permalink
        post_name = page.find('link', {'rel':'canonical'})['href'].split('/')[-2]
        # post timestamp
        timestamp = datetime.strptime(page.find('time').get('datetime'),
                                     '%Y-%m-%dT%H:%M:%S+00:00')
        # build content from p tags in td-post-conent
        content = ''
        for x in page.find('div', {'class': 'td-post-content'}).find_all('p'):
            content += x.prettify()
...
```

Once all the content that was needed was stripped from the HTML pages. I created an post object and inserted it back into the database.

```Python
...
    post = Post(post_title=title.string,
                    post_author=1,
                    post_content=content,
                    post_name=post_name,
                    post_date=timestamp,
                    post_date_gmt=timestamp)
        # insert into database
        try:
            db_conn.add(post)
            db_conn.commit()
        except Exception:
            raise
```

Once I had these components I ran the script on the fold with the .html files. After it completed I took a dump of the local mysql Wordpress database and uploaded it into devel to check the results.

The full Python script can be viewed [here](https://github.com/Codeholics/archive_recovery "Archive Recovery") on our github.

I have always said I have learned more from the things that have broke than the things that worked and this was no exception. I had been wanting to use these Python packages for sometime and this gave me the need to use them. I also want to give a shout out to Internet Archive at archive.org. Without their amazing work all would have been lost. I encurage people to donate to archive.org as I will be as a 'thank you for saving my ass'.

Links:
------

-   [Internet Archive](https://archive.org/ "archive.org")
-   [Donate to the Internet Archive](https://archive.org/donate "archive.org")
-   [WayBackMachine](https://archive.org/web "waybackmachine")
-   [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/ "BeuatifulSoup")
-   [SQLAlchemy](https://www.sqlalchemy.org/ "SQLAlchemy")