interface ISong {
  urls: string[]
  name: string
  pic: string
  artist: string
  bvid: string
  duration: number
}

interface ICollection {
  songs: ISong[]
  name: string
  id: string
}

interface IDemandMusic {
  bvid: string;
  uname: string;
  uid: number;
  isFree: boolean
}
