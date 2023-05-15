import { doc, getDoc } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import { db } from './firebase'

export const roomExists = async (roomId) => {
    const docRef = doc(db, 'chats', roomId)
    const room = await getDoc(docRef)

    const toast = useToast()
    if (!room.exists()) {
        toast.error('Room does not exist!')
    }


    return room.exists()
    
}