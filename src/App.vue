<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-8">
          <youtube
            ref="youtube"
            :video-id="videoId"
            :player-vars="playerVars"
            @ended="nextSong"
            :fit-parent="true"
          ></youtube>
        </div>
        <div class="col-4">
          <div class="form">
            <div class="form-group row">
              <label class="col-sm-2"></label>
              <input
                type="email"
                class="form-control col-sm-10"
                placeholder="name@example.com"
                v-on:keyup.enter="addSong"
                v-model="url"
              />
            </div>
          </div>
          <table class="table table-borderless">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Url</th>
              </tr>
            </thead>
            <tbody>
              <tr
                :class="{ 'alert alert-info': (index == currentIndex) }"
                v-for="(video, index) in playlist"
                :key="video.id"
              >
                <th scope="row">{{ index }}</th>
                <td>{{ video.url }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from "lodash";
import { db } from "@/firebase";

export default {
  name: "App",
  data: function() {
    return {
      playlistId: null,
      playlist: [],
      url: "",
      videoId: null,
      currentIndex: 0,
      playerVars: {
        autoplay: 1,
        controls: 0
      },
      date: new Date()
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, "/")
    };
  },
  created: function() {
    this.fetchOrCreatePlaylistForToday();
  },
  firestore: {
    playlists: db.collection("playlists")
  },
  methods: {
    fetchOrCreatePlaylistForToday() {
      let self = this;

      this.$firestoreRefs.playlists
        .where("date", "==", this.date)
        .get()
        .then(function(querySnapshot) {
          if (querySnapshot.empty) {
            self.$firestoreRefs.playlists.add({
              date: self.date,
              data: [],
              index: 0,
            });
            self.fetchOrCreatePlaylistForToday();
          } else {
            const docData = querySnapshot.docs[0];

            self.playlistId = docData.id;
            self.playlist = docData.data().data;
            self.currentIndex = docData.data().index;
            self.startAt = docData.data().startAt;
            self.play();
          }
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    },
    play: function() {
      if (this.playlist[this.currentIndex]) {
        this.videoId = this.playlist[this.currentIndex].id;
      } else {
        this.videoId = this.playlist[0].id;
        this.currentIndex = 0;
      }
    },
    playing() {
      console.log("we are watching!!!");
    },
    nextSong() {
      console.log("ended");
      this.currentIndex += 1;
      this.play();
      this.syncDbData();
    },
    addSong() {
      if (this.url === "") {
        alert("what da heo ?");
        return;
      }

      this.playlist.push({
        url: this.url,
        id: this.$youtube.getIdFromUrl(this.url)
      });

      this.syncDbData();

      this.url = "";

      if (this.playlist.length == 1) {
        this.play();
      }
    },
    syncDbData() {
      db.collection("playlists")
        .doc(this.playlistId)
        .set({
          data: this.playlist,
          date: this.date,
          index: this.currentIndex,
        });
    },
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
