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

var nTorns = 50, tornActual = 0, failurePerc = 20;

function PingPong() {
    let a = make_coroutine( function(resume, value) {
        let r, newValues = value;
        while (tornActual < nTorns) {
            r = Math.floor(Math.random() * 100);
            if (r < failurePerc) {
                print("Torn [" + (tornActual<10 ? "0" : "") + tornActual + "] -> A falla! Punt per a B.");
                ++tornActual;
                newValues = resume(c, [newValues[0], newValues[1] + 1, 'b']);
            } else { 
                print("Torn [" + (tornActual<10 ? "0" : "") + tornActual + "] -> A: ping!");
                ++tornActual;
                newValues = resume(b, newValues);
            }
        }
        resume(c, newValues);   // Si acabem aquí l'execució, C rebrà valors undefined i no podrem decidir qui ha guanyat
    });
    let b = make_coroutine( function(resume, value) {
        let r, newValues = value;
        while (tornActual < nTorns) {
            r = Math.floor(Math.random() * 100);
            if (r < failurePerc) {
                print("Torn [" + (tornActual<10 ? "0" : "") + tornActual + "] -> B falla! Punt per a A.");
                ++tornActual;
                newValues = resume(c, [newValues[0] + 1, newValues[1], 'a']);
            } else { 
                print("Torn [" + (tornActual<10 ? "0" : "") + tornActual + "] -> B: pong!");
                ++tornActual;
                newValues = resume(a, newValues);
            }
        }
        resume(c, newValues);   // Si acabem aquí l'execució, C rebrà valors undefined i no podrem decidir qui ha guanyat
    });
    let c = make_coroutine( function(resume, value) {
        print("C: Comença el partit! Treurà A!");
        let newValues = value, guanyador;
        while (tornActual < nTorns) {
            newValues[2] == 'a' ? newValues = resume(a, newValues) : newValues = resume(b, newValues);
            print("C: El marcador és el següent: [" + newValues[0] + " - " + newValues[1] + "]");
            if (newValues[0] == newValues[1]) guanyador = "-";
            else if (newValues[0] < newValues[1]) guanyador = "B";
            else guanyador = "A";
        }
        print();
        print("C: Final del partit!");
        if (guanyador == "-") {
            print("C: Això sí que no m'ho esperava! Han empatat dues màquines al atzar!");
        } else print("C: El guanyador és " + guanyador + "!");
        print("C: Gràcies per jugar amb nosaltres! Quan vulguis jugar un altre cop, executan's!");
    });
    
    if (typeof(a) === 'function') {
        c([0, 0, 'a']);    // [PuntsA, PuntsB, QuiComençaSegüentTorn]
    }
}

PingPong();