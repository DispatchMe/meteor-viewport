beforeEach(function () {
  jasmine.addMatchers({
    toDeepEqual: function () {
      return {
        compare: function (actual, expected) {
          return {
            pass: _.isEqual(actual, expected)
          };
        }
      };
    }
  });
});
