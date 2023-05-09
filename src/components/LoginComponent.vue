<template>
<!-- HTML -->
<aside>

    
    <div>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" class="input" >
    </div>

    <div>
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" class="input" >
    </div>
    
    <div>
        <a v-if="newUser" @click="newUser=false">Already have an account? Login</a>
        <a v-else @click="newUser=true" >New user? Register here </a>
    </div>
    
    <button 
        @click="signInOrCreateUser()"
        class="button is-info"
        :class="{'is-loading': loading}"
        >
        {{ newUser ? 'Register' : 'Login' }}
    </button>
    <button @click="signInAnonymously(auth)" class="button">Login as a Guest</button>

    <p v-if="errMessage" class="has-text-danger">{{ errMessage }}</p>

</aside>    
<!-- HTML -->
</template>

<script>
// JS
import { auth } from '../firebase'
import { signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth';

export default {
    data() {
        return { 
            auth, 
            signInAnonymously,
            email:'',
            password:'',
            newUser: false,
            errMessage: '',
            loading: false
        }
    },
    methods: {
        async signInOrCreateUser() {
            this.loading = true
            try {
                this.newUser ? 
                    await createUserWithEmailAndPassword(auth,  this.email, this.password) : 
                    await signInWithEmailAndPassword(auth, this.email, this.password)

            } catch (err) {
                this.errMessage = err.code
                console.log(err);
            }

            this.loading = false
        }

    }
}
// JS
</script>