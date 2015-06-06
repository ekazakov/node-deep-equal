var test = require('tape');
var equal = require('../');
var isArguments = require('../lib/is_arguments.js');
var objectKeys = require('../lib/keys.js');

test('equal', function (t) {
    t.ok(equal(
        { a : [ 2, 3 ], b : [ 4 ] },
        { a : [ 2, 3 ], b : [ 4 ] }
    ));
    t.end();
});

test('not equal', function (t) {
    t.notOk(equal(
        { x : 5, y : [6] },
        { x : 5, y : 6 }
    ));
    t.end();
});

test('nested nulls', function (t) {
    t.ok(equal([ null, null, null ], [ null, null, null ]));
    t.end();
});

test('strict equal', function (t) {
    t.notOk(equal(
        [ { a: 3 }, { b: 4 } ],
        [ { a: '3' }, { b: '4' } ],
        { strict: true }
    ));
    t.end();
});

test('non-objects', function (t) {
    t.ok(equal(3, 3));
    t.ok(equal('beep', 'beep'));
    t.ok(equal('3', 3));
    t.notOk(equal('3', 3, { strict: true }));
    t.notOk(equal('3', [3]));
    t.end();
});

test('arguments class', function (t) {
    t.ok(equal(
        (function(){return arguments})(1,2,3),
        (function(){return arguments})(1,2,3),
        "compares arguments"
    ));
    t.notOk(equal(
        (function(){return arguments})(1,2,3),
        [1,2,3],
        "differenciates array and arguments"
    ));
    t.end();
});

test('test the arguments shim', function (t) {
    t.ok(isArguments.supported((function(){return arguments})()));
    t.notOk(isArguments.supported([1,2,3]));

    t.ok(isArguments.unsupported((function(){return arguments})()));
    t.notOk(isArguments.unsupported([1,2,3]));

    t.end();
});

test('test the keys shim', function (t) {
    t.deepEqual(objectKeys.shim({ a: 1, b : 2 }), [ 'a', 'b' ]);
    t.end();
});

test('dates', function (t) {
    var d0 = new Date(1387585278000);
    var d1 = new Date('Fri Dec 20 2013 16:21:18 GMT-0800 (PST)');
    t.ok(equal(d0, d1));
    t.end();
});

test('buffers', function (t) {
    t.ok(equal(Buffer('xyz'), Buffer('xyz')));
    t.end();
});

test('booleans and arrays', function (t) {
    t.notOk(equal(true, []));
    t.end();
});

test('ES6 Map', function (t) {
    var m1 = new Map([['x', 1], ['y', 2], ['z', 3]]);
    var m2 = new Map([['x', 1], ['y', 2], ['z', 3]]);
    var m3 = new Map([['x', 1], ['y', 2], ['z', 4]]);
    var m4 = new Map([['x', 1], ['y', 2]]);

    t.ok(equal(m1, m2), 'equal maps');
    t.notOk(equal(m2, m3), 'different values');
    t.notOk(equal(m3, m4), 'different size');
    t.ok(equal(new Map(), new Map()), 'empty maps');
    t.end();
});


test('ES6 Map Nested', function (t) {
    var m1 = new Map([
        ['x', 1],
        ['y', new Map([['z', 3]])]
    ]);
    var m2 = new Map([
        ['x', 1],
        ['y', new Map([['z', 3]])]
    ]);

    var m3 = new Map([
        ['x', 1],
        ['y', new Map([['z', 3]])]
    ]);
    var m4 = new Map([
        ['x', 1],
        ['y', new Map([['c', 3]])]
    ]);

    t.ok(equal(m1, m2), 'equal nested meps');
    t.notOk(equal(m3, m4), 'different key in nested map');
    t.end();
});

test('ES6 Set', function (t) {
    var s1 = new Set([1, 2, 3]);
    var s2 = new Set([1, 2, 3]);
    var s3 = new Set([1, 2, 4]);
    var s4 = new Set([1, 2]);

    t.ok(equal(s1, s2), 'equal sets');
    t.notOk(equal(s2, s3), 'different values');
    t.notOk(equal(s3, s4), 'different size');
    t.ok(equal(new Set(), new Set()), 'empty sets');
    t.end();
});

test('ES6 Set nested', function (t) {
    var s1 = new Set([1, new Set([2, 21, 22]), 3]);
    var s2 = new Set([1, new Set([2, 21, 22]), 3]);
    var s3 = new Set([1, new Set([2, 21, 2]), 4]);

    t.ok(equal(s1, s2), 'equal sets');
    t.notOk(equal(s2, s3), 'different values');
    t.end();
});
