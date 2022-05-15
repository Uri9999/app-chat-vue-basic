<template>
    <div class="profile">
        <div class="card">
            <img src="img.jpg" alt="John" style="width:100%">
            <h1>John Doe</h1>
            <p class="title">CEO & Founder, Example</p>
            <p>Harvard University</p>
            <p><button>Contact</button></p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // TODO: need work feature profile
            firebaseDocId: localStorage.getItem("FirebaseDocumentId"),
            id: localStorage.getItem("id"),
            name: localStorage.getItem("name"),
            aboutMe: localStorage.hasOwnProperty("description")
                ? localStorage.getItem("description")
                : "",
            photoURL: localStorage.getItem("photoURL"),
            newPhoto: null
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    max-width: 300px;
    margin: auto;
    text-align: center;
}

.title {
    color: grey;
    font-size: 18px;
}

button {
    border: none;
    outline: 0;
    display: inline-block;
    padding: 8px;
    color: white;
    background-color: #000;
    text-align: center;
    cursor: pointer;
    width: 100%;
    font-size: 18px;
}

a {
    text-decoration: none;
    font-size: 22px;
    color: black;
}

button:hover,
a:hover {
    opacity: 0.7;
}
</style>
