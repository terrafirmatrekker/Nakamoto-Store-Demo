module.exports = function (BigNumber, BN) {

  BigNumber = BigNumber || require('bignumber.js');
  BN = BN || require('bn.js');

  return function (chai, utils) {
    chai.Assertion.addProperty('bignumber', function () {
      utils.flag(this, 'bignumber', true);
    });

    var isBigNumber = function (object) {
      return object.isBigNumber ||
        object instanceof BigNumber ||
        (object.constructor && object.constructor.name === 'BigNumber')
    }

    var isBN = function (object) {
      return (BN && (BN.isBN(object) || object instanceof BN)) ||
        (object.constructor && object.constructor.name === 'BN')
    }

    var convert = function (value, dp, rm) {
      var number;

      if (typeof value === 'string' || typeof value === 'number' || isBN(value)) {
        number = new BigNumber(value);
      } else if (isBigNumber(value)) {
        number = value;
      } else {
        new chai.Assertion(value).assert(false,
          'expected #{act} to be an instance of string, number, BigNumber or BN');
      }

      if (parseInt(dp) === dp) {
        if (rm === undefined) {
          rm = BigNumber.ROUND_HALF_UP;
        }
        number = number.round(dp, rm);
      }

      return number;
    };

    var override = function (fn) {
      return function (_super) {
        return function (value, dp, rm) {
          if (utils.flag(this, 'bignumber')) {
            var expected = convert(value, dp, rm);
            var actual = convert(this._obj, dp, rm);
            fn.apply(this, [expected, actual]);
          } else {
            _super.apply(this, arguments);
          }
        };
      };
    };

    // BigNumber.equals
    var equals = override(function (expected, actual) {
      this.assert(
        new BigNumber(expected).isEqualTo(new BigNumber(actual)),
        'expected #{act} to equal #{exp}',
        'expected #{act} to be different from #{exp}',
        expected.toString(),
        actual.toString()
      );
    });
    chai.Assertion.overwriteMethod('equal', equals);
    chai.Assertion.overwriteMethod('equals', equals);
    chai.Assertion.overwriteMethod('eq', equals);

    // BigNumber.greaterThan
    var greaterThan = override(function (expected, actual) {
      this.assert(
        actual.isGreaterThan(expected),
        'expected #{act} to be greater than #{exp}',
        'expected #{act} to be less than or equal to #{exp}',
        expected.toString(),
        actual.toString()
      );
    });
    chai.Assertion.overwriteMethod('above', greaterThan);
    chai.Assertion.overwriteMethod('gt', greaterThan);
    chai.Assertion.overwriteMethod('greaterThan', greaterThan);

    // BigNumber.greaterThanOrEqualTo
    var greaterThanOrEqualTo = override(function (expected, actual) {
      this.assert(
        actual.isGreaterThanOrEqualTo(expected),
        'expected #{act} to be greater than or equal to #{exp}',
        'expected #{act} to be less than #{exp}',
        expected.toString(),
        actual.toString()
      );
    });
    chai.Assertion.overwriteMethod('least', greaterThanOrEqualTo);
    chai.Assertion.overwriteMethod('gte', greaterThanOrEqualTo);

    // BigNumber.lessThan
    var lessThan = override(function (expected, actual) {
      this.assert(
        actual.isLessThan(expected),
        'expected #{act} to be less than #{exp}',
        'expected #{act} to be greater than or equal to #{exp}',
        expected.toString(),
        actual.toString()
      );
    });
    chai.Assertion.overwriteMethod('below', lessThan);
    chai.Assertion.overwriteMethod('lt', lessThan);
    chai.Assertion.overwriteMethod('lessThan', lessThan);

    // BigNumber.lessThanOrEqualTo
    var lessThanOrEqualTo = override(function (expected, actual) {
      this.assert(
        actual.isLessThanOrEqualTo(expected),
        'expected #{act} to be less than or equal to #{exp}',
        'expected #{act} to be greater than #{exp}',
        expected.toString(),
        actual.toString()
      );
    });
    chai.Assertion.overwriteMethod('most', lessThanOrEqualTo);
    chai.Assertion.overwriteMethod('lte', lessThanOrEqualTo);

    // BigNumber.isFinite
    chai.Assertion.addProperty('finite', function () {
      var value = convert(this._obj);
      this.assert(
        value.isFinite(),
        'expected #{this} to be finite',
        'expected #{this} to not be finite',
        value.toString()
      );
    });

    // BigNumber.isInteger
    chai.Assertion.addProperty('integer', function () {
      var value = convert(this._obj);
      this.assert(
        value.isInteger(),
        'expected #{this} to be an integer',
        'expected #{this} to not be an integer',
        value.toString()
      );
    });

    // BigNumber.isNegative
    chai.Assertion.addProperty('negative', function () {
      var value = convert(this._obj);
      this.assert(
        value.isNegative(),
        'expected #{this} to be negative',
        'expected #{this} to not be negative',
        value.toString()
      );
    });

    // BigNumber.isZero
    chai.Assertion.addProperty('zero', function () {
      var value = convert(this._obj);
      this.assert(
        value.isZero(),
        'expected #{this} to be zero',
        'expected #{this} to not be zero',
        value.toString()
      );
    });
  };
};
