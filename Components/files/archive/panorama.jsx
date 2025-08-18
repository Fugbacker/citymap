import React from "react";
import { withYMaps } from "react-yandex-maps";

class Panorama extends React.Component {
  componentDidMount() {
    this._isMounted = true;
    const { ymaps } = this.props;

    if (!ymaps.panorama.isSupported()) {
      return;
    }
    ymaps.panorama.locate([55.733685, 37.588264]).done(
      function(panoramas) {
        if (panoramas.length > 0) {
          const player = new ymaps.panorama.Player("player", panoramas[0], {
            direction: [256, 16]
          });
        }
      },
      function(error) {
        alert(error.message);
      }
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return null;
  }
}

export default withYMaps(Panorama, true, [
  "panorama.isSupported",
  "panorama.locate",
  "panorama.Player"
]);
