---
title: Deciding for a dotfiles installer platform
date: '2014-06-09T15:00:00.000Z'
author: Decebal D.
description: ''
tags:
  - dotfiles
slug: deciding-for-a-dotfiles-installer-platform
canonicalUrl: >-
  https://decebalonprogramming.net/post/deciding-for-a-dotfiles-installer-platform
---


During the week-end I've browsed and tried some gems found on [Build Awesome Command-Line Applications in Ruby](http://www.awesomecommandlineapps.com/gems.html).

Until finding this stream of goodness I've struggled with deciding which language would serve my wishes better between bash, python, php, ruby and haskell. 

I've decided to go with ruby only because I found usefull resources and examples. Bash seems like too complicated for building menu's from scratch and using IO. Python and haskell are 2 languages in what I am not so proficient and as i have not found enought resources to go throught with one of them I left this options aside. Php just does not seem right for this kind of task, althought it can be done.

Finally I decided to go with capistrano and [Commander](https://github.com/visionmedia/commander). These are the articles that stroke me as essential to my decision :

1. [Ruby Command Line Interface Gems](http://www.sitepoint.com/ruby-command-line-interface-gems/)
2. [Ruby Forum discussion](https://www.ruby-forum.com/topic/211630)
3. [Framewors: Scripting for Command line applications](http://www.plugingeek.com/categories/frameworks-scripting-command-line-applications-ruby-javascript)
4. [Python: cliff - Command Line Interface Formulation Framework](https://cliff.readthedocs.org/)
