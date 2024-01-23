import './App.css';
import {
    ActionButton,
    Content,
    Dialog,
    DialogTrigger,
    Flex,
    Heading,
    Image,
    Item,
    Menu,
    MenuTrigger,
} from '@adobe/react-spectrum';
import { useState } from 'react';
import {VegaLite} from 'react-vega';


const barData = {
  table: [
    { a: 'A', b: 28 },
    { a: 'B', b: 55 },
    { a: 'C', b: 43 },
    { a: 'D', b: 91 },
    { a: 'E', b: 81 },
    { a: 'F', b: 53 },
    { a: 'G', b: 19 },
    { a: 'H', b: 87 },
    { a: 'I', b: 52 },
  ],
}


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
                    <ActionButton>Metric</ActionButton>
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
