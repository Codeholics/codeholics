Title: Make a Bootable Flash Drive from an ISO file in Linux
Date: 2015-07-17 19:59
Author: root
Category: Linux
Tags: linux
Slug: make-a-bootable-flash-drive-from-an-iso-file-in-linux
Status: published

Make a Bootable Flash Drive from an ISO file in Linux  

*OS:* *nix based systems  
*Skill Level:* Beginner  
*Prerequisites:* Terminal, The Power of Root

There are a few ways of creating a bootable USB drive. This is my preference. Using dd is quick, easy and available on all \*nix systems. In fact, most GUI tools are just dd wrappers, so lets cut out the fluff and get down to it.

1. Figure out the device path to your usb drive:

`sudo fdisk -l`

This will list all your drives:

2. Now using dd use the following command of course replacing the path with the path to the ISO image you want to use on the removable device.

`sudo dd if=/path/to/a.iso of=/dev/sd(x) && sync`

This might take a few minutes, but once it is done boot from the removable device.