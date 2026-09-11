---

title: "Get the exit code of a bash command"
date: "2016-02-25 16:00"
author: "root"
category: "Linux"
tags: "os, linux, sysadmin, bash, shell"
slug: "get-the-exit-code-of-a-bash-command"
status: "published"
---


If you want to see the exit status of a Linux shell command in bash use the variable  
`$?`  
This will return the exit status of the last command.

Now this will only give you the right most exit code if you are piping a command.

`~> ls | sort`  
  
the last command sort would be the exit code in  
`$?`