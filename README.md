Viewport [![Build Status](https://travis-ci.org/DispatchMe/meteor-viewport.svg?branch=master)](https://travis-ci.org/DispatchMe/meteor-viewport)
======

##Usage

`meteor add dispatch:viewport`

```
Viewport('page').goTo('login', { myData: true, transition: Viewport.Transition.slideX }, function () {
  // transition is done
});
```

* Inspired by https://github.com/raix/storyboard
