Title: Linux Backup  Restore with tar (part 1 of 2)
Date: 2015-01-04 02:40
Author: root
Category: Linux
Tags: linux, shell, coding
Slug: linux-backup-restore-with-tar-part-1-of-2
Status: published

*OS:* Linux  
*Skill Level:* Intermediate  
*Prerequisites:* Linux CLI and Bash Scripting  
*Language:* Bash Shell Scripting

*Intro:*  
There are a lot of great open source and commercial backup solutions and what you will find if you look under the hood of these software packages is that most of them are just interfacing or wrapping over tar. For my home needs I decided it would be simple and fun to just write my own basic backup software using tar and a script.

*Software Requirements:*  
1. Backup: Script must backup all important files on my system and exclude files that are not needed. The backup tar.gz file must contain the name of the host the it backed up and the date of the backup.

`hostname-backup-0000-00-00.tar.gz`

2. Retire old backups: Script must be able to remove old backups after a specified time period.

This are simple backup requirements for my own home use, and they might not apply to everyones individual needs.

*Part 1:*  
First things we need to backup the data we want and exclude what we do not need. Lets break down the tar arguments we will need to get this accomplished.

Backup archive to tar.gz file:

`tar cpzf [tar.bz file] -X [exclude list] [directory]`
  
`czf` create file.tar.bz  
  
`p` preserve file permissions.  
  
`X` exclude files listed in this file  
  
These tar arguments should cover all we need for our basic backup script. Time to start building the script.
  
1. vim backup.sh (call it whatever you want)

For the sake of simplicity and organization I am going to break this down into two functions. The first will be  the backup function. We will also need a few global variables (I might change these to local vars depending on the needs of the script as I move forward).

having our global variables up top makes it very easy to edit our settings if needed later on. The one we need to look at is our exclude\_list. I put this list in the same directory as the backup script. Here is what mine looks like:

Now set this as a cron job to run at your desired backup intervals. I have mine set to run once a week as my data does not change all that often and the world would not stop spinning if I lost something between that week. Create a cron file call backup in `/etc/cron.d/` with the following (adjust to meet your needs).

This sets the script to run at 12am every Saturday.

*Part 2:*  

This part gets a little more tricky. We will need to write a function to look at the backup tar file and check if it is beyond a date we specify to retire that backup. Since I am going to have it set to retire older backups before it takes the new backup I will test the files creation date against the current date and see if it is beyond our retention policy. I am going to call this function retire.

First lets get the last modified time.  We can do this with the stat command:

`stat -c%y [tar archive] | cut -c1-10`

`-c` or `format=`: this lets us modify the output of the stat command

`%y` gives us the date the file was last modified

Output of stat command:

`2014-11-22 05:41:56.045547078 -0800`

At this point in time we only care about the date so we can pipe this to cut command to snip off what we need.

`cut -c1-10`

`-c` characters to cut

This give us just what we need:

`2014-11-22`

for this I am also going to need one more global var called `retire_after`. This will be our retention policy set in how many days we would like to keep the backups. I am going to set mine for 14 days (two weeks). The easiest way to explain this function will be to show it first and go over what it is doing after.

First we get a list of all the files in the backup location, then we get the retire date. Once we have those things we check to see if the list is empty.  
`$valid`  
hold a regex expression that we use to check if  
`$files[0]`  
contains a `\*` at the end of its string. If it does contain a `\*` it means the folder was empty.  Now loop through the backup files and figure out if they match the retire date. If they do then we remove them. Then we add the retire function under the main section of our script:

This completes our requirements for a backup script. Here is the script in it entirety.

If you have been following along you probably noticed a few issues with the script.

*Known Issues:*  

1. Since the script is set to run weekly we can only retire on weekly increments. While this works just fine for me it might not work for every situation.

2. If the script gets skipped one week it might strand a older backup. This can be cured with more tests on the tar files for age in the retire function.

*Conclusion:*  

I am sure there are other issue with this script but for my basic needs at home this does the trick. I will post the full script to the Codeholics github page. Part two of this post will be writing the wrapper script for restoring files.