import './App.css';
import {
    ActionButton,
    Flex,
    Heading,
    Image,
} from '@adobe/react-spectrum';


export function playlistStats(playlist) {
    let stats = {count: 0, avgDance: 0, avgEnergy: 0, avgValence: 0}

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
    <div>
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
              <ActionButton>Analysis</ActionButton>
    </div>
  );
}
