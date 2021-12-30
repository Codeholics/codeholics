Title: Microsoft Visual Studio and SQL Management Studio error Exception has been thrown by the target of an invocation
Date: 2015-06-18 14:56
Author: root
Category: Windows
Tags: microsoft, windows, mssql
Slug: microsoft-visual-studio-and-sql-management-studio-error-exception-has-been-thrown-by-the-target-of-an-invocation
Status: published

I recently ran into an error one day trying to open my SQL Management Studio application. I have been using this application for years now but one day it just would not launch and just displayed an error message Exception has been thrown by the target of an invocation.

I found this error is more common with Visual Studio but I can see how this might also affect more than just Microsoft applications.

In order to fix this you will have to manually edit your registry. This error is caused because the PATH value is more than 2078 characters long. You can remove the lines for applications you no longer use or shorten the path to resolve this issue.

**  
This is how to fix it:  
**