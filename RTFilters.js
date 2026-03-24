(function () {
    var CFG = {
        strategyIds: [303624, 303658, 302424],
        maxProductsPerStrategy: 50,
        fields: {
            image: "image_url",
            groupId: "group_id",
            name: "name",
            rating: "rating_hotel",
            star: "star",
            destination: "destinazione",
            url: "url",
            keywords: "keywords",
            brand: "brand"
        }
    };

    var POSITION_PREFIX = '1';
    var DEFAULT_CURRENCY = '$';
    var CURRENCY_SIGN = '${Currency Symbol}' || DEFAULT_CURRENCY;
    var CURRENCY_POSITION = '${Currency Position}' || POSITION_PREFIX;
    var SCREEN_WIDTH = window.innerWidth;
    var container = document.getElementById('dy-recommendations-${dyVariationId}');
    var sliderInstance = null;
    var swiperReady = false;
    var brandMap = null;

    var state = {
        allItems: [],
        filteredItems: [],
        selectedStar: [],
        selectedTag: [],
        selectedTig: [],
        selectedSer: [],
        searchSer: "",
        openSerGroups: {},
        initialLoadDone: false,
        activeDropdownGroup: ""
    };

    var KEYWORD_LABELS = {
        "SER/000016": "Animazione italiana",
        "SER/000017": "Piscina esterna",
        "SER/000019": "Assistente residente",
        "SER/000020": "Direttamente sul mare",
        "SER/000021": "Negozi / Minimarket interni",
        "SER/000022": "Accesso a internet",
        "SER/000026": "Noleggio motorini",
        "SER/000032": "Family Room",
        "SER/000036": "Chef italiano",
        "SER/000042": "Ristorante à la carte",
        "SER/000044": "Ristoranti in spiaggia",
        "SER/000046": "Spiaggia privata",
        "SER/000047": "Pontile",
        "SER/000048": "Barriera corallina",
        "SER/000050": "Spiaggia di sabbia",
        "SER/000051": "Mare digradante",
        "SER/000055": "Miniclub",
        "SER/000056": "Nursery",
        "SER/000060": "Babysitter",
        "SER/000061": "Piscina per bambini",
        "SER/000064": "Discoteca",
        "SER/000066": "Beach volley",
        "SER/000071": "Palestra / Fitness",
        "SER/000077": "Windsurf",
        "SER/000078": "Centro diving",
        "SER/000079": "Snorkeling",
        "SER/000080": "Beach tennis",
        "SER/000088": "Spa",
        "SER/000090": "Massaggi",
        "SER/000135": "Junior club",
        "SER/000136": "Ombrelloni e Lettini",
        "SER/000137": "Animazione internazionale",
        "SER/000138": "Lavanderia",
        "SER/000164": "Servizio spiaggia incluso",
        "SER/000173": "Assistente non residente",
        "SER/000174": "Cassetta di sicurezza in camera",
        "SER/000178": "Centro benessere",
        "SER/000184": "Bar in spiaggia",
        "SER/000185": "Wi-Fi",
        "SER/000186": "Ping pong",
        "SER/000188": "Volley",
        "SER/000240": "In pieno centro",
        "SER/000246": "Parcheggio coperto",
        "SER/000250": "Asciugacapelli",
        "SER/000285": "Wi-Fi free",
        "SER/000324": "Pediatra",
        "SER/000327": "Scaldabiberon",
        "SER/000331": "Camere comunicanti",
        "SER/000339": "Casinò",
        "SER/000341": "Sauna",
        "SER/000342": "Bagno Turco",
        "SER/000343": "Idromassaggio",
        "SER/000345": "Wi-Fi in camera",
        "SER/000347": "Internet point",
        "SER/000349": "Servizio medico interno",
        "SER/000387": "Cerimonia nuziale",
        "SER/000445": "Minibar",
        "SER/000446": "Camere con 2 ambienti separati",
        "SER/000599": "Posizione fronte mare",
        "SER/000621": "Yoga",
        "SER/000623": "Trattamenti Estetici",
        "SER/000630": "Consulenza medica",
        "SER/000635": "Piscina con idromassaggio",
        "SER/000637": "Sala fitness",
        "SER/001003": "Parco Giochi Bambini",
        "SER/001008": "Angolo Cottura Accessoriato",
        "SER/001029": "Ristorante: Area Riservata Bambini",
        "SER/001043": "Padel",
        "SER/001047": "Culla",
        "SER/001072": "Piscina Infinity",
        "SER/001073": "Parco acquatico",
        "SER/001074": "Piscina con zona per bambini",
        "SER/001075": "Piscina con scivoli per bambini",
        "SER/001090": "Camere con piscina privata",
        "SER/001091": "Accesso diretto al mare",
        "SER/001096": "Piscina",
        "SER/001104": "Ristorante",
        "SER/001122": "Adult Zone",
        "SER/001153": "Palestra",

        "TAG/008584": "Progetto Gluten Care",
        "TAG/005041": "Benessere",
        "TAG/005052": "Only Adults",
        "TAG/005046": "Famiglia Numerosa (+4)",
        "TAG/008585": "Certificazione GSTC",
        "TAG/005056": "Progetto Gluten Free",
        "TAG/005049": "Gruppi",
        "TAG/005042": "Bikers/Bike",
        "TAG/005057": "Progetto Senza Barriere",
        "TAG/008580": "Padel",
        "TAG/005044": "Divers/Diving",
        "TAG/005048": "Golfisti/Golf",
        "TAG/005059": "Tennisti/Tennis",
        "TAG/008583": "Travel Expert",
        "TAG/005058": "Sposi in Luna di Miele",
        "TAG/005045": "Famiglia",
        "TAG/005051": "Kite Surfers/ Kite Surf",
        "TAG/008582": "Protocollo GVR",
        "TAG/005043": "Coppia",
        "TAG/005050": "In Viaggio Con Animali",
        "TAG/005055": "Single",

        "TIG/008641": "Tour Individuale",
        "TIG/008606": "Appartamenti",
        "TIG/008617": "Tour di Gruppo",
        "TIG/008613": "Safari",
        "TIG/008610": "Resort",
        "TIG/008620": "Soggiorni",
        "TIG/008612": "Villaggio",
        "TIG/008608": "Crociere",
        "TIG/008618": "Fly & Drive",
        "TIG/008611": "Tour",
        "TIG/008607": "Camping",
        "TIG/008609": "Hotel"
    };

    var SERVICE_GROUPS = {
        "SER/000016": "Servizi",
        "SER/000017": "Servizi",
        "SER/000019": "Servizi",

        "SER/000032": "Camere",
        "SER/000174": "Camere",
        "SER/000250": "Camere",

        "SER/000042": "Ristorazione",
        "SER/000044": "Ristorazione",
        "SER/001104": "Ristorazione",

        "SER/000046": "Spiaggia",
        "SER/000050": "Spiaggia",
        "SER/000599": "Spiaggia",

        "SER/000055": "Bambini",
        "SER/001003": "Bambini",

        "SER/000066": "Attività e Sport",
        "SER/001043": "Attività e Sport",

        "SER/000088": "Benessere",
        "SER/000341": "Benessere",

        "SER/000240": "Posizione e Trasporti",

        "SER/001047": "Neonati"
    };
    function groupServices(codes) {
        var orderedGroups = [
            "Servizi",
            "Camere",
            "Ristorazione",
            "Spiaggia",
            "Bambini",
            "Attività e Sport",
            "Benessere",
            "Posizione e Trasporti",
            "Neonati"
        ];

        var groups = {};

        orderedGroups.forEach(function (groupName) {
            groups[groupName] = [];
        });

        (codes || []).forEach(function (code) {
            var group = SERVICE_GROUPS[code] || "Servizi";
            groups[group].push(code);
        });

        return groups;
    }

    if (!container) return;

    setResponsiveAttributes();

    function isMobile() {
        var userAgentCheck = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        var screenCheck = window.matchMedia("(max-width: 768px)").matches;
        return userAgentCheck || screenCheck;
    }

    var mainCard = document.querySelector(".dy-recommendations__slider-conatiner-${dyVariationId}");
    if (mainCard) {
        mainCard.style.width = isMobile() ? '100%' : '1140px';
        mainCard.style.width = window.innerWidth >= 1140 ? '1140px' : '100%';
    }

    function toTitleCase(str) {
        return String(str || "")
            .normalize("NFD")
            .toLowerCase()
            .replace(/\b[a-zà-ú]/gi, function (c) {
                return c.normalize("NFC").toUpperCase();
            });
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function normalizeStar(value) {
        var v = String(value == null ? "" : value).trim().toUpperCase();
        if (!v || v === "ND" || v === "NULL" || v === "UNDEFINED" || v === "N/A") return "Other";
        return v;
    }

    function splitKeywords(value) {
        if (Array.isArray(value)) {
            return value
                .map(function (v) { return String(v || "").trim(); })
                .filter(Boolean);
        }

        return String(value || "")
            .split("|")
            .map(function (v) { return String(v || "").trim(); })
            .filter(Boolean);
    }

    function uniq(arr) {
        var map = {};
        var out = [];

        for (var i = 0; i < arr.length; i++) {
            var val = String(arr[i] || "").trim();
            if (!val || map[val]) continue;
            map[val] = true;
            out.push(val);
        }

        return out;
    }

    function extractItems(data) {
        var slots = data && data.slots ? data.slots : [];
        return slots.map(function (slot) { return slot.item; }).filter(Boolean);
    }

    function getKeywordsCount(item) {
        return splitKeywords(item && item[CFG.fields.keywords]).length;
    }


    function dedupItems(items) {
        var map = {};

        items.forEach(function (item) {
            var key =
                item[CFG.fields.groupId] ||
                item.sku ||
                item.id;

            if (!key) return;

            if (!map[key]) {
                map[key] = item;
                return;
            }

            var existing = map[key];
            var existingKeywordsCount = getKeywordsCount(existing);
            var currentKeywordsCount = getKeywordsCount(item);

            if (currentKeywordsCount > existingKeywordsCount) {
                map[key] = Object.assign({}, existing, item);
                return;
            }

            if (!existingKeywordsCount && currentKeywordsCount) {
                map[key] = Object.assign({}, existing, item);
                return;
            }

            if (!existing[CFG.fields.keywords] && item[CFG.fields.keywords]) {
                map[key] = Object.assign({}, existing, item);
                return;
            }

            map[key] = Object.assign({}, item, existing);
        });

        return Object.keys(map).map(function (key) {
            return map[key];
        });
    }

    function getItemKeywords(item) {
        return splitKeywords(item[CFG.fields.keywords]);
    }
    function getKeywordLabel(code) {
        return KEYWORD_LABELS[code] || code;
    }

    function getKeywordGroup(code) {
        var value = String(code || "").trim().toUpperCase();
        if (value.indexOf("TAG/") === 0) return "TAG";
        if (value.indexOf("TIG/") === 0) return "TIG";
        if (value.indexOf("SER/") === 0) return "SER";
        return "";
    }

    function hasAllSelectedKeywords(itemKeywords, selectedValues) {
        if (!selectedValues || !selectedValues.length) return true;
        return selectedValues.every(function (value) {
            return itemKeywords.indexOf(value) !== -1;
        });
    }

    function hasAnySelectedKeyword(itemKeywords, selectedValues) {
        if (!selectedValues || !selectedValues.length) return true;
        return selectedValues.some(function (value) {
            return itemKeywords.indexOf(value) !== -1;
        });
    }

    function matchesSelectedStars(itemStar, selectedStars) {
        if (!selectedStars || !selectedStars.length) return true;
        return selectedStars.indexOf(itemStar) !== -1;
    }

    function arrayEquals(a, b) {
        if (!a || !b || a.length !== b.length) return false;
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    function getMultiselectSummary(selectedValues, emptyLabel, labelsMapFn) {
        if (!selectedValues || !selectedValues.length) return emptyLabel;
        return selectedValues.length === 1 ? "1 selezionato" : selectedValues.length + " selezionati";
    }

    function toggleArrayValue(arr, value) {
        var out = arr.slice();
        var index = out.indexOf(value);

        if (index === -1) out.push(value);
        else out.splice(index, 1);

        return out;
    }

    function getVisibleKeywordCodesByGroup(items, group, filters, searchTerm) {
        var values = getAvailableKeywordCodesByGroup(items, group, filters);
        var search = String(searchTerm || "").trim().toLowerCase();

        if (!search) return values;

        return values.filter(function (code) {
            return getKeywordLabel(code).toLowerCase().indexOf(search) !== -1;
        });
    }

    function getAvailableKeywordCodesByGroup(items, group, filters) {
        var values = [];

        items.forEach(function (item) {
            var itemStar = normalizeStar(item[CFG.fields.star]);
            var itemKeywords = getItemKeywords(item);

            if (!matchesSelectedStars(itemStar, filters.star || [])) return;
            if (!hasAllSelectedKeywords(itemKeywords, filters.tag || [])) return;
            if (!hasAnySelectedKeyword(itemKeywords, filters.tig || [])) return;
            if (!hasAllSelectedKeywords(itemKeywords, filters.ser || [])) return;

            itemKeywords.forEach(function (code) {
                if (getKeywordGroup(code) === group) {
                    values.push(code);
                }
            });
        });

        return uniq(values).sort(function (a, b) {
            return getKeywordLabel(a).localeCompare(getKeywordLabel(b), undefined, { numeric: true, sensitivity: "base" });
        });
    }
    function getAvailableStars(items, filters) {
        var stars = [];

        items.forEach(function (item) {
            var itemStar = normalizeStar(item[CFG.fields.star]);
            var itemKeywords = getItemKeywords(item);

            if (!hasAllSelectedKeywords(itemKeywords, filters.tag || [])) return;
            if (!hasAnySelectedKeyword(itemKeywords, filters.tig || [])) return;
            if (!hasAllSelectedKeywords(itemKeywords, filters.ser || [])) return;

            stars.push(itemStar);
        });

        return uniq(stars).sort(function (a, b) {
            return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
        });
    }

    function filterItems(items, filters) {
        return items.filter(function (item) {
            var itemStar = normalizeStar(item[CFG.fields.star]);
            var itemKeywords = getItemKeywords(item);

            var matchStar = matchesSelectedStars(itemStar, filters.star || []);
            var matchTag = hasAllSelectedKeywords(itemKeywords, filters.tag || []);
            var matchTig = hasAnySelectedKeyword(itemKeywords, filters.tig || []);
            var matchSer = hasAllSelectedKeywords(itemKeywords, filters.ser || []);

            return matchStar && matchTag && matchTig && matchSer;
        });
    }

    function setOptions(selectEl, values, placeholder, selectedValue, labelResolver) {
        var html = '<option value="">' + escapeHtml(placeholder) + '</option>';

        values.forEach(function (value) {
            var selected = selectedValue === value ? ' selected' : '';
            var label = typeof labelResolver === "function" ? labelResolver(value) : value;
            html += '<option value="' + escapeHtml(value) + '"' + selected + '>' + escapeHtml(label) + '</option>';
        });

        selectEl.innerHTML = html;
    }

    function editButtons(scope) {
        scope.querySelectorAll(".url-button").forEach(function (buttonComponent) {
            if (!buttonComponent || !buttonComponent.href) return;
            buttonComponent.href = buttonComponent.href.replace('?id=', '?searchId=');
        });
    }

    function createStarSVG(color) {
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 20 20");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
        svg.setAttribute("fill", color);
        svg.style.marginRight = "1px";
        svg.style.width = '10px';
        svg.style.heigth = '10px';
        svg.style.aspectRatio = "1";

        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M10.0004 16.2609L6.02112 18.3226C5.29379 18.6994 4.39826 18.4154 4.02137 17.688C3.87231 17.4 3.82112 17.071 3.87681 16.7509L4.63114 12.4167L1.45573 9.36616C0.865089 8.79858 0.845964 7.85918 1.41354 7.26854C1.64305 7.03003 1.94568 6.87477 2.27307 6.82752L6.68152 6.19638L8.67339 2.21938C9.04015 1.48699 9.93174 1.19054 10.6641 1.5573C10.9505 1.70074 11.1828 1.93306 11.3262 2.21938L13.3181 6.19638L17.7265 6.82752C18.5377 6.94396 19.1008 7.69549 18.9849 8.50664C18.9382 8.83458 18.7829 9.13666 18.5439 9.36616L15.3685 12.4167L16.1228 16.7509C16.2634 17.5581 15.7229 18.3265 14.9156 18.4671C14.5961 18.5228 14.2671 18.4722 13.9785 18.3226L9.99924 16.2609H10.0004Z");
        svg.appendChild(path);

        return svg;
    }

    function renderRatingRow(card) {
        var starsContainer = card.querySelector('.stars');
        if (starsContainer) {
            var rawStar = starsContainer.getAttribute("data-star");
            var starMap = { "4": 4, "4S": 4, "5": 5, "5L": 5, "6": 5 };
            var stars = starMap[String(rawStar || "").trim().toUpperCase()] || 0;

            starsContainer.innerHTML = "";

            if (!stars) {
                starsContainer.style.visibility = "hidden";
            } else {
                starsContainer.style.visibility = "visible";
                for (var i = 0; i < stars; i++) {
                    starsContainer.appendChild(createStarSVG("#ffd253"));
                }
                for (var j = stars; j < 5; j++) {
                    starsContainer.appendChild(createStarSVG("var(--primary-disabled, #d7d9e0)"));
                }
            }
        }

        var scoreContainer = card.querySelector('.score');
        var scoreValueEl = card.querySelector('.score-value');

        if (!scoreContainer || !scoreValueEl) return;

        var rawRating = String(scoreValueEl.textContent || "").trim();
        if (!rawRating || rawRating === "ND") {
            scoreContainer.remove();
            return;
        }

        var rating = parseInt(rawRating, 10);
        if (isNaN(rating)) {
            scoreContainer.remove();
            return;
        }

        var recensione = document.createElement('span');
        recensione.innerText = rating >= 8 ? 'Ottimo' : 'Buono';
        recensione.className = 'score-label';
        scoreContainer.appendChild(recensione);
    }

    function getBrandMap() {
        if (brandMap) return Promise.resolve(brandMap);

        return fetch("https://static.alpitour.it/.rest/delivery/brand")
            .then(function (res) { return res.json(); })
            .then(function (data) {
                brandMap = {};
                var results = data && data.results ? data.results : [];

                results.forEach(function (item) {
                    if (item && item.codBrand) {
                        brandMap[item.codBrand] = item;
                    }
                });

                return brandMap;
            })
            .catch(function () {
                brandMap = {};
                return brandMap;
            });
    }

    function renderLogos(scope) {
        return getBrandMap().then(function (map) {
            var logos = scope.querySelectorAll('.logo');

            logos.forEach(function (logoEl) {
                var code = String(logoEl.getAttribute("data-brand") || "").trim();

                if (!code || code === 'ND') {
                    logoEl.remove();
                    return;
                }

                var brandItem = map[code];
                if (!brandItem || !brandItem.whiteLogo || !brandItem.whiteLogo["@path"]) {
                    return;
                }

                logoEl.innerHTML = '';

                var icon = document.createElement('img');
                icon.src = "https://static.alpitour.it/dam" + brandItem.whiteLogo["@path"];
                icon.alt = code;
                icon.style.height = '15px';
                icon.style.objectFit = 'contain';

                logoEl.appendChild(icon);
            });
        });
    }

    function buildCardHtml(item) {
        var image = item[CFG.fields.image] || "";
        var groupId = item[CFG.fields.groupId] || "";
        var name = toTitleCase(item[CFG.fields.name] || "");
        var rating = item[CFG.fields.rating] || "ND";
        var star = item[CFG.fields.star] || "";
        var destination = item[CFG.fields.destination] || "";
        var url = item[CFG.fields.url] || "#";
        var brand = item[CFG.fields.brand] || "";

        return ''
            + '<div class="card-${dyVariationId} dy-recommendation-product-${dyVariationId}">'
            + '  <img src="' + escapeHtml(image) + '" class="card-image" />'
            + '  <div class="logo" data-brand="' + escapeHtml(brand) + '">' + escapeHtml(brand) + '</div>'
            + '  <div class="card-content-${dyVariationId}">'
            + '    <div class="card-info-${dyVariationId}">'
            + '      <h2 class="card-title-${dyVariationId}">' + escapeHtml(name) + '</h2>'
            + '    </div>'
            + '    <div class="rating-row">'
            + '      <div class="stars" data-star="' + escapeHtml(star) + '"></div>'
            + '      <div class="score">'
            + '        <span class="score-value">' + escapeHtml(rating) + '</span>'
            + '      </div>'
            + '    </div>'
            + '    <div class="location-${dyVariationId}">'
            + '      <svg xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px" width="20" height="20" viewBox="0 0 20 20" fill="#FFFFFF">'
            + '        <path d="M9.99972 1C13.3087 1 16 3.69125 16 7.00028C16 9.70816 13.9293 12.67 12.2651 15.0496C11.2996 16.4299 10.3885 17.737 10.3874 18.3492C10.3874 18.5611 10.2182 18.7457 10.0053 18.7457H10.0003C9.78844 18.7457 9.61597 18.5755 9.6132 18.3636V18.3514C9.60488 17.7425 8.70262 16.4527 7.74768 15.0879C6.07736 12.7022 4 9.73201 4 7.00028C4 3.69125 6.6907 1 9.99972 1ZM9.99972 1.77416C7.11826 1.77416 4.7736 4.11881 4.7736 7.00028C4.7736 9.48856 6.77333 12.3473 8.38098 14.6443C9.04866 15.5992 9.63205 16.4321 9.99584 17.1303C10.3602 16.4233 10.953 15.5765 11.6301 14.606C13.2322 12.3151 15.2258 9.46361 15.2258 7.00028C15.2258 4.11881 12.8812 1.77416 9.99972 1.77416ZM9.99972 4.61569C11.3872 4.61569 12.5168 5.74421 12.5168 7.13171C12.5168 8.5192 11.3872 9.64883 9.99972 9.64883C8.61223 9.64883 7.4826 8.5192 7.4826 7.13171C7.4826 5.74421 8.61223 4.61569 9.99972 4.61569ZM9.99972 5.38985C9.03868 5.38985 8.25787 6.17122 8.25787 7.13171C8.25787 8.09275 9.03813 8.87412 9.99972 8.87412C10.9613 8.87412 11.7416 8.09275 11.7416 7.13171C11.7416 6.17177 10.9613 5.38985 9.99972 5.38985Z" fill="#FFFFFF"/>'
            + '      </svg>'
            + '      <div>' + escapeHtml(destination) + '</div>'
            + '    </div>'
            + '    <a target="_blank" rel="noopener noreferrer" class="url-button" href="' + escapeHtml(url) + '" style="text-decoration: auto">'
            + '      <button class="discover">SCOPRI</button>'
            + '    </a>'
            + '  </div>'
            + '</div>';
    }

    function renderSkeletonCards() {
        var wrapper = container.querySelector('.dy-recommendations__slider-wrapper');
        var arrowsContainer = container.querySelector('.dy-recommendations-slider-arrows');
        var titleComponent = container.querySelector('.title-${dyVariationId}');

        if (!wrapper) return;

        var skeletonCount = window.innerWidth < 1140 ? 3 : 4;

        var html = new Array(skeletonCount).fill('').map(function () {
            return ''
                + '<div class="dy-skeleton-card-${dyVariationId}">'
                + '  <div class="dy-skeleton-shimmer-${dyVariationId}"></div>'
                + '  <div class="dy-skeleton-content-${dyVariationId}">'
                + '    <div class="dy-skeleton-line-${dyVariationId} w-70"></div>'
                + '    <div class="dy-skeleton-line-${dyVariationId} w-45"></div>'
                + '    <div class="dy-skeleton-line-${dyVariationId} w-55"></div>'
                + '    <div class="dy-skeleton-button-${dyVariationId} w-100"></div>'
                + '  </div>'
                + '</div>';
        }).join('');

        wrapper.innerHTML = html;
        wrapper.classList.remove('hidden');

        if (titleComponent) titleComponent.classList.remove('hidden');
        if (arrowsContainer) arrowsContainer.classList.add('hidden');
    }


    function renderProducts(items) {
        var wrapper = container.querySelector('.dy-recommendations__slider-wrapper');
        var arrowsContainer = container.querySelector('.dy-recommendations-slider-arrows');
        var titleComponent = container.querySelector('.title-${dyVariationId}');

        if (!wrapper) return;

        destroySlider();

        wrapper.innerHTML = items.map(buildCardHtml).join('');

        editButtons(wrapper);

        wrapper.querySelectorAll('.card-${dyVariationId}').forEach(function (card) {
            renderRatingRow(card);
        });

        renderLogos(wrapper).then(function () {
            if (items.length > 0) {
                wrapper.classList.remove('hidden');
                if (titleComponent) titleComponent.classList.remove('hidden');
                if (arrowsContainer) arrowsContainer.classList.remove('hidden');
                initOrUpdateSlider();
            } else {
                wrapper.classList.add('hidden');
                if (arrowsContainer) arrowsContainer.classList.add('hidden');
            }
        });
    }

    function renderStarOptions(values, selectedValues) {
        var containerEl = container.querySelector('[data-options="star"]');
        if (!containerEl) return;

        if (!values || !values.length) {
            containerEl.innerHTML = '<div class="dy-multiselect-empty-${dyVariationId}">Nessuna stella</div>';
            return;
        }

        var html = values.map(function (value) {
            var checked = selectedValues.indexOf(value) !== -1 ? "checked" : "";

            return ''
                + '<label class="dy-multiselect-option-${dyVariationId}">'
                + '  <input type="checkbox" value="' + escapeHtml(value) + '" data-group="star" ' + checked + '>'
                + '  <span>' + escapeHtml(value) + '</span>'
                + '</label>';
        }).join('');

        containerEl.innerHTML = html;
    }
    function renderServiceOptions(values, selectedValues) {
        var containerEl = container.querySelector('[data-options="ser"]');
        if (!containerEl) return;

        var groups = groupServices(values);
        var html = "";
        var hasSearch = !!String(state.searchSer || "").trim();

        Object.keys(groups).forEach(function (group) {
            if (!groups[group].length) return;

            var groupId = "grp-" + group.replace(/\s+/g, "-").toLowerCase();
            var isOpen = hasSearch ? true : !!state.openSerGroups[groupId];
            var bodyClass = isOpen ? "dy-group-body" : "dy-group-body hidden";
            var arrow = isOpen ? "v" : ">";

            html += ''
                + '<div class="dy-group">'
                + '  <div class="dy-group-header" data-group="' + escapeHtml(groupId) + '">'
                + '    <span>' + escapeHtml(group) + '</span>'
                + '    <span class="arrow">' + arrow + '</span>'
                + '  </div>'
                + '  <div class="' + bodyClass + '" id="' + escapeHtml(groupId) + '">';

            groups[group].forEach(function (code) {
                var checked = selectedValues.indexOf(code) !== -1 ? "checked" : "";

                html += ''
                    + '<label class="dy-multiselect-option-${dyVariationId}">'
                    + '  <input type="checkbox" value="' + escapeHtml(code) + '" data-group="ser" ' + checked + '>'
                    + '  <span>' + escapeHtml(getKeywordLabel(code)) + '</span>'
                    + '</label>';
            });

            html += '</div></div>';
        });

        containerEl.innerHTML = html || '<div class="dy-multiselect-empty-${dyVariationId}">Nessun servizio</div>';
    }

    function renderMultiSelectOptions(groupKey, values, selectedValues, emptyLabel) {
        if (groupKey === "ser") {
            renderServiceOptions(values, selectedValues);
            return;
        }

        if (groupKey === "star") {
            renderStarOptions(values, selectedValues);
            return;
        }

        var containerEl = container.querySelector('[data-options="' + groupKey + '"]');
        if (!containerEl) return;

        if (!values || !values.length) {
            containerEl.innerHTML = '<div class="dy-multiselect-empty-${dyVariationId}">' + escapeHtml(emptyLabel) + '</div>';
            return;
        }

        var html = values.map(function (code) {
            var checked = selectedValues.indexOf(code) !== -1 ? "checked" : "";

            return ''
                + '<label class="dy-multiselect-option-${dyVariationId}">'
                + '  <input type="checkbox" value="' + escapeHtml(code) + '" data-group="' + groupKey + '" ' + checked + '>'
                + '  <span>' + escapeHtml(getKeywordLabel(code)) + '</span>'
                + '</label>';
        }).join('');

        containerEl.innerHTML = html;
    }
    function updateMultiSelectTrigger(group, selectedValues, emptyLabel) {
        var root = container.querySelector('.dy-multiselect-${dyVariationId}[data-filter-group="' + group + '"]');
        if (!root) return;

        var textEl = root.querySelector('.dy-multiselect-trigger-text-${dyVariationId}');
        if (!textEl) return;

        textEl.textContent = getMultiselectSummary(selectedValues, emptyLabel, getKeywordLabel);
    }

    function openDropdown(root) {
        var dropdown = root.querySelector('.dy-multiselect-dropdown-${dyVariationId}');
        if (!dropdown) return;

        container.querySelectorAll('.dy-multiselect-dropdown-${dyVariationId}').forEach(function (el) {
            if (el !== dropdown) el.classList.add('hidden');
        });

        dropdown.classList.remove('hidden');
        state.activeDropdownGroup = root.getAttribute('data-filter-group') || "";

        var input = root.querySelector('.dy-multiselect-search-${dyVariationId}');
        if (input) input.focus();
    }

    function closeAllDropdowns() {
        container.querySelectorAll('.dy-multiselect-dropdown-${dyVariationId}').forEach(function (el) {
            el.classList.add('hidden');
        });
        state.activeDropdownGroup = "";
    }

    function refreshFiltersAndProducts() {
        var emptyState = container.querySelector('.dy-empty-state-${dyVariationId}');
        var sliderEl = container.querySelector('.dy-recommendations__slider-${dyVariationId}');

        var availableStars = getAvailableStars(state.allItems, {
            tag: state.selectedTag,
            tig: state.selectedTig,
            ser: state.selectedSer
        });

        var availableTags = getAvailableKeywordCodesByGroup(state.allItems, "TAG", {
            star: state.selectedStar,
            tag: [],
            tig: state.selectedTig,
            ser: state.selectedSer
        });

        var availableTigs = getAvailableKeywordCodesByGroup(state.allItems, "TIG", {
            star: state.selectedStar,
            tag: state.selectedTag,
            tig: [],
            ser: state.selectedSer
        });

        var availableSers = getVisibleKeywordCodesByGroup(state.allItems, "SER", {
            star: state.selectedStar,
            tag: state.selectedTag,
            tig: state.selectedTig,
            ser: []
        }, state.searchSer);

        state.selectedStar = state.selectedStar.filter(function (v) {
            return availableStars.indexOf(v) !== -1;
        });

        state.selectedTag = state.selectedTag.filter(function (v) {
            return availableTags.indexOf(v) !== -1;
        });

        state.selectedTig = state.selectedTig.filter(function (v) {
            return availableTigs.indexOf(v) !== -1;
        });

        state.selectedSer = state.selectedSer.filter(function (v) {
            return getAvailableKeywordCodesByGroup(state.allItems, "SER", {
                star: state.selectedStar,
                tag: state.selectedTag,
                tig: state.selectedTig,
                ser: []
            }).indexOf(v) !== -1;
        });

        renderMultiSelectOptions(
            "star",
            availableStars,
            state.selectedStar,
            "Nessuna stella"
        );

        renderMultiSelectOptions(
            "tag",
            availableTags,
            state.selectedTag,
            "Nessuna caratteristica"
        );

        renderMultiSelectOptions(
            "tig",
            availableTigs,
            state.selectedTig,
            "Nessuna tipologia"
        );

        renderMultiSelectOptions(
            "ser",
            availableSers,
            state.selectedSer,
            "Nessun servizio"
        );

        updateMultiSelectTrigger("star", state.selectedStar, "Tutte le stelle");
        updateMultiSelectTrigger("tag", state.selectedTag, "Tutte le caratteristiche");
        updateMultiSelectTrigger("tig", state.selectedTig, "Tutte le tipologie");
        updateMultiSelectTrigger("ser", state.selectedSer, "Tutti i servizi");

        state.filteredItems = filterItems(state.allItems, {
            star: state.selectedStar,
            tag: state.selectedTag,
            tig: state.selectedTig,
            ser: state.selectedSer
        });

        if (emptyState) {
            if (state.filteredItems.length) emptyState.classList.add('hidden');
            else emptyState.classList.remove('hidden');
        }

        if (sliderEl) {
            if (state.filteredItems.length) sliderEl.classList.remove('is-empty-results');
            else sliderEl.classList.add('is-empty-results');
        }
        if (state.activeDropdownGroup) {
            var activeRoot = container.querySelector('.dy-multiselect-${dyVariationId}[data-filter-group="' + state.activeDropdownGroup + '"]');
            if (activeRoot) {
                openDropdown(activeRoot);
            }
        }
        renderProducts(state.filteredItems);
    }

    function fetchStrategy(strategyId) {
        return new Promise(function (resolve) {
            DYO.recommendationWidgetData(strategyId, { maxProducts: CFG.maxProductsPerStrategy }, function (err, data) {
                if (err) {
                    resolve([]);
                    return;
                }

                resolve(extractItems(data));
            });
        });
    }

    function fetchAllStrategies() {
        return Promise.all(
            CFG.strategyIds.map(function (strategyId) {
                return fetchStrategy(strategyId);
            })
        ).then(function (results) {
            var merged = [];
            results.forEach(function (items) {
                merged = merged.concat(items);
            });
            return dedupItems(merged);
        });
    }

    function initEvents() {
        var resetButton = container.querySelector('.dy-filter-reset-${dyVariationId}');

        container.querySelectorAll('.dy-multiselect-${dyVariationId}').forEach(function (root) {
            var group = root.getAttribute('data-filter-group');
            var trigger = root.querySelector('.dy-multiselect-trigger-${dyVariationId}');
            var searchInput = root.querySelector('.dy-multiselect-search-${dyVariationId}');

            if (trigger) {
                trigger.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var dropdown = root.querySelector('.dy-multiselect-dropdown-${dyVariationId}');
                    if (!dropdown) return;

                    var isHidden = dropdown.classList.contains('hidden');
                    closeAllDropdowns();
                    if (isHidden) openDropdown(root);
                });
            }

            if (searchInput) {
                searchInput.addEventListener('input', function () {
                    if (group === 'ser') {
                        state.searchSer = this.value;
                    }

                    refreshFiltersAndProducts();
                    openDropdown(root);
                });

                searchInput.addEventListener('click', function (e) {
                    e.stopPropagation();
                });
            }
        });

        container.addEventListener('change', function (e) {
            var checkbox = e.target;
            if (!checkbox || checkbox.tagName !== 'INPUT' || checkbox.type !== 'checkbox') return;

            var option = checkbox.closest('.dy-multiselect-option-${dyVariationId}');
            if (!option) return;

            var group = checkbox.getAttribute('data-group');
            var value = checkbox.value;

            if (group === 'star') {
                state.selectedStar = toggleArrayValue(state.selectedStar, value);
            }

            if (group === 'tag') {
                state.selectedTag = toggleArrayValue(state.selectedTag, value);
            }

            if (group === 'tig') {
                state.selectedTig = toggleArrayValue(state.selectedTig, value);
            }

            if (group === 'ser') {
                state.selectedSer = toggleArrayValue(state.selectedSer, value);
            }

            refreshFiltersAndProducts();

            var multiselectRoot = checkbox.closest('.dy-multiselect-${dyVariationId}');
            if (multiselectRoot) {
                openDropdown(multiselectRoot);
            }
        });

        if (resetButton) {
            resetButton.addEventListener('click', function () {
                state.selectedStar = [];
                state.selectedTag = [];
                state.selectedTig = [];
                state.selectedSer = [];
                state.searchSer = "";
                state.openSerGroups = {};

                container.querySelectorAll('.dy-multiselect-search-${dyVariationId}').forEach(function (input) {
                    input.value = "";
                });

                refreshFiltersAndProducts();
                closeAllDropdowns();
            });
        }
        container.addEventListener('click', function (e) {
            var resetSingle = e.target.closest('.dy-multiselect-reset-${dyVariationId}');
            if (!resetSingle) return;

            e.stopPropagation();

            var group = resetSingle.getAttribute('data-reset-group');

            if (group === 'star') {
                state.selectedStar = [];
            }

            if (group === 'tag') {
                state.selectedTag = [];
            }

            if (group === 'tig') {
                state.selectedTig = [];
            }

            if (group === 'ser') {
                state.selectedSer = [];
                state.searchSer = "";
                state.openSerGroups = {};

                var searchInput = container.querySelector('.dy-multiselect-${dyVariationId}[data-filter-group="ser"] .dy-multiselect-search-${dyVariationId}');
                if (searchInput) {
                    searchInput.value = "";
                }
            }

            refreshFiltersAndProducts();

            var root = container.querySelector('.dy-multiselect-${dyVariationId}[data-filter-group="' + group + '"]');
            if (root) {
                openDropdown(root);
            }
        });
        container.addEventListener('click', function (e) {
            var header = e.target.closest('.dy-group-header');
            if (!header) return;

            e.stopPropagation();

            if (String(state.searchSer || "").trim()) return;

            var targetId = header.getAttribute('data-group');
            var body = container.querySelector('#' + targetId);
            var arrow = header.querySelector('.arrow');

            if (!body || !arrow) return;

            if (body.classList.contains('hidden')) {
                body.classList.remove('hidden');
                arrow.textContent = 'v';
                state.openSerGroups[targetId] = true;
            } else {
                body.classList.add('hidden');
                arrow.textContent = '>';
                state.openSerGroups[targetId] = false;
            }
        });

        document.addEventListener('click', function (e) {
            var clickedOnTrigger = !!e.target.closest('.dy-multiselect-trigger-${dyVariationId}');
            var clickedInsideDropdown = !!e.target.closest('.dy-multiselect-dropdown-${dyVariationId}');

            if (!clickedOnTrigger && !clickedInsideDropdown) {
                closeAllDropdowns();
            }
        });

    }

    function initSlider() {
        var SWIPER_JS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.4.6/js/swiper.js';
        return appendJSFile(SWIPER_JS_URL).then(function () {
            swiperReady = true;
        });
    }

    function destroySlider() {
        if (sliderInstance && typeof sliderInstance.destroy === "function") {
            sliderInstance.destroy(true, true);
            sliderInstance = null;
        }
    }

    function initOrUpdateSlider() {
        if (!swiperReady || typeof Swiper === "undefined") return;

        var sliderElement = container.querySelector('.dy-recommendations__slider-${dyVariationId}');
        var wrapper = container.querySelector('.dy-recommendations__slider-wrapper');
        var slidesCount = wrapper ? wrapper.querySelectorAll('.dy-recommendation-product-${dyVariationId}').length : 0;

        if (!sliderElement || !slidesCount) return;

        sliderInstance = new Swiper(sliderElement, getSliderOptions(slidesCount));
    }

    function parsePriceHtml(num, integrSeperator, fructionSeperator) {
        var str = num.toString().split('.');
        if (str[0].length >= 5) {
            str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1' + integrSeperator);
        }
        if (str[1] && str[1].length >= 5) {
            str[1] = str[1].replace(/(\d{3})/g, '$1 ');
        }
        return str.join(fructionSeperator);
    }

    function formatPrice(price, sign, position) {
        var parsedPrice = parsePriceHtml(price, '${Thousands Separator}', '${Decimal Separator}');
        var data = position === POSITION_PREFIX ? [sign, parsedPrice] : [parsedPrice, sign];
        return data.join('');
    }

    function setResponsiveAttributes() {
        var ENABLE_ARROWS_DESKTOP = !!parseInt('${Visibility on Desktop}');
        var ENABLE_ARROWS_TABLET = !!parseInt('${Visibility on Tablet}');
        var ENABLE_ARROWS_MOBILE = !!parseInt('${Visibility on Mobile}');
        var ENABLE_PAGINATION_DESKTOP = !!parseInt('${Dots on Desktop}');
        var ENABLE_PAGINATION_TABLET = !!parseInt('${Dots on Tablet}');
        var ENABLE_PAGINATION_MOBILE = !!parseInt('${Dots on Mobile}');

        var settings = [{
            el: '.dy-recommendations-slider-pagination',
            data: {
                'dy-hide--d': !ENABLE_PAGINATION_DESKTOP,
                'dy-hide--t': !ENABLE_PAGINATION_TABLET,
                'dy-hide--m': !ENABLE_PAGINATION_MOBILE
            }
        }, {
            el: '.dy-recommendations-slider-arrows',
            data: {
                'dy-hide--d': !ENABLE_ARROWS_DESKTOP,
                'dy-hide--t': !ENABLE_ARROWS_TABLET,
                'dy-hide--m': !ENABLE_ARROWS_MOBILE
            }
        }];

        settings.forEach(function (item) {
            var el = container.querySelector(item.el);
            if (!el) return;

            for (var key in item.data) {
                if (item.data[key]) {
                    el.classList.add(key);
                }
            }
        });
    }

    function getSliderOptions(injectedProducts) {
        var ENABLE_AUTOPLAY = !!parseInt('${Autoplay}');
        var AUTOPLAY_SPEED = parseInt('${Autoplay Speed}') * 1000;
        var ITEMS_TO_DISPLAY_XL = parseInt('${Large Screen}');
        var ITEMS_TO_DISPLAY_DESKTOP = parseInt('${Standard Screen}');
        var ITEMS_TO_DISPLAY_TABLET = parseInt('${Tablet}');
        var ITEMS_TO_DISPLAY_MOBILE = parseInt('${Mobile}');
        var ENABLE_LOOP = 0;

        if (
            SCREEN_WIDTH <= '${Breakpoint Mobile}' && injectedProducts > ITEMS_TO_DISPLAY_MOBILE ||
            SCREEN_WIDTH > '${Breakpoint Mobile}' && SCREEN_WIDTH <= '${Breakpoint Tablet}' && injectedProducts > ITEMS_TO_DISPLAY_TABLET ||
            SCREEN_WIDTH > '${Breakpoint Tablet}' && SCREEN_WIDTH <= '${Breakpoint Desktop}' && injectedProducts > ITEMS_TO_DISPLAY_DESKTOP ||
            SCREEN_WIDTH > '${Breakpoint Desktop}' && injectedProducts > ITEMS_TO_DISPLAY_XL
        ) {
            ENABLE_LOOP = !!parseInt('${Infinite Scroll}');
        }

        return {
            freeMode: true,
            touchStartPreventDefault: false,
            loop: ENABLE_LOOP,
            loopAdditionalSlides: 0,
            autoplay: ENABLE_AUTOPLAY && {
                delay: AUTOPLAY_SPEED
            },
            spaceBetween: 15,
            slidesPerView: window.innerWidth < 1140 ? (window.innerWidth / 333) : 3.4,
            slidesPerGroup: 1,
            navigation: {
                nextEl: container.querySelector('.dy-recommendations-slider-button--next'),
                prevEl: container.querySelector('.dy-recommendations-slider-button--prev'),
                disabledClass: 'dy-recommendations-slider-button--disabled'
            },
            pagination: {
                el: container.querySelector('.dy-recommendations-slider-pagination'),
                bulletClass: 'dy-recommendations-slider-pagination-bullet',
                bulletActiveClass: 'dy-recommendations-slider-pagination-bullet__active',
                modifierClass: 'dy-recommendations-slider-pagination-',
                clickableClass: 'dy-recommendations-slider-pagination--clickable',
                clickable: true,
                type: 'bullets',
                renderBullet: function (index, className) {
                    return '<div class="' + className + '"></div>';
                }
            },
            a11y: {
                notificationClass: 'dy-recommendations-slider--aria-notification'
            },
            slideClass: 'dy-recommendation-product-${dyVariationId}',
            wrapperClass: 'dy-recommendations__slider-wrapper',
            containerModifierClass: 'dy-recommendations__slider-${dyVariationId}'
        };
    }

    function appendJSFile(url) {
        return DYO.Q.Promise(function (resolve, reject) {
            if (typeof define === 'function' && define.amd) {
                require([url], function (swiper) {
                    window.Swiper = swiper;
                    resolve();
                });
                return;
            }

            if (window.Swiper) {
                resolve();
                return;
            }

            var js = document.createElement('SCRIPT');
            js.setAttribute('type', 'text/javascript');
            js.setAttribute('src', url);
            js.addEventListener('load', resolve);
            js.addEventListener('error', reject);
            document.head.appendChild(js);
        });
    }

    function boot() {
        initEvents();
        renderSkeletonCards();

        fetchAllStrategies().then(function (items) {
            state.allItems = items;
            state.initialLoadDone = true;
            refreshFiltersAndProducts();
        });
    }

    initSlider().then(boot);

    document.addEventListener('click', function (e) {
        var button = e.target.closest('.url-button');
        if (button && container.contains(button)) {
            if (window.DY && DY.API) {
                DY.API('event', {
                    name: 'clickCTAcarosello_${dyExperienceId}'
                });
            }
        }
    });
})();// JavaScript source code
