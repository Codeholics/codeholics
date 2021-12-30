Title: File count from the command line on a Linux system
Date: 2014-10-21 05:34
Author: root
Category: Linux
Tags: os, linux, shell, cli, sysadmin
Slug: file-count-from-the-command-line-on-a-linux-system
Status: published

*OS:* Linux    
*Skill Level:* Beginner  
*Prerequisites:* Basic Linux CLI and regular expression understanding

*Intro:*  
  
When a folder only has a few items in it this trick is not that important, but let say the folder you are looking at has 754,586 files in it? Here is a quick trick to get an accurate count of the items in a folder.

*Example Folder Listing:*  
```
-rwxr-xr-x. 1 vesc vesc 1465 Apr 14 2014 backup.py  
drwxrwxr-x. 7 vesc vesc 4096 May 1 23:13 Code  
drwxrwxr-x. 2 vesc vesc 4096 Apr 12 2014 Downloads
-rwxrwxr. 1 vesc vesc 1279 Aug 17 07:19 ipcheck.py  
-rw-rw-r. 1 vesc vesc 16 Oct 10 04:20 ip.dat  
-rw-rw-r. 1 vesc vesc 6045 Aug 16 08:51 movielist.txt  
-rw-. 1 root root 294944 Apr 26 18:31 text.out  
-rwxr-xr-x. 1 vesc vesc 529276 Apr 8 2014 slowhttptest  
drwxrwxr-x. 2 vesc vesc 4096 Jan 2 2014 somefile
```
*Total items in folder:*  
```
ls -1 | wc -l

[vesc@indigofs ~\]$ ls -1 | wc -l  
9
```
*Number of files in the folder:*  
```
ls -l | grep ^- | wc -l

[vesc@indigofs ~\]$ ls -l | grep ^- | wc -l    
6
```
*Number of sub-folders in the folder:*  
```
ls -l | grep ^d | wc -l

[vesc\@indigofs ~\]$ ls -l | grep ^d | wc -l  
3
```