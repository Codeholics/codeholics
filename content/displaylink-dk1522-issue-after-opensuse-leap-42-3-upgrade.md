Title: Displaylink DK1522 Issue after OpenSUSE Leap 42.3 Upgrade
Date: 2017-12-20 15:19
Author: vesc
Category: Linux
Tags: os, coding, C, Lenovo, Linux, OpenSUSE, patch, Shell, Upgrade
Slug: displaylink-dk1522-issue-after-opensuse-leap-42-3-upgrade
Status: published


It is the end of the year and the time I use to upgrade my Lenovo P50 to the latest OpenSUSE Leap version. I do it this time of year because I expect to have some issue that I will need to work through after the upgrade and since this is my work machine I pick a time of year when the office is quite and all the major projects are completed for the year.

I am not going to go over the upgrade process as this is well covered in the OpenSuse documentation and other posts. The upgrade from 42.2 to 42.3 was in fact fairly smooth. The things that I expect to have problems with are the Displaylink DK1522 dock since it was a fairly involved process to get it running in the first place since they only officially support Ubuntu and the Nvidia display driver. Once the upgrade was completed and the dust settled. I plugged in my Displaylink DK1522 and hit 'Meta+D' the shortcut I have mapped to run a shell script with the xrandr commands to setup the external displays. As I anticipated nothing happened and with that it was time to start digging. Looking over a few things I see the dlm service has errored out and there is some log errors.

First thing I did was check the [Displaylink](http://www.displaylink.com/downloads/ubuntu "Displaylink") site expecting a new version of the Linux drivers. I was running the 1.2.x version and they recently released 1.4. This was exciting because I was having some screen paint issues that were fairly annoying. After downloading their package if you are using anything other than Ubuntu you will need to make so  
adjustments to the displaylink-install.sh script. After unzipping the file unpack the displaylink-driver-1.4.210.run.

`./displaylink-driver-1.4.210.run --noexec --keep`

Then navigate to the displaylink-driver-1.4.210 file.

Copy [displaylink-installer.patch](https://pastebin.com/ADpYR2nd "displaylink-installer.patch") into a  
displaylink-installer.patch and apply the patch.

`patch displaylink-installer.sh displaylink-installer.patch`

Once this was done and I went to install it. I got an error when it was building the evdi module. I have filed a issue on github that also has the work around: [evdi-issues-110](https://github.com/DisplayLink/evdi/issues/110 "evdi-issue-110")

To apply the fix to evdi copy the text from Github into a patch file evdi\_fb.patch and extract the evdi-1.4.210-src.tar.gz package.

```
mkdir evdi
tar xzf evdi-1.4.210-src.tar.gz -C ./evdi
patch ./evdi/evdi_fb.c ./evdi_fb.patch
tar czf ./evdi-1.4.210-src.tar.gz -C ./evdi .
```

Once the change is made to the evdi package it should install as intended.

After the module package was installed I hopefully plug in my displaylink and hit 'Meta+D'. Once more nothing happened. Looking at the logs I started seeing these type of errors:
```
...
Dec 19 11:24:02 linux-olhs.suse kernel: evdi: disagrees about version of symbol drm_framebuffer_cleanup
Dec 19 11:24:02 linux-olhs.suse kernel: evdi: Unknown symbol drm_framebuffer_cleanup (err -22)
...
```

I tried loading the module manually with modprobe evdi and got the following error.
```
modprobe: ERROR: could not insert 'evdi': Invalid argument
```
The 'dkms status' command showed everything was install properly

After googling for hours and trying lots of non-solutions I noticed a similar log error for my nvidia driver. The lead me to try and reinstall the nvidia driver and it was erroring out. I went back to see if things had changed on the OpenSuse / NVidia driver front and to my delight there is now a NVidia supported OpenSUSE repo for OpenSUSE leap and Tumbleweed.

NVidia drivers have been a thorn in my side for many years so I was excited to add the repo and zypp my problems away.  
Reading the steps lead me to the problem with the Displaylink driver:
```
sudo zypper rm drm-kmp-default
```
After removing this package and install the new NVidia driver all my issues were resolved. With the new Displaylink driver I no longer have the screen refresh issues I had with the prior version.

I also can not wait to use this nvidia repo on my tumbleweed desktop. This should make upgrades a lot less of a hassle. I hope this post helps anyone with a similar setup to mine who might be experiencing a similar issue.