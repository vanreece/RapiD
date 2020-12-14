describe('iD.serviceFbAiFeatures', function () {
    var dimensions = [64, 64];
    var context, server, fbML;

    before(function() {
        iD.services.fbMLRoads = iD.serviceFbAIFeatures;
    });

    after(function() {
        delete iD.services.fbMLRoads;
    });

    beforeEach(function() {
        // The main context init will init the service because it's plugged in above
        context = iD.coreContext().assetPath('../dist/').init();
        context.projection
            .scale(iD.geoZoomToScale(14))
            .translate([-116508, 0])  // 10,0
            .clipExtent([[0,0], dimensions]);

        server = window.fakeFetch().create();
        fbML = iD.services.fbMLRoads;
        fbML.reset();
    });

    afterEach(function() {
        server.restore();
    });

    it('serves', function () {
        expect(true).to.be.true;
    });

    it('init', function () {
        iD.services.fbMLRoads.init();
        expect(true).to.be.true;
    });

    it('fires loadedData when data are loaded', function(done) {
        fbML.on('loadedData', function() {
            var graph = fbML.graph('TheNiftyDataset');
            expect(graph.hasEntity('w-223422622090188')).to.be.ok;
            var tags = graph.entity('w-223422622090188').tags;
            expect(tags.highway).to.be.ok;
            expect(tags.highway).to.equal('residential');
            expect(tags.source).to.be.ok;
            expect(tags.source).to.equal('maxar');
            expect(graph.hasEntity('n-111796553805975')).to.be.ok;
            expect(graph.hasEntity('n-719901218790572')).to.be.ok;
            expect(graph.hasEntity('made-up-stuff')).to.be.not.ok;
            done();
        });

        fbML.loadTiles('TheNiftyDataset', context.projection);

        var xmlResponse = '<?xml version="1.0"?>\n' + 
        '<osm attribution="http://www.openstreetmap.org/copyright" copyright="OpenStreetMap and contributors" generator="fb_conflation_service" version="0.6">\n' + 
        '  <bounds maxlat="-1.3621863466646" maxlon="38.375234137787" minlat="-1.3676579520968" minlon="38.369760979401"/>\n' + 
        '  <node action="modify" id="-719901218790572" lat="-1.3669929" lon="38.3710005" visible="true"/>\n' + 
        '  <node action="modify" id="-111796553805975" lat="-1.3673308" lon="38.3709146" visible="true"/>\n' + 
        '  <way action="modify" id="-223422622090188" visible="true">\n' + 
        '    <nd ref="-111796553805975"/>\n' + 
        '    <nd ref="-719901218790572"/>\n' + 
        '    <tag k="highway" v="residential"/>\n' + 
        '    <tag k="source" v="maxar"/>\n' + 
        '  </way>\n' + 
        '</osm>\n';
        
        server.respondWith('GET', /ml_roads/,
            [200, { 'Content-Type': 'text/xml; charset=UTF-8' }, xmlResponse]);
        server.respond();
    });
});