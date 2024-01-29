import './App.css';
import {
    Flex,
    Heading,
    Image,
    Text
} from '@adobe/react-spectrum';

export function playlistStats(playlist) { 
    let stats = {count: 0, danceability: 0, energy: 0, valence: 0}

    //get the sum
    playlist?.trackList.forEach((element)=>{
        stats.count++
        stats.danceability +=  element.features.danceability
        stats.energy += element.features.energy
        stats.valence += element.features.valence
    })

    //get the avg
    stats.danceability = (stats.danceability /stats.count).toFixed(2)
    stats.energy = (stats.energy /stats.count).toFixed(2)
    stats.valence = (stats.valence /stats.count).toFixed(2)
  

  return (
    <div>
        <Heading level={3}><u>{playlist? playlist.name : "Playlist"}</u></Heading>
        <Flex direction={"row"} width={'100%'} gap={'1em'}>
          <Flex direction={"column"} alignItems={"start"} width={'50%'}>
            <Image src={playlist?.imgSrc} />
            <Heading level={6}>{playlist ? `Owner: ${playlist.maker}` : null}</Heading>
          </Flex>
          <Flex direction={'column'} width={'50%'} alignItems={'start'}>
            <Heading level={4}>
              {Object.keys(stats).map((map)=>(
                <div>
                <Text>{playlist ? `${map}: ` : null}</Text>
                <Text>{playlist ? stats[map] : null}</Text><br/>
                </div>
              )
              )}
            </Heading>
          </Flex>
        </Flex>
</div>
  );
}
