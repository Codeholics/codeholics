Title: LVM: Move a logical volume into a new volume group.
Date: 2016-01-22 08:23
Author: vesc
Category: Linux
Tags: linux, sysadmin
Slug: lvm-split-a-volume-group-into-a-new-volume-group
Status: published

*OS:* *nix  
*Require:* LVM, the power of root  
*Skill Level:* Intermediate

Here is how to move a logical volume into a new volume group in LVM using `vgsplit`  
  
Lets say you want to change the volume group settings for some of your logical volumes or you just want the logical volumes better organized.

1. Use vgsplit to move your logical volume to its new volume group.

2. Check out your new volume group with the logical volume you moved:

3. Activate your logical volume and re mount it. Make sure to update the mapping in your fstab to the new volume group name that your logical volume resides under now.

4. Go get coffee