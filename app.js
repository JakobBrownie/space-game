const grid = document.querySelector('.gird')
const resultsDisplay = document.querySelector('.results')   
let currentShooterIndex = 202
let width = 15
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []
let results = 0

for (let i = 0; i< 225; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

//indexes for aliens to be in
const alienInvaders = [
    0,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

//puts the alines in the indexes
function draw(){
    for (let i=0; i < alienInvaders.length; i++) {
        if(!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader')
        }
    }
}

draw()

function remove(){
    for (let i=0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

squares[currentShooterIndex].classList.add('shooter')

//movement for the shooter
function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -=1
            break
        case 'ArrowRight':
            if (currentShooterIndex % width < width -1) currentShooterIndex +=1
    }
    squares[currentShooterIndex].classList.add('shooter')
}
document.addEventListener('keydown', moveShooter)

//movement for the invaders
function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length -1] % width === width -1
    remove()

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width +1
            direction = -1
            goingRight = false
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width -1
            direction = 1
            goingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()
    
    //game functions
    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        resultsDisplay.innerHTML = 'GAME OVER'
        clearInterval(invadersId)
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] > (squares.length)) {
            resultsDisplay.innerHTML = 'GAME OVER'
            clearInterval(invadersId)
        }
    }
    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = 'GAME OVER'
        clearInterval(invadersId)
    }
}

//Invader speed
invadersId = setInterval (moveInvaders, 500)

//shooting function
function shoot(e) {
    let laserID
    let currentLaserIndex = currentShooterIndex
    function movelaser() {
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width 
        squares[currentLaserIndex].classList.add('laser')

        if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')

            setTimeout(()=> squares[currentLaserIndex].classList.remove('boom', 300))
            clearInterval(laserID)

            const alienRemoval = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(aliensRemoved)
            results++ 
            resultsDisplay.innerHTML = results
            console.log(aliensRemoved)
        }

    }
    switch(e.key) {
        case 'arrowUp':
            laserID = setInterval(movelaser, 100)
    }
}

document.addEventListener('keydown', shoot)