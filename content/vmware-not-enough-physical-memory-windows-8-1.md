Title: VMware not enough physical memory windows 8.1
Date: 2015-02-05 16:06
Author: root
Category: Windows
Tags: os, windows, vmware
Slug: vmware-not-enough-physical-memory-windows-8-1
Status: published

I have been using VMware for a long time now and this is the first I have ever seen an error with physical memory when trying to run my VMs. My VMs were running fine until my Windows 8.1 rebooted after automatic updates. After the reboot my VM wouldnt start and would displayed a messages as if my system had 4gb of ram but I was trying to allocate 8gb of ram.

During my troubleshooting I did exactly what the message said by lowering the memory I have assigned to that machine to 1gb. Rebooted my VM and another message came up but this time it said to allocate less than 600kb!

Long story short, there was no issue with the my system memory but Windows update  
*KB2995388*  
broke my VMware Workstation 10.

++This is how you fix this.++