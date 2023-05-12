import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

export const roomExists = async (roomId) => {
    const docRef = doc(db, 'chats', roomId)
    const room = await getDoc(docRef)

    return room.exists()
    
}