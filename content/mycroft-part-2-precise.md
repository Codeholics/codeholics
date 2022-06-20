Title: Mycroft Personal Assistant Setup Part 2
Date: 2022-06-16 18:39
Category: Software
Tags: ai, coding, mycroft, raspberrypi, pi4, python, respeaker, hardware, opensource

### Intro

If you have followed the [part 1](https://codeholics.com/mycroft-personal-assistant-setup-part-1.html) of this Mycroft personal assistant setup
you have a standard Mycroft personal assistant with either the `Hey Mycroft` wake word or you tried to set it up with a custom wake word. 
If that customer wake word is using Pocketsphinx it is probably getting an unlivable amount of false positives. 
In part 2 of this series I am going to walk you through setting up a custom wake word for Mycroft using [mycroft-precise](https://github.com/MycroftAI/mycroft-precise). 
As of the time of writing this the setup was not all that straight forward and the processes of training a custom wake word is a bit more involved than one might think. 
Also [mycroft-core](https://github.com/MycroftAI/mycroft-core) defaults to an older version of Precise and the Precise Runner. A wake word you train with the newer version of Precise
will not run on an older version. I also ran into an [issue](https://github.com/MycroftAI/mycroft-precise/issues/158) along the way and the requirements for the Precise project were a bit out of date. 
This lead me to opening up a [PR](https://github.com/MycroftAI/mycroft-precise/pull/216) and I am currently running on my fork until the PR is merged. It is nice to be able to contribute back to a great project.
First I will walk through the project setup and training of the custom wake word. Then I will get into the precise configuration for the PA. 

### Custom Wake Word Project Setup 

For recording I used two different microphones that I had within my environment to train the wake word. First I used my Blue Snowball
but when I ran my model on my Picroft with the ReSpeaker hat I was not getting good results so I started training directly on the Mycroft device itself. 
Doing this gave me much better results.
    
Start off by creating the following project structure. If time permits maybe I will make a cookie cutter for this in the future. 
#### The project structure
```
jarvis
├── models
├── not-wake-word
├── README.md
├── test
│   ├── not-wake-word
│   └── wake-word
└── wake-word
```
I wanted my custom wake word to be `Jarvis` not `Hey Jarvis` just `Jarvis`. Now, I was already setting myself up for trouble because most guides tell you to use a two word wake word 
but if Tony Stark can just say, "Jarvis, bring up the plans for the Mark 5." I should be able to as well. With that said I have been able to get good results from my single word wake word 
so I wont advise against trying it for yourself.  

### Wake word collection
Now start recording the wake word with Precise using the following command:
```
precise-collect
```

This will collect `.wave` files in the current directory. This cli tool has a few options but I think one major thing it is lacking is the ability to set the path of where you want to collect. 
If you would like to set the output file name use:
```
precise-collect jarvis-###
```
This will create `jarvis-000.wave` and so on as you keep recording. Think of this project as any other software project that you will need to work on over time.
With that in mind you want to make unique names for each recording session. Here is a peek at my wake-word folder:
```
...
-rw-r--r-- 1 pi pi  64078 Sep 24  2021 jarvis-eebfbb38-db51-4a83-98dd-8a0712b32a7e.wav
-rw-r--r-- 1 pi pi  69676 Sep 24  2021 jarvis-ef72a2b2-0ea2-495c-af10-eaf12255ec9d.wav
-rw-r--r-- 1 pi pi  81964 Sep 24  2021 jarvis-fa85b5d8-5803-43f9-a6aa-9dd67034be14.wav
-rw-r--r-- 1 pi pi  81964 Sep 24  2021 jarvis-fb675e0a-1ac8-4a45-b9d8-36d454c598bc.wav
-rw-r--r-- 1 pi pi  67628 Oct 22  2021 jarvis-with-radiohead-00.wav
-rw-r--r-- 1 pi pi  75820 Oct 22  2021 jarvis-with-radiohead-01.wav
-rw-r--r-- 1 pi pi  67628 Oct 22  2021 jarvis-with-radiohead-02.wav
-rw-r--r-- 1 pi pi  67628 Oct 22  2021 jarvis-with-radiohead-03.wav
...
```
At one point I used a little bash-fu to give some old recordings UUIDs to make sure not to clobber them when I just had the files numbered. 
At one point I was listening to Radiohead and I was getting a lot of false positives so I did a recording session with Radiohead playing in the background. 
It is important to do a good amount of wake word recordings from different distances from the mic as you might be half way across the room and want to say a command. 
  
One important thing to do before starting collection is stop your Mycroft services: `mycroft-stop all`
  
It is just as important to have a well populated `not-wake-word` folder. Record yourself saying words that might sounds like your wake word but are not. 
Also, the [Precise-Community-Data](https://github.com/MycroftAI/Precise-Community-Data/tree/master/not-wake-words) has a good set of `not-work-words` recordings to include in your project.

Once you have your `wake-word` and `not-wake-word` folder populated grab a subset to include in your `test` sub folders. Now take the first pass at training the wake word model.
Navigate to your models folder and use the following command:
```
precise-train -e 600 jarvis.net ../
```
Where `-e` is for number of EPOCHS to train the mode, jarvis.net is the NN model and `../` is the path to the project data to train the model.
Once this is completed convert the jarvis.net file:
```
precise-convert jarvis.net
```
After all this the models folder will look something like this:
```
ls ./jarvis/models/
jarvis.epoch  jarvis.logs  jarvis.net  jarvis.net.params  jarvis.pb  jarvis.pb.params  jarvis.pbtxt  jarvis.trained.txt
```

Now that you have a wake word model it is time to test it out and see if it works. This can be done using the `precise-listen` command:
```
precise-listen jarvis.net
``` 

This command will give you a bit of visual feedback on how well your wake word is doing. 
This tool can also be used to find false positives within your environment.
```
precise-listen jarvis.net -d ../not-wake-word
```
This will put all the trigger words into the `not-wake-word` folder. I have ran this over a few days while I am in meetings and what not to help 	catch false positives.
Doing this has really helped improve the accuracy of my wake word. 

### Setting up Picroft to use the latest precise-engine

Since I trained my model with a newer version of precise I needed to update the precise running binary on my Mycroft PA. 
The Precise Engine binary can be found in `/home/pi/.mycroft/precise`:
```
cd /home/pi/.mycroft/precise
wget https://github.com/MycroftAI/mycroft-precise/releases/download/v0.3.0/precise-engine_0.3.0_armv7l.tar.gz
tar xvf precise-engine_0.3.0_armv7l.tar.gz
```
Now you should have the latest version of the precise-engine installed. 

### Installing mycroft-precise fork

Anytime you have to start using a fork of a project you are setting yourself up for a bit of work.
At this time I am setup with the dev upstream release of mycroft-core and I am installing my fork of mycroft-precise into the venv.
The issue with this is when Picroft restarts it will pull down the latest dev and this can clobber the locally installed precise.
I think in the end I will fork mycroft-core as well and run on both forks and manage my own upgrade process of the forks from upstream. 
This is not an ideal setup for people looking for a set it and forget it type PA but I am going to be creating custom skills 
and contributing where I can so this works for me. 

```
# clone the fork (change url if you will be working on your own fork)
git clone https://github.com/jessecooper/mycroft-precise.git
cd mycroft-precise
# while in the mycroft venv run
pip install -r requirements/requirements.txt
pip install .
```

### Mycroft wake word config

With all of this done it is time to configure Mycroft to use the custom listener.
Edit `~/.config/mycroft/mycroft.conf` to use the custom listener:

```
  "listener": {
    "wake_word": "jarvis",
    "phoneme_duration": 240
  },
  "hotwords": {
    "jarvis": {
      "module": "precise",
      "phonemes": "JH AA R V AH S .",
      "threshold": 1e-20,
      "lang": "en-us",
      "local_model_file": "/home/pi/jarvis/models/jarvis.pb",
      "sensitivity": 0.5,
      "trigger_level": 3
    }
```

Of course replace `jarvis` with the name of your custom wake word.

The final thing to do is restart your Mycroft services. 
```
mycroft-stop all
mycroft-start all
```

### Conclusion

This is how I have set up Picroft with a custom wake word. I am sure one could get more stability if they went with the master version of mycroft-core 
and trained the wake word on mycroft-precise 0.2. I personally do not mind working off of my own forks because I like contributing back to projects like this where I can 
but this is not a path for everyone. One very  awesome thing about having a custom wake word that you have only trained with your voice is that I find it only response to my voice. 
This is different from most commercial PAs where you can walk into someones house and potentially just start messing with a persons PA. 
It may take a few training sessions to get it dialed in but it is fairly rare now that I get a false positive. 

Part 3 of this build will take some time to come out as I am a person with way to many projects. One of those being a Codeholics theme redesign. For that post I will either
go into getting the Mycroft GUI up or creating a custom skill. If you have enjoyed either of the posts on my Mycroft setup please think about becoming a
[sponsor](https://github.com/sponsors/jessecooper). 

### Links

* [mycroft-precise](https://github.com/MycroftAI/mycroft-precise)
* [mycroft-precise fork](https://github.com/jessecooper/mycroft-precise)
* [mycroft-precise wiki](https://github.com/MycroftAI/mycroft-precise/wiki/Training-your-own-wake-word)
* [Precise-Community-Data](https://github.com/MycroftAI/mycroft-precise/wiki/Training-your-own-wake-word)
* [Github Sponsors](https://github.com/sponsors/jessecooper)
