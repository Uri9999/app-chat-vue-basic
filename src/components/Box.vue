<template>
    <div class="box">
        <ul id="chat">
            <li class="text-inner" :class="item.idFrom === currentUserId ? 'me' : 'you'" v-for="item in listMessage"
                :key="item.id">
                <div class="entete">
                    <span class="status green"></span>
                    <h3>{{ item.id | formatDateTime }}</h3>
                </div>
                <div class="triangle"></div>
                <div class="message">
                    {{ item.content }}
                </div>
            </li>
        </ul>
        <footer>
            <textarea placeholder="Type your message" v-model="inputValue"></textarea>
            <a href="#" @click.prevent="sendMessage(inputValue)">Send</a>
        </footer>
    </div>
</template>

<script>
import firebase from '../services/firebase';
import moment from 'moment'
export default {
    props: ["currentPeerUser"],
    data() {
        return {
            currentUserName: localStorage.getItem("name"),
            currentUserId: localStorage.getItem("id"),
            currentUserPhoto: localStorage.getItem("photoURL"),
            inputValue: "",
            photoURL: localStorage.getItem("photoURL"),
            listMessage: [],
            groupChatId: null
        }
    },

    watch: {
        currentPeerUser: function (newVal, oldVal) {
            if (newVal !== oldVal) {
                this.getMessages();
            }
        }
    },

    methods: {
        async sendMessage(content) {
            if (content.trim() === "") {
                return;
            }
            const timestamp = moment()
                .valueOf()
                .toString();
            const message = {
                id: timestamp,
                idFrom: this.currentUserId,
                idTo: this.currentPeerUser.id,
                timestamp: timestamp,
                content: content.trim()
            };

            const defaultStatus = {
                status: 0,
                idFrom: this.currentUserId,
                idTo: this.currentPeerUser.id
            }

            await firebase
                .firestore()
                .collection("Messages")
                .doc(this.groupChatId)
                .collection(this.groupChatId)
                .doc(timestamp)
                .set(message)
                .then(() => {
                    this.inputValue = "";
                });
            await firebase
                .firestore()
                .collection("Messages")
                .doc(this.groupChatId)
                .set({
                    status: 0,
                    idFrom: this.currentUserId,
                    idTo: this.currentPeerUser.id
                })
            // firebase
            //     .firestore()
            //     .collection("Messages")
            //     .doc(this.groupChatId).set({ status: 0 })
            // const events = firebase.firestore().collection('Messages').get()
            //     .then(querySnapshot => {
            //         console.log('snap', querySnapshot);
            //         querySnapshot.docs.map(doc => {
            //             console.log('LOG 1', doc.data());
            //             console.log('LOG 1', doc.id);
            //             // return doc.data();
            //         });
            //     });
        },

        getMessages() {
            console.log("call coming");
            this.listMessage = [];
            // let groupChatId = `${this.currentPeerUser.id} + ${this.currentUserId}`;
            let groupChatId = [this.currentPeerUser.id, this.currentUserId]
            groupChatId = groupChatId.sort().join('+');
            firebase
                .firestore()
                .collection("Messages")
                .doc(groupChatId)
                .collection(groupChatId)
                .onSnapshot(Snapshot => {
                    if (Snapshot.docChanges().length > 0) {
                        console.log('> 0 group', this.groupChatId);
                        console.log('length > 0');
                        this.groupChatId = groupChatId;
                        Snapshot.docChanges().forEach(res => {
                            this.listMessage.push(res.doc.data());
                            this.$emit('updateStatusMessage', res.doc.data())
                        });
                    } else {
                        let groupChatId = [this.currentPeerUser.id, this.currentUserId]
                        this.groupChatId = groupChatId.sort().join('+');
                        firebase
                            .firestore()
                            .collection("Messages")
                            .doc(this.groupChatId)
                            .collection(this.groupChatId)
                            .onSnapshot(Snapshot => {
                                Snapshot.docChanges().forEach(res => {
                                    console.log('< 0 group', this.groupChatId);
                                    console.log('length < 0');
                                    // if (res.type === "added") { 
                                    this.listMessage.push(res.doc.data());
                                    // }
                                    this.$emit('updateStatusMessage', res.doc.data())
                                });
                            });
                    }
                });
        },

        createGroupId(peerUserId, currentUserId) {
            let groupChatId = [peerUserId, currentUserId]
            return groupChatId.sort().join('+');
        }
    },

    mounted() {
        if (!localStorage.hasOwnProperty("id")) this.$router.push({ name: "Login" });
        this.getMessages();
        console.log(this.listMessage);
        console.log(this.currentUserId);
    }
}
</script>

<style scoped>
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

footer {
    height: 155px;
    padding: 20px 30px 10px 20px;
}

footer textarea {
    resize: none;
    border: none;
    display: block;
    width: 90%;
    border-radius: 3px;
    padding: 20px;
    font-size: 13px;
    margin-bottom: 13px;
}

footer textarea::placeholder {
    color: #ddd;
}

footer img {
    height: 30px;
    cursor: pointer;
}

footer a {
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
