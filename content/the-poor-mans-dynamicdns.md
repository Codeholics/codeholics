Title: The Poor Mans DynamicDNS
Date: 2016-04-14 19:57
Author: root
Category: Coding
Tags: coding, shell, os, linux, python
Slug: the-poor-mans-dynamicdns
Status: published

A few years ago I had an issue where I needed a DynamicDNS service or some sort. I didnt want to pay for it and got the thought in my head to just write my own script that suited my need. The things it needed to do was check if public IP had changed and send that change to me in some way so I could update my host file on my laptop. Fairly simple but effective to make sure I always knew how to phone home. I wrote a quick hacky python script to get the job done and it has been working for me for a few years now flawlessly.

[Click here](https://github.com/Codeholics/ipchecker)  
to go to the Github repo

Install:

first figure out where you would like script to live and run:

`git clone https://github.com/Codeholics/ipchecker`

Then edit ipchecker.py with your favorite text editor and add your info to the vars:
```Python
#
#IP File
#

FILE = /path/to/ip.dat #File where it stores your IP to compare to

#
#SMTP Options
#

EMAIL = your@email.com
SMTPHOST = localhost
SENDER = name@email.com
```
Once this is done create a cron job in `/etc/cron.d/` with the following schedule it however you would like:
```
# Check current IP and send an email if it has changed

20 4 * * * [user] python /usr/local/bin/ipcheck.py
```
The only issue with this is it will get filtered by any spam filter when it is sent from a residential dynamic IP address. You will need to mark it as not being spam or if you notice you cant get into your system check your spam folder.

The script queries a site with curl that returns your public IP address then it checks that IP with the one inside the ip.dat file. If it is different than it emails out the new IP address and writes the new address to the ip.dat file.

Enjoy