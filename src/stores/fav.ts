export const useFavStore = defineStore(
  'fav',
  () => {
    const collections = ref<ICollection[]>([])

    const collectionOptions = computed(() => {
      return collections.value.map((collection) => {
        return {
          name: collection.name,
          id: collection.id,
        }
      })
    })

    const addToCollection = (collectionId: string, song: ISong) => {
      const collection = collections.value.find(collection => collection.id === collectionId)
      if (collection) {
        const exist = collection.songs.findIndex(s => s.bvid === song.bvid)
        if (exist === -1)
          collection.songs.push(song)
      }
    }

    return {
      collections,
      collectionOptions,
      addToCollection,
    }
  },
  {
    persist: {
      paths: ['collections'],
    },
  },
)
