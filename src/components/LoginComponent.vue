<template>
<!-- HTML -->

    <section class="is-flex is-flex-direction-column is-align-items-center ">
        
        <div class="field mb-5">
            <p class="control has-icons-left">
                <input type="email" id="email" v-model="email" class="input is-medium is-primary has-background-black-bis has-text-white-bis" placeholder="Email">
                <span class="icon is-small is-left">
                    <i class="fa fa-envelope"></i>
                </span>
            </p>
        </div>
    
        <div class="field mb-5">
            <p class="control has-icons-left">
                <input type="password" id="password" v-model="password" class="input input is-medium is-primary has-background-black-bis has-text-white-bis" placeholder="Password">
                <span class="icon is-left">
                    <i class="fa fa-lock"></i>
                </span>
            </p>
        </div>
        
        <div class="is-flex is-flex-direction-column is-align-items-center">
            <button 
                @click="signInOrCreateUser()"
                class="button is-primary mt-5"
                :class="{'is-loading': loading}"
                :disabled="loading || anonymousLoginLoading"
            >
                {{ newUser ? 'Register' : 'Login' }}
            </button>

            <div class="choice">
                <p class="has-text-white seperator">OR</p>
                <p class="has-text-grey line">________________________________________________________________________________________</p>
            </div>

            <button 
                @click="anonymousSignIn()"
                class="button is-primary is-inverted has-background-black-bis  mt-5"
                :class="{'is-loading': anonymousLoginLoading}"
                :disabled="anonymousLoginLoading || loading"
            >
                Login as a Guest
            </button>

        </div>

        <div class="login-state mt-6">
            <h3 v-if="newUser" class="has-text-white">
                Already have an account? <span class="has-text-primary is-clickable" @click="newUser=false" >Login</span>
            </h3>
            <h3 v-else class="has-text-white">
                New to walkie talkie? <span class="has-text-primary is-clickable" @click="newUser=true" >Register</span> 
            </h3>
        </div>
    </section>    

<!-- HTML -->
</template>

<script>
// JS
import { auth } from '../firebase'
import { signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@firebase/auth';

export default {
    data() {
        return { 
            email:'',
            password:'',
            newUser: false,
            loading: false,
            anonymousLoginLoading: false
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
                this.$toast.error(err.code)
            }

            this.loading = false
        },

        async anonymousSignIn() {
            this.anonymousLoginLoading = true

            try {
                await signInAnonymously(auth)
            } catch (err) {
                this.$toast.error(err.code)
            }

            this.anonymousLoginLoading = false
        }

    }
}
// JS
</script>

<style scoped>
* {
  margin: 0px;
}

section {
    min-height: 80vh;
}

input, .btn-container {
    width: 400px;
}

input {
    filter: drop-shadow(0 24px 14px rgba(255, 255, 255, 0.03)) drop-shadow(0 10px 8px rgba(255, 255, 255, 0.08))
}

::-webkit-input-placeholder {
  color: hsl(0, 0%, 48%)
}

.login-state span:hover{
    opacity: 60%;
}

.login-state h3 {
    font-weight: 400;
    letter-spacing: 0.5px;
}

.choice {
    height: 80px;
    width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.line {
    margin-top: -69px;
    position: relative;
    z-index: 10;
}

.seperator {
    background-color: black;
    position: relative;
    z-index: 20;
    padding: 20px;
}

</style>