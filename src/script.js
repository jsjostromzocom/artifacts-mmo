const upBtn = document.querySelector('.up')
const rightBtn = document.querySelector('.right')
const downBtn = document.querySelector('.down')
const leftBtn = document.querySelector('.left')

const testBtnEl = document.querySelector('.test')

const characterName = document.querySelector('.name')
const xPosEl = document.querySelector('.x-position')
const yPosEl = document.querySelector('.y-position')
const cooldownEl = document.querySelector('.cooldown')
const restBtnEl = document.querySelector('.rest-btn')
const fightBtnEl = document.querySelector('.fight-btn')
const gatherBtnEl = document.querySelector('.gather-btn')
const gotoCookingEl = document.querySelector('.cooking')
const gotoSunflowerEl = document.querySelector('.sunflower')
const automateEl = document.querySelector('#automate')


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
    movement(currentXPos, (currentYPos - 1))
})

rightBtn.addEventListener('click', () => {
    movement((currentXPos + 1), currentYPos)
})

downBtn.addEventListener('click', () => {
    movement(currentXPos, (currentYPos + 1))
})

leftBtn.addEventListener('click', () => {
    movement((currentXPos - 1), currentYPos)
})

restBtnEl.addEventListener('click', rest)
fightBtnEl.addEventListener('click', fight)
gatherBtnEl.addEventListener('click', gather)
gotoCookingEl.addEventListener('click', () => movement(1    , 1))
gotoSunflowerEl.addEventListener('click', () => movement(2, 2))

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


async function rest(action) {
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

    if(action) {
        setTimeout(action, (cooldownTimer + 3) * 1000)
    }
}


async function fight() {
    const url = server + '/my/' + character +'/action/fight'
    let data = null
      
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
        data = await response.json()
      
        console.log(data)
        cooldownTimer = data.data.cooldown.remaining_seconds
      
        if(cooldownTimer > 0) {
             cooldown()
        }
      
    } catch (error) {
          console.log(error)
    }



    if(automateEl.checked && data.data.fight.result === 'win') {

        if(data.data.character.hp < 70) {
            setTimeout(() => rest(fight), (cooldownTimer + 3) * 1000)
        }
        else {
            console.log("automatic fighting")
            console.log("cooldown: " + ((cooldownTimer + 3) * 1000))
            setTimeout(fight, (cooldownTimer + 3) * 1000 )
        }

        
    }
    else if(data.data.fight.result === 'loss') {
        console.log("loss")
        automateEl.checked = false
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

    if(automateEl.checked) {
        console.log("automatic gathering")
        setTimeout(gather, 30000)
    }
}

async function craft() {
    const url = server + '/my/' + character +'/action/crafting'

    const code = 'copper'
    const quantity = 1

    const body = `{"code": "copper_helmet","quantity": ${quantity}}`
    console.log(body)
          
    const options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
        },
        body: body
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


testBtnEl.addEventListener('click', () => {
    console.log('crafting')
    craft()
})