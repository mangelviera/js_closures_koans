const expect = require('chai').expect;

describe("the JavaScript language", function () {
    describe("considers functions as first class citizens so that", function () {

        it("can declare named functions", () => {
            function example() {
                return 'some example';
            }

            expect(example()).to.be.eql('some example');
        });

        it("can declare anonymous functions", () => {
            let someVar = (a, b) => a + b;

            expect(typeof (someVar)).to.be.eql('function');
            expect(someVar(1, 1)).to.be.eql(2);
        });

        it("may return arrays that contains functions and so on", () => {
            function example() {
                return [function (number) {
                    return [0, 10]
                }];
            }

            expect(example()[0](1)[1]).to.be.eql(10);
        });

        it("doesn't care about the declaration order when they are named", () => {
            function exampleA() {
                return exampleB(1);
            }

            expect(exampleA()).to.be.eql(1);

            function exampleB(arg1) {
                return arg1;
            }
        });

        it("matters, the declaration order when they are anonymous", () => {
            let exampleA = () => exampleB(1);

            expect(() => exampleA()).to.throws(ReferenceError);

            let exampleB = arg1 => arg1;
        });

        it("can use optional parameters", () => {
            function example(a, b, c) {
                if (c) {
                    return a + b + c;
                }
                return a + b;
            }

            expect(example(1, 1, 1)).to.be.eql(3);
            expect(example(1, 1)).to.be.eql(2);
        });

        it("considers functions to be anonymous in case of assignment statement", () => {
            let x = function z() {
                return 1;
            };
            expect(typeof (z)).to.be.eql('undefined');
            expect(x()).to.be.eql(1);
        });

        it("can take functions as arguments", () => {
            function a(x) {
                return x() + 1;
            }

            function b(x) {
                return x;
            }

            function c() {
                return 3;
            }

            let result = a(b(c));

            expect(result).to.be.eql(4);
        });

        it("can create closures with free letiables", () => {
            function external() {
                let a = 1;

                function internal() {
                    return a + 1;
                }

                return internal();
            }

            expect(external()).to.be.eql(2);
        });

        it("can create closures with several free letiables", () => {
            function external() {
                let a = 1, b = 2;

                function internal() {
                    let c = 3;
                    return a + b + c;
                }

                return internal;
            }

            expect(external()()).to.be.eql(6);
        });

        it("defines a pure function when there are no free letiables", () => {
            function external() {
                let a = 1, b = 2, c = 100;

                function internal(a, b) {
                    let c = 1;
                    return a + b + c;
                }

                return internal(4, 4);
            }

            expect(external()).to.be.eql(9);
        });

        it("may return arrays that contains closures and so on", () => {
            function example() {
                // write the missing code here
                let a = 9;
                return [function (number) {
                    return [0, number + a];
                }];
            }

            expect(example()[0](1)[1]).to.be.eql(10);
            expect(example()[0](2)[1]).to.be.eql(11);
            expect(example()[0](3)[1]).to.be.eql(12);
        });

        it("passes primitive types as values (a copy) to functions", () => {
            function example(arg) {
                arg = "test!";
            }

            let x = 1;
            let y = "example";
            let z = true;

            example(x)
            expect(x).to.be.eql(1);

            example(y);
            expect(y).to.be.eql("example");

            example(z);
            expect(z).to.be.eql(true);
        });

        it("passes arrays by reference", () => {
            function sum(sequenceOfNumbers) {
                sequenceOfNumbers[0] = 100;
            }

            let x = [1, 2, 3];

            sum(x);

            expect(x).to.be.eql([100, 2, 3]);
        });

        it("passes objects by reference", () => {
            function example(arg) {
                arg.property = 'cockatoo';
            }

            let x = {property: 'parrot'};

            example(x);

            expect(x.property).to.be.eql('cockatoo');
        });

        it("may return a function as the result of invoking a function", () => {
            function add(a, b) {
                return a + b;
            }

            function example() {
                return add;
            }

            expect(example()(1, 2)).to.be.eql(3);
            let f = example();
            expect(f(2, 2)).to.be.eql(4);
        });

        it("can return closures as a function result", () => {
            function plus(amount) {
                return function (number) {
                    return number + amount;
                };
            }

            let f = plus(5);

            expect(f(3)).to.be.eql(8);
        });

        it("can have functions that receive other functions as arguments", () => {
            function add(a, b) {
                return a + b;
            }

            function example(arg) {
                return arg(2, 2) + 1;
            }

            expect(example(add)).to.be.eql(5);
        });

        it("may have functions as the input and the output", () => {
            function plus(originalFunction) {
                return arg1 => originalFunction() + arg1;
            }

            let f = plus(() => 1);

            expect(f(2)).to.be.eql(3);
        });

        it("can invoke functions indirectly using the special 'call'", () => {
            function f(a, b) {
                return a + b;
            }

            expect(f.call(f, 1, 1)).to.be.eql(2);
            expect(f(1, 1)).to.be.eql(2);
        });

        it("can invoke functions indirectly using the special 'apply'", () => {
            function f(a, b) {
                return a + b;
            }

            expect(f.apply(f, [1, 1])).to.be.eql(2);
            expect(f(1, 1)).to.be.eql(2);
        });

        it("is useful sometimes to change the context call", () => {
            function F() {
                this.val = 100;
                this.exec = function () {
                    ++this.val;
                };
            }

            function G() {
                this.val = 200;
                this.exec = function () {
                    ++this.val;
                };
            }

            let f = new F();
            let g = new G();

            f.exec.call(g);
            expect(f.val).to.be.eql(100);
            expect(g.val).to.be.eql(201);
        });

        it("is useful sometimes to change the context apply", () => {
            function F() {
                this.val = 100;
                this.exec = function () {
                    ++this.val;
                };
            }

            function G() {
                this.val = 200;
                this.exec = function () {
                    ++this.val;
                };
            }

            let f = new F();
            let g = new G();

            f.exec.apply(g);
            expect(f.val).to.be.eql(100);
            expect(g.val).to.be.eql(201);
        });


        it("doesnt have a private scope inside blocks", () => {
            let j = 0;
            for (var i = 0; i < 5; i++) {
                j += i;
            }

            expect(i).to.be.eql(5);
            expect(j).to.be.eql(10);
        });
    });

    describe("has multiple ways to define and create objects", () => {

        it("can define object literals", () => {
            let obj = {
                name: 'bob',
                theName() {
                    return this.name;
                }
            };

            expect(obj.theName()).to.be.eql('bob');
        });

        it("can create properties dynamically", () => {
            let obj = {name: 'Parroty', surname: 'McParrot'};
            obj.address = 'Parrot Street 221B';

            expect(obj.name).to.be.eql('Parroty');
            expect(obj['name']).to.be.eql('Parroty');
            expect(obj.surname).to.be.eql('McParrot');
            expect(obj['surname']).to.be.eql('McParrot');
            expect(obj.address).to.be.eql('Parrot Street 221B');
            expect(obj['address']).to.be.eql('Parrot Street 221B');
        });

        it("can define properties also using brackets", () => {
            let obj = {};
            obj["name"] = "Parrot";

            expect(obj.name).to.be.eql('Parrot');

            obj["something"] = "McParrot";
            expect(obj.something).to.be.eql("McParrot");
        });

        it("has a pattern called, the Module Pattern", () => {
            function createObject() {
                let points = 0;

                return {
                    addPoint: function () {
                        ++points;
                    },
                    score: function () {
                        return points;
                    }
                };
            }

            let obj = createObject();
            obj.addPoint();
            expect(obj.score()).to.be.eql(1);
            expect(typeof (obj.points)).to.be.eql("undefined");
        });

        it("may create objects also with the module pattern", () => {
            function createObject(score, color) {
                function points() {
                    return score;
                }

                function incrementScoreIn(points) {
                    score += points;
                }

                return {
                    points,
                    color,
                    incrementScoreIn
                }


            }

            let obj = createObject(5, 'red');
            obj.incrementScoreIn(5);
            expect(obj.color).to.be.eql('red');
            expect(obj.points()).to.be.eql(10);
        });

        it("can define constructors", () => {
            function Obj() {
                let name = 'Parroty';

                this.theName = () => name;
            }

            let obj = new Obj();
            expect(obj.theName()).to.be.eql('Parroty');
        });

        it("may contain 'static' methods", () => {
            function Obj() {
                let name = 'bob';

                this.theName = () => name;
            }

            Obj.someStaticMethod = () => 22;

            expect(Obj.someStaticMethod()).to.be.eql(22);
        });

        it("can create methods dynamically on an object instance", () => {
            let obj = {};
            let methodNames = ['fly', 'growl'];
            for (let i = 0; i < methodNames.length; i++) {
                obj[methodNames[i]] = () => `it works ${i}`;
            }
            expect(obj.fly()).to.be.eql('it works 0');
            expect(obj.growl()).to.be.eql('it works 1');
        });

        describe("the polymorphism", function () {
            it("for object with same signature can answer a function call", () => {
                const cockatoo = {
                    growl() {
                        return "Cockatoo growling"
                    }
                }
                const africanGrey = {
                    growl() {
                        return "African Grey growling";
                    }
                }

                const duck = {
                    quack() {
                        return "Duck quack";
                    }
                }

                const trainer = {
                    pet(bird) {
                        return bird.growl();
                    }
                }

                expect(trainer.pet(cockatoo)).to.be.eql('Cockatoo growling');
                expect(trainer.pet(africanGrey)).to.be.eql('African Grey growling');
                expect(() => trainer.pet(duck)).to.throws(TypeError);
            });

        });

    });

    describe("commons patterns with functions and behaviors", () => {
        it("can invoke functions immediately to take advantage of scopes", () => {
            let myNamespace = {
                growl() {
                    console.log('parrot');
                }
            };

            // IIF
            (function (theNamespace) {
                let counter = 0;

                theNamespace.addOne = () => {
                    counter++;
                };

                theNamespace.giveMeTheCount = () => counter;

            }(myNamespace));

            myNamespace.addOne();
            myNamespace.addOne();

            expect(myNamespace.giveMeTheCount()).to.be.eql(2);
        });

        it("hoists letiables the way you probably dont expect", () => {
            function generate() {
                let functions = [];
                for (var i = 0; i < 5; i++) {
                    functions.push(() => i);
                }
                return functions;
            }

            let functions = generate();
            expect(functions[0]()).to.be.eql(0);
            expect(functions[1]()).to.be.eql(1);
            expect(functions[2]()).to.be.eql(2);
            expect(functions[3]()).to.be.eql(3);
            expect(functions[4]()).to.be.eql(4);
        });

    });


    context("has ways to simulate classes", () => {
        function Cat() {
            this.kilos = 1;
            this.feed = function () {
                this.kilos++;
            };
        }

        function Lion(energy) {
            Cat.call(this);
            this.energy = energy || 100;

            let run = function () {
                this.energy -= 10;
            };
            let attack = function () {
                this.energy -= 5;
            };
            this.hunt = function () {
                run();
                attack();
                this.onHunting();
            };
            this.onHunting = function () {
            };
        }


        context("and the THIS keyword", () => {
            let cat;

            beforeEach(() => {
                cat = new Cat();
                global.kilos = 0;
            });

            it("sometimes works as expected in other languages", () => {
                cat.feed();
                cat.feed();

                expect(cat.kilos).to.be.eql(undefined);
            });

            it("works different on dettached functions", () => {
                global.kilos = 10;
                let feed = cat.feed;
                feed();
                expect(global.kilos).to.be.eql(10);
                expect(cat.kilos).to.be.eql(2);
            });

            it("can be bound explicitly with CALL and APPLY", () => {
                let feed = cat.feed;

                feed.apply(cat);

                expect(cat.kilos).to.be.eql(undefined);
            });

            it("can be bound in modern browsers with BIND", () => {
                let feed = cat.feed.bind(cat);

                feed();
                feed();

                expect(cat.kilos).to.be.eql(undefined);
            });

            it("works different when function is attached to other object", () => {
                let otherCat = new Cat();
                otherCat.kilos = 2;
                otherCat.feed = cat.feed;

                otherCat.feed();
                expect(otherCat.kilos).to.be.eql(undefined);
                expect(cat.kilos).to.be.eql(undefined);
            });

            it("can be handled using the SELF trick", () => {
                let energy = 200;
                let lion = new Lion(energy);

                lion.hunt();

                expect(lion.energy).to.be.eql(185);
            });

            it("interprets the THIS when the function is executed", () => {
                let energy = 200;
                let lion = new Lion(200);

                lion.hunt = function () {
                    this.energy = 4000;
                };

                expect(lion.energy).to.be.eql(4000);
            });
        });

    });
});
