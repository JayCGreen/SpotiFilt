import './App.css';
import {
  Column,
  Cell, 
  Row,
  TableBody,
  TableView,
  TableHeader,
  Dialog,
  DialogContainer,
  Content,
  Flex,
  Header,
  Text,
  Heading,
  Divider
} from '@adobe/react-spectrum';
import { useState } from 'react';

const columns = [
  {id: 'song', name: 'Song'},
  {id: 'artist', name: 'Artist'},
  {id: 'duration', name: 'Duration'}
]

const metrics =[
  {key:0 , id: 'danceability', minValue: 0, maxValue: 1, step: 0.01},
  {key:1, id: 'energy', minValue: 0, maxValue: 1, step: 0.01},
  {key:2, id: 'valence', minValue: 0, maxValue: 1, step: 0.01},
  {key:3, id: 'instrumentalness', minValue: 0, maxValue: 1, step: 0.01}
]


export function SongTable(playlist) {
  const [dialog, setDialog] = useState()

  function songStats(){
    let currSong = playlist.trackList[dialog.currentKey]
    console.log()
    return(
      <DialogContainer isDismissable onDismiss={()=>setDialog()} isKeyboardDismissDisabled={false}>
        <Dialog size='m'>
          <Header alignSelf={'start'}>
            <Heading>{currSong.song.name}</Heading>
          </Header>
          <Divider/>
          <Content>
            {metrics.map((element)=>
              <Heading level={4}>
                <Text>{`${element.id}: ${currSong.features[element.id]}`}</Text><br/>
              </Heading>
            )}
            
          </Content>
        </Dialog>
      </DialogContainer>
    )
  }
  

  return (
    <Flex width={"100%"} alignItems={'start'}>
    <TableView alignSelf={'start'} width={'100%'} maxHeight={'75vh'} isQuiet selectionMode='single' selectionStyle="highlight" selectedKeys={dialog} onSelectionChange={setDialog}>
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
    {dialog? songStats():null}
    </Flex>
  );
}
