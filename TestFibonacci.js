function current_continuation() {
    return new Continuation();
}

function make_coroutine(func) {
    //let cor = new Coroutine(func);
    let cor = function(v) {
        return cor.body(resume,v);
    }
    cor.body = func;
    cor.firstTime = 1;
    cor.cont = null;
    let resume = function(c, v) {
        //print("Inside " + v + "'s resume");
        cor.cont = current_continuation();
        if (cor.cont instanceof Continuation) {
            cor.firstTime = 0;
            if (c.firstTime) {
                c(v);
            }
            //print("I'm going to call the next function");
            else c.cont(v);
        }
        else return cor.cont;
    }
    return cor;
}

var n = 15;

function TestFibonacci() {
    print("Benvingut/da a la successió de Fibonacci!");
    print("A s'encarregarà de calcular fib(n) quan n sigui parell, i B ho farà quan n sigui senar.");
    print("Començant amb que fib(0) i fib(1) són 0 i 1 respectivament...");
    let a = make_coroutine( function(resume, value) {
        let currentFibValue;
        let newValues;
        for (let i = 2; i <= n; i += 2) {
            newValues = value;
            currentFibValue = newValues[i - 2] + newValues[i - 1];
            print("A: el resultat de fib(" + i + ") és: " + currentFibValue);
            newValues.push(currentFibValue);
            resume(b, newValues);
        }
    });
    let b = make_coroutine( function(resume, value) {
        let currentFibValue;
        let newValues;
        for (let i = 3; i <= n; i += 2) {
            newValues = value;
            currentFibValue = newValues[i - 2] + newValues[i - 1];
            print("B: el resultat de fib(" + i + ") és: " + currentFibValue);
            newValues.push(currentFibValue);
            resume(a, newValues);
        }
    });
    // amb aquest codi evitem "complicar-nos la vida" amb
    // problemes d'acabament quan cridem la corutina inicial
    
    if (typeof(a) === 'function') {
        a([0, 1]);
    }
}

TestFibonacci();