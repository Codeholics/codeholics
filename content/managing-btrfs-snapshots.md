Title: Managing BTRFS Snapshots
Date: 2014-10-14 23:12
Author: root
Category: Linux
Slug: managing-btrfs-snapshots
Status: published

*Skill:* Advanced  
*OS:* Linux (OpenSUSE 13.1)  
*Prerequisites:* A drive with btrfs  
  
*Intro:*  
When I first installed OpenSUSE 13.1 it gave me the option of using btrfs for my file system. It warned me it was experimental but after reading up about the benefits I decided to live on the wild side and use it on my laptop. The drive is a fairly small 120gb SSD so giving up the chunk to btrfs was a bit of a sacrifice. I figured if push came to crash it would add some value and it is a new file system to play with. One day I was running my updates and the install crapped out in the middle saying I had no space available and at this point my X locked up and crapped out. I did a Ctrl+Alt+F1 to get to a command line and figure out just what the hell is happening. I do a df -h and can see no issues with my space. After a while I figure out it was my btrfs snapshots that were eating up all my space. Here is what I did to correct this issue, and set the configuration file to keep from having this issue in the future.

*Snapper:*  
Snapper is the snapshot manager tool for btrfs. Doing a snapper help should give you all the information you need to know about the basic usage and to get your system back up and running if your running btrfs and notice programs are complaining about space when you can not see why.

1. snapper list    
List all snapshots  
Do this as root and you should see something similar to this:  
```
Type    |  #      |  Pre #  | Date                               | User  | Cleanup  | Description    | Userdata    
-++-+++-++
single   | 0       |           |                                          | root  |                | current          |  
single   | 1990 |           | Sun Oct 5 00:45:02 2014 | root | timeline   | timeline         |   
single   | 2011 |           | Mon Oct 6 07:00:01 2014 | root | timeline  | timeline         |     
pre       | 2015 |            | Mon Oct 6 10:10:41 2014 | root | number  | zypp(zypper)  |    
post     | 2016 | 2015   | Mon Oct 6 10:10:45 2014 | root | number  |                         
```
Things to notice:  
  
Type Single: A single timeline snapshot taken as part of btrfs operation  
  
pre/post: These are snapshots taken before and after a zypper update  
  
\# This is the number to reference a snapshot  
  
Date Date the snapshot was taken by default btrfs keeps a lot of snapshots. I will show you how to adjust this at the end.

2\. Delete some old snapshot to free up some space  
    
`snapper delete`  

`snapper delete 1990 #this will delete single`    
  
3. Roll Back: If this happened to you like it did to me while in the middle of a update you will need this step  
  
`snapper`  
  
`snapper -v undochange [newer]..[older]`  
   
`snapper -v undochange 2041..2040 #This will undo the update changes made by zypper`  
  
4. Configure snapper retention:  
* `vim /etc/snapper/configs/root`
* Find and edit this section of the file to meet your needs and space limitations:  
```  
# limits for timeline cleanup 
TIMELINE_MIN_AGE=1800   
TIMELINE_LIMIT_HOURLY=10 
TIMELINE_LIMIT_DAILY=10 
TIMMELINE_LIMIT_MONTHLY=10  
TIMELINE_LIMIT_YEARLY=10  
```

By default it keeps the 10 last snapshots of each hourly, daily, monthly and yearly.

*Conclusion:*  
  
I hear they have worked on fixing this issue in the newer releases, but if you find yourself in my predicament I hope this helps. The thing I found ironic was the snapshot is what did me in and is what saved me after the fact.