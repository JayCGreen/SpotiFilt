import './App.css';
import {
    ActionButton,
    Content,
    Dialog,
    DialogTrigger,
    Flex,
    Item,
    Menu,
    MenuTrigger,
} from '@adobe/react-spectrum';
import {VegaLite} from 'react-vega';


export function graphPop(playlist, selected, setSelected) {
  
    const data = { table: playlist.trackList.map((element) =>
    {
      return {song: element.song.name, danceability: element.features.danceability, energy:element.features.energy, valence:element.features.valence }
    })}
    console.log(data)

    let metric = ["danceability", "energy", "valence"]
    //console.log(selected.currentKey)

    const spec = {
      width: 400,
      title: `${playlist?.name}'s ${selected?.currentKey} Distribution`,
      height: 200,
      mark: 'bar',
      encoding: {
        y: { aggregate: 'count', title: 'Count' },
        x: { field: selected?.currentKey, bin: {step:.1},},
      },
      data: { name: 'table' }, // note: vega-lite data attribute is a plain object instead of an array
    }
    

  return (
    <div>
        <DialogTrigger isDismissable>
            <ActionButton>Analysis</ActionButton>
        <Dialog>
        <Content alignSelf={'center'}>
            <Flex alignItems={'center'} direction={'column'}>
                <MenuTrigger>
                    <ActionButton marginBottom={'5%'}>Metric</ActionButton>
                    <Menu selectionMode='single' selectedKeys={selected} onSelectionChange={setSelected}>
                        {metric.map((element)=>(
                        <Item key={element}>{element}</Item>
                        ))}
                    </Menu>
                </MenuTrigger>
                {selected ? <VegaLite spec={spec} data={data} />: null}
            </Flex>
        </Content>
        </Dialog>
        </DialogTrigger>
    </div>
  );
}
