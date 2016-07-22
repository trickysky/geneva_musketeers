var map, tileLayer, gridLayer, graphicLayer;

G.ready(function() {

    map = new G.Map('mapContainer', {
        maxExtent: [-2e7, -2e7, 2e7, 2e7],
        hideLogo: true
    });

    var level = 1;

    var mapTileServer = {
        "osm": { "url": "http://{s}.tile.osm.org/{z}/{x}/{y}.png", "cluster": ['a', 'b', 'c'] },
        "googleImage": { "url": "http://mt{s}.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}", "cluster": ['1', '2', '3'] },
        "googleRoad": { "url": "http://mt{s}.google.cn/vt/lyrs=m&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}", "cluster": ['1', '2', '3'] },
        "amap": { "url": "http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}", "cluster": ['1', '2', '3', '4'] },
        "midnight": { "url": "https://s{s}.geohey.com/s/mapping/midnight/all?z={z}&x={x}&y={y}&ak=ZmVmODVkNzZhZjk3NDUzNWFlYjQ4ODcwOGFhMWQ5ZGQ", "cluster": ['1', '2', '3', '4', '5', '6', '7', '8'] }
    };

    var mapName = mapTileServer["googleRoad"];
    tileLayer = new G.Layer.Tile(mapName["url"], {
        cluster: mapName["cluster"]
    });
    tileLayer.addTo(map);

    map.bind('viewChanged', function(e) {
        var res = map.getResolution();
        var resToLevel = [156543.033928,78271.516964,39135.758482,19567.879241,9783.9396205,4891.96981025,2445.984905125,1222.9924525625,611.49622628125,305.748113140625,152.8740565703125,76.43702828515625,38.21851414257813,19.10925707128906,9.55462853564453,4.777314267822266,2.388657133911133,1.194328566955567,0.597164283477783,0.298582141738892]
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
            gridLayer.addTo(map);
        });

        console.log({
           // "center": map.getCenter()[0] + "," + map.getCenter()[1],
           // "size": String(map.getExtent()[2] - map.getExtent()[0]) + "," + String(map.getExtent()[3] - map.getExtent()[1]),
           //  "p1": String(map.getExtent()[0]) + ',' + String(map.getExtent()[1]),
           //  "p2": String(map.getExtent()[2]) + ',' + String(map.getExtent()[3]),
           //  "res": map.getResolution(),
            "gridLayer": gridLayer,
            "level": level
        });
    });

    graphicLayer = (new G.Layer.Graphic()).addTo(map);
    graphicLayer.setStyle(['tileType'], ['=="google"'], {
        fillColor: '#0f0'
    });
    graphicLayer.setStyle(['tileType'], ['=="mapbox"'], {
        fillColor: '#103DFD'
    });
    graphicLayer.setStyle(['tileType'], ['=="amap"'], {
        fillColor: '#F50D0D'
    });
    graphicLayer.setStyle(['tileType'], ['=="tencent"'], {
        fillColor: '#F1F419'
    });

    map.view([12957936.317742838, 4854225.096751984], 3000, 5000);

    map.bind('click', function(e) {
        $('#google').attr("src", "images/1/google.png");
        $('#mapbox').attr("src", "images/1/mapbox.png");
        $('#amap').attr("src", "images/1/amap.png");
        $('#tencent').attr("src", "images/1/tencent.png");
        $('#myModal').modal('show');
        $('#satellite-images img').bind('click', function() {
            $('#myModal').modal('hide');
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
            var tileType = $(this).attr("id");
            var pointGrid = new G.Graphic.Polygon(grid, { tileType: tileType }, {
                outlineColor: '#000',
                outlineWidth: 2,
                fillOpacity: 1
            });
            pointGrid.addTo(graphicLayer);
            $('#satellite-images img').unbind('click');
        });
    });
});

function zoomIn() {
    if (map) {
        map.zoomIn();
    }
}

function zoomOut() {
    if (map) {
        map.zoomOut();
    }
}

function sampleModal() {
    $('#google').attr("src", "images/sample/google.jpg");
    $('#mapbox').attr("src", "images/sample/osm.jpg");
    $('#amap').attr("src", "images/sample/amap.jpg");
    $('#tencent').attr("src", "images/sample/baidu.jpg");
    $('#myModal').modal('show');
}