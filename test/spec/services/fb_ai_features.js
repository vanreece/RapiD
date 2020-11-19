// import { expect } from 'chai';
// import { serviceFbAIFeatures } from '../../../modules/services';

// const { expect } = require("chai");

// const { identity } = require("lodash-es");

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
    // it('loadTiles', function () {
        // iD.services.fbMLRoads.init();
        it('fires loadedData when data are loaded', function(done) {
                // debugger;
            fbML.on('loadedData', function() {
                // expect(server.requests().length).to.eql(1); 
                expect(true).to.be.true;
                // Also verify that the right data is loaded
                fbML.graph('TheNiftyDataset');
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
    // loadTiles: function(datasetID, projection, taskExtent) {
    // });
});
    // var context, connection, spy;
    // var serverFetch;

    // before(function() {
    //     iD.services.fbMLRoads = iD.serviceFbAIFeatures;
    // });

    // after(function() {
    //     delete iD.services.fbMLRoads;
    // });

    // beforeEach(function () {
        // serverFetch = window.fakeFetch().create();  // unauthenticated calls use d3-fetch
        // serverXHR = sinon.fakeServer.create();      // authenticated calls use XHR via osm-auth
        // context = iD.coreContext().init();
        // spy = sinon.spy();
    // });

    // afterEach(function() {
        // serverFetch.restore();
        // serverXHR.restore();
    // });

    // describe('#loadTiles', function() {
    //     var xmlResponse =
    //         '<?xml version="1.0"?>' +
    //         '<osm attribution="http://www.openstreetmap.org/copyright" copyright="OpenStreetMap and contributors" generator="fb_conflation_service" version="0.6">' +
    //         '  <bounds maxlat="-1.3621863466646" maxlon="38.38072730185" minlat="-1.3676579520968" minlon="38.375254143464"/>' +
    //         '  <node action="modify" id="-164835301822362" lat="-1.3842658" lon="38.3895617" visible="true"/>' +
    //         '  <node action="modify" id="-313691089763511" lat="-1.3835579" lon="38.3889984" visible="true"/>' +
    //         '  <way action="modify" id="-3013781116947940257" orig_id="-3228851663860136" visible="true">' +
    //         '    <nd ref="-164835301822362"/>' +
    //         '    <nd ref="-313691089763511"/>' +
    //         '    <tag k="highway" v="residential"/>' +
    //         '    <tag k="source" v="maxar"/>' +
    //         '  </way>' +
    //         '</osm>';


    //     it('calls callback when data tiles are loaded', function(done) {
    //         var spy = sinon.spy();
    //         connection.loadTiles(context.projection, spy);

    //         serverFetch.respondWith('GET', /map.json\?bbox/,
    //             [200, { 'Content-Type': 'application/json' }, tileResponse]);
    //         serverFetch.respond();

    //         window.setTimeout(function() {
    //             expect(spy).to.have.been.calledOnce;
    //             done();
    //         }, 500);
    //     });

        // it('#isDataLoaded', function(done) {
        //     expect(connection.isDataLoaded([-74.0444216, 40.6694299])).to.be.not.ok;

        //     connection.loadTiles(context.projection);
        //     serverFetch.respondWith('GET', /map.json\?bbox/,
        //         [200, { 'Content-Type': 'application/json' }, tileResponse]);
        //     serverFetch.respond();

        //     window.setTimeout(function() {
        //         expect(connection.isDataLoaded([-74.0444216, 40.6694299])).to.be.ok;
        //         done();
        //     }, 500);
        // });
//     });


// });
