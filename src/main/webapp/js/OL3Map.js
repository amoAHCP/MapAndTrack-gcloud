OL3Map = function (opt_options) {

    var options = opt_options || {};
    if (!options.center)
        options.center = [1014517.02672212, 6228354.578845702];
    //[1, 10];//[9+6.807/60, 48+43.509/60]; // N48°43.509 E09°06.807
    if (!options.zoom)
        options.zoom = 14;
    this.projection = ol.proj.get('EPSG:3857'); // default projection (Web Mercator)
    this.projectionGPS = ol.proj.get('EPSG:4326'); // WGS 84 - GPS

    this.startDraw = function () {
        this.draw.setActive(true);
        stateChange("drawinit");
    }

    this.clearDraw = function () {
        if (this.modify)
            this.modify.setActive(false);
        this.draw.setActive(false);
        this.vector.getSource().clear();
        this.map.renderSync();
        stateChange("cleared");
    }

    var source = new ol.source.Vector();

    options.hasSource = true;
    if (options.url) {
        console.log("Load from URL");
        source = new ol.source.Vector({
            url: options.url,
            format: new ol.format.GPX()
        });

        options.zoomTo = function (vector, map) {
            // GPX zoom To
            vector.getSource().on("change", function (evt) {
                extent = vector.getSource().getExtent();
                map.getView().fit(extent, map.getSize());
            });
        }
    } else if (options.gpx) {
        console.log("Load from literal");
        var format = new ol.format.GPX();
        var features = format.readFeatures(options.gpx,
                {featureProjection: this.projection});
        source = new ol.source.Vector({features: features});

        options.zoomTo = function (vector, map) {
            var extent = vector.getSource().getExtent();
            map.getView().fit(extent, map.getSize());
        }
    } else {
        console.log("no source");
        options.hasSource = false;
    }
    this.source = source;

    var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: [0, 153, 255, 0.5],
                width: 9
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });
    this.vector = vector;
    var _this = this;
    var controls = [];

    if (options.saveHandler) {
        controls.push({name: "save",
            handler: function () {
                var features = [];

                _this.source.forEachFeature(function(f){
                    var feature = f.clone();
                    features.push(feature);
                    feature.getGeometry().transform(this.projection, this.projectionGPS);
                }, _this );

                if (features && features.length > 0) {
                    var format = new ol.format.GPX();
                    var gpxString = new ol.format.GPX().writeFeatures(features);
                    options.saveHandler.apply(window, [options.routeObject, gpxString]);
                }
            },
            html: '<img src="toolbar/save.png" title="save"> </img>',
            tooltip: 'save'
        });
    }

    if (!options.hasSource) {
        controls.push({name: "draw",
            handler: function () {
                _this.startDraw.call(_this);
            },
            html: '<img src="toolbar/draw.png" title="draw a route"> </img>',
            tooltip: 'draw a route'
        });
        controls.push({name: "clear",
            handler: function () {
                _this.clearDraw.call(_this);
            },
            html: '<img src="toolbar/delete.png" title="clear"> </img>',
            tooltip: 'clear'
        });

    }

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                title: 'OSM',
                type: 'base',
                visible: true,
                source: new ol.source.OSM()
            }),
            new ol.layer.Tile({
                title: 'Mapquest',
                type: 'base',
                visible: false,
                source: new ol.source.MapQuest({layer: 'osm'})
            }),
            new ol.layer.Tile({
                title: 'Mapquest Sat',
                type: 'base',
                visible: false,
                source: new ol.source.MapQuest({layer: 'sat'})
            }),
            vector
        ],
        target: 'map',
        view: new ol.View({
            center: options.center
            , zoom: options.zoom
                    //, projection: this.projection
        }),
        controls: [new ol.control.ZoomSlider(),
            //new ol.control.OverviewMap(),
            new MultiControl({
                controls: controls
            }),
            new ol.control.ScaleLine(),
            new ol.control.Attribution(),
            new ol.control.MousePosition({
                coordinateFormat: function (coord) {
                    return coord[0] + " " + coord[1];
//                    return Geo.Util.getFormattedLonLat(coord[1], "lat", "dmdm") +
//                            ' ' +
//                            Geo.Util.getFormattedLonLat(coord[0], "lon", "dmdm");
                }
                //, projection: this.projectionGPS
            }),
            new ol.control.LayerSwitcher({
                tipLabel: 'Legende' // Optional label for button
            })]
    });
    this.map = map;


    if (options.zoomTo) {
        options.zoomTo(vector, map);

        this.modify = new Modify(map);
        this.modify.setActive(true);
    } else {
        this.draw = new Draw(map, vector);
        this.draw.setActive(false);
    }

    // The snap interaction must be added after the Modify and Draw interactions
    // in order for its map browser event handlers to be fired first. Its handlers
    // are responsible of doing the snapping.
    var snap = new ol.interaction.Snap({
        source: vector.getSource()
    });
    map.addInteraction(snap);

    stateChange("initialized");

}


