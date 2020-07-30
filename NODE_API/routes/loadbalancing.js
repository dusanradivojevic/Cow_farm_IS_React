// Server pool
const servers = [
    { name:'server0', ip:'217.182.197.96' },
    { name:'server1', ip:'172.217.17.142' },
    { name:'server2', ip:'37.187.137.123' },
    { name:'server3', ip:'87.116.154.195' },
    { name:'server4', ip:'81.93.64.34' }
]

// Middleware function
function redirect(req, res, next) {
    const id = req.requestId;

    let index = stringToHash(id); // requestId (string) -> number (Int32)
    index = numberToOneDigit(index); // any integer -> one digit number
    index = serverIndex(index); // one digit number -> one number from 0 
                                // to number of available servers

    let chosenServer = servers[index];
    console.log(`Request with id: ${id} is redirected to: ${chosenServer.name} (${chosenServer.ip})`);
    res.server = chosenServer;

    next();
}

// Hash functions 
function stringToHash(string) {                   
    var hash = 0; 
      
    if (string.length == 0) return hash; 
      
    for (i = 0; i < string.length; i++) { 
        char = string.charCodeAt(i); 
        hash = ((hash << 5) - hash) + char; 
        hash = hash & hash; 
    } 
      
    return hash; 
} 

function numberToOneDigit(number) {
    let num = number > 0 ? number : -1 * number;

    if (num < 10) return num;

    let digitSum = 0;
    while(num > 0) {
        digitSum += num % 10;
        num = Math.trunc(num / 10);
    }

    let oneNumber = digitSum;
    while(oneNumber > 9) {
        oneNumber = Math.trunc(oneNumber % 10);
    }

    return oneNumber;
}

function serverIndex(number) {
    return number < servers.length ? number : number % servers.length;    
}

module.exports = redirect;