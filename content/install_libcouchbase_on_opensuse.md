Title: How to Install libcouchbase on OpenSuse to use the Couchbase Python Module
Date: 2019-02-20 16:06
Author: vesc
Category: Linux
Tags: os, coding, python, couchbase, dev, linux, opensuse
Slug: how-to-install-libcouchbase-on-openSuse-to use-couchbase-python-module
Status: published

*OS:* OpenSuse Tumbleweed
  
Here are the steps to get libcouchbase installed on OpenSuse:

### Get dependences:

```
sudo zypper in libev-devel cmake openssl-devel
```

### Get source:

```
git clone https://github.com/couchbase/libcouchbase.git
```

### Run config and build:

```
cd libcouchbase
mkdir build
../cmake/configure
make
```

### Run tests:

```
cmake
```

### Install:

```
sudo make install
```

### Load newly installed libcouchbase shared objects:

```
ldconfig -v
```

### Install Couchbase Python Module:

```
pip install coucbase
```