import './App.css';
import {
  Column,
  Cell, 
  Row,
  TableBody,
  TableView,
  TableHeader,
} from '@adobe/react-spectrum';

const columns = [
  {id: 'song', name: 'Song'},
  {id: 'artist', name: 'Artist'},
  {id: 'duration', name: 'Duration'}
]

export function songTable(playlist) {
  

  return (
    <TableView alignSelf={'start'} width={'90%'} isQuiet>
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
  );
}
