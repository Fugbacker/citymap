
import { TileLayer, MVTLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';

export const layersType = {
    tileLayer: (props) => new TileLayer(props),
    bitmap: (props) => new BitmapLayer(props)
}