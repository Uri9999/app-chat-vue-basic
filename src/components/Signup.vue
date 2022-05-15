<template>
  <div class="signup">
    <form style="border: 1px solid #ccc" id="formRegister">
      <div class="container">
        <h1>Sign up</h1>
        <p>Please fill in this form to create an account.</p>
        <hr />

        <label for="name"><b>Name</b></label>
        <input type="text" placeholder="Enter Name" v-model="name" required />

        <label for="email"><b>Email</b></label>
        <input type="text" placeholder="Enter Email" v-model="email" required />

        <label for="psw"><b>Password</b></label>
        <input type="password" placeholder="Enter Password" required v-model="password" />

        <label>
          <input type="checkbox" checked="checked" name="remember" style="margin-bottom: 15px" />
          Remember me
        </label>

        <div class="clearfix">
          <button type="button" class="cancelbtn">Cancel</button>
          <button type="submit" @click.prevent="register()" class="signupbtn">Sign Up</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from "../services/firebase";
export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  mounted() {
  },
  methods: {
    register() {
      const auth = firebase.auth();
      auth.createUserWithEmailAndPassword(this.email, this.password)
        .then(async response => {
          console.log(response.user.uid);
          await firebase.firestore().collection('users').add({
            id: response.user.uid,
            name: this.name,
            email: this.email,
            password: this.password,
            description: '',
            URL: '',
          }).then(res => {
            localStorage.setItem("id", response.user.uid);
            localStorage.setItem("name", this.name);
            localStorage.setItem("email", this.email);
            localStorage.setItem("password", this.password);
            localStorage.setItem("URL", "");
            localStorage.setItem("description", "");
            localStorage.setItem("FirebaseDocumentId", res.id);
            this.name = "";
            this.email = "";
            this.password = "";
            this.$router.push({ name: 'Chat' });
          }).catch(error => {
            console.log(error);
          })
        })
    }
  }
};
</script>

<style scoped>
body {
  font-family: Arial, Helvetica, sans-serif;
}

* {
  box-sizing: border-box;
}

#formRegister {
  width: 425px;
  margin: 0 auto;
}

/* Full-width input fields */
input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  display: inline-block;
  border: none;
  background: #f1f1f1;
}

input[type="text"]:focus,
input[type="password"]:focus {
  background-color: #ddd;
  outline: none;
}

hr {
  border: 1px solid #f1f1f1;
  margin-bottom: 25px;
}

/* Set a style for all buttons */
button {
  background-color: #04AA6D;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
}

button:hover {
  opacity: 1;
}

/* Extra styles for the cancel button */
.cancelbtn {
  padding: 14px 20px;
  background-color: #f44336;
}

/* Float cancel and signup buttons and add an equal width */
.cancelbtn,
.signupbtn {
  float: left;
  width: 50%;
}

/* Add padding to container elements */
.container {
  padding: 16px;
}

/* Clear floats */
.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

/* Change styles for cancel button and signup button on extra small screens */
@media screen and (max-width: 300px) {

  .cancelbtn,
  .signupbtn {
    width: 100%;
  }
}
</style>
