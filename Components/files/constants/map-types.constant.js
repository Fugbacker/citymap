export const mapTypes = {
    baseLayers: [
        { title: 'Схема', value: 'yandex#map', selected: true, type: 'base' },
        { title: 'Спутник', value: 'yandex#satellite', selected: false, type: 'base' },
        { title: 'OSM', value: 'osm#map', selected: false, type: 'base' }],

    cadastralBoundaries: [
        { title: 'Земельные участки', value: 'nspd-areas', selected: true, type: 'boundaries' },
        { title: 'Здания', value: 'nspd-buildings', selected: false, type: 'boundaries' }
    ],

    thematicLayers: [
        { title: 'Без слоя', value: '', selected: true, type: 'thematic' },
        // { title: 'Объекты незавершенного строительства', value: 'nspd-unfinished', selected: false, type: 'thematic' },
        { title: 'Зоны с особыми условиями', value: 'nspd-zones', selected: false, type: 'thematic' },
        { title: 'Территориальные зоны', value: 'nspd-territorial-zones', selected: false, type: 'thematic' },
        { title: 'Лесничества', value: 'nspd-forestry', selected: false, type: 'thematic' },
        { title: 'Объекты культурного наследия', value: 'nspd-inheritance', selected: false, type: 'thematic' },
        { title: 'Охраняемые природные территории', value: 'nspd-protected', selected: false, type: 'thematic' },
        { title: 'Особые экономические зоны', value: 'nspd-economic', selected: false, type: 'thematic' },
        { title: 'Водныеобъекты', value: 'nspd-water', selected: false, type: 'thematic' },
        // { title: 'Описание местоположения границ земельных участков, подлежащих образованию', value: 'nspd-surveying', selected: false, type: 'thematic' }
    ]
}