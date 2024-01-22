import logo from './logo.svg';
import './App.css';
import {ActionButton, 
  Button,
  Column,
  Cell, 
  Divider, 
  Flex, 
  Heading, 
  Image,
  Item, 
  Menu, 
  MenuTrigger,
  Provider,
  Row,
  TableBody,
  TableView,
  TableHeader,
  Text,
  TextField,
  defaultTheme, ProgressCircle, darkTheme, DialogContainer, Dialog, Content, DialogTrigger, RangeSlider} from '@adobe/react-spectrum';
import { useEffect, useState } from 'react';


const columns = [
  {id: 'song', name: 'Song'},
  {id: 'artist', name: 'Artist'},
  {id: 'duration', name: 'Duration'}
]

const metrics =[
  {key:0 , id: 'danceability', minValue: 0, maxValue: 1, step: 0.01},
  {key:1, id: 'energy', minValue: 0, maxValue: 1, step: 0.01},
  {key:2, id: 'valence', minValue: 0, maxValue: 1, step: 0.01},
  {key:3, id: 'instumentalness', minValue: 0, maxValue: 1, step: 0.01}
]

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
      const search = token.json().then((l)=>{
        let test = fetch(`https://api.spotify.com/v1/audio-features?ids=${id}`, {
          headers:{
            "Authorization": `${l.token_type} ${l.access_token}`
          }
        })
        return test
      })
      return search
    }
  })
  return resp.json()
}

async function getPlaylist(url){
  const resp = await init().then((token)=>{
    if(token.ok){
      const search = token.json().then((l)=>{
        let p = fetch(`https://api.spotify.com/v1/users/{user_id}/playlists`, {
          method: 'POST',
          headers:{
            "Authorization": `${l.token_type} ${l.access_token}`
          },
          body: {
            "name": "Mc check",
            "description": "New playlist description",
            "public": true
        }
        }).then((o)=> console.log(o.json()))
        
        let test = fetch(`https://api.spotify.com/v1/${url[1]+'s'}/${url[2]}`, {
          headers:{
            "Authorization": `${l.token_type} ${l.access_token}`
          }
        })
        return test
      })
      return search
    }
  })
  return resp.json()
}

function filter(songList, filters){
  let finalList = []
  let willAdd;
  console.log(Object.keys(filters))
  for(let i =0; i < songList.length; i++){
    willAdd=true;
    Object.keys(filters).forEach((cat) => {
      if(filters[cat].start > songList[i].features[cat] || filters[cat].end < songList[i].features[cat]){
        willAdd = false;
      }
    })
    if (willAdd) finalList.push({key: i, song: songList[i].song, features: songList[i].features})
  }
  return finalList
}

function loadSongs(songList, featureList){
  let finalList = []
  for(let i =0; i < songList.length; i++){
   finalList.push({key: i, song: songList[i].track, features: featureList[i]})
  }
  return finalList
}



function App() {
  const [playlist, setPlaylist] = useState();
  const [url, setURL] = useState()
  const [og, setOG] = useState();
  const [filtered, setFiltered] = useState(() => {
    let temp ={}
    metrics.forEach(m => (
    temp[m.id] = {start: m.minValue, end: m.maxValue}))
    return temp
  });
  
  let stats = {count: 0, avgDance: 0, avgEnergy: 0, avgValence: 0}
  let tempFilt = Object.create(() => {
    let temp ={}
    metrics.forEach(m => (
    temp[m.id] = {start: m.minValue, end: m.maxValue}))
    return temp
  })
  
  let trackList = new Array()
  //let url = ''
  console.log(playlist)
  console.log(!og)
  if (!og && playlist) setOG(playlist)


  //get the sum
  playlist?.trackList.forEach((element)=>{
    stats.count++
    stats.avgDance +=  element.features.danceability
    stats.avgEnergy += element.features.energy
    stats.avgValence += element.features.valence
  })

  //get the avg
    stats.avgDance = (stats.avgDance /stats.count).toFixed(2)
    stats.avgEnergy = (stats.avgEnergy /stats.count).toFixed(2)
    stats.avgValence = (stats.avgValence /stats.count).toFixed(2)


  return (
    <Provider theme={defaultTheme}>
      <div className="App">
        <header className="App-header">
          <Flex direction={'column'} gap={'size-100'} width={'100%'} alignItems={'center'}>
          <TextField label="Playlist URL" onChange={setURL} value ={url} width={'50%'} onKeyUp={e => {
            if(e.code === "Enter"){
              let ul = new URL(url)
              getPlaylist(ul.pathname.split('/')).then((songs) => {
                let idList = ''
                songs.tracks.items.forEach((element) =>{
                  idList = idList.concat(`${element.track.id},`)
                })
                console.log(idList)
                getAudFeatures(idList.slice(0,-1)).then((feat) => {
                  trackList = loadSongs(songs.tracks.items, feat.audio_features)
                  setPlaylist({name: songs.name, maker: songs.owner.display_name, trackList: trackList, imgSrc: songs.images[0].url});
                  setOG(playlist)
                })
              })
            }
          }}/>
            <DialogTrigger type='modal' isDismissable>
              <ActionButton>Filter</ActionButton>
              {(close) => <Dialog size='M'>
                  <Heading>Filter Playlist</Heading>
                  <Divider />
                  <Content>
                    <Flex direction={'column'} gap={'size-100'}>
                      {metrics.map((m, k) => (
                        <RangeSlider label={m.id} onChange={(val) =>
                          setFiltered({...filtered, [m.id]: val})
                        } minValue={m.minValue} maxValue={m.maxValue} step={m.step} value={filtered[m.id]}/>
                      ))}
                    </Flex>
                    <Flex direction={'row'} gap={'20%'} width={'100%'}>
                      <ActionButton onPress={() =>{
                        trackList = filter(og.trackList, filtered)
                        setPlaylist({...playlist, trackList: trackList});
                        close()
                      }}>Set Filters</ActionButton>
                      <ActionButton onPress={() =>{
                        setFiltered(tempFilt)
                        trackList = filter(playlist.trackList, filtered)
                        setPlaylist(og);
                        close()
                      }}>Reset</ActionButton>
                      <ActionButton onPress={() =>{
                        close()
                      }}>Cancel</ActionButton>
                    </Flex>
                  </Content>
                  
                </Dialog>}
            </DialogTrigger>
          <Divider orientation='horizontal'height={'size-10'} width={'90%'} alignSelf={'center'}/>
          <Flex direction={"row"} width={'100%'} gap={'10%'}>
            
            
            <Flex direction={"column"} width={'40%'} alignItems={"center"}>
              <Heading level={3}><u>{playlist? playlist.name : "Playlist"}</u></Heading>
              <Flex direction={"row"} columnGap={'5%'} width={'100%'}>
                <Flex direction={"column"} alignItems={"center"}>
                  <Image src={playlist?.imgSrc} width={'50%'}/>
                  <Heading level={6}>{playlist ? `Owner: ${playlist.maker}` : null}</Heading>
                </Flex>
                <Flex alignItems={'center'} direction={'column'}>
                  <Heading level={6}>{playlist ? `Danceability: ${stats.avgDance}` : null}</Heading>
                  <Heading level={6}>{playlist ? `Energy: ${stats.avgEnergy}` : null}</Heading>
                  <Heading level={6}>{playlist ? `Valence: ${stats.avgValence}` : null}</Heading>
                </Flex>
              </Flex>
            </Flex>

            <Divider orientation='vertical' width={'size-10'}/>
            
            <Flex direction={'column'} width={'60%'} maxHeight={'size-5000'} alignItems={'center'} gap={30}>
              <TableView width={'90%'}  alignSelf={'center'} flex ={true} isQuiet>
                <TableHeader columns={columns}>
                    {(column) =>(
                      <Column align='center'key={column.id}>
                        {column.name}
                      </Column>
                    )}
                </TableHeader>
                <TableBody items={playlist?.trackList ? playlist?.trackList : []}>
                  {item =>(
                    <Row>
                      {columnKey => {
                        switch(columnKey){
                          case 'song':
                            return (<Cell>{item.song.name}</Cell>)
                          case 'artist':
                            return <Cell>{item.song.artists[0].name}</Cell>
                          case 'duration':
                            return (<Cell>{`${Math.floor(item.song.duration_ms/(60*1000))} min, ${Math.round(item.song.duration_ms/(1000)%60)} sec`}</Cell>)
                          default:
                            return <Cell>{item.key}</Cell>
                        }
                      }}
                    </Row>
                  )}
                </TableBody>
              </TableView>
              <ActionButton>Makr</ActionButton>
              </Flex>
          </Flex>
          </Flex>
        </header>
      </div>
    </Provider>
  );
}

export default App;
