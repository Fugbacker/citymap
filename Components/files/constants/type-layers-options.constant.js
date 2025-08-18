import { BitmapLayer } from '@deck.gl/layers';
import { COORDINATE_SYSTEM } from '@deck.gl/core';

export const layersTypeOptions = {
    tileLayer: (props) => ({
        minZoom: 18,
        maxZoom: 20,
        opacity: 0.7,
        desaturate: 0,
        pickable:false,
        _imageCoordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        onTileError: props => { },
        // getTileData: ({ x, y, z, bbox }) => {
        //     const box = { west, south, east, north };
        //     // Кастомный запрос — можно использовать fetch или просто вернуть URL
        //     const imageUrl = `https://nspd.gov.ru/api/aeggis/v3/36048/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=36048&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=36048&RANDOM=0.34806718283014204&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=408&J=70&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${box}`;

        //     return new Promise((resolve, reject) => {
        //       const img = new Image();
        //       console.log('imageUrl', imageUrl)
        //       img.crossOrigin = 'anonymous'; // если нужно
        //       img.onload = () => resolve(img);
        //       img.onerror = reject;
        //       img.src = imageUrl;
        //     });
        //   },
        renderSubLayers: props => {
            const {
                bbox: { west, south, east, north }
            } = props.tile;

            return new BitmapLayer(props, {
                data: null,
                image: props.data,
                bounds: [west, south, east, north]
            });
        },
        ...props,
        tileSize: 1024
    }),

    bitmap: (props) => ({
        opacity: 0.05,
        ...props,
        desaturate: 1,
        tintColor: [69, 197, 135,1],
        zIndex: 1,
        onError: props => {  },
    }),
}