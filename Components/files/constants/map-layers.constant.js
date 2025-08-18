export const layersConfig = {
    mapTypes: [{
        name: 'osm#map',
        layers: ['custom#osm']
    } ],

    layers: [{
        tileUrl: 'http://tile.openstreetmap.org/%z/%x/%y.png',
        name: 'custom#osm',
        copyright: 'OpenStreetMap',
        minZoom: 3,
        maxZoom: 20,
        pane: 'ground',
        zIndex: 2
    } ]
};
