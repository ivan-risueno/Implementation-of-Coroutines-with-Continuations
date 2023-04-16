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

let a1 = [ [ [ [1], [] ], [ [2], [ [3], [4] ] ] ], [ [ [], [5] ], [ [6], [7] ] ] ];
let a2 = [ [ [ [1], [2] ], [ [3], [4] ] ], [ [ [5], [6] ], [ [7], [] ] ] ];
let a3 = [ [ [ [1], [2] ], [ [3], [4] ] ], [ [ [5], [9] ], [ [7], [] ] ] ];
let a4 = [ [ [ [1], [2] ], [ [3], [4] ] ], [ [ [5], [6] ], [ [7], [8] ] ] ];
let a5 = [ [ [ [], [8] ], [ [7], [6] ] ], [ [ [5], [4] ], [ [3], [2] ] ] ];
let a6 = [ [ [ [8], [7] ], [ [6], [ [5], [4] ] ] ], [ [ [3], [] ], [ [2], [] ] ] ];
let a7 = [ [ [ [7], [8] ], [ [1], [ [], [] ] ] ], [ [ [], [] ], [ [], [] ] ] ];
let a8 = [ [ [ [], [] ], [ [], [ [], [] ] ] ], [ [ [], [7] ], [ [8], [1] ] ] ];
let a9 = [ [ [ [0], [] ], [ [], [ [], [] ] ] ], [ [ [], [] ], [ [], [] ] ] ];
let a10 = [ [ [ [], [] ], [ [], [ [0], [] ] ] ], [ [ [], [] ], [ [], [] ] ] ];

function correctBinTree(BinTree) {
    if (BinTree.length == 0 || (BinTree.length == 1 && typeof BinTree[0] == 'number')) return true;
    else if (BinTree.length == 2) return correctBinTree(BinTree[0]) && correctBinTree(BinTree[1]);
    return false;
}

function same_fringe(tree1, tree2) {
    let c1 = correctBinTree(tree1), c2 = correctBinTree(tree2);
    if (!c1) print("The first tree provided is not a valid tree!");
    if (!c2) print("The second tree provided is not a valid tree!");
    if (!c1 || !c2) return;

    let a = make_coroutine( function(resume, value) {
        if (value.length == 0) return;
        else if (value.length == 1) {
            //print("A: li passo a c la fulla " + value[0]);
            resume(c, value[0]);
        } else {
            this(value[0]);
            this(value[1]);
        }
    });
    let b = make_coroutine( function(resume, value) {
        if (value.length == 0) return;
        else if (value.length == 1) {
            //print("B: li passo a c la fulla " + value[0]);
            resume(c, value[0]);
        } else {
            this(value[0]);
            this(value[1]);
        }
    });
    let c = make_coroutine( function(resume, value) {
       let t1 = 0, t2 = 0;
       while(typeof t1 != 'undefined' && typeof t2 != 'undefined') {    // Comprovem que no hàgim arribat al final
        t1 = resume(a, value[0]);
        t2 = resume(b, value[1]);
        if ((typeof t1 == 'number' && typeof t2 == 'number' && t1 != t2)) return 0;
       }
       if (typeof t1 != typeof t2) return 0;    // Comprovem que tinguin el mateix nombre de fulles, i.e. no hi ha cap parell que sigui un nombre i l'altre undefined
       return 1;
    });

    if (typeof(a) === 'function') {
        c([tree1, tree2]) ? print("Both trees have the same fringe!") : print("They doesn't have the same fringe :'(");
    }
}

print("Test with a1 and a2:");
same_fringe(a1, a2);
print();
print("Test with a1 and a4:");
same_fringe(a1, a4);
print();
print("Test with a4 and a2:");
same_fringe(a4, a2);
print();
print("Test with a3 and a4:");
same_fringe(a3, a4);
print();
print("Test with a5 and a6:");
same_fringe(a5, a6);
print();
print("Test with a7 and a8:");
same_fringe(a7, a8);
print();
print("Test with a9 and a10:");
same_fringe(a9, a10);

// NOTA: Si es vol comprovar que el programa acabi quan comprovi que dues fulles no són iguals,
// només cal descomentar les línies 55 i 65 per veure quantes fulles es comproven en cada cas.