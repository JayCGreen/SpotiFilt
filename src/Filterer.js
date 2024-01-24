import { useState } from 'react';
import './App.css';
import {
    ActionButton,
    Content,
    Dialog,
    DialogTrigger,
    Divider,
    Flex,
    Heading,
    RangeSlider
} from '@adobe/react-spectrum';

const metrics =[
    {key:0 , id: 'danceability', minValue: 0, maxValue: 1, step: 0.01},
    {key:1, id: 'energy', minValue: 0, maxValue: 1, step: 0.01},
    {key:2, id: 'valence', minValue: 0, maxValue: 1, step: 0.01},
    {key:3, id: 'instrumentalness', minValue: 0, maxValue: 1, step: 0.01}
  ]

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

export function Filterer(playlist, setPlaylist) { 
    const [origPL, setOrigPL] = useState(playlist)
    const [filtered, setFiltered] = useState(() => {
        let temp ={}
        metrics.forEach(m => (
        temp[m.id] = {start: m.minValue, end: m.maxValue}))
        return temp
      });

    let tempFilt = Object.create(() => {
        let temp ={}
        metrics.forEach(m => (
        temp[m.id] = {start: m.minValue, end: m.maxValue}))
        return temp
    })

    let trackList = []
    console.log(origPL)
    console.log("oi vey")
    if (!origPL && playlist) setOrigPL(playlist)
    
  

  return (
    <DialogTrigger type='modal' isDismissable>
    <ActionButton isDisabled={!playlist}>Filter</ActionButton>
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
              trackList = filter(origPL.trackList, filtered)
              setPlaylist({...playlist, trackList: trackList});
              close()
            }}>Set Filters</ActionButton>
            <ActionButton onPress={() =>{
              setFiltered(tempFilt)
              trackList = filter(playlist.trackList, filtered)
              setPlaylist(origPL);
              close()
            }}>Reset</ActionButton>
            <ActionButton onPress={() =>{
              close()
            }}>Cancel</ActionButton>
          </Flex>
        </Content>
        
      </Dialog>}
  </DialogTrigger>
  );
}
