export const deckLayersConfig = {

    mapTypes: [
        //BASE NSPD - AREAS
        {
            name: 'yandex#map,nspd-areas',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-areas,nspd-unfinished',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-unfinished', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-areas,nspd-zones',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-zones', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-areas,nspd-territorial-zones',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-territorial-zones', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-areas,nspd-forestry',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-forestry', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-areas,nspd-inheritance',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-inheritance', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-areas,nspd-protected',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-protected', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-areas,nspd-economic',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-economic', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-areas,nspd-water',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-water', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-areas,nspd-surveying',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-surveying', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        },
        //BASE NSPD - BUILDINGS
        {
            name: 'yandex#map,nspd-buildings',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-buildings,nspd-unfinished',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-unfinished', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-buildings,nspd-zones',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-zones', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-buildings,nspd-territorial-zones',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-territorial-zones', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-buildings,nspd-forestry',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-forestry', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-buildings,nspd-inheritance',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-inheritance', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-buildings,nspd-protected',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-protected', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-buildings,nspd-economic',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-economic', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-buildings,nspd-water',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-water', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#map,nspd-buildings,nspd-surveying',
            layers: ['yandex#map'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-surveying', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        },
        //SATELITE NSPD - AREAS
        {
            name: 'yandex#satellite,nspd-areas',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-areas,nspd-unfinished',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-unfinished', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-areas,nspd-zones',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-zones', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-areas,nspd-territorial-zones',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-territorial-zones', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-areas,nspd-forestry',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-forestry', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-areas,nspd-inheritance',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-inheritance', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-areas,nspd-protected',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-protected', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-areas,nspd-economic',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-economic', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-areas,nspd-water',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-water', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-areas,nspd-surveying',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-surveying', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        },
        //SATELITE NSPD - BUILDINGS
        {
            name: 'yandex#satellite,nspd-buildings',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-buildings,nspd-unfinished',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-unfinished', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-buildings,nspd-zones',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-zones', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-buildings,nspd-territorial-zones',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-territorial-zones', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-buildings,nspd-forestry',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-forestry', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-buildings,nspd-inheritance',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-inheritance', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-buildings,nspd-protected',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-protected', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-buildings,nspd-economic',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-economic', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-buildings,nspd-water',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-water', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'yandex#satellite,nspd-buildings,nspd-surveying',
            layers: ['yandex#satellite'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-surveying', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        },
        //OSM NSPD - AREAS
        {
            name: 'osm#map,nspd-areas',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-areas,nspd-unfinished',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-unfinished', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-areas,nspd-zones',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-zones', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-areas,nspd-territorial-zones',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-territorial-zones', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-areas,nspd-forestry',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-forestry', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-areas,nspd-inheritance',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-inheritance', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-areas,nspd-protected',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-protected', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-areas,nspd-economic',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-economic', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-areas,nspd-water',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-water', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-areas,nspd-surveying',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-areas', 'custom#nspd-surveying', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        },
        //OSM NSPD - BUILDINGS
        {
            name: 'osm#map,nspd-buildings',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-buildings,nspd-unfinished',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-unfinished', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-buildings,nspd-zones',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-zones', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-buildings,nspd-territorial-zones',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-territorial-zones', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-buildings,nspd-forestry',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-forestry', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-buildings,nspd-inheritance',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-inheritance', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-buildings,nspd-protected',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-protected', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-buildings,nspd-economic',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-economic', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-buildings,nspd-water',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-water', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        }, {
            name: 'osm#map,nspd-buildings,nspd-surveying',
            layers: ['custom#osm'],
            deckLayers: ['custom#nspd-buildings', 'custom#nspd-installations', 'custom#nspd-surveying', 'custom#nspd-borders', 'custom#nspd-neighborhoods']
        },
        ],
    layers: [{
        data: `/api/tiles/{z}/{x}/{y}.png?type=36048`,
        name: 'custom#nspd-areas',
        title: 'Земельные участки',
        copyright: 'OpenStreetMap',
        minZoom: 6,
        maxZoom: 20,
        zIndex: 100,
        type: 'tileLayer',
        tileSize: 1024,
        visible: false,
        opacity: 0.7
    }, {
        data: `/api/tiles/{z}/{x}/{y}.png?type=36049`,
        name: 'custom#nspd-buildings',
        title: 'Здания',
        copyright: 'OpenStreetMap',
        minZoom: 13,
        maxZoom: 20,
        zIndex: 100,
        type: 'tileLayer',
        tileSize: 1024,
        visible: false,
        opacity: 0.7,
        desaturate: 1,
        tintColor: [252, 239, 231, 500]
    },
    // {
    //     data: `/api/tiles/{z}/{x}/{y}.png?type=36328`,
    //     name: 'custom#nspd-installations',
    //     title: 'Сооружения',
    //     copyright: 'OpenStreetMap',
    //     minZoom: 6,
    //     maxZoom: 20,
    //     zIndex: 100,
    //     type: 'tileLayer',
    //     tileSize: 1024,
    //     visible: false,
    //     opacity: 0.7
    // },

    {
        data: `/api/tiles/{z}/{x}/{y}.png?type=36329`,
        name: 'custom#nspd-unfinished',
        title: 'Объекты незавершенного строительства',
        copyright: 'OpenStreetMap',
        minZoom: 6,
        maxZoom: 20,
        zIndex: 100,
        type: 'tileLayer',
        tileSize: 1024,
        visible: false,
        opacity: 0.7
    }, {
        data: `/api/tiles/{z}/{x}/{y}.png?type=36435`,
        name: 'custom#nspd-zones',
        title: 'Зоны с особыми условиями использования территории',
        copyright: 'OpenStreetMap',
        minZoom: 6,
        maxZoom: 20,
        zIndex: 100,
        type: 'tileLayer',
        tileSize: 1024,
        visible: false,
        opacity: 0.5
    }, {
        data: `/api/tiles/{z}/{x}/{y}.png?type=36315`,
        name: 'custom#nspd-territorial-zones',
        title: 'Территориальные зоны',
        copyright: 'OpenStreetMap',
        minZoom: 6,
        maxZoom: 20,
        zIndex: 100,
        type: 'tileLayer',
        tileSize: 1024,
        visible: false,
        opacity: 0.5
    }, {
        data: `/api/tiles/{z}/{x}/{y}.png?type=36314`,
        name: 'custom#nspd-forestry',
        title: 'Лесничества',
        copyright: 'OpenStreetMap',
        minZoom: 6,
        maxZoom: 20,
        zIndex: 100,
        type: 'tileLayer',
        tileSize: 1024,
        visible: false,
        opacity: 0.7
    }, {
        data: `/api/tiles/{z}/{x}/{y}.png?type=37577`,
        name: 'custom#nspd-inheritance',
        title: 'Территории объектов культурного наследия',
        copyright: 'OpenStreetMap',
        minZoom: 9,
        maxZoom: 20,
        zIndex: 100,
        type: 'tileLayer',
        tileSize: 1024,
        visible: false,
        opacity: 0.7
    }, {
        data: `/api/tiles/{z}/{x}/{y}.png?type=36317`,
        name: 'custom#nspd-protected',
        title: 'Особо охраняемые природные территории',
        copyright: 'OpenStreetMap',
        minZoom: 4,
        maxZoom: 20,
        zIndex: 100,
        type: 'tileLayer',
        tileSize: 1024,
        visible: false,
        opacity: 0.7
    }, {
        data: `/api/tiles/{z}/{x}/{y}.png?type=36303`,
        name: 'custom#nspd-economic',
        title: 'Особые экономические зоны',
        copyright: 'OpenStreetMap',
        minZoom: 6,
        maxZoom: 20,
        zIndex: 100,
        type: 'tileLayer',
        tileSize: 1024,
        visible: false,
        opacity: 0.7
    }, {
        data: `/api/tiles/{z}/{x}/{y}.png?type=36470`,
        name: 'custom#nspd-water',
        title: 'Границах водных объектов',
        copyright: 'OpenStreetMap',
        minZoom: 7,
        maxZoom: 20,
        zIndex: 100,
        type: 'tileLayer',
        tileSize: 1024,
        visible: false,
        opacity: 0.7
    }, {
        data: `/api/tiles/{z}/{x}/{y}.png?type=36486`,
        name: 'custom#nspd-surveying',
        title: 'Описание местоположения границ земельных участков, подлежащих образованию в соответствии с утвержденным проектом межевания территории',
        copyright: 'OpenStreetMap',
        minZoom: 9,
        maxZoom: 20,
        zIndex: 100,
        type: 'tileLayer',
        tileSize: 1024,
        visible: false,
        opacity: 0.7
    }, {
        data: `/api/tiles/{z}/{x}/{y}.png?type=36070`,
        name: 'custom#nspd-borders',
        title: 'Кадастровые районы',
        copyright: 'OpenStreetMap',
        minZoom: 2,
        maxZoom: 20,
        zIndex: 100,
        type: 'tileLayer',
        tileSize: 1024,
        visible: false,
        opacity: 0.7
    }, {
        data: `/api/tiles/{z}/{x}/{y}.png?type=36071`,
        name: 'custom#nspd-neighborhoods',
        title: 'Административные границы (кадастровые кварталы)',
        copyright: 'OpenStreetMap',
        minZoom: 2,
        maxZoom: 20,
        zIndex: 100,
        type: 'tileLayer',
        tileSize: 1024,
        visible: false,
        opacity: 0.7
    },
    ]
}
