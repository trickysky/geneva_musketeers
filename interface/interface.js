var baseMap, tileLayer, gridLayer, graphicLayer, highLightLayer;
var map1, map1tileLayer,
    map2, map2tileLayer,
    map3, map3tileLayer,
    map4, map4tileLayer;
var resToLevel = [156543.033928,78271.516964,39135.758482,19567.879241,9783.9396205,4891.96981025,2445.984905125,1222.9924525625,611.49622628125,305.748113140625,152.8740565703125,76.43702828515625,38.21851414257813,19.10925707128906,9.55462853564453,4.777314267822266,2.388657133911133,1.194328566955567,0.597164283477783,0.298582141738892];
var mapTileServer = {
    "osm": { "url": "http://{s}.tile.osm.org/{z}/{x}/{y}.png", "cluster": ['a', 'b', 'c'] },
    "googleImage": { "url": "http://mt{s}.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}", "cluster": ['1', '2', '3'] },
    "googleRoad": { "url": "http://mt{s}.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}", "cluster": ['1', '2', '3'] },
    "amapImage": { "url": "http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}", "cluster": ['1', '2', '3', '4'] },
    "midnight": { "url": "https://s{s}.geohey.com/s/mapping/midnight/all?z={z}&x={x}&y={y}&ak=ZmVmODVkNzZhZjk3NDUzNWFlYjQ4ODcwOGFhMWQ5ZGQ", "cluster": ['1', '2', '3', '4', '5', '6', '7', '8']},
    "dark": { "url": "https://s{s}.geohey.com/s/mapping/dark/all?z={z}&x={x}&y={y}&ak=ZmVmODVkNzZhZjk3NDUzNWFlYjQ4ODcwOGFhMWQ5ZGQ", "cluster": ['1', '2', '3', '4', '5', '6', '7', '8']},
    "pencil": {"url": "https://s{s}.geohey.com/s/mapping/pencil/all?z={z}&x={x}&y={y}&ak=ZmVmODVkNzZhZjk3NDUzNWFlYjQ4ODcwOGFhMWQ5ZGQ", "cluster": ['1', '2', '3', '4', '5', '6', '7', '8']},
    "mapbox": {"url": "http://a.tiles.mapbox.com/v4/bobbysud.79c006a5/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYm9iYnlzdWQiLCJhIjoiTi16MElIUSJ9.Clrqck--7WmHeqqvtFdYig", "cluster": []},
    "arcgis": {"url": "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", "cluster": []}
}
    ;
G.ready(function() {
    $('#myModal').modal('show');

    baseMap = new G.Map('mapContainer', {
        maxExtent: [-2e7, -2e7, 2e7, 2e7],
        hideLogo: true
    });

    var level = 1, res = 20000;
    highLightLayer = (new G.Layer.Graphic()).addTo(baseMap);
    var mapName = mapTileServer["pencil"];
    tileLayer = new G.Layer.Tile(mapName["url"], {
        cluster: mapName["cluster"]
    });
    tileLayer.addTo(baseMap);

    map1 = new G.Map('satelliteMap1', {
        maxExtent: [-2e7, -2e7, 2e7, 2e7],
        hideLogo: true
    });
    var map1Name = mapTileServer["googleImage"];
    map1tileLayer = new G.Layer.Tile(map1Name["url"], {
        cluster: map1Name["cluster"]
    });
    map1tileLayer.addTo(map1);

    map2 = new G.Map('satelliteMap2', {
        maxExtent: [-2e7, -2e7, 2e7, 2e7],
        hideLogo: true
    });
    var map2Name = mapTileServer["amapImage"];
    map2tileLayer = new G.Layer.Tile(map2Name["url"], {
        cluster: map2Name["cluster"]
    });
    map2tileLayer.addTo(map2);

    map3 = new G.Map('satelliteMap3', {
        maxExtent: [-2e7, -2e7, 2e7, 2e7],
        hideLogo: true
    });
    var map3Name = mapTileServer["arcgis"];
    map3tileLayer = new G.Layer.Tile(map3Name["url"], {
        cluster: map3Name["cluster"]
    });
    map3tileLayer.addTo(map3);

    map4 = new G.Map('satelliteMap4', {
        maxExtent: [-2e7, -2e7, 2e7, 2e7],
        hideLogo: true
    });
    var map4Name = mapTileServer["googleImage"];
    map4tileLayer = new G.Layer.Tile(map4Name["url"], {
        cluster: map4Name["cluster"]
    });
    map4tileLayer.addTo(map4);

    baseMap.bind('viewChanged', function(e) {
        res = baseMap.getResolution();
        var zoomLevel = 0.15,
            width = (baseMap.getExtent()[2] - baseMap.getExtent()[0]) * zoomLevel,
            height = (baseMap.getExtent()[3] - baseMap.getExtent()[1]) * zoomLevel;
        map1.zoomTo(baseMap.getCenter(), width, height);
        map2.zoomTo(baseMap.getCenter(), width, height);
        map3.zoomTo(baseMap.getCenter(), width, height);
        map4.zoomTo(baseMap.getCenter(), width, height);
        for (var i = 0; i < resToLevel.length; i++) {
            if (res > resToLevel[i]) {
                break;
            }
        }
        level = i;
        G.loadModule('geogrid', function() {
            if (gridLayer) {
                gridLayer.remove();
            }
            gridLayer = new G.Layer.GeoGrid(level, G.Proj.WebMercator, {
                gridOutlineColor: '#777',
                gridFill: false,
                gridOutlineWidth: 1
            });
            gridLayer.addTo(baseMap);
        });
        highLightLayer.bringToTop();
        // console.log({
        //     'getExtent': String(baseMap.getExtent()[2] - baseMap.getExtent()[0]) + ',' + String(baseMap.getExtent()[3] - baseMap.getExtent()[1]),
        //     'getSize': baseMap.getSize()[0] + ',' + baseMap.getSize()[1],
        //     'center':baseMap.getCenter()[0] + ',' + baseMap.getCenter()[1]
        // });
    });

    graphicLayer = (new G.Layer.Graphic()).addTo(baseMap);
    graphicLayer.setStyle(['tileType'], ['=="satelliteMap1"'], {
        fillColor: '#0f0'
    });
    graphicLayer.setStyle(['tileType'], ['=="satelliteMap2"'], {
        fillColor: '#103DFD'
    });
    graphicLayer.setStyle(['tileType'], ['=="satelliteMap3"'], {
        fillColor: '#F50D0D'
    });
    graphicLayer.setStyle(['tileType'], ['=="satelliteMap4"'], {
        fillColor: '#F1F419'
    });

    baseMap.view([12957800.543657428,4854644.180560455], 21620.657274331897,6606.311944935471);

    var highLight;

    baseMap.bind('click', function(e) {
        $('.satellite-map').unbind('click');
        var [clickLon, clickLat] = G.Proj.WebMercator.unproject(e.mapX, e.mapY),
            row = Math.floor(Math.sin((clickLat * Math.PI / 180)) / 2.0 * Math.pow(2, level)),
            col = Math.floor(clickLon / 360.0 * Math.pow(2, level + 1)),
            deltaLon = 360 / Math.pow(2, level + 1),
            deltaLat = 2 / Math.pow(2, level),
            minLon = col * deltaLon,
            minLat = Math.asin(row * deltaLat) / Math.PI * 180,
            maxLon = (col + 1) * deltaLon,
            maxLat = Math.asin((row + 1) * deltaLat) / Math.PI * 180,
            grid = [
                [
                    G.Proj.WebMercator.project(minLon, minLat),
                    G.Proj.WebMercator.project(minLon, maxLat),
                    G.Proj.WebMercator.project(maxLon, maxLat),
                    G.Proj.WebMercator.project(maxLon, minLat)
                ]
            ];
        baseMap.view([e.mapX, e.mapY]);
        if (highLight) {
            highLight.remove();
        }
        // highLight = new G.Graphic.Point([e.mapX, e.mapY], null, {
        //     shape: 'image',
        //     size: [25, 40],
        //     offset: [-12, -40],
        //     image: '../geohey-js-sdk-2.5.0/lib/images/pin{i}.png'
        // });
        highLight = new G.Graphic.Polygon(grid, null, {
            // fillImage: 'images/honey.png',
            // fillImageSize: [64, 64],
            outlineWidth: 4,
            fillColor: '#000',
            fillOpacity: 0.4,
            // lineHighlightWiden: 1,
            outlineColor: '#484545'
        });
        highLight.addTo(highLightLayer);
        $('.satellite-map').removeClass('map-fade');
        $('#close-button').removeClass('fade');
        $('.satellite-map').bind('click', function() {
            $('.satellite-map').addClass('map-fade');
            $('#close-button').addClass('fade');
            if (highLight) {
                highLight.remove();
            }
            var tileType = $(this).attr("id");
            var pointGrid = new G.Graphic.Polygon(grid, { tileType: tileType }, {
                outlineColor: '#000',
                outlineWidth: 1,
                fillOpacity: 1
            });
            pointGrid.addTo(graphicLayer);
            $('.satellite-map').unbind('click');
        });
    });
});

function zoomIn() {
    if (baseMap) {
        baseMap.zoomIn();
    }
}

function zoomOut() {
    if (baseMap) {
        baseMap.zoomOut();
    }
}

function sampleModal() {
    $('#myModal').modal('show');
}

function closesatelliteMap() {
    $('.satellite-map').addClass('map-fade');
    $('#close-button').addClass('fade');
}

function viewToCongo() {
    if (tileLayer) {
        tileLayer.remove();
    }
    var mapName = mapTileServer["googleRoad"];
    tileLayer = new G.Layer.Tile(mapName["url"], {
        cluster: mapName["cluster"]
    });
    tileLayer.addTo(baseMap);
    tileLayer.bringToBottom();
    baseMap.view([1704458.9328009544,-492795.4834811784], 8959.174255834427,3596.11299991142);
}