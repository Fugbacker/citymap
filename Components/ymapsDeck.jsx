import React, { useState, useEffect, useRef } from 'react';
import { Deck } from "@deck.gl/core";
import { deckLayersConfig } from './files/constants/deck-layers.constant.js';
import { layersType } from './files/constants/type-layers.contant.js';
import { layersTypeOptions } from './files/constants/type-layers-options.constant.js';
import { default as uuid } from './files/constants/uuid.js';

const YMapsDeck = ({ props }) => {

  const { imageLayer } = props;
  if (!props.mapRef) return;
  const mapRef = useRef(props?.mapRef?.current);
  const projection = mapRef?.current?.options?.get('projection');;
  const [layer, setLayer] = useState({ map: new Map() });
  // console.log('layer', layer)
  const ymaps = useRef(props?.ymaps?.current);
  const deckContainer = useRef(mapRef.current.container?.getParentElement());
  const deckOverlay = useRef(buildCanvas());
  const deck = useRef(undefined);
  const mapTypes = useRef(deckLayersConfig.mapTypes);

  function getLayer(key) {
    return layer.map.get(key);
  }

  function updateLayers(key, value) {
    setLayer(({ map }) => ({ map: map.set(key, value) }));
  }

  function getCenter(event) {
    return projection.fromGlobalPixels(
      event.originalEvent.tick.globalPixelCenter,
      event.originalEvent.tick.zoom);
  }

  const getLayers = () => {
    const data = getLayersType(mapRef.current.getType());
    let layers = data?.map((item) => getLayer(item)?.clone({ visible: true }));
    getLayer('imageLayer') && layers.push(getLayer('imageLayer'));
    return layers;
  }

  function buildCanvas() {
    let canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.pointerEvents = "none";
    canvas.style.inset = '0px';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    return canvas;
  }

  const getLayersType = (selectedType) => {
    return mapTypes.current.filter((type) => type.name === selectedType)[0]?.deckLayers;
  }

  const onMapTypeChange = () => {
    updateDeck({ layers: getLayers() });
  }

  function updateDeck(props) {
    deck.current.setProps(props);
  }

  const getViewState = (state) => {
    return {
      latitude: state
        ? state.latitude
        : mapRef.current.getCenter()[0],
      longitude: state
        ? state.longitude
        : mapRef.current.getCenter()[1],
      zoom: state
        ? state.zoom
        : mapRef.current.getZoom()
    };
  }

  const onViewChange = (event) => {
    const center = getCenter(event);
    updateDeckView({
      latitude: center[0],
      longitude: center[1],
      zoom: event.originalEvent.tick.zoom - 1,
    });
  }

  const updateDeckView = (state) => {
    deck.current.setProps({ viewState: state });
    deck.current.redraw(false);
  }

  const buildLayers = (layersConfig) => {
    return new Promise((resolve, reject) => {
      layersConfig?.layers?.forEach(async (layer) => {
        await buildLayer(layer);
      });
      resolve(true);
    }).catch((error) => resolve(false));
  }

  const createLayers = (layersConfig) => {
    return layersType[layersConfig.type](layersTypeOptions[layersConfig.type](layersConfig));
  }

  const buildLayer = (layer) => {
    return new Promise((resolve, reject) => {
      // if (!layer) return;
      updateLayers(layer.name, createLayers({ ...layer, id: layer.name.includes('#') ? `#${uuid()}` : uuid() }));
      resolve(true);
    }).catch((error) => reject(error));
  }

  const buildDeck = async (layers) => {
    const props = { ...{}, layers: layers };
    deck.current = await createDeckInstance(props);
  }

  const createMapTypes = (data) => {
    data?.forEach((layer) => {
      ymaps.current.mapType.storage
        .add(layer.name, new ymaps.current.MapType(layer.name, layer.layers));
    });
  }

  const addLayer = async (layer) => {
    await buildLayer(layer);
    updateDeck({ layers: getLayers() });
  }

  const addListeners = () => {
    mapRef.current.events.add("typechange", onMapTypeChange);
    mapRef.current.events.add("actiontick", onViewChange);
  }

  const addOptions = () => {
    mapRef.current.cursors.push('arrow');
    mapRef.current.options.set('maxAnimationZoomDifference', 0);
    mapRef.current.container.getElement().style.background = '#fff';
  }

  const createDeckInstance = (props) => {
    return new Deck({
      initialViewState: getViewState(),
      parent: deckContainer?.current,
      canvas: deckOverlay?.current,
      controller: false,
      style: { zIndex: '2000' },
      useDevicePixels: false,
      ...props,
    });
  }

  useEffect(
    () => {
      (async () => {
        mapRef.current.container.getElement().append(deckOverlay.current);
        addListeners();
        addOptions();
        await buildLayers(deckLayersConfig);
        await createMapTypes(deckLayersConfig.mapTypes);
        await buildDeck([]);
        mapRef.current.events.fire('onloaddeck', {});
        return () => {
          deck.current?.finalize();
          deck.current = undefined;
        };
      })();
    }, []);

  useEffect(
    () => {
      imageLayer && addLayer(imageLayer[0]);

    }, [imageLayer]);

}

export default YMapsDeck;