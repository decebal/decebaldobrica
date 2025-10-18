---
title: Creating your own dotfiles - First Episode
date: '2014-01-16T15:00:00.000Z'
author: Decebal D.
description: Customizing the linux console
tags:
  - zsh
  - bash
  - dotfiles
slug: creating-your-own-dotfiles-first-episode
canonicalUrl: 'https://decebalonprogramming.net/post/creating-your-own-dotfiles-first-episode'
---


1. Choosing between bash and zsh
    One of these days i had some time on my hand and decided to put all my [dot]files into a git repository. I chose to do that because I wanted to be able do to things the same way in all enviroments that I'm working. So I came across these problems:
    
    1. Choosing between bash and zsh
    2. Private aliases and functions vs public
    3. Usefull completion files
    4. Git aliases and completion
    5. Vim config files and bundles
    6. Symfony2 Php completion
        
    I decided to split the above list into episodes, just because there was plenty of info online and thankfully i got to choosing some goods.

### Step 1 : decision making

*I recently came upon zsh and got in love with it.*

First of all when choosing between bash and zsh, I asked my friend [google](http://google.com/) on what others said on the subject. I looked on some argument people commented on [reddit](http://www.reddit.com/r/linux/comments/1csl7c/bash_vs_zsh/), but the opinion of a friend and this presentation [Why Zsh is Cooler than Your Shell](https://www.slideshare.net/jaguardesignstudio/why-zsh-is-cooler-than-your-shell-16194692) from [jaguardesignstudio](http://www.slideshare.net/jaguardesignstudio) really got my thinking it must be worth it.

I've got some usefull aliases from this [post on askubuntu](http://askubuntu.com/questions/1577/moving-from-bash-to-zsh), too.

### Step 2 : installation

Most of you will find this easy in your package management tool and install it. The package is called zsh . 

I came upon the problem of not having root access right on some machines so i needed and alternative. I found it on [sourceforge](http://zsh.sourceforge.net/). 

Big lines clone the git repo:

    git clone git://git.code.sf.net/p/zsh/code

than follow INSTALL intructions. Be aware thought, only for advanced users with time on their hands. I'm trying to put up a script that does this for me, but in less busy days.

### Step 3 : customization

I ran across [this list of themes](https://github.com/robbyrussell/oh-my-zsh/wiki/themes) and tried a few. I liked some of them: af-magic, arrow, sporty_256, bira, powerline.

I must say [powerline](https://github.com/steadystatic/dotfiles/tree/master/oh-my-zsh-powerline-theme) brought to me an entire new world of customizations. Fir of all I had some troubles when [installing a custom font](https://github.com/Lokaltog/powerline-fonts) . This job must be done on your local machine and the magic arrows in powerline will reveal themselves.

Edit: Powerline is happiest with Zsh because it allows for prompts to be built out from both the left and right. Bash is not so nice, and so the default Powerline Bash display prompt is not great. The standard theme (which only displays the “left” segments in Bash) leaves out important things like Git status/branch info. The “default_leftonly” theme, is better, but it still puts a lot of information, uncondensed, on a single line, so that you end up with 70 characters of stuff in your 80 character window prior to the insertion point. Not great.

*You can see my files in this [repo](https://github.com/decebal/dotfiles)*

     https://github.com/decebal/dotfiles
