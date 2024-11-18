const upBtn = document.querySelector('.up')
const rightBtn = document.querySelector('.right')
const downBtn = document.querySelector('.down')
const leftBtn = document.querySelector('.left')

const characterName = document.querySelector('.name')
const xPosEl = document.querySelector('.x-position')
const yPosEl = document.querySelector('.y-position')
const cooldownEl = document.querySelector('.cooldown')
const restBtnEl = document.querySelector('.rest-btn')
const fightBtnEl = document.querySelector('.fight-btn')
const gatherBtnEl = document.querySelector('.gather-btn')
const gatherRepeatBtn = document.querySelector('.gather-repeat-btn')


//Use node index.js in the terminal for execute the script.
//Warning: Firefox does not fully support the editor. Please use a chromimum-based web browser such as Chrome, Brave or Edge.
//This script is a basic example of a player's movement. You can load other examples by clicking on "Load example".
const server = "https://api.artifactsmmo.com"
//Your token is automatically set
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Implc3Blci5zam9zdHJvbUB6b2NvbS5zZSIsInBhc3N3b3JkX2NoYW5nZWQiOiIifQ.OycGhHnZABKOV23TGEq2a4AxQ8ubbxc2kvTiUrVBPKU";
//Put your character name here
const character = "Frippe"

// Character variables
let currentXPos = 0
let currentYPos = 0
let cooldownTimer = 5


async function getCharacter() {
    const url = server + "/characters/" + character

  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    },
  }
  
  try {
    const response = await fetch(url, options)
    const data = await response.json()

    console.log(data)

    currentXPos = data.data.x
    currentYPos = data.data.y

    characterName.innerText = data.data.name
    xPosEl.innerText = data.data.x
    yPosEl.innerText = data.data.y

    console.log("we have gotten our character information")

  } catch (error) {
    console.log(error)
  }
}
getCharacter()
  
async function movement(gotoX, gotoY) {
      
  const url = server + '/my/' + character +'/action/move'

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: `{"x":${gotoX},"y":${gotoY}}` //change the position here
  }
  
  try {
    const response = await fetch(url, options)
    const data = await response.json()

    console.log(data)

    console.log(`x: ${data.data.character.x}, y: ${data.data.character.y}`)

    currentXPos = data.data.destination.x
    currentYPos = data.data.destination.y
    cooldownTimer = data.data.cooldown.remaining_seconds

    xPosEl.innerText = data.data.character.x
    yPosEl.innerText = data.data.character.y

    if(cooldownTimer > 0) {
        cooldown()
    }

  } catch (error) {
    console.log(error)
  }
  }
  

upBtn.addEventListener('click', () => {
    console.log("up")

    movement(currentXPos, (currentYPos - 1))
})

rightBtn.addEventListener('click', () => {
    console.log("right")

    movement((currentXPos + 1), currentYPos)
})

downBtn.addEventListener('click', () => {
    console.log("down")

    console.log("new y-position is: " + (y + 1))
    movement(currentXPos, (currentYPos + 1))
})

leftBtn.addEventListener('click', () => {
    console.log("left")

    movement((currentXPos - 1), currentYPos)
})

const gatherRepeat = () => {
    console.log('repeat gathering')
    gather()
    setInterval(gather, 30000)
}

restBtnEl.addEventListener('click', rest)
fightBtnEl.addEventListener('click', fight)
gatherBtnEl.addEventListener('click', gather)
gatherRepeatBtn.addEventListener('click', gatherRepeat)



function cooldown() {
    cooldownEl.innerText = `cooldown: ${cooldownTimer}`
    if(cooldownTimer > 0) {
        setTimeout(cooldown, 1000)
        cooldownTimer--

        console.log(cooldownTimer)
    }
    else {
        console.log("cooldown complete!")
    }
}







async function rest() {
    const url = server + '/my/' + character +'/action/rest'
  
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      },
    }
    
    try {
      const response = await fetch(url, options)
      const data = await response.json()
  
      console.log(data)
      cooldownTimer = data.data.cooldown.remaining_seconds
  
      if(cooldownTimer > 0) {
          cooldown()
      }
  
    } catch (error) {
      console.log(error)
    }
}


async function fight() {
    const url = server + '/my/' + character +'/action/fight'
      
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
        },
    }
        
    try {
        const response = await fetch(url, options)
        const data = await response.json()
      
        console.log(data)
        cooldownTimer = data.data.cooldown.remaining_seconds
      
        if(cooldownTimer > 0) {
             cooldown()
        }
      
    } catch (error) {
          console.log(error)
    }
}


async function gather() {
    const url = server + '/my/' + character +'/action/gathering'
          
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
        },
    }
            
    try {
        const response = await fetch(url, options)
        const data = await response.json()
          
        console.log(data)
        cooldownTimer = data.data.cooldown.remaining_seconds
          
        if(cooldownTimer > 0) {
            cooldown()
        }
          
    } catch (error) {
        console.log(error)
    }
}
