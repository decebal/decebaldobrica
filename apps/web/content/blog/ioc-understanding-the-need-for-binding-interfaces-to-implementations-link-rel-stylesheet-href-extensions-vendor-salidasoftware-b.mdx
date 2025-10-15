---
title: IoC - Understanding the need for binding interfaces to implementations
date: '2015-09-01T15:00:00.000Z'
author: Decebal D.
description: |
  The problem: *Write testable code.*
tags:
  - php
  - coding
  - oop
  - opinions
  - programming advice
slug: >-
  ioc-understanding-the-need-for-binding-interfaces-to-implementations-link-rel-stylesheet-href-extensions-vendor-salidasoftware-b
canonicalUrl: >-
  https://decebalonprogramming.net/post/ioc-understanding-the-need-for-binding-interfaces-to-implementations-link-rel-stylesheet-href-extensions-vendor-salidasoftware-b
---


I found myself confused by this need of binding the interfaces to an implementation, maybe you have too.

I like explaining this kind of things by looking for the root of the problem it solves, as by itself it might not make sense.

If you are not familiar with the Inversion of Control container you might want to take a look at topics like this [What is Inversion of Control?](http://stackoverflow.com/a/3140/392502)

Actually this might not be new to most experienced programmers out there, but might help a few others.

The problem: *Write testable code.*

Principles used: *Code to an Interface.*

You might have found sense in that it is useful to set what Implementation is binded to a specific interface, but the purpose of it might escape your sight as the IoC handles that in a somehow magical way.

Illuminate's IoC can resolve dependencies internal without the need for you to say which goes where, but how can you control that ? what is missing from all this magic picture ?

Getting into the code, let's illustrate that with a simple example:

```php startinline="true"
namespace Core;
Class Template  
{
   public function __contruct (ViewInterface $view) 
   {
        $this->view = $view;
   }
}
```

```php startinline="true"
namespace App;
Class ClientView implements ViewInterface
{}
```

We can easily solve the dependecy from the IoC container by binding the implementation in a somehow transparent way:
```php startinline="true"
$ioc->singleton('Core\Template', function($ioc) {
    return new Template($ioc->make('App\ClientView');
}
```

Notes: 

1. In this case singleton is the method that bind the implementation, but it might differ in different versions of the IoC. bindShared it's also another method of doing this, in the latest version the methods have the same implementation.
2. By using namespaced bindings as above e.g. `Core\Template` we empower the IoC to solve the class dependency, the old way of binding based on keys like this 'core.template' won't solve the problem.

But we can also rely on the IoC solving our dependency, we just need to bind the ClientView implementation to the interface, before.
```php startinline="true"
$ioc->bind('Core\ViewInterface',  'App\ClientView');
```

We won't need binding of the Template class anymore as we can just get it from the IoC container and rely on it:
```php startinline="true"
$ioc->make('Core\Template')
```

The new IoC from Illuminate can also solve dependencies for function calls if the implementations are binded to the IoC. Cool feature.
