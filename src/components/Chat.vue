<template>
    <div class="chat">
        <div id="container">
            <aside>
                <header>
                    <!-- <input type="text" placeholder="search"> -->
                    <div class="user">
                        <div class="img">
                            <!-- <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_10.jpg" alt=""> -->
                            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt="">


                        </div>
                        <div class="info">
                            <h2>{{ currentUserName }}</h2>
                            <h3>
                                <button @click="logOut()">Logout</button>
                            </h3>
                        </div>
                    </div>
                </header>
                <ul>
                    <li v-for="item in searchUsers" :key="item.id" v-show="item.id != currentUserId"
                        @click="letsChat(item)">
                        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_10.jpg" alt="">
                        <div>
                            <h2>{{ item.name }}</h2>
                            <h3>
                                <span class="status green"></span>
                                read
                            </h3>
                        </div>
                    </li>
                </ul>
            </aside>
            <main>
                <header v-if="userChatBox">
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_10.jpg" alt="">

                    <div>
                        <h2>Chat with {{ userChatBox }}</h2>
                        <h3>already 1902 messages</h3>
                    </div>
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_star.png" alt="">
                </header>
                <Box :currentPeerUser="currentPeerUser" v-if="currentPeerUser" @updateStatusMessage="updateStatusUser">
                </Box>
            </main>
        </div>
    </div>
</template>

<script>
import firebase from "../services/firebase";
import Box from "./Box.vue";

export default {
    components: {
        Box
    },
    data() {
        return {
            currentUserName: localStorage.getItem("name"),
            currentPeerUser: null,
            currentUserId: localStorage.getItem("id"),
            currentUserPhoto: localStorage.getItem("photoURL"),
            searchUsers: [],
            photoURL: localStorage.getItem("photoURL"),
            userChatBox: '',
            userUrlChatBox: '',
            statusMessages: '',
        }
    },

    methods: {
        async getUserList() {
            const result = await firebase
                .firestore()
                .collection("users")
                .get();
            if (result.docs.length > 0) {
                let listUsers = result.docs;
                listUsers.forEach((item, index) => {
                    this.searchUsers.push({
                        key: index,
                        documentKey: item.id,
                        id: item.data().id,
                        name: item.data().name,
                        URL: item.data().URL,
                        description: item.data().description
                    });
                });
            }
        },

        letsChat(item) {
            this.currentPeerUser = item;
            this.userChatBox = item.name;
            this.userUrlChatBox = item.URL;
        },

        logOut() {
            firebase.auth().signOut().then(() => {
                localStorage.clear();
                this.$router.push({ name: 'Login' });
            }).catch(error => {
                alert(error.message);
            });;
        },

        updateStatusUser(user) {
        },

        async updateStatusMessage() {
            await firebase.firestore().collection('Messages').onSnapshot(snap => {
                let changes = snap.docChanges();
                console.log(changes);
                // this.statusMessages = changes
                // console.log(this.statusMessages);
                changes.forEach((item, itemIndex) => {
                    this.statusMessages.push({
                        groupId: item.doc.id,
                        idFrom: item.doc.data().idForm,
                        idTo: item.doc.data().idTo,
                        status: item.doc.data().status
                    });
                })
            })
        }
    },

    created() {
        if (!localStorage.hasOwnProperty("id")) this.$router.push({ name: "Login" });
        this.getUserList();
        this.updateStatusMessage()
    }
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

body {
    background-color: #abd9e9;
    font-family: Arial;
}

#container {
    width: 750px;
    height: 800px;
    background: #eff3f7;
    margin: 0 auto;
    font-size: 0;
    border-radius: 5px;
    overflow: hidden;
}

.user {
    display: flex;
    background-color: rgb(68, 72, 83);
}

.user .img {
    padding-right: 20px;
}

.user .info {
    color: rgb(255, 255, 255);
}

aside {
    width: 260px;
    height: 800px;
    background-color: #3b3e49;
    display: inline-block;
    font-size: 15px;
    vertical-align: top;
}

main {
    width: 490px;
    height: 800px;
    display: inline-block;
    font-size: 15px;
    vertical-align: top;
}

aside header {
    padding: 30px 20px;
}

aside input {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 50px 0 20px;
    background-color: #5e616a;
    border: none;
    border-radius: 3px;
    color: #fff;
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_search.png);
    background-repeat: no-repeat;
    background-position: 170px;
    background-size: 40px;
}

aside input::placeholder {
    color: #fff;
}

aside ul {
    padding-left: 0;
    margin: 0;
    list-style-type: none;
    overflow-y: scroll;
    height: 690px;
}

aside li {
    padding: 10px 0;
}

aside li:hover {
    background-color: #5e616a;
}

h2,
h3 {
    margin: 0;
}

aside li img {
    border-radius: 50%;
    margin-left: 20px;
    margin-right: 8px;
}

aside li div {
    display: inline-block;
    vertical-align: top;
    margin-top: 12px;
}

aside li h2 {
    font-size: 14px;
    color: #fff;
    font-weight: normal;
    margin-bottom: 5px;
}

aside li h3 {
    font-size: 12px;
    color: #7e818a;
    font-weight: normal;
}

.status {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 7px;
}

.green {
    background-color: #58b666;
}

.orange {
    background-color: #ff725d;
}

.blue {
    background-color: #6fbced;
    margin-right: 0;
    margin-left: 7px;
}

main header {
    height: 110px;
    padding: 30px 20px 30px 40px;
}

main header>* {
    display: inline-block;
    vertical-align: top;
}

main header img:first-child {
    border-radius: 50%;
}

main header img:last-child {
    width: 24px;
    margin-top: 8px;
}

main header div {
    margin-left: 10px;
    margin-right: 145px;
}

main header h2 {
    font-size: 16px;
    margin-bottom: 5px;
}

main header h3 {
    font-size: 14px;
    font-weight: normal;
    color: #7e818a;
}

#chat {
    padding-left: 0;
    margin: 0;
    list-style-type: none;
    overflow-y: scroll;
    height: 535px;
    border-top: 2px solid #fff;
    border-bottom: 2px solid #fff;
}

#chat li {
    padding: 10px 30px;
}

#chat h2,
#chat h3 {
    display: inline-block;
    font-size: 13px;
    font-weight: normal;
}

#chat h3 {
    color: #bbb;
}

#chat .entete {
    margin-bottom: 5px;
}

#chat .message {
    padding: 20px;
    color: #fff;
    line-height: 25px;
    max-width: 90%;
    display: inline-block;
    text-align: left;
    border-radius: 5px;
}

#chat .me {
    text-align: right;
}

#chat .you .message {
    background-color: #58b666;
}

#chat .me .message {
    background-color: #6fbced;
}

#chat .triangle {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 10px 10px 10px;
}

#chat .you .triangle {
    border-color: transparent transparent #58b666 transparent;
    margin-left: 15px;
}

#chat .me .triangle {
    border-color: transparent transparent #6fbced transparent;
    margin-left: 375px;
}

main footer {
    height: 155px;
    padding: 20px 30px 10px 20px;
}

main footer textarea {
    resize: none;
    border: none;
    display: block;
    width: 100%;
    height: 80px;
    border-radius: 3px;
    padding: 20px;
    font-size: 13px;
    margin-bottom: 13px;
}

main footer textarea::placeholder {
    color: #ddd;
}

main footer img {
    height: 30px;
    cursor: pointer;
}

main footer a {
    text-decoration: none;
    text-transform: uppercase;
    font-weight: bold;
    color: #6fbced;
    vertical-align: top;
    margin-left: 333px;
    margin-top: 5px;
    display: inline-block;
}
</style>
