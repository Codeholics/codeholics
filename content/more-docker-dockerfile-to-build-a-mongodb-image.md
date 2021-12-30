Title: More Docker: Dockerfile to build a MongoDB Image
Date: 2015-02-26 03:43
Author: root
Cqtegory: Docker
Tags: sysadmin, docker, mongodb, linux
Slug: more-docker-dockerfile-to-build-a-mongodb-image
Status: published

Last post ([Getting Started With Docker](http://codeholics.com/2015/02/getting-started-with-docker/ "Getting Started With Docker")) I ended off with saying I would come back and show how to set up a mongodb docker image. If you go to https://registry.hub.docker.com/ on the first page you can find the official mongodb docker image. This is not that point of this post though. This is about getting to know and understand Docker, so we are going to do it from a base image and create a Dockerfile to do all the work for use. I like CentOS so that is what I am going to use but you can go ahead and pick your poison.

A Dockerfile is a image build script. Before creating one of these it is good to think about what steps you would take to build an image manually.

1. Mongodb repo

2. Install the packages
`yum -y install mongodb-org-server.x86_64 mongodb-org-shell.x86_64 mongodb-org-tools.x86_64`

Easy enough lets build the file:

Using your favorite text editor crate Dockerfile:

Lets break it down a bit:

```  
FROM [image]

COPY [file] [destination]  
```
Copy a file into the image.

```
RUN [command]  
```
Run a command
```
EXPOSE [port]  
```
Expose a network port

Now that we have our DockerFile run:
```
docker build -t [image name] .  
```
so
```
docker build -t mongodb.centos .
```
It will build the image and now you have your very own Mongodb Docker image.

Now to run it:
```
docker run -d -p 27017:27017 mongodb.centos /usr/bin/mongod --port 27017  
```
  
*-d* Run as a daemon
  
*-p 27017:27017* Expose port 27017 on local port 27017

*/usr/bin/mongod port 27017* Start the mongodb server and run it on port 27017

Now I hope you see the power already. I could run 100 of these just by setting up a bash script with a loop.

Now to connect to this server from the local machine run the `mongo` command and there you have it.

Hopefully this has displayed Docker in a way that makes you as excited about it as it did me when I really started digging in. If you want to collaborate with a friend or coworker on a project you could send him over your Dockerfile and know that both of you have the same environment. If you have a ready image you can just push it over to them the way you would with git. Even better you can easily push to Dev, QA, Stage and Prod without long build times and outage windows. If your not excited you should check your pulse! This does not mean docker is 100% production ready, but I am sure it will be shortly with all the attention it is getting.