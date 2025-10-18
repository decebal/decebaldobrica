---
title: Day Four of Machine Learning in Review
date: '2018-07-17T15:00:00.000Z'
author: Decebal D.
description: ''
tags:
  - machine-learning
  - research
  - 100DaysOfMLCode
slug: day-four-of-machine-learning-in-review
canonicalUrl: 'https://decebalonprogramming.net/post/day-four-of-machine-learning-in-review'
---

import YouTubePlayer from 'react-player/lib/players/YouTube'

After last day I decided to continue researching for 15 days more, before diving into building a real-world app.
I already have a list of rough app ideas, but I expect more ideas to come to surface when going through these amazing resources out there.

### Resources explored


* A Recap from TensorFlow Summit
	https://youtu.be/kV2by5VNBsA
	
  Speaker's github [profile](https://github.com/fooljames) contains a good 
quantity of workshops using TensorFlow, between them one 
[Image Recognition](https://github.com/tf-dl-workshop/tf-image-workshop) 
workshop seems interesting to study.

* [Awesome Public Datasets](https://github.com/awesomedata/awesome-public-datasets)
	I might not be the first person to refer this resource, 
	I wish these were rated as well as this list is confusing, 
	but it is an amazing place to start when one just wants to dabble some theories.
	
  My picks in order to research them further are:
  
  - [tracebase](https://github.com/areinhardt/tracebase) -  a collection of power consumption traces
  - [Ancestry forum archive](http://www.cs.cmu.edu/~jelsas/data/ancestry.com/) - Dataset is not available, but it's something I would like to get into
  - [Challenges in Machine Learning](http://www.chalearn.org/) - I love that they keep an 
    archive of past challenges, like this one from [2003](http://clopinet.com/isabelle/Projects/NIPS2003/)
    that led me to [Data science competitions to save the world](https://www.drivendata.org/)
  - [Kaggle Datasets](https://www.kaggle.com/datasets) from which [this dataset with best sellers](https://www.kaggle.com/cmenca/new-york-times-hardcover-fiction-best-sellers) is my personal favourite.
 This list of data sets is a definite upgrade on the original "awesome list".
	 
* [D3.js](https://d3js.org/) - My favourite Data-Driven Library, their [gallery](https://github.com/d3/d3/wiki/Gallery) is awe inspiring.
	[timeseries](http://mlvl.github.io/timeseries/) is a nice example, I associate this with event streams.

* Conversational Agents - TensorFlow and Deep Learning Singapore

  <YouTubePlayer
  url='https://youtu.be/nPyVZ5EPlFs'
  playing={false}
  controls
/>

  I love the format of this presentation, [Sam](https://github.com/samwit) goes through technological considerations, 
current and past state of chat bots before diving into his content. 
[Sam](https://github.com/samwit) has quite a library of Jupyter Notebook repositories playing with TensorFlow	   


* [Decision Trees and Random Forests](https://towardsdatascience.com/decision-trees-and-random-forests-df0c3123f991)

  A sound introduction into Decision Trees and their super set : Random Forests.

* [Keras: The Python Deep Learning library](https://keras.io/)
  
  This looks like a really promising tool for prototyping while on the 100 days challenge.
	
* Product Design in the Era of the ALGORITHM

  *used to be on youtube :(*

  I loved what this talk explored in terms of the implications for product managers and designers.
  
  I just recently held an interview with a company where their products went through the hands of 
data engineers and software engineers before reaching production, a thought that is as 
delightful as it is scaring. 

  Golden Nuggets:
  - Make Data-Sets intrusive
  - don't codify the paths to the product: [Mind The Product](https://www.mindtheproduct.com/)

* [TensorBoard](https://www.tensorflow.org/guide/summaries_and_tensorboard) - useful for visualizing your model's computations , kind of on the go. (might be wrong here, need to explore this resource further)
	
  [on github](https://github.com/tensorflow/tensorboard)

* [TensorFlow Hub](https://www.tensorflow.org/hub/) -  a library for reusable machine learning modules, I understand it contains only modules by Google and DeepMind

* [Deep Reinforcement Learning in Action](https://www.manning.com/books/deep-reinforcement-learning-in-action) -
 	
  I love the format Manning uses for their books, can't wait for this one to be finished and compare it with my research 

* [How to build and run your first deep learning network](https://www.oreilly.com/learning/how-to-build-and-run-your-first-deep-learning-network)
	
  I do like this beginners tutorial, although marginally helpful to myself. 
  I plan to do a translation of this tutorial as my first task after the documentation phase.

* [Glow](https://github.com/openai/glow) - "Glow: Generative Flow with Invertible 1x1 Convolutions" - Glow Demos are particularly educational
