<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-8">
          <youtube :video-id="videoId" :player-vars="playerVars" @ended="nextSong" :fit-parent="true"></youtube>
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
              <tr v-for="(video, index) in playlist" :key="video.id">
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
export default {
  name: "App",
  data: function() {
    return {
      playlist: [],
      url: "",
      videoId: null,
      currentIndex: 0,
      playerVars: {
        autoplay: 1
      }
    };
  },
  created: function() {
    this.play();
  },
  methods: {
    play: function() {
      if (this.playlist[this.currentIndex]) {
        this.videoId = this.playlist[this.currentIndex].id;
      } else {
        alert("please add videos");
      }
    },
    playing() {
      console.log("we are watching!!!");
    },
    nextSong() {
      console.log("ended");
      this.currentIndex += 1;
      this.play();
    },
    addSong() {
      if (this.url === "") {
        alert("what da heo ?");
        return;
      }

      this.playlist.push({
        url: this.url,
        id: this.$youtube.getIdFromUrl(this.url)
      })
      this.url = "";

      if (this.playlist.length == 1) {
        this.play()
      }
    }
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
