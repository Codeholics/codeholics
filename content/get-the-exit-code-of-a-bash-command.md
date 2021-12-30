Title: Get the exit code of a bash command
Date: 2016-02-25 16:00
Author: root
Category: Linux
Tags: os, linux, sysadmin, bash, shell
Slug: get-the-exit-code-of-a-bash-command
Status: published

If you want to see the exit status of a Linux shell command in bash use the variable  
`$?`  
This will return the exit status of the last command.

Now this will only give you the right most exit code if you are piping a command.

`~> ls | sort`  
  
the last command sort would be the exit code in  
`$?`
