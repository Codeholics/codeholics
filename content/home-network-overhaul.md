Title: Home Network Overhaul with Enterprise Techniques
Date: 2022-06-20 18:39
Category: Hardware
Tags: networking, hardware, review, firewall, pfsense, tplink, asus, router, switch, vlan, infosec

### Pre-Reqs
* An understanding of IP networking

### Intro

Most home users have a flat network on the private range of `192.168.1.1/24`. This allows for 254 devices including the router.
This is alright for most users but has become more of a concern with the lacking security in IoT devices. 
With this said this post will not be an in depth look into the topic of home IoT devices but more of a look at how I have used
what I have learned through my career in IT to plan the setup of my home network. This setup is not for most people. The concepts
I learned were picked up many years ago in CCNA classes. I have also implemented and worked directly with advanced networking topologies
over my 20+ year career in various positions throughout the industry. This post is in no way a _flex_. I did this on a small budget using
what I had available to me and bought adequate hardware for things I didn't have. 

### Planning

All good network implementations start with a plan. It is important to understand the goals you are trying to achieve with
your current networking needs and understand what your future needs might be. If you put in the up front work to design your network 
properly, it will grow as your needs grow saving you valuable future time.

#### My Goals

My environment has the standard things most houses have: laptops, phones, Roku sticks, personal assistance, cameras... 
but I also have a bit more than the average home. I have a file server, beefy 4U server and a Raspberry Pi cluster. 
I wanted to create a few VLANs and rich firewall rules to keep these devices orginized and make sure they do not get out of line. 

#### Network Topology Diagram

Once you understand your goal, it is time to get a high level understanding of what you have and what you will need to achieve that goal.
In the enterprise space, you would use expensive software like MS Visio to do a network diagram, but this can be done with other software that is 
freely or openly available to everyone. For this project and for projects I have helped out with in the past I use the Google Suite.
For the network diagram I use Google Drawings. For the network address layout and VLAN switch port assignments I use Google Sheets. 
This method has served me well when I want to collaborate with people on a project or just use multiple devices to access the project's
artifacts.  
  
When it comes to network diagrams, it is nice to have official asset images. Network topology images can be downloaded from Cisco:
[Network Topology Icons](https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html)

I unzipped the JPG icons and uploaded them into my Google Drive to have them available for my Google Drawings. 
Now, if you have not taken CCNA classes, read networking books or worked in this space these icons might not mean anything to you. 
The icons I will use in my network topology diagram are:  

| | | | |
| :----: | :----: | :----: | :---: |
|**Modem**|**Firewall Router**|**Switch**|**WiFi Router**|
| ![modem icon]({static}/images/networking_icons/modem.jpg) | ![firewall router icon]({static}/images/networking_icons/router_firewall.jpg) | ![switch icon]({static}/images/networking_icons/workgroup_switch.jpg) | ![wifi router icon]({static}/images/networking_icons/wireless_router.jpg) |

I could have used an Access Point icon instead of the WiFi Router icon since  the router will only be acting as an Access Point, 
but this is for my home network and not an enterprise network, so I know what it is. With that said, you do not need to 
do icons if this is just for you. You can just do boxes or whatever makes sense to you.

Here is what the first version of my network topology diagram looked like:

![network topology v1]({static}/images/home_network_overhaul/network_topology_v1.webp)

The things that were known going into the first iteration of the network topology design:

1. I was going to re-use my current Asus router in AP mode
2. I needed a 24 port switch that supported VLANs
3. I needed a more feature rich firewall router that supports VLANs and rich firewall rules
4. I was going to use the 192.168.0.0/16 address space
5. 192.168.1.0/24 was going to be my network management subnet
6. 192.168.2.0/24 was going to be my wireless device subnet

#### VLAN Network Assignment
The next task is laying out all the additional VLANs and subnets that are needed.

![network vlan layout]({static}/images/home_network_overhaul/network_vlan_layout.webp)

At this point, it's time to start acquiring the hardware needed to get the job done.

### Hardware

What I had:

* [Asus AC1900 (RT-AC68U)](https://amzn.to/3bnH7VX)  
  
The Asus RT-AC68U is a basic Wifi router with a 4 port switch. I had this for only a few months as my Asus RT-AC66U power switch gave out after its loyal service for about 5 years. 
The RT-AC68U has never been stable in Router Mode. I had constant connection issues and had to reboot it often. My hope in continuing to use the device was that 
these issues might go away in AP Mode. (Spoiler Alert!!) So far so good in using it in AP Mode.
    
Probably most important is the UPS. It is not depicted in the Network Topology Diagram. It would be in a Network Rack Diagram. I am not going to go over the Network Rack Diagram in this post. 
If you are going to drop some money on equipment you need to protect it. I have a CyberPower UPS that I have been using 
for a few years. It is not rack mounted, but I had this long before I had a rack. 

* [CyberPower CP900AVR](https://amzn.to/3Ngvo92)

If I were going to buy a UPS for this project I would probably go with this:

* [CyberPower OR700LCDRM1U Smart App LCD UPS, 700VA/400W, 6 Outlets, AVR, 1U Rackmount](https://amzn.to/39PEYSM)

The price is good and it is a 1U design

New hardware:

* [Protechtli FW20216](https://protectli.com/product/fw2/)  

* [Protechtli FW2B](https://protectli.com/vault-2-port/)  

I included two links because the model I have is no longer available and has been updated to a newer model. Before I go on about how nice this device is, it is
probably worth a reminder that I am not getting paid by Protechtli for this post. 

I got my hardware from a friend who decided the device was not right for their environment so I got it for the low, low price of free. I had never heard of the company 
Protechtli but I was immediately impressed. First thing I noticed when I unpacked this device was the quality of the case. It is a beautifully designed, thick, all aluminum case.

The specs on the device should have plenty of power for running in my environment. These devices do not come pre-loaded with an OS. I am using PFSense CE on my device. 

* [TP-Link TL-SG1024DE](https://amzn.to/3ndATL4)  

When I was searching around for a switch I had in mind a few things I wanted and a dollar amount I wanted to stay under. I also didn't want to buy used network hardware off of ebay because you have no idea the device's history, and Cisco IOS is behind a pay wall. The TP-Link TL-SG1024DE 24 port switch is a really nice, 
feature rich budget switch. It is low power, and it has a fanless design. 

Things this had that I neeeded:  
* VLAN
* LAG
Things it was lacking that I wanted:  
* POE
* Trunking

In the future when needs and budget grow, I will look into a 24 port switch that offers the things I want. However, you are looking at $200+ extra for a switch with these features. At the moment this was not in the network project budget. You really cannot beat the price tag on this switch for the feature set it provides. I will also need to update my AP or see if maybe another firmware would support multiple VLANs in AP mode. 

* [NavePoint 9U Wall Mount IT Open Frame 19 Inch Rack with Swing Out Hinged Gate Black](https://amzn.to/3bpUu84)

* [AC Infinity Vented Cantilever 1U Universal Rack Shelf](https://amzn.to/3OCipzK)

I have the 9U rack mounted to a fire rated backer board in a spot down in the basement. I had already had the spot setup as I have been wanting to do this project for sometime. The rack was very easy to mount. I was able to do it all myself without having to call anyone over to lend a hand. 
The 1U shelves worked out really well for keeping items that were not rack mountable in a nice location within the rack.

### Finished Network Topology Diagram

Once the hardware is selected, a little more detail can be added to the final topology diagram.

![network topology v2]({static}/images/home_network_overhaul/network_topology_v2.webp)

### Switch Port VLAN Assignment Diagram

The reason this is not included with the planning is due to the fluid nature of the document, and the port configuration can depend on the features of the switch. 
My configuration is not finalized as of this moment, as I have not setup any LAG groups and the additional ports for the Pi Cluster. This will all be done at a later time.

Having a document like this is handy for easy deployment and future troubleshooting. 

![Network Switch Port Assignment]({static}/images/home_network_overhaul/switch_port_assignment.webp)

### Conclusion

The main goal of this post was to introduce some of the upfront processes and tasks that go into enterprise network planning and some of the techniques that can be utilized to keep a more complex networking project in order. 
The techniques for enterprise deployments can be applied on a home network as well if your needs are a little more demanding like mine. 
  
There is one document that I should have gone over but will not for this small project: The Rack Level Diagram. This diagram displays all the equipment at the rack level so you know where everything will be placed and can make sure it all fits. I didn't do one of these because I simply had an idea in my head of how all these things would fit together, and since it was just for me I didn't need it. 
  
The topic of computer networking is very deep. While some of the hardware has gone virtual the concepts and practices remain the same. Having a solid foundation in networking has given me an edge throughout my career working with virtulization, containerization and cloud technologies. 
I would like to give a special thanks to George Markwick who has been an amazing friend and mentor throughout my career, and it was he who taught me these techniques early on in my career while we were designing and building out IDFs, MDFs and Data Centers. 

I am going to leave this post off with a few pictures of everything racked up:  

![just mounted rack]({static}/images/home_network_overhaul/just_mounted.webp)
![before switch]({static}/images/home_network_overhaul/before_switch.webp)
![rack as of this post]({static}/images/home_network_overhaul/rack_today.webp)
   
My next steps are getting a 1U cable tray to get those cables under control and getting a rack mount for the Pi Cluster.
If you enjoyed this post, please consider becoming a sponsor. The funds will be used to help keep Codeholics rolling.  

### Links:

* [Network Topology Icons](https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html)
* [Asus AC1900 (RT-AC68U)](https://amzn.to/3bnH7VX)  
* [CyberPower CP900AVR](https://amzn.to/3Ngvo92)
* [CyberPower OR700LCDRM1U Smart App LCD UPS, 700VA/400W, 6 Outlets, AVR, 1U Rackmount](https://amzn.to/39PEYSM)
* [Protechtli FW20216](https://protectli.com/product/fw2/)  
* [Protechtli FW2B](https://protectli.com/vault-2-port/)  
* [TP-Link TL-SG1024DE](https://amzn.to/3ndATL4)  
* [NavePoint 9U Wall Mount IT Open Frame 19 Inch Rack with Swing Out Hinged Gate Black](https://amzn.to/3bpUu84)
* [AC Infinity Vented Cantilever 1U Universal Rack Shelf](https://amzn.to/3OCipzK)
* [Github Sponsors](https://github.com/sponsors/jessecooper)
