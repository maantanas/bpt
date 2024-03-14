console.log('test');

((g) => {
  var h,
    a,
    k,
    p = "The Google Maps JavaScript API",
    c = "google",
    l = "importLibrary",
    q = "__ib__",
    m = document,
    b = window;
  b = b[c] || (b[c] = {});
  var d = b.maps || (b.maps = {}),
    r = new Set(),
    e = new URLSearchParams(),
    u = () =>
      h ||
      (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g)
          e.set(
            k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
            g[k]
          );
        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => (h = n(Error(p + " could not load.")));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a);
      }));
  d[l]
    ? console.warn(p + " only loads once. Ignoring:", g)
    : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
  key: "AIzaSyCkKnvpO5QHezQvC4uHZbS2FiCOfGZaRt8",
  v: "weekly",
});

let map;
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );

  map = new Map(document.getElementById("map"), {
    zoom: 6.5,
    center: {
      lat: 54.251186,
      lng: -4.463196,
    },
    disableDefaultUI: true,
    zoomControl: true,
  });
  let markersArray = [];
  function loadRoutesOnMap() {
    var allRoutesFiles = document.querySelectorAll('[geojsonFile = ""]');
    let openInfoWindow = null;

    allRoutesFiles.forEach((routejson) => {
      let firstCoordLat;
      let firstCoordLng;
      let fullElementP = routejson.parentElement;
      let fullElement = fullElementP.querySelector(['[window-content=""]']);

      let forLat = routejson.parentElement;
      let latCoord = forLat.querySelectorAll(['[ori-lat=""]']);

      let forLng = routejson.parentElement;
      let lngCoord = forLng.querySelectorAll(['[ori-lng=""]']);

      map.data.loadGeoJson(routejson.textContent, null, function (feature) {
        feature.forEach(function (obj, i) {
          let geometry = obj.getGeometry();
          let type = geometry.getType();
          if (type == "Point") {
            map.data.remove(obj);
          } else {
            let name = obj.getProperty("name");

            const marker = new google.maps.Marker({
              position: {
                lat: parseFloat(latCoord[0].innerHTML),
                lng: parseFloat(lngCoord[0].innerHTML),
              },
              map: map,
              title: "Start",
              icon: "https://uploads-ssl.webflow.com/657c44c47675c57ed3c90760/65f195e74b772a3e9bd284bd_Button.svg",
            });
            markersArray.push(marker);
            const infoWindow = new google.maps.InfoWindow({
              content: `<div class="preview-container">${fullElement.innerHTML}</div>`,
            });
            marker.addListener("click", function () {
              if (openInfoWindow) {
                openInfoWindow.close();
              }
              infoWindow.open(map, marker);
              openInfoWindow = infoWindow;
            });
          }
        });
      });
      var lineSymbol = {
        path: "M 0,-1 0,1",
        strokeOpacity: 1,
        scale: 4,
      };
      var routeStyle = {
        strokeColor: "#540E3C",
        strokeWeight: 0,
        icons: [
          {
            icon: lineSymbol,
            offset: "0",
            repeat: "16px",
          },
        ],
      };

      map.data.setStyle(routeStyle);
    });
  }
  loadRoutesOnMap();
  document
    .getElementById("routes-pagi-next-btn")
    .addEventListener("click", function () {
      map.data.forEach(function (feature) {
        map.data.remove(feature);
      });
      markersArray.forEach(function (marker) {
        marker.setMap(null);
      });
      markersArray = [];

      setTimeout(() => {
        loadRoutesOnMap();
        document
          .getElementById("routes-pagi-prev-btn")
          .addEventListener("click", function () {
            map.data.forEach(function (feature) {
              map.data.remove(feature);
            });
            markersArray.forEach(function (marker) {
              marker.setMap(null);
            });
            markersArray = [];
            setTimeout(() => {
              loadRoutesOnMap();
            }, 100);
          });
      }, 100);
    });
}

initMap();

// <!--Map Focus Outline Remove-->

setTimeout(() => {
  var firstIframe = document.querySelector("iframe");
  firstIframe.nextSibling.style.border = "0rem solid rgb(255,255,255, 0)";
}, 1000);

// <!--Close Filters-->

var filtersBg = document.getElementById("filters-bg");
var filtersCloseBtn = document.getElementById("filters-close-btn");

filtersBg.addEventListener("click", function () {
  filtersCloseBtn.click();
});

// <!--Active Filters Count / Clear Btn State-->

var activeFiltersTxt = document.getElementById("active-filters-txt");
var clearBtn = document.querySelector(".clear-filters-button");

setInterval(() => {
  var activeFilters = document.querySelectorAll(".fs-cmsfilter_active");
  activeFiltersTxt.textContent = activeFilters.length;
  if (activeFilters.length > 0) {
    clearBtn.classList.remove("disabled");
  } else {
    clearBtn.classList.add("disabled");
  }
}, 100);

// <!--Range Sliders Min / Max Values-->

var distanceTxtValues = document.querySelectorAll(".distance");
var durationTxtValues = document.querySelectorAll(".duration");
var distanceIntValue = [],
  durationIntValue = [];

// Distance Filter
distanceTxtValues.forEach((txt) => {
  distanceIntValue.push(parseInt(txt.textContent));
});

var distanceMin = Math.min(...distanceIntValue);
var distanceMax = Math.max(...distanceIntValue);

var distanceRangeSlider = document.getElementById("length-range-slider");
distanceRangeSlider.setAttribute("fs-rangeslider-min", distanceMin);
distanceRangeSlider.setAttribute("fs-rangeslider-max", distanceMax);

// Duration Filter
durationTxtValues.forEach((txt) => {
  durationIntValue.push(parseInt(txt.textContent));
});

var durationMin = Math.min(...durationIntValue);
var durationMax = Math.max(...durationIntValue);

var durationRangeSlider = document.getElementById("duration-range-slider");
durationRangeSlider.setAttribute("fs-rangeslider-min", durationMin);
durationRangeSlider.setAttribute("fs-rangeslider-max", durationMax);

// <!--Route Like and Active State-->

var memberIdField = document.getElementById("member-id");
var routeIdField = document.getElementById("route-id");
var saveRouteSubmit = document.getElementById("route-save-submit");
var routesPagination = document.querySelector(".routes-pagination");

// Like Handler
function likeHandle() {
  var saveButtons = document.querySelectorAll("[save-btn]");
  saveButtons.forEach((btn) => {
    if (!btn.hasAttribute("handeled")) {
      btn.addEventListener("click", function () {
        var routeIdVal = this.lastChild.textContent;
        routeIdField.value = routeIdVal;
        saveRouteSubmit.click();
      });
      btn.setAttribute("handeled", "");
    }
  });
}
// Liked State Handler
function likeStateHandle() {
  var likeButtons = document.querySelectorAll("[save-btn]");
  likeButtons.forEach((btn) => {
    if (!btn.hasAttribute("likeHandled")) {
      btn.addEventListener("click", function () {
        this.classList.toggle("active");
      });
      btn.setAttribute("likeHandled", "");
    }
  });
}
likeHandle();
likeStateHandle();
// Pagination Handle
routesPagination.addEventListener("click", function () {
  setTimeout(() => {
    likeHandle();
    likeStateHandle();
    savedRoutesCheck();
  }, 50);
});

// <!--Check Member ID After Login-->

function memberCheck() {
  setTimeout(() => {
    var memberNavInfo = document.querySelectorAll("[nav-member-info]");
    if (memberNavInfo.length != 0) {
      var memberIdField = document.getElementById("member-id");
      if (memberIdField.value == "") {
        location.reload();
      } else {
        console.log(memberIdField.value);
      }
    } else {
      console.log("No Loged In User");
    }
  }, 1000);
}
if (window.$memberstackReady) {
  memberCheck();
} else {
  document.addEventListener("memberstack.ready", memberCheck);
}

var navBGOverlay = document.querySelector(".routes-navbar-bg");
var expandCollapseColumn = document.querySelector(".routes-map-column");
var expandCollapseButton = document.getElementById("expand-collapse-btn");
var listingCollapseButton = document.getElementById("listing-expand-btn");
var listingColumn = document.querySelector(".routes-listing-column");
var routesBodyHolder = document.querySelector(".routes-body-holder");
navBGOverlay.style.height =
  document.querySelector(".navbar").offsetHeight + "px";

if (window.innerWidth > 991) {
  expandCollapseButton.addEventListener("click", function () {
    this.classList.toggle("active");
    if (this.classList.contains("active")) {
      expandCollapseColumn.style.width = "100%";
    } else {
      expandCollapseColumn.style.width = "57%";
    }
  });
} else {
  expandCollapseButton.addEventListener("click", function () {
    this.classList.toggle("active");
    routesBodyHolder.style.justifyContent = "start";
    if (this.classList.contains("active")) {
      expandCollapseColumn.style.height = "100%";
    } else {
      expandCollapseColumn.style.height = "60%";
    }
  });
}

listingCollapseButton.addEventListener("click", function () {
  this.classList.toggle("active");
  routesBodyHolder.style.justifyContent = "end";
  if (this.classList.contains("active")) {
    listingColumn.style.height = `${
      routesBodyHolder.offsetHeight -
      document.querySelector(".routes-filter-form-block").offsetHeight
    }px`;
  } else {
    listingColumn.style.height = "40%";
  }
});

