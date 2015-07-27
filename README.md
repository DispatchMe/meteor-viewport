Viewport [![Circle CI](https://circleci.com/gh/DispatchMe/meteor-viewport.svg?style=svg)](https://circleci.com/gh/DispatchMe/meteor-viewport)
======

##Usage

`meteor add dispatch:viewport`

```
Viewport('page').goTo('login', { myData: true, transition: Viewport.Transition.slideX }, function () {
  // transition is done
});
```

* Inspired by https://github.com/raix/storyboard
