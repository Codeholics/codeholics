Title: Kali Linux (rolling) Blank Screen Fix
Date: 2020-10-23 13:41
Author: vesc
Category: Linux
Tags: linux, kali, blank screen, quick fix
Slug: kali-rolling-blank-screen-fix
Status: published


Recently I installed the latest Kali Linux on my old Asus Eee PC Netbook and was met with a blinking cursor `_` after install. After hitting Alt+F1 and dropping into a terminal I ran all the updates I could and did a reboot with no change to the
DE issue. I did a quick `apt search intel` to see what Intel packages were installable since this has Intel integrated graphics. In the list I found the `xserver-xorg-video-intel` package. Once this was installed `sudo apt install xserver-xorg-video-intel` and  
the system was rebooted the DE was able to load with no issues. I seen a lot of posts on the Kali forum about this issue and instead of creating yet another forum account I decided to post the solution here and maybe this will help someone out who finds themself in the same situation. 
Next on this old Netbook is to try out i3 window manager and see if I can make this old netbook still usable in the modern world. 
