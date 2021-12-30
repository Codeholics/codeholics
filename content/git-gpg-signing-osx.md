Title: Git GPG Signing Setup on OSX
Date: 2021-02-22 07:39
Category: Infosec
Tags: coding, git, crypto, infosec, osx, gpg, gnupg

### Intro
Setting up Git commit and tag signing with GnuPG on Mac OSX is not as straight forward as one would like it to be. Here are the steps I used to get it set up. Before hand I was getting the following error:
```
git commit -S -m "test signing"
error: gpg failed to sign the data
fatal: failed to write commit object
```

### Steps
Getting GnuPG setup and configured properly
```
brew upgrade gnupg
brew link --overwrite gnupg
brew install pinentry-mac
echo "pinentry-program /usr/local/bin/pinentry-mac" >> ~/.gnupg/gpg-agent.conf
killall gpg-agent
```
Once that is set up configure git
```
# create a key if you already have not done so
gpg --gen-key
# configure git
git config --global gpg.program gpg 
git config --global user.signingkey <key_id>
git config --global commit.gpgsign true  # if you want to sign every commit
```
Add signing flag when committing or tagging
```
git commit -S -m 'Signed commit'
git tag -s v1.5 -m 'my signed 1.5 tag'
```
Viewing signatures
```
git show v1.5
git log --show-signature -1
```
Verifying signatures
```
# check tag signature
git tag -v <tag-name>
# verify signature before merging
git merge --verify-signatures signed-branch
```
  
I hope this is helpful for people looking to start signing their Git commits on OSX.
### Links:
* [Git Tools Signing Your Work](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work)
