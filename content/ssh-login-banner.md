Title: SSH Login Banner
Date: 2014-10-14 01:27
Author: root
Category: Linux
Tags: sysadmin, os, linux
Slug: ssh-login-banner
Status: published

Want a custom banner or warning message when a user connects via SSH on your server?  
  
*Skill level:* Beginner  
*OS:* Linux  
*Prerequisites:* Understand how to edit a file with vim or other text editor in Linux.  
*Dependencies:*
*Config files:*  
`/etc/ssh/sshd_config`
`/etc/issue.net`

1. Open `/etc/ssh/sshd_config` and look for the line with `Banner` in it and point it to your `/etc/issue.net` file:
```
Banner /etc/issue.net  
```
2. Generate a banner:  
`figlet -f banner [string]`  
3. Copy and paste your banner into `/etc/issue.net` to add your message.  
4. Restart sshd:  
`sudo -i service sshd restart`  
  
Now connect to your box:  
[![ssh-login](https://web-beta.archive.org/web/20150725063050im_/http://codeholics.com/wp-content/uploads/2014/10/Selection_221-300x72.png)](https://web-beta.archive.org/web/20150725063050/http://codeholics.com/wp-content/uploads/2014/10/Selection_221.png)