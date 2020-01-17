  mapboxgl.accessToken = 'pk.eyJ1IjoiYmVudHoxMjMiLCJhIjoiY2s1YmVjY29jMGJtcjNtbnF0b3lhMDF1biJ9.7jR1RWzs_9R2QsLhERNlKw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/bentz123/ck5e9mhob08rj1il4qxc99g42',
    center: [34.783796, 32.077739],
    zoom: 13
  });

  var features = ''
  map.once("idle", function(e) {
    
    features = map.queryRenderedFeatures({layers: ['vegan-places']});
    renderListings(features);

});

  /*  var popup = new mapboxgl.Popup({
    closeButton: false,  offset: [0, -15] 
    });*/

  var filterEl = document.getElementById('feature-filter');
  var listingEl = document.getElementById('feature-listing');

  filterEl.addEventListener('keyup', function(e) {
   // var features = map.queryRenderedFeatures({layers: ['vegan-places']});

    var value = e.target.value;
     
    // Filter visible features that don't match the input value.
    var filtered = features.filter(function(feature) {
    var name = feature.properties.title;
    return name.indexOf(value) === 0;
    });
     
   renderListings(filtered);
     
    // Set the filter to populate features into the layer.
    map.setFilter('vegan-places', [
    'match',
    ['get', 'title'],
    filtered.map(function(feature) {
    return feature.properties.title;
    }),
    true,
    false
    ]);
});

function renderListings(features) {
    listingEl.innerHTML = '';
    if (features.length) {
    features.forEach(function(feature) {
    var prop = feature.properties;
    var item = document.createElement('a');
    item.textContent = prop.title + ' (' + prop.description + ')';
  /* item.addEventListener('mouseover', function() {
    // Highlight corresponding feature on the map
    popup
    .setLngLat(feature.geometry.coordinates)
    .setText(
    feature.properties.title +
    ' (' +
    feature.properties.description +
    ')'
    )
    .addTo(map);
    });*/
    listingEl.appendChild(item);
    });
     
    // Show the filter input
    filterEl.parentNode.style.display = 'block';
    } 
    }

    map.on('click', function(e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['vegan-places'] // replace this with the name of the layer
        });
      
        if (!features.length) {
          return;
        }
      
        var feature = features[0];
      
        var popup = new mapboxgl.Popup({ offset: [0, -15] })
          .setLngLat(feature.geometry.coordinates)
          .setHTML('<h3>' + feature.properties.title + '</h3><p>' + feature.properties.description + '</p>')
          .addTo(map);
      });
