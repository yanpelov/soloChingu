  mapboxgl.accessToken = 'pk.eyJ1IjoiYmVudHoxMjMiLCJhIjoiY2s1YmVjY29jMGJtcjNtbnF0b3lhMDF1biJ9.7jR1RWzs_9R2QsLhERNlKw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/bentz123/ck5e9mhob08rj1il4qxc99g42',
    center: [34.768403,32.063209],
    zoom: 12
  });

  var features = ''
  map.once("idle", function (e) {

    features = map.queryRenderedFeatures({
      layers: ['vegan-places']
    });
    renderListings(features);

  });

    var popup = new mapboxgl.Popup({
    closeButton: false,  offset: [0, -15] 
    });

  var filterEl = document.getElementById('feature-filter');
  var listingEl = document.getElementById('feature-listing');

  filterEl.addEventListener('keyup', function (e) {
    map.setLayoutProperty(
      'vegan-places',
      'visibility',
      'visible')
    var value = e.target.value;

    var filtered = features.filter(function (feature) {
      var name = feature.properties.title;
      return name.indexOf(value) === 0;
    });

    renderListings(filtered);
    if (filtered.length == 0) {
      map.setLayoutProperty(
        'vegan-places',
        'visibility',
        'none');
      return;
    }
    map.setFilter('vegan-places', [
      'match',
      ['get', 'title'],
      filtered.map(function (feature) {
        return feature.properties.title;
      }),
      true,
      false
    ]);
  });

  function renderListings(features) {
    listingEl.innerHTML = '';
    if (features.length) {
      features.forEach(function (feature) {
        var prop = feature.properties;
        var item = document.createElement('li');
        item.className = "listing-item";
        item.textContent = prop.title + ' (' + prop.description + ')';
         item.addEventListener('mouseover', function() {
          popup
          .setLngLat(feature.geometry.coordinates)
          .setHTML('<div id="title" class="title-style">' + feature.properties.title + '</div><div id="desc" class="desc-style">' + feature.properties.description + '</div>')
          .addTo(map);
          });
        listingEl.appendChild(item);
      });

      // Show the filter input
      filterEl.parentNode.style.display = 'block';
    }
  }

  function expand_sidebar() {
    if (document.getElementById("sidebar").style.display == "none") {
      document.getElementById("sidebar").style.display = "block";
      document.getElementsByClassName("sidebar-btn")[0].innerHTML = '✕';
    } else {
      document.getElementById("sidebar").style.display = "none";
      document.getElementsByClassName("sidebar-btn")[0].innerHTML = '☰';
    }
  }