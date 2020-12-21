const tracklist = [
  {
    name: "Interference",
    length: "2:55"
  },
  {
    name: "Ice T",
    length: "4:07"
  },
  {
    name: "Free Mind",
    length: "4:08"
  },
  {
    name: "Témìládè Interlude",
    length: "0:41"
  },
  {
    name: "Higher",
    length: "3:16"
  },
  {
    name: "Damages",
    length: "2:49"
  },
  {
    name: "The Key",
    length: "2:46"
  }
]

// Used to fetch the lyrics file
async function getLyrics (){
  let response = await fetch("assets/data.json")
  return response.json()
}

// Creating track markup
function getMarkup(track){
  return `
    <div>
      <i class="fa fa-play-circle"></i>
      <h1>${track.name}</h1>
    </div>
    <span>${track.length}</span>
  `
}

/**
 * 
 * @param {number} start The start of the range
 * @param {number} end The end of the range
 * @param {number} current The value to test
 */
function isBetween(start,end,current){
  return (start <= Math.trunc((current))) && (end >= Math.trunc((current)))
}

// IIFE, document object is aliased to $
(async function($){
  const lyrics = await getLyrics()
  let fragment = document.createDocumentFragment()
  // Looping through tracklist and adding items
  tracklist.forEach((track,index) => {
    let div = document.createElement('div')
    div.classList.add('album-track')
    div.insertAdjacentHTML("beforeend",getMarkup(track))
    fragment.appendChild(div)
    if(index == 2){
      div.addEventListener('click', function(){
        $.getElementById('player').play()
      })
    }
  })
  // Adding lyrics (only one song) to document
  lyrics.forEach(line => {
    let p = document.createElement('p')
    p.textContent = line.line
    p.dataset.start = line.start
    p.dataset.end = line.end
    p.addEventListener('click',function() {
      $.getElementById('player').currentTime = +this.dataset.start
      $.getElementById('player').play()
    })
    $.querySelector('#song-lyrics div').appendChild(p)
  })
  $.getElementById('album-tracklist').appendChild(fragment)
  let top = $.getElementById('lyrics-wrapper').offsetTop
  // Function to execute when audio time is updated
  $.getElementById('player').ontimeupdate = function(){
    // Getting the current line based on time
    let line = lyrics.filter(line => {return isBetween(line.start,line.end,this.currentTime)})
    $.querySelectorAll('p.active').forEach(function(p){
      p.classList.remove('active')
    })
    // Translating wrapper on Y axis
    let text = $.querySelectorAll('p')
    let currentText = {}
    for(let i = 0; i < text.length; i++){
      let current = text[i]
      if(isBetween(current.dataset.start,current.dataset.end,this.currentTime)){
        currentText = current;
        break;
      }
    }
    // Translation is based on the position of current line and the top of the wrapper
    let translate = -(currentText.offsetTop - top)
    $.getElementById('lyrics-wrapper').style.transform = `translateY(${translate}px)`
    // Setting active line
    $.querySelector(`p[data-start="${line[0].start}"]`).classList.add('active')
  };
}(document))
