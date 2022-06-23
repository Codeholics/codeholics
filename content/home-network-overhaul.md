Title: Home Network Overhaul
Date: 2022-06-20 18:39
Category: Hardware
Tags: networking, hardware, review, firewall, pfsense, tplink, asus, router, switch, vlan, infosec

### Pre-Reqs
* An understanding of IP networking

### Intro

Most home users have a flat network on the private range of `192.168.1.1/24`. This allows for 254 devices including the router.
This is alright for most users but has become more of a concern with the lacking security in IoT devices. 
With this said this post will not be a in depth look into the topic of home IoT devices but more of a look at how I have used
what I have learned through my career in IT to plan the setup of my home network. This setup is not for most people. The concepts
I learned many years ago in CCNA classes. I have also implemented and worked directly with advanced networking typologies over my 20+ year career
in various positions throughout the industry. This post is in no way a flex as I did this on a small budget and used what I had
available to me and bought adequate hardware for things I didn't have. 

### Planning

All good network implementation start with a plan. It is important to understand the goals you are trying to achieve with
your current networking needs and understand what your future needs might be. If you design your network properly up 
front it will grow as your needs grow. Taking time up front will save your future self time. 

#### My Goals

My environment has the standard things most houses have with laptops, phones, Roku sticks, personal assistance, cameras... 
but I also have a bit more than the average home. I have a file server, beefy 4U server and a Raspberry Pi cluster. 
I wanted to create a few vLANs and rich firewall rules to keep these devices orginized and make sure they do not get out of line. 

#### Network Topology Diagram

Once you understand your goal it is time to get a high level understanding of what you have and what you need to achieve that goal.
In the enterprise space you would use expensive software like MS Visio to do a network diagram but this can be done with other software that is 
freely or openly available to everyone. For this project and for projects I have helped out with in the past I use the Google Suit.
For the network diagram I use Google Drawings. For the network address layout and VLAN switch port assignments I use Google Sheets. 
This method has served me well when I want to collaborate with people on a project or just use multiple devices to access the projects
artifacts.  
  
When it comes to network diagrams it is nice to have official asset images. Network topology images can be downloaded from Cisco:
[Network Topology Icons](https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html)

I unzipped the JPG icons and uploaded them into my Google Drive to have them available for my Google Drawings. 
Now if you have not take CCNA classes, read networking books or worked in this space these icons might not mean anything to you. 
The icons I will use in my network topology diagram are:  

| | | | |
| :----: | :----: | :----: | :---: |
|**Modem**|**Firewall Router**|**Switch**|**WiFi Router**|
| ![modem icon]({static}/images/networking_icons/modem.jpg) | ![firewall router icon]({static}/images/networking_icons/router_firewall.jpg) | ![switch icon]({static}/images/networking_icons/workgroup_switch.jpg) | ![wifi router icon]({static}/images/networking_icons/wireless_router.jpg) |

I could have used a Access Point icon as the WiFi Router icon could be a bit confusing since it will only be acting as a Access Point but
this is for my home network and not an enterprise network so I know what it is. With that said, you do not need to do icons if this is just for you.
You can just do boxes or whatever makes sense to you.  

Here is what the first version of my network topology diagram looked like:

![network topology v1]({static}/images/home_network_overhaul/network_topology_v1.webp)

The things that were known going into the first iteration of the network topology design:

1. I was going to re use my current Asus router in AP mode
2. I needed a 24 port switch that supported VLANs
3. I needed a more feature rich firewall router that supports VLANs and rich firewall rules
4. I was going to use the 192.168.0.0/16 address space
5. 192.168.1.0/24 was going to be my network management subnet
6. 192.168.2.0/24 was going to be my wireless device subnet

#### VLAN Network Assignment
The next task is laying out all the additional VLANs and subnets that are  needed.

![network vlan layout]({static}/images/home_network_overhaul/network_vlan_layout.webp)

At this point it time to start acquiring the hardware needed to get the job done.

### Hardware

What I had:

* [Asus AC1900 (RT-AC68U)](https://amzn.to/3bnH7VX)  
Price: $129.99  
  
The Asus RT-AC68U is a basic Wifi router with a 4 port switch. I had this for only a few months as my Asus RT-AC66U power switch gave out after its loyal service for about 5 years. 
The RT-AC68U has never been stable in Router Mode. I had constant connection issues and had to reboot it often. My hope in continuing to use the device was that 
these issues might go away in AP Mode. (Spoiler Alert!!) So far so good in using it in AP Mode.
  
New hardware:

* [Protechtli FW20216](https://protectli.com/product/fw2/)  
Price: $179 (No Longer sold)

* [Protechtli FW2B](https://protectli.com/vault-2-port/)  
Price: $259

I included two links because the model I have is no longer avalible and has been updated to a newer model. Before I go on about how nice this device is it is
probably worth a reminder that I am not getting paid for this post. 

I got my hardware from a friend who decided the device was not right for their enviornment so I got it for the low low price of free. I had never heard of the company 
Protechtli but I was immediately impressed. First thing I noticed when I unpacked this device was the quality of the case. It is a beautify designed thick all aluminum case. 
The specs on the device should have plenty of power for running in my environment. 

* [TP-Link TL-SG1024DE](https://amzn.to/3ndATL4)  
Price: $99

When I was searching around for a switch I had in mind a few things I wanted and a dollar amount I wanted to stay under. I also didn't want to buy used network hardware off of ebay
because you have no idea the devices history and Cisco IOS is behind a pay wall. The TP-Link TL-SG1024DE 24 port switch is a really nice feature rich budget switch. It is low power and has a
fanless design. 

Things this had that I neeeded:  
* VLAN
* LAG
Things it was lacking that I wanted:  
* POE
* Trunking

In the future when needs and budget grow I will look into a 24 port switch that offers the things I wanted but you are looking at $200+ extra for a switch with these features. 
At the moment this was not in the network project budget. You really can not beat the price tag on this switch for the feature set it provides. I will also need to update my AP
or see if maybe another firmware would support multiple VLANs in AP mode. 

* [NavePoint 9U Wall Mount IT Open Frame 19 Inch Rack with Swing Out Hinged Gate Black](https://amzn.to/3bpUu84)
Price: $116

* [AC Infinity Vented Cantilever 1U Universal Rack Shelf](https://amzn.to/3OCipzK)
Price: $35

### Switch Port VLAN Assignment Diagram

The reason this is not included with the planning is because this can be a more fluid document and the port configuration can depend on the features of the switch. 
What my configuration is as of this moment is far from finalized as I have not setup an LAG groups for my server and I have not setup the ports for the Pi cluster.
