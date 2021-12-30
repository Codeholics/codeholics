Title: Understanding Linux Basic Disk Partition Setup
Date: 2016-03-25 11:30
Author: root
Category: Linux
Tags: os, linux, tutorial
Slug: understanding-linux-basic-disk-partition-setup
Status: published

Recently I was asked the question what are the needed Linux partitions and what are they for? With that I thought it would be a good post because this is something that is very overlooked since distro installs have become so simple most people just go with the defaults, but as always it is important to know what is going on under the hood. I will go over a minimal disk configuration and with a minimal disk configuration you only need three partitions.

The first and most important partition on any Linux disk layout is the */boot* partition.

The */boot* partition holds your boot loader and boot loader configurations and Linux kernel images. This partition only needs to be about 300 to 400MB.

The next partition would be your *swap* partition. This is disk space the system will use under heavy memory usage. The *swap* partition should very in size based upon your systems memory configuration. Here are some rules of thumb when configuring your *swap* partition:

The last partition in the list of minimum need partitions in a Linux system is the */* _root_ partition. The root partition should be the remained of your hard disk under a basic setup. This partition will have all your user and application files.

This is by far this most simplistic setup of a disk on a Linux system and most automated configurations will do a more complicated setup of the disk using LVM (Logical Volume Manager) to manage the */* root and *swap* partitions. In any configuration though under any file system type, manager or raid configuration the */boot*, */* and *swap* partitions are still the minimum partitions needed for a Linux system.