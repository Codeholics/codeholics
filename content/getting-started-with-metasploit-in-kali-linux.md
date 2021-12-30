Title: Getting Started with Metasploit in Kali Linux
Date: 2015-07-24 16:51
Author: root
Category: Linux
Tags: infosec, kali linux, linux, sysadmin
Slug: getting-started-with-metasploit-in-kali-linux
Status: published

*OS:* Kali Linux  
*Skill Level:* Intermediate  
*Prerequisites:* Linux CLI, Basic Networking Concepts, PostgresSQL

Metasploit is the closet thing to push button security and penetration testing one can find. It is by far the most popular security testing framework. Metasploit has thousands of modules and is growing daily with a very active community getting modules for exploits out not long after they have been reported. The framwork is written in Ruby so, if that is your language of choice you might want to join in on the action. No InfoSec teams tool kit should be without this tool when trying to keep the castle walls strong against would be attackers. Since it is open source and widely available in most Linux distros you can bet someone might try or be trying some of these modules against your network and systems as you read this.

*Real life use case:*  
I was able to identify and finger print a DOS (Denial of Service) attack and find a module in Metasploit to replicate the attack and help an InfoSec and Network Team strengthen the configuration of the IPS (Intrusion Prevention System) and block out attacks of this type. Later on I will come back with a post about (D)DOS attacks and preventative measures. Lets get started with setting up Metasploit with a PostrgesSQL database in Kali Linux.

1. First of install kali linux we assume you got that covered.

2. Open a command prompt and type (as root or with sudo):
`# service postgressql start`  
this will bring up the postgres database

3. Bring up the metaspoit service

Since this is your first time running it. It will detect that postgres is running and set up the Metaspoit database.

4. Now its time to play and run the Metasploit console

Now lets get started with understanding workspaces. Workspaces help separate testing information.

to see all the options for the `workspace`
command:

Lets add a workspace:

now if you type `workspace` you can see you are using the test1 workspace instead of default.

the first step of security tests is reconnaissance to gather information about a system or environment. We can do this using nmap. Nmap is a port scanning tool that can identify services running on a system and try to figure out the operating system running on that system. Metasploit has nmap built in and can add the results straight to the workspaces database so the results can be easily filter through to find systems with services that you want to test with a specific module. The nmap module is call  
`db_nmap` 
and you can pass it all the same commands you would when using nmap outside of the metasploit framework.

Nmap will do its thing and now you will have that information in your database.

to look at the information we have gathered  use the hosts and services commands.

hosts: Shows all host information like DNS name and OS type.

services: Shows all running services the port scan picked up and what service they might be.

As with all commands you can pass them the `-h`
and get help information. The most helpful I found was filtering services out by port number and adding them to the `RHOST` global variable.

This will add all hosts that have a service running on port 80 to the `RHOST` global variable. This is most likely a web server because port 80 is the standard HTTP port. We can check the variable values by using the set commands this is also used as you might have guessed to set a variables value:

This is important for setting up variables for modules to run.

To select a module to use we type
`use [module]`. Module are broken up in categories such as auxilary then broken down further from there. I guess I can not leave this hanging without running a module against our RHOST that we set, so lets run the module that helped ID the attack in the beginning of this post.

check the variables with set but we should be good to run at this point since we have a host running a web server. If you go to run it and get and error it is probably do to the interface not being set correctly. If you are on wireless use:

now exploit:

It should start sending a synflood to the host you have selected. Since you are doing this to a lab system or a system you own (disclaimer :-)). Log on and check the activity with netstat -t you should see a bunch of this:

Now if this was behind a properly configured IPS or IDS it would get blocked, alert the interested parties and service would continue with normal users not noticing anything. Now go have some fun with the other module and make sure the walls are strong and systems are secure. I will try to cover some more modules later as I go deeper into web application security.

Links:  
[https://www.kali.org/](https://www.kali.org/)Kali Linux  
  
[https://www.metasploit.com/](https://www.metasploit.com/)Metasploit