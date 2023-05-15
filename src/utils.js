import { doc, getDoc } from 'firebase/firestore'
import { db, auth } from './firebase'

export const roomExists = async (roomId) => {
    const docRef = doc(db, 'chats', roomId)
    const room = await getDoc(docRef)

    return room.exists()
}

export const checkUserExists = () => {
  return new Promise((resolve) => {

    auth.onAuthStateChanged(fbUser => {
      resolve(fbUser)
    })

  })
}