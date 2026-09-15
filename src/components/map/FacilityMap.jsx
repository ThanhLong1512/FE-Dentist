import { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Building2,
  ExternalLink,
  Search,
  CheckCircle2,
  Wrench,
  Armchair,
} from "lucide-react";
import { useFacilities } from "../../features/facilities/useFacilities";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useLanguage } from "../../context/LanguageContext";
import { translateFacility } from "../../utils/dataTranslator";
import "./FacilityMap.css";

// Fallback GPS coordinates if DB record is missing lat/lng
const FALLBACK_COORDS = {
  "CS-Q1": { lat: 10.7865, lng: 106.6998 },
  "CS-Q7": { lat: 10.7291, lng: 106.7218 },
  "CS-BT": { lat: 10.7989, lng: 106.7082 },
  "CS-HN": { lat: 21.0336, lng: 105.7955 },
};

export default function FacilityMap({
  defaultCity = "all",
  title,
  subtitle,
  showBookingAction = true,
}) {
  const { facilities = [], isLoading } = useFacilities();
  const { isDarkMode } = useDarkMode();
  const { t, language } = useLanguage();

  const displayTitle = title || t("facilities.title");
  const displaySubtitle = subtitle || t("facilities.subtitle");

  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const markersMapRef = useRef({});

  // Translate facilities by active language
  const translatedFacilities = useMemo(() => {
    return facilities.map((fac) => translateFacility(fac, language));
  }, [facilities, language]);

  // Filter facilities by city and search term
  const filteredFacilities = useMemo(() => {
    return translatedFacilities.filter((fac) => {
      const matchCity =
        selectedCity === "all" ||
        fac.city?.toLowerCase().includes(selectedCity.toLowerCase()) ||
        (selectedCity === "hồ chí minh" &&
          (fac.city?.toLowerCase().includes("hồ chí minh") ||
            fac.city?.toLowerCase().includes("ho chi minh") ||
            fac.city?.includes("胡志明"))) ||
        (selectedCity === "hà nội" &&
          (fac.city?.toLowerCase().includes("hà nội") ||
            fac.city?.toLowerCase().includes("hanoi") ||
            fac.city?.includes("河内")));

      const matchSearch =
        !searchTerm.trim() ||
        fac.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fac.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fac.code?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCity && matchSearch;
    });
  }, [translatedFacilities, selectedCity, searchTerm]);

  // Unique city count badges
  const cityCounts = useMemo(() => {
    const counts = { all: facilities.length, hcm: 0, hn: 0 };
    facilities.forEach((f) => {
      const c = f.city?.toLowerCase() || "";
      if (c.includes("hồ chí minh") || c.includes("hcm")) counts.hcm++;
      if (c.includes("hà nội") || c.includes("hn")) counts.hn++;
    });
    return counts;
  }, [facilities]);

  // Helper to extract GPS coordinates
  const getCoords = (facility) => {
    if (facility.latitude && facility.longitude) {
      return { lat: Number(facility.latitude), lng: Number(facility.longitude) };
    }
    if (facility.code && FALLBACK_COORDS[facility.code]) {
      return FALLBACK_COORDS[facility.code];
    }
    if (facility.city?.toLowerCase().includes("hà nội")) {
      return { lat: 21.0336, lng: 105.7955 };
    }
    return { lat: 10.7865, lng: 106.6998 };
  };

  // Set default selected facility once loaded
  useEffect(() => {
    if (filteredFacilities.length > 0 && !selectedFacilityId) {
      setSelectedFacilityId(filteredFacilities[0]._id);
    }
  }, [filteredFacilities, selectedFacilityId]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center around Ho Chi Minh City
    const map = L.map(mapContainerRef.current, {
      center: [10.7865, 106.6998],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // OpenStreetMap standard tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Render Markers whenever facilities or selection change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    markersMapRef.current = {};

    if (filteredFacilities.length === 0) return;

    const bounds = L.latLngBounds();

    filteredFacilities.forEach((fac) => {
      const { lat, lng } = getCoords(fac);
      bounds.extend([lat, lng]);

      const isSelected = fac._id === selectedFacilityId;
      const isMaint = fac.status === "maintenance";

      // Custom HTML DivIcon with official Cheese Dental logo
      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div class="marker-pin-bubble ${isSelected ? "is-active" : ""} ${
          isMaint ? "is-maintenance" : ""
        }">
            <div class="marker-icon">
              <img src="/logo.png" alt="Cheese Dental" class="marker-pin-logo" />
            </div>
          </div>
        `,
        iconSize: [46, 46],
        iconAnchor: [23, 46],
        popupAnchor: [0, -42],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupHtml = `
        <div class="facility-popup-card">
          <div class="facility-popup-brand-header">
            <div class="facility-popup-brand">
              <img src="/logo.png" alt="Cheese Dental" class="facility-popup-logo" />
              <span class="facility-popup-brand-name">Cheese Dental</span>
            </div>
            <span class="facility-popup-badge">${fac.code || "CHI NHÁNH"}</span>
          </div>
          <h4 class="facility-popup-title">${fac.name}</h4>
          <div class="facility-popup-info">
            <div class="facility-popup-row">
              <span style="color: #0284c7;">📍</span>
              <span>${fac.address}, ${fac.city}</span>
            </div>
            <div class="facility-popup-row">
              <span style="color: #0284c7;">📞</span>
              <a href="tel:${fac.phoneNumber}" style="color: #0284c7; text-decoration: none; font-weight: 700;">${fac.phoneNumber}</a>
            </div>
            <div class="facility-popup-row">
              <span style="color: #0284c7;">⏰</span>
              <span>${fac.workingHours || "08:00 - 20:00 (Thứ 2 - CN)"}</span>
            </div>
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}"
            target="_blank"
            rel="noopener noreferrer"
            class="facility-popup-btn"
            style="color: #ffffff !important; text-decoration: none !important;"
          >
            <span style="color: #ffffff !important; font-weight: 700;">Chỉ đường trên Google Maps</span>
            <span style="color: #ffffff !important; font-size: 14px; font-weight: 700;">↗</span>
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on("click", () => {
        setSelectedFacilityId(fac._id);
      });

      marker.addTo(markersGroup);
      markersMapRef.current[fac._id] = marker;
    });

    // If a specific facility is selected, fly to it
    const activeFac = filteredFacilities.find(
      (f) => f._id === selectedFacilityId
    );
    if (activeFac) {
      const { lat, lng } = getCoords(activeFac);
      map.flyTo([lat, lng], 15, { duration: 0.8 });
      // Open popup after fly animation completes
      setTimeout(() => {
        markersMapRef.current[activeFac._id]?.openPopup();
      }, 900);
    } else if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [filteredFacilities, selectedFacilityId]);

  // Handle clicking a branch card from the list
  const handleSelectFacility = (fac) => {
    setSelectedFacilityId(fac._id);
    const { lat, lng } = getCoords(fac);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.0 });
      setTimeout(() => {
        markersMapRef.current[fac._id]?.openPopup();
      }, 1100);
    }
  };

  return (
    <div className="facility-map-wrapper">
      {/* Header with Title and City Tabs */}
      <div className="facility-map-header">
        <div className="facility-map-title-group">
          <h3>
            <img
              src="/logo.png"
              alt="Cheese Dental"
              className="facility-map-heading-logo"
            />
            <span>{displayTitle}</span>
          </h3>
          <p>{displaySubtitle}</p>
        </div>

        <div className="facility-city-tabs">
          <button
            type="button"
            className={`city-tab-btn ${selectedCity === "all" ? "active" : ""}`}
            onClick={() => setSelectedCity("all")}
          >
            <span>{t("facilities.allCities")}</span>
            <span className="city-tab-badge">{cityCounts.all}</span>
          </button>
          <button
            type="button"
            className={`city-tab-btn ${
              selectedCity === "hồ chí minh" ? "active" : ""
            }`}
            onClick={() => setSelectedCity("hồ chí minh")}
          >
            <span>
              {language === "en"
                ? "Ho Chi Minh City"
                : language === "zh"
                ? "胡志明市"
                : "TP. Hồ Chí Minh"}
            </span>
            <span className="city-tab-badge">{cityCounts.hcm}</span>
          </button>
          <button
            type="button"
            className={`city-tab-btn ${
              selectedCity === "hà nội" ? "active" : ""
            }`}
            onClick={() => setSelectedCity("hà nội")}
          >
            <span>
              {language === "en"
                ? "Hanoi"
                : language === "zh"
                ? "河内市"
                : "Hà Nội"}
            </span>
            <span className="city-tab-badge">{cityCounts.hn}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: List on Left, Map on Right */}
      <div className="facility-map-body">
        {/* Left Side: Branch List */}
        <div className="facility-list-panel">
          {isLoading ? (
            <div className="facility-empty-state">
              Đang tải danh sách chi nhánh...
            </div>
          ) : filteredFacilities.length === 0 ? (
            <div className="facility-empty-state">
              Không tìm thấy chi nhánh nào tại khu vực này.
            </div>
          ) : (
            filteredFacilities.map((facility) => {
              const isSelected = facility._id === selectedFacilityId;
              const coords = getCoords(facility);
              const isMaint = facility.status === "maintenance";

              return (
                <div
                  key={facility._id}
                  className={`facility-card ${isSelected ? "active" : ""}`}
                  onClick={() => handleSelectFacility(facility)}
                >
                  <div className="facility-card-top">
                    <div className="facility-card-title-wrap">
                      <img
                        src="/logo.png"
                        alt="Cheese Dental"
                        className="facility-card-logo"
                      />
                      <h4 className="facility-card-name">{facility.name}</h4>
                    </div>
                    <span className="facility-code-pill">{facility.code}</span>
                  </div>

                  <div className="facility-card-meta">
                    <div className="facility-meta-row">
                      <MapPin size={15} className="facility-meta-icon" />
                      <span>
                        {facility.address}, {facility.city}
                      </span>
                    </div>

                    <div className="facility-meta-row">
                      <Phone size={15} className="facility-meta-icon" />
                      <span>{facility.phoneNumber}</span>
                    </div>

                    <div className="facility-meta-row">
                      <Clock size={15} className="facility-meta-icon" />
                      <span>
                        {facility.workingHours || "08:00 - 20:00 (Thứ 2 - CN)"}
                      </span>
                    </div>

                    <div className="facility-meta-row">
                      <Armchair size={15} className="facility-meta-icon" />
                      <span>
                        {t("facilities.chairs")}: {facility.chairCount || 6}
                      </span>
                    </div>

                    <div
                      className={`facility-status-tag ${
                        isMaint ? "maintenance" : "active"
                      }`}
                    >
                      {isMaint ? (
                        <>
                          <Wrench size={12} />
                          <span>{t("facilities.statusMaintenance")}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={12} />
                          <span>{t("facilities.statusActive")}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="facility-card-actions">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-directions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Navigation size={13} />
                      <span>{t("facilities.getDirections")}</span>
                    </a>
                    {showBookingAction && (
                      <a
                        href="/booking"
                        className="btn-directions"
                        style={{
                          color: "#2563eb",
                          background: "rgba(37, 99, 235, 0.08)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={13} />
                        <span>{t("nav.booking")}</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Leaflet Map */}
        <div className="facility-map-canvas-container">
          <div ref={mapContainerRef} className="facility-leaflet-map" />
        </div>
      </div>
    </div>
  );
}
