let currentSong=new Audio();
let songs;
let currentFolder;




function formatTime(seconds) {
    if(isNaN(seconds)|| seconds<0){
        return "00:00/00:00";
    }
    // Ensure the seconds are an integer
    seconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad single digit minutes and seconds with leading zeros
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}

















async function getSongs(folder){
    currentFolder=folder;
    let a=await fetch(`http://192.168.0.105:3000/${folder}/`);
    let response=await a.text();
    console.log(response);
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
     songs=[];
    for(let i=0;i<as.length;i++){
        const element=as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
     //show all the songs in the playlist
 let songUL=document.querySelector(".songlists").getElementsByTagName("ul")[0];

 songUL.innerHTML="";
 for(const song of songs){
     songUL.innerHTML=songUL.innerHTML+`<li><img class="invert" src="Assets/music.svg" alt="">
  <div class="info">
      <div>${song.replaceAll("%20"," ")}</div>
      <div>Dheeraj</div>
  </div>
  <div class="playnow">
      
      <img  class="invert play-left" src="Assets/play.svg" alt="">
  </div>   
     
      </li>`;
 }
 //Attach an event listener to each song
 Array.from(document.querySelector(".songlists").getElementsByTagName("li")).forEach(e=>{
     e.addEventListener("click",element=>{
         console.log(e.querySelector(".info").firstElementChild.innerHTML);
         playMusic(e.querySelector(".info").firstElementChild.innerHTML);
     })
 })
   

}

const playMusic=(track,pause=false)=>{
    // let audio=new Audio("/Songs/"+ track);
    currentSong.src=`/${currentFolder}/`+ track;
    if(!pause){
        currentSong.play();
        play.src="Assets/pause.svg";

    }
   
   
    document.querySelector(".songinfo").innerHTML=decodeURI(track);
    document.querySelector(".songtime").innerHTML="00:00/00:00";
}

async function main(){



    
    //get the list of all songs
    await getSongs("Songs/Hindi");
    playMusic(songs[0],true);
    

 

   
   
   
   
   
   
   
   
   
   
   
   
   
   
   





   
   
   
   
   
   
   




    //Attach an even listener to play,next and previous
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="Assets/pause.svg";
        }
        else{
            currentSong.pause();
            play.src="Assets/play.svg";
        }
    })



    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML=`${
            formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`

         //seekbar circle
         document.querySelector(".circle").style.left=(currentSong.currentTime)/(currentSong.duration)*100 +"%";   
    })



    //Add a event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=percent+"%";
        currentSong.currentTime=((currentSong.duration)*percent)/100;
    })


    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
        document.querySelector(".hamburger").style.display="none";
    })

    //Cross the hamburger
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-150%";
    })
    





    //Add event listener to the previous
    previous.addEventListener("click",()=>{
        // currentSong.pause();
        // console.log("Previous Clicked..");
        // console.log(currentSong)
        let j=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((j-1)>=0){
            playMusic(songs[j-1]);
        }
    })


    //Add event listener to the next
    next.addEventListener("click",()=>{
        // currentSong.pause();
        // console.log("Next Clicked..");
        // console.log(currentSong.src);
        let k=songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if((k+1)<songs.length){
            playMusic(songs[k+1])
        }
    })
    



    //Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        console.log(e);
        e.addEventListener("click",async item=>{
            console.log(item,item.currentTarget.dataset)
            songs=await getSongs(`Songs/${item.currentTarget.dataset.folder}`)
        })
    })
    


    
    
    


   
   
   


}
main();

