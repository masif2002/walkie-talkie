import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";
import { auth } from "./firebase";


export function useUser() {
    const user = ref(null)

    const unsubscribe = onAuthStateChanged(
        auth, 
        (firebaseUser) => user.value = firebaseUser
    )

    return {
        user,
        unsubscribe
    }
}
