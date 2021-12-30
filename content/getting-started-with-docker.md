Title: Getting Started with Docker
Date: 2015-02-12 04:33
Author: root
Caregory: Sysadmin
Tags: docker, sysadmin, linux
Slug: getting-started-with-docker
Status: draft

*OS:* OpenSuse 13.2  
*Skill Level:* Intermediate

*Setup:*

# Notes for updated post:

- remove dangling images: `docker images --filter "dangling=true"`
- using filter

1. First off install the package
```
sudo zypper -y in docker docker-bash-completion
```

2. Add your user account to the docker group. You will need to log out and log back in for this to take effect.
```
sudo usermod -G docker -a [username]
```
3. (Optional) Set docker to start on boot
```
sudo systemctl enable docker
```
4. Start docker service
```
sudo systemctl start docker
```
Now we are ready to start using docker! First thing we want to do is grab a docker container from [https://registry.hub.docker.com/](https://web-beta.archive.org/web/20150423055425/https://registry.hub.docker.com/ "https://registry.hub.docker.com/"). There are a lot of images I am sure you can find one to fit your needs. If you are familiar with git using docker will fill vary natural.

*Using Docker:*

1. Pull a image:

This will pull down the latest CentOS image.

2. Get a console in a container from the image:
```
docker run -i -t [image] /bin/bash  
```
  
I found myself using this command a lot while building and playing with images, so I created a little wrapped script:

With this I can just run:
```
docker-term [image]
```
I find myself scripting everything I can. It is easier then remembering the command line args of every program.

Now that you have a terminal you can do whatever you want to the container. Though you will find little differences between working with a docker container an a fully booted system.

*IMPORTANT:* (This seems to confuse a lot of people from all the reading I have done on docker)

Go ahead and make a few files exit the shell and re-enter the image and you will notice you are back to the original docker image. Why is this?

1. Each time you run a terminal on an image a new container is created and assigned a Container ID. It is important that we understand the difference between these two states. I did not fully understand this at first and if you read this post before this update sorry for the confusion.

Image: A committed state of a container

Container: A dynamic state of a image

To access and find past containers run:  
`docker ps --all`
  
This will show you all past and present containers. To recall a container run:
```
docker start [container ID]
```

To re-attach to a terminal run:
```
docker attach [container ID]
```
Only run this on a container with a terminal enabled.

To remove a container run:
```
docker rm [container ID]
```
Let say you have made some changes in your current container that you want to keep as an image.

1. Keep your docker image terminal open and bring up another terminal

2. Find your docker image id

This will show you all your running docker processes (just in case ps was not a given)

3. Commit your image:

now when you run
```
docker images
```
you will see your newly created image

*Conclusion:*

This is a quick intro to Docker. Hopefully from this you can see some of the potential of Docker and how powerful it can be. Think of instead of moving source code we can move a full image between users with all dependence baked into the image. My next post on Docker will cover creating a MongoDB image from a Dockerfile and how to set up that container to be accessed form an application.

Links:

[https://www.docker.com/](https://web-beta.archive.org/web/20150423055425/https://www.docker.com/ "https://www.docker.com/")
