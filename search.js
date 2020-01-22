  mapboxgl.accessToken = 'pk.eyJ1IjoiYmVudHoxMjMiLCJhIjoiY2s1YmVjY29jMGJtcjNtbnF0b3lhMDF1biJ9.7jR1RWzs_9R2QsLhERNlKw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/bentz123/ck5e9mhob08rj1il4qxc99g42',
    center: [34.768403,32.063209],
    zoom: 12,
    maxzoom: 15
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
    var value = normalize(e.target.value);

    var filtered = features.filter(function (feature) {
      var name = feature.properties.code;
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
      ['get', 'code'],
      filtered.map(function (feature) {
        return feature.properties.code;
      }),
      true,
      false
    ]);
  });

  function renderListings(features) {
    listingEl.innerHTML = '';
    if (features.length) {
      features.forEach(function (feature, n) { 
        if(n == 0 && features.length == 1)
        {
          popup
          .setLngLat(feature.geometry.coordinates)
          .setHTML('<div id="title" class="title-style">' + feature.properties.title + '</div><div id="desc" class="desc-style">' + feature.properties.description + '</div>')
          .addTo(map);
          map.flyTo({center: feature.geometry.coordinates, zoom: 15});
        }

        else{
          map.flyTo({center: [34.768403,32.063209], zoom: 12});
          popup.remove();
        }
        var prop = feature.properties;
        var item = document.createElement('li');
        item.className = "listing-item";
        item.textContent = prop.title + ' (' + prop.description + ')';
         item.addEventListener('mouseover', function() {
          popup
          .setLngLat(feature.geometry.coordinates)
          .setHTML('<div id="title" class="title-style">' + feature.properties.title + '</div><div id="desc" class="desc-style">' + feature.properties.description + '</div>')
          .addTo(map);
          map.flyTo({center: feature.geometry.coordinates, zoom: 15});

                  });


        listingEl.appendChild(item);
      });

      // Show the filter input
      filterEl.parentNode.style.display = 'block';
    }
  }

  function normalize(string) {
    return string.trim().toLowerCase();
  }

  function expand_sidebar() {
    if (document.getElementById("sidebar").style.display == "none") {
      document.getElementById("sidebar").style.display = "block";
      document.getElementsByClassName("sidebar-btn")[0].innerHTML = '✕';
      if(window.matchMedia("(max-width: 600px)").matches)
      {
        document.getElementsByClassName("map")[0].style.top='-25%';
      }

      else{
        document.getElementsByClassName("map")[0].style.left='15%';
      }
    } else {
      document.getElementById("sidebar").style.display = "none";
      document.getElementsByClassName("sidebar-btn")[0].innerHTML = '☰';
      if(window.matchMedia("(max-width: 600px)").matches)
      {
        document.getElementsByClassName("map")[0].style.top='0%';
      }

      else{
        document.getElementsByClassName("map")[0].style.left='0%';
      }

    }
  }