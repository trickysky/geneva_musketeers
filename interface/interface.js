var map, tileLayer;

G.ready(function() {

    map = new G.Map('mapContainer', {
        maxExtent: [-2e7, -2e7, 2e7, 2e7],
        hideLogo: true
    });

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

    G.loadModule('geogrid', function() {
        gridLayer = new G.Layer.GeoGrid(16, G.Proj.WebMercator, {
            gridOutlineColor: '#777',
            gridFill: false,
            gridOutlineWidth: 1
        });
        gridLayer.addTo(map);
    });

    var graphicLayer = (new G.Layer.Graphic()).addTo(map);
    graphicLayer.setStyle(['tileType'], ['=="google"'], {
        fillColor: '#0f0'
    });
    graphicLayer.setStyle(['tileType'], ['=="osm"'], {
        fillColor: '#103DFD'
    });
    graphicLayer.setStyle(['tileType'], ['=="amap"'], {
        fillColor: '#F50D0D'
    });
    graphicLayer.setStyle(['tileType'], ['=="baidu"'], {
        fillColor: '#F1F419'
    });

    map.view([12957936.317742838, 4854225.096751984], 3000, 5000);

    map.bind('click', function(e) {
        $('#myModal').modal('show');
        $('#satellite-images img').bind('click', function() {
            $('#myModal').modal('hide');
            var [clickLon, clickLat] = G.Proj.WebMercator.unproject(e.mapX, e.mapY),
                level = 16,
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

    // map.bind('viewChanged', function(e) {
    //     console.log({
    //        "center": map.getCenter()[0] + "," + map.getCenter()[1],
    //        "res": map.getResolution(),
    //        "size": String(map.getExtent()[2] - map.getExtent()[0]) + "," + String(map.getExtent()[3] - map.getExtent()[1]),
    //        "p1": String(map.getExtent()[0]) + ',' + String(map.getExtent()[1]),
    //        "p2": String(map.getExtent()[2]) + ',' + String(map.getExtent()[3]),
    //     });
    // });
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