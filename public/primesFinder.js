let startFrom = 0;
let latest = null;
let primes = [];
let running = false;
    
onmessage = function(message) {
	if (message.data.startFrom) {
		startFrom = message.data.startFrom;
		running = true;
		findPrime();
	}
	if (message.data.stop) {
		running = false;
	}
}

function findPrime() {
	latest = nextPrime(latest !== null?(latest+1):startFrom);
	if (running) {
		postMessage({"prime": latest});
		primes.push(latest);
		setTimeout(findPrime, 1);
	} else {
		postMessage({"primes": primes});
	}
}

function nextPrime(after) {
	let pc = after%2==0?after+1:after;
	while (!isPrime(pc))
		pc+=2;
	return pc;
}

function isPrime(n) {
	let dv = Math.ceil(Math.sqrt(n));
	while (dv > 2) {
		if (n % dv == 0)
			return false;
		dv--;
	}
	return true;
}

