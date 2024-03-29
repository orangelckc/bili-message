interface ISong{
  urls: string[]
  name: string
  pic: string
  artist: string
  bvid: string
}

interface ICollection{
  songs: ISong[]
  name: string
  id: string
}