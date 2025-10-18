---
title: gRPC as a better alternative to GEARMAN
date: '2018-02-28T15:00:00.000Z'
author: Decebal D.
description: Using gRPC as a replacement for GEARMAN communication between PHP and Python
tags:
  - architecture
  - concurrency
  - python
  - php
slug: grpc-alternative-to-gearman
canonicalUrl: 'https://decebalonprogramming.net/post/grpc-alternative-to-gearman'
---


![Selection_014.png](https://res.cloudinary.com/hpiynhbhq/image/upload/v1519346372/hlpcqlsk7bz0o6pti5jg.png)

## Using gRPC as a replacement for GEARMAN communication between PHP and Python

You might need or want to create a software architecture where everyone is welcome.

If there is an open source project that solves a problem of your domain like crunching metrics or storing some metadata somewhere else like analytics, I am sure you are used to just call an API through a simple HTTP call.

But when you want to deploy a service of your own, that is at the core of your domain you would definitely want to use something faster as execution, easier to maintain and simple.

> All computers wait at the same speed.

Starting from the need to communicate between different programming languages, first you might arrive at the legacy option: GEARMAN. Although Gearman is a legacy, it is definitely good enough to get you started.

### Problem with Gearman

The job server processes the jobs one at a time with similar jobs having to wait to a worker to become available in order to have it's workload processed. Now I know that this problem I experienced with Gearman might be considered unfair towards judging it or deffered.

In order to adjust for this the most common solution is to increase availability by having multiple workers waiting in the background. I experimented with 5 to 25 and still had availability problems due to my main consumer being quite needy.

That would be just one problem, but stacking on top of that:
 
- deprecated libraries
- not [so rich documentation](http://gearman.org/), basically no one else knows how to use Gearman, as simple as it is, unless they try it by themsleves (my experience with Gearman is limited to php and python languages) 
- poor tooling for monitoring

So, best solution to this problem would be something available on demand, an rpc, but fast and for me in particular, it has to be almost as fast as a function call in the same language. But between 2 different languages.

---
### Why gRPC (also referred as Protocol Buffers) and not ...
So when I discovered gRPC I thought it was a match made in heaven for my particular situation. After reading [Exploring The gRPC Framework for Building Microservices](https://nordicapis.com/exploring-the-grpc-framework-for-building-microservices/) I decided to develop my own opinion on gRPC.

Really, really strong points for gRPC:

- simple definition using protobufers, shares a proto definition between programming languages
- binary communication
- declarative communication channels
- https
- uses http2
- multiple libraries for different languages, supports Go-lang, Python, Php, Nodejs, Julia ..
- monitoring, best with [opencensus](https://opensource.googleblog.com/2018/01/opencensus.html)
- interceptors (middleware) both on the client and server side
- [rich documentation and examples](https://github.com/grpc/grpc/tree/master/doc)
- quite an active [open source community on github](https://github.com/grpc/grpc)


Some cons (really quite hidden):

- quite hard to reverse engineer (tried to reverse engineer the python server) - could be one of my biased opinions though
- multiple versions with unstable reminiscences
- documentation only covers the best case scenario, but it is expanding
- php cover is really limited
- python server does not support forking

The exciting part about gRPC for me was that it allows **streaming** and it is quite declarative. 

Valid alternatives to gRPC:

- MessagePack
- jsonRPC
- Protocol Buffers
- Avro
- Thrift
- bson

Sitepoint published an article on [Data Serialization Comparison: JSON, YAML, BSON, MessagePack](https://www.sitepoint.com/data-serialization-comparison-json-yaml-bson-messagepack/) that is worth a read on the subject. Although quite old, read this [article](https://www.igvita.com/2011/08/01/protocol-buffers-avro-thrift-messagepack/) for a somewhat richer comparison.

---

### Using gRPC as a replacement for GEARMAN communication between PHP and Python

If you arrived here you must be curious about how to get this running.
Here is my setup.

1. First of all you need to define your `.proto` file, here is mine:

```bash
# file protos/ouroboros.proto
syntax = "proto3";

package Grpc.Ouroboros;

// Ouroboros communication service definition.
// please notice the keyword *service*
service Ouroboros {
    // A simple RPC.
    //
    // Obtains the `Response` based on the job asked in the `Request`
    // please notice the keyword *rpc*
    rpc SyncJob (Request) returns (Response) {}

    // We have a method called `StreamJob` which takes
    // parameter called `Request` and returns the message `Response`

    // The stream keyword is specified before both the request type and response
    // type to make it as bidirectional streaming RPC method.
    // please notice the keyword *stream*
    rpc StreamJob (stream Request) returns (stream Response) {}
}

//please notice the keyword *message*
message Request {
    // the value [1] defines the positional order of the attribute, please notice the scalar type *string*
    string job = 1;
    string message = 2;
}

message Response {
    string message = 1;
}
```

2. On the Php side of things you can only have a client, it seems. 
It might just be that things have evolved and I just got across dated sources, please let me know if your research shows something else or if you wrote a server on your own.

Here is how I ended up generating my client:
```bash
# file ourobouros_proto_gen.sh
#!/bin/bash
docker run -it --rm -v $PWD:/src:rw \
  decebal2dac/protoc-php  \
  --php_out=out \
  --grpc-php_out=out \
  --plugin=protoc-gen-grpc-php=/grpc/grpc/bins/opt/grpc_php_plugin \
  ./protos/*.proto
```

In order to be able to run this script, one needs the following dependencies:
- docker

Prepare your current directory by creating the `out` directory before running the script above. Also make sure you have a `protos` directory for `ouroboros.proto` file to sit, containing the definition above.

The [protobuf docker image](https://github.com/decebal/docker-protobuf-1) uses PHP 7.0 to generate the client.

At this stage you should have a generated client that looks similar to this [example](https://github.com/decebal/grpc-example). This works well with PHP >= 5.6 (I am using it with 7.2) and the [grpc and protobuf extensions](https://cloud.google.com/php/grpc).

Now, here is what I tried in order to get a working client and didn't work out for me so well. In the example above the 
lines:
```
  --grpc-php_out=out \
  --plugin=protoc-gen-grpc-php=/grpc/grpc/bins/opt/grpc_php_plugin 
```
were key to my trouble, as it is fairly easy to generate code without them. It also means you won't have a working client.
I will go more into this in another article as there were plenty of mistakes I hope you won't make, or at least I can only help you make your own mistakes.

3. Server side - python 3.6

I order to generate the server I picked up a small script from [grpc](https://github.com/grpc/grpc) :
```python
# file run_codegen.py
"""Runs protoc with the gRPC plugin to generate messages and gRPC stubs."""

from grpc_tools import protoc

protoc.main((
    '',
    '-I./protos',
    '--python_out=.',
    '--grpc_python_out=.',
    './protos/ouroboros.proto',
))
```
You should create both a server and a client, I used the client for testing purposes to start with. Either use examples from grpc to play around or [Program Creek](https://www.programcreek.com/python/example/95419/grpc.server), which was of great help in order to understand how interceptors can be used on the server.

Looking back at my little experiment I am sad I have not tried [grpclib](https://github.com/vmagamedov/grpclib) which looks like a way better solution for my server problems. The *official* server runs on threads and does not support *forking* which creates a new problem, non-existent in my previous Gearman setup where each job was running in an isolated process.


<br /><hr/><em>Posted on <a href="https://utopian.io/utopian-io/@decebal2dac/grpc-as-a-better-alternative-to-gearman">Utopian.io -  Rewarding Open Source Contributors</a> and <a href="https://medium.com/funeralzone/grpc-as-a-better-alternative-to-gearman-ea1c4ce9b8ae">FuneralZone Engineering</a></em><hr/>

