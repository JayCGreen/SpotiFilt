import './App.css';
import {
  ActionButton,
  Divider, 
  Form,
  Flex, 
  Provider,
  TextField,
  defaultTheme} from '@adobe/react-spectrum';
import { useState } from 'react';
import { SongTable } from './songTable';
import { playlistStats } from './playlistStats';
import { graphPop } from './graphPopUp';
import { Filterer } from './Filterer';
import Search from '@spectrum-icons/workflow/Search'


async function init() {
  const id = "44ecebfe60684e3190de17084d2c95c3"
  const secret = "aaf6d7fa216c443aa83ead247608ec42"
  const resp = await fetch("https://accounts.spotify.com/api/token", {
    method: 'POST',
    headers:{
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${id}&client_secret=${secret}`
  })
  //console.log(resp.json())
  return resp
}

async function getAudFeatures(id) {
  const resp = await init().then((token)=>{
    if(token.ok){
      const search = token.json().then((l)=>
        fetch(`https://api.spotify.com/v1/audio-features?ids=${id}`, {
          headers:{
            "Authorization": `${l.token_type} ${l.access_token}`
          }
        })
      )
      return search
    }
  })
  return resp.json()
}

async function getPlaylist(url){
  const resp = await init().then((token)=>{
    if(token.ok){
      const search = token.json().then((l)=>
        fetch(`https://api.spotify.com/v1/${url[1]+'s'}/${url[2]}`, {
          headers:{
            "Authorization": `${l.token_type} ${l.access_token}`
          }
        })
      )
      return search
    }
  })
  return resp.json()
}

function loadSongs(songList, featureList){
  let finalList = []
  for(let i =0; i < songList.length; i++){
   finalList.push({key: i, song: songList[i].track, features: featureList[i]})
  }
  return finalList
}



function App() {
  const [selected, setSelected] = useState()
  const [playlist, setPlaylist] = useState();
  const [url, setURL] = useState()
  
  let trackList = []

  function submission(){
    let ul = new URL(url)
    getPlaylist(ul.pathname.split('/')).then((songs) => {
      let idList = ''
      songs.tracks.items.forEach((element) =>{
        idList = idList.concat(`${element.track.id},`)
      })
      getAudFeatures(idList.slice(0,-1)).then((feat) => {
        trackList = loadSongs(songs.tracks.items, feat.audio_features)
        setPlaylist({name: songs.name, maker: songs.owner.display_name, trackList: trackList, imgSrc: songs.images[0].url});
      })
    })
  }

  return (
    <Provider theme={defaultTheme} width={'100vw'} height={'100vh'}>
      <div className="wrapper">
            <div className='search'>
              <Form width={'100%'} onSubmit={(e) => {
                e.preventDefault()
                submission()
                }} orientation='horizontal'>
                <div>
                <TextField onChange={setURL} width={'80%'} onvalue ={url}/>
                <ActionButton  type='submit' width={'20%'} isDisabled={!url}><Search/></ActionButton>
                </div>
              </Form>
            </div>
          
            <div className='filt'>
              {Filterer(playlist, setPlaylist)}
            </div>
            <div className='stats'>
              {playlist ? playlistStats(playlist) : null}
              {playlist ? graphPop(playlist, selected, setSelected) : null}
            </div>
            <div className='songs'>
              {SongTable(playlist)}
            </div>
          <div className='con'>
          <Divider orientation='horizontal'height={'size-10'} width={'90%'} alignSelf={'center'}/>            
          </div>
      </div>
    </Provider>
  );
}

export default App;
