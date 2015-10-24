doppelchat
==========

A peer-to-peer chat app where message relevance is determined
by similarity of the user image avatars. The working title
"doppelchat" reflects that I wanted to make a chat application
that enabled people to talk with a doppelgänger.

P2P
---
The P2P networking uses WebRTC so it currently limits browsers
to Chrome and Firefox. The great [PeerJS](http://peerjs.com/)
library is used to smooth things over in the client and I'm
also running an instance of their PeerServer to enable more
connections and an index of peers.

Image similarity
----------------
[convnetjs](https://github.com/karpathy/convnetjs) is used to
extract a feature vector from the user image. I'm using the
[cifar10-solving CNN demo](http://cs.stanford.edu/people/karpathy/convnetjs/demo/cifar10.html)
with the 80% accurate pre-trained weights.

UI
--
I'm using this project to try out React. There's probably a
bunch of rookie mistakes in there.
