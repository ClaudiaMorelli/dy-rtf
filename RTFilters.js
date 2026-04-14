(function () {
    var CFG = {
        strategyIds: [303624, 303658, 305944],
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
        byStrategy: [],
        selectedStar: [],
        selectedTag: [],
        selectedTig: [],
        selectedSer: [],
        searchSer: "",
        openSerGroups: {},
        // FIX 3: stato accordion gruppi servizi nel pannello mobile
        openMobileSerGroups: {},
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
        "TAG/008580": "Amanti del Padel",
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

    var SERVICE_GROUP_ORDER = [
        "Attività&Esperienze",
        "Servizi Hotel",
        "Famiglia",
        "Mare&Spiaggia",
        "Benessere",
        "Sport",
        "Camere&Comfort",
        "Posizione",
        "Ristorazione"
    ];

    var SERVICE_FILTER_CONFIG = {
        "SER/000016": { label: "Animazione", groups: ["Attività&Esperienze"] },
        "SER/000017": { label: "Piscina", groups: ["Servizi Hotel"] },
        "SER/000019": { label: "Assistente", groups: ["Attività&Esperienze"] },
        "SER/000020": { groups: ["Posizione"] },
        "SER/000021": { groups: ["Servizi Hotel"] },
        "SER/000022": { label: "Wi-Fi", groups: ["Servizi Hotel"] },
        "SER/000026": { groups: ["Attività&Esperienze"] },
        "SER/000032": { groups: ["Camere&Comfort"] },
        "SER/000036": { groups: ["Ristorazione"] },
        "SER/000042": { label: "Ristorante", groups: ["Ristorazione"] },
        "SER/000044": { groups: ["Ristorazione", "Mare&Spiaggia"] },
        "SER/000046": { groups: ["Mare&Spiaggia"] },
        "SER/000047": { groups: ["Mare&Spiaggia"] },
        "SER/000048": { groups: ["Mare&Spiaggia"] },
        "SER/000050": { groups: ["Mare&Spiaggia"] },
        "SER/000051": { label: "Fondale basso", groups: ["Mare&Spiaggia"] },
        "SER/000055": { groups: ["Famiglia"] },
        "SER/000056": { groups: ["Famiglia"] },
        "SER/000060": { groups: ["Famiglia"] },
        "SER/000061": { label: "Piscina per bambini", groups: ["Famiglia"] },
        "SER/000064": { groups: ["Attività&Esperienze"] },
        "SER/000066": { groups: ["Sport"] },
        "SER/000071": { label: "Palestra", groups: ["Sport"] },
        "SER/000077": { groups: ["Sport"] },
        "SER/000078": { groups: ["Sport", "Attività&Esperienze"] },
        "SER/000079": { groups: ["Sport"] },
        "SER/000080": { groups: ["Sport"] },
        "SER/000088": { groups: ["Benessere"] },
        "SER/000090": { groups: ["Benessere"] },
        "SER/000135": { groups: ["Famiglia"] },
        "SER/000136": { label: "Spiaggia attrezzata", groups: ["Mare&Spiaggia"] },
        "SER/000137": { label: "Animazione", groups: ["Attività&Esperienze"] },
        "SER/000138": { groups: ["Servizi Hotel"] },
        "SER/000164": { label: "Spiaggia attrezzata", groups: ["Mare&Spiaggia"] },
        "SER/000173": { label: "Assistente", groups: ["Attività&Esperienze"] },
        "SER/000174": { groups: ["Camere&Comfort"] },
        "SER/000184": { groups: ["Mare&Spiaggia"] },
        "SER/000185": { groups: ["Servizi Hotel"] },
        "SER/000186": { groups: ["Sport"] },
        "SER/000188": { groups: ["Sport"] },
        "SER/000240": { groups: ["Posizione"] },
        "SER/000246": { groups: ["Servizi Hotel"] },
        "SER/000250": { groups: ["Camere&Comfort"] },
        "SER/000285": { groups: ["Servizi Hotel"] },
        "SER/000324": { groups: ["Famiglia"] },
        "SER/000327": { groups: ["Famiglia"] },
        "SER/000331": { groups: ["Camere&Comfort"] },
        "SER/000339": { groups: ["Attività&Esperienze"] },
        "SER/000341": { groups: ["Benessere"] },
        "SER/000342": { groups: ["Benessere"] },
        "SER/000343": { groups: ["Benessere"] },
        "SER/000345": { groups: ["Camere&Comfort", "Servizi Hotel"] },
        "SER/000347": { groups: ["Servizi Hotel"] },
        "SER/000349": { groups: ["Servizi Hotel"] },
        "SER/000387": { groups: ["Attività&Esperienze"] },
        "SER/000445": { groups: ["Camere&Comfort"] },
        "SER/000446": { groups: ["Camere&Comfort"] },
        "SER/000599": { groups: ["Posizione"] },
        "SER/000621": { groups: ["Benessere", "Sport"] },
        "SER/000623": { groups: ["Benessere"] },
        "SER/000630": { groups: ["Servizi Hotel"] },
        "SER/000635": { groups: ["Benessere", "Servizi Hotel"] },
        "SER/000637": { label: "Palestra", groups: ["Sport"] },
        "SER/001003": { groups: ["Famiglia"] },
        "SER/001008": { groups: ["Camere&Comfort"] },
        "SER/001029": { groups: ["Ristorazione"] },
        "SER/001043": { groups: ["Sport"] },
        "SER/001047": { groups: ["Famiglia"] },
        "SER/001072": { label: "Piscina", groups: ["Servizi Hotel"] },
        "SER/001073": { groups: ["Attività&Esperienze"] },
        "SER/001074": { label: "Piscina per bambini", groups: ["Famiglia"] },
        "SER/001075": { label: "Piscina per bambini", groups: ["Famiglia"] },
        "SER/001090": { groups: ["Camere&Comfort"] },
        "SER/001091": { groups: ["Posizione", "Mare&Spiaggia"] },
        "SER/001096": { groups: ["Servizi Hotel"] },
        "SER/001104": { groups: ["Ristorazione"] },
        "SER/001122": { groups: ["Servizi Hotel"] },
        "SER/001153": { groups: ["Sport"] },
        "TAG/008584": { groups: ["Ristorazione"] },
        "TAG/005056": { groups: ["Ristorazione"] }
    };

    function slugifyServiceValue(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function getServiceGroupDomId(prefix, group) {
        return prefix + slugifyServiceValue(group);
    }

    function buildServiceFilterDefinitions() {
        var aggregated = {};

        Object.keys(SERVICE_FILTER_CONFIG).forEach(function (code) {
            var config = SERVICE_FILTER_CONFIG[code] || {};
            var label = config.label || getKeywordLabel(code);
            if (!label) return;

            if (!aggregated[label]) {
                aggregated[label] = {
                    id: "SVC/" + slugifyServiceValue(label),
                    label: label,
                    groups: [],
                    keywords: []
                };
            }

            (config.groups || []).forEach(function (group) {
                if (aggregated[label].groups.indexOf(group) === -1) aggregated[label].groups.push(group);
            });

            if (aggregated[label].keywords.indexOf(code) === -1) aggregated[label].keywords.push(code);
        });

        return Object.keys(aggregated).map(function (label) {
            return aggregated[label];
        }).sort(function (a, b) {
            return a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: "base" });
        });
    }

    var SERVICE_FILTER_DEFINITIONS = buildServiceFilterDefinitions();
    var SERVICE_FILTER_BY_ID = {};
    SERVICE_FILTER_DEFINITIONS.forEach(function (definition) {
        SERVICE_FILTER_BY_ID[definition.id] = definition;
    });

    function getServiceDefinition(optionId) {
        return SERVICE_FILTER_BY_ID[optionId] || null;
    }

    function getServiceLabel(optionId) {
        var definition = getServiceDefinition(optionId);
        return definition ? definition.label : getKeywordLabel(optionId);
    }

    function itemMatchesServiceOption(itemKeywords, optionId) {
        var definition = getServiceDefinition(optionId);
        if (!definition) return itemKeywords.indexOf(optionId) !== -1;
        return definition.keywords.some(function (keyword) {
            return itemKeywords.indexOf(keyword) !== -1;
        });
    }

    function matchesSelectedServiceOptions(itemKeywords, selectedValues) {
        if (!selectedValues || !selectedValues.length) return true;
        return selectedValues.every(function (optionId) {
            return itemMatchesServiceOption(itemKeywords, optionId);
        });
    }

    function getAvailableServiceOptionIds(items, filters) {
        var available = [];

        items.forEach(function (item) {
            var itemStar = normalizeStar(item[CFG.fields.star]);
            var itemKeywords = getItemKeywords(item);

            if (!matchesSelectedStars(itemStar, filters.star || [])) return;
            if (!hasAllSelectedKeywords(itemKeywords, filters.tag || [])) return;
            if (!hasAnySelectedKeyword(itemKeywords, filters.tig || [])) return;
            if (!matchesSelectedServiceOptions(itemKeywords, filters.ser || [])) return;

            SERVICE_FILTER_DEFINITIONS.forEach(function (definition) {
                if (itemMatchesServiceOption(itemKeywords, definition.id)) available.push(definition.id);
            });
        });

        return uniq(available).sort(function (a, b) {
            return getServiceLabel(a).localeCompare(getServiceLabel(b), undefined, { numeric: true, sensitivity: "base" });
        });
    }

    function groupServices(optionIds) {
        var groups = {};

        SERVICE_GROUP_ORDER.forEach(function (group) {
            groups[group] = [];
        });

        (optionIds || []).forEach(function (optionId) {
            var definition = getServiceDefinition(optionId);
            if (!definition) return;
            definition.groups.forEach(function (group) {
                if (!groups[group]) groups[group] = [];
                groups[group].push(optionId);
            });
        });

        Object.keys(groups).forEach(function (group) {
            groups[group] = uniq(groups[group]).sort(function (a, b) {
                return getServiceLabel(a).localeCompare(getServiceLabel(b), undefined, { numeric: true, sensitivity: "base" });
            });
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
            .normalize("NFD").toLowerCase()
            .replace(/\b[a-zà-ú]/gi, function (c) { return c.normalize("NFC").toUpperCase(); });
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    function normalizeStar(value) {
        var v = String(value == null ? "" : value).trim().toUpperCase();
        if (!v || v === "ND" || v === "NULL" || v === "UNDEFINED" || v === "N/A") return "OTHER";

        // Raggruppa varianti nella categoria base
        if (v === "2S") return "2";
        if (v === "3S" || v === "3PLUS") return "3";
        if (v === "4S" || v === "4PLUS") return "4";
        if (v === "5S" || v === "5L" || v === "5GL") return "5";
        if (v === "6") return "6";
        if (v === "CLUB VACACIONAL") return "OTHER";

        // Chiavi: rimangono come sono
        if (v.indexOf("CHIAVI") === 0) return v;

        return v;
    }

    function splitKeywords(value) {
        if (Array.isArray(value)) {
            return value.map(function (v) { return String(v || "").trim(); }).filter(Boolean);
        }
        return String(value || "").split("|").map(function (v) { return String(v || "").trim(); }).filter(Boolean);
    }

    function uniq(arr) {
        var map = {}, out = [];
        for (var i = 0; i < arr.length; i++) {
            var val = String(arr[i] || "").trim();
            if (!val || map[val]) continue;
            map[val] = true;
            out.push(val);
        }
        return out;
    }

    function extractItems(data, wId, fId, strategyId) {
        var slots = data && data.slots ? data.slots : [];
        return slots.map(function (slot) {
            if (!slot.item) return null;
            return Object.assign({}, slot.item, {
                _wId: wId,
                _fId: fId,
                _strId: slot.strId  // ← valore reale, non serve più il fallback
            });
        }).filter(Boolean);
    }

    function deduplicateAcrossStrategies(resultsByStrategy) {
        var seenKeys = {};
        var byStrategy = resultsByStrategy.map(function () { return []; });
        resultsByStrategy.forEach(function (items, strategyIndex) {
            items.forEach(function (item) {
                var key = item[CFG.fields.groupId] || item.sku || item.id;
                if (!key || seenKeys[key]) return;
                seenKeys[key] = true;
                byStrategy[strategyIndex].push(item);
            });
        });
        var allItems = [];
        byStrategy.forEach(function (items) { allItems = allItems.concat(items); });
        return { allItems: allItems, byStrategy: byStrategy };
    }

    function getItemKeywords(item) {
        return splitKeywords(item[CFG.fields.keywords]);
    }

    function getStarLabel(value) {
        var v = String(value == null ? "" : value).trim().toUpperCase();
        var starMap = {
            "1": "1 stella",
            "2": "2 stelle",
            "2S": "2 stelle",
            "3": "3 stelle",
            "3PLUS": "3 stelle",
            "3S": "3 stelle",
            "4": "4 stelle",
            "4S": "4 stelle",
            "4PLUS": "4 stelle",
            "5": "5 stelle",
            "5S": "5 stelle",
            "5L": "5 stelle",
            "5GL": "5 stelle",
            "6": "6 stelle",
            "CHIAVI 1": "1 Chiave",
            "CHIAVI 3": "3 Chiavi",
            "CHIAVI 2": "2 Chiavi",
            "CHIAVI 4": "4 Chiavi",
            "CHIAVI 5": "5 Chiavi",
            "CLUB VACACIONAL": "Altro",
            "OTHER": "Altro"
        };
        return starMap[v] || "Altro";
    }

    function getKeywordLabel(code) { return KEYWORD_LABELS[code] || code; }

    function getKeywordGroup(code) {
        var value = String(code || "").trim().toUpperCase();
        if (value.indexOf("TAG/") === 0) return "TAG";
        if (value.indexOf("TIG/") === 0) return "TIG";
        if (value.indexOf("SER/") === 0) return "SER";
        return "";
    }

    function hasAllSelectedKeywords(itemKeywords, selectedValues) {
        if (!selectedValues || !selectedValues.length) return true;
        return selectedValues.every(function (value) { return itemKeywords.indexOf(value) !== -1; });
    }

    function hasAnySelectedKeyword(itemKeywords, selectedValues) {
        if (!selectedValues || !selectedValues.length) return true;
        return selectedValues.some(function (value) { return itemKeywords.indexOf(value) !== -1; });
    }

    function matchesSelectedStars(itemStar, selectedStars) {
        if (!selectedStars || !selectedStars.length) return true;
        return selectedStars.indexOf(itemStar) !== -1;
    }

    function getMultiselectSummary(selectedValues, emptyLabel) {
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
            var label = group === "SER" ? getServiceLabel(code) : getKeywordLabel(code);
            return label.toLowerCase().indexOf(search) !== -1;
        });
    }

    function getAvailableKeywordCodesByGroup(items, group, filters) {
        if (group === "SER") return getAvailableServiceOptionIds(items, filters);

        var values = [];
        items.forEach(function (item) {
            var itemStar = normalizeStar(item[CFG.fields.star]);
            var itemKeywords = getItemKeywords(item);
            if (!matchesSelectedStars(itemStar, filters.star || [])) return;
            if (!hasAllSelectedKeywords(itemKeywords, filters.tag || [])) return;
            if (!hasAnySelectedKeyword(itemKeywords, filters.tig || [])) return;
            if (!matchesSelectedServiceOptions(itemKeywords, filters.ser || [])) return;
            itemKeywords.forEach(function (code) {
                if (getKeywordGroup(code) === group) values.push(code);
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
            if (!matchesSelectedServiceOptions(itemKeywords, filters.ser || [])) return;
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
            return matchesSelectedStars(itemStar, filters.star || []) &&
                hasAllSelectedKeywords(itemKeywords, filters.tag || []) &&
                hasAnySelectedKeyword(itemKeywords, filters.tig || []) &&
                matchesSelectedServiceOptions(itemKeywords, filters.ser || []);
        });
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
        svg.style.height = '10px';
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
            var starMap = {
                "1": 1,
                "2": 2, "2S": 2,
                "3": 3, "3S": 3, "3PLUS": 3,
                "4": 4, "4S": 4, "4PLUS": 4,
                "5": 5, "5S": 5, "5L": 5, "5GL": 5, "6": 5
            };
            var stars = starMap[String(rawStar || "").trim().toUpperCase()] || 0;
            starsContainer.innerHTML = "";
            if (!stars) {
                starsContainer.style.visibility = "hidden";
            } else {
                starsContainer.style.visibility = "visible";
                for (var i = 0; i < stars; i++) starsContainer.appendChild(createStarSVG("#ffd253"));
                for (var j = stars; j < 5; j++) starsContainer.appendChild(createStarSVG("var(--primary-disabled, #d7d9e0)"));
            }
        }
        var scoreContainer = card.querySelector('.score');
        var scoreValueEl = card.querySelector('.score-value');
        if (!scoreContainer || !scoreValueEl) return;
        var rawRating = String(scoreValueEl.textContent || "").trim();
        if (!rawRating || rawRating === "ND") { scoreContainer.remove(); return; }
        var rating = parseInt(rawRating, 10);
        if (isNaN(rating)) { scoreContainer.remove(); return; }
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
                results.forEach(function (item) { if (item && item.codBrand) brandMap[item.codBrand] = item; });
                return brandMap;
            })
            .catch(function () { brandMap = {}; return brandMap; });
    }

    function renderLogos(scope) {
        return getBrandMap().then(function (map) {
            scope.querySelectorAll('.logo').forEach(function (logoEl) {
                var code = String(logoEl.getAttribute("data-brand") || "").trim();
                if (!code || code === 'ND') { logoEl.remove(); return; }
                var brandItem = map[code];
                if (!brandItem || !brandItem.whiteLogo || !brandItem.whiteLogo["@path"]) return;
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
        var name = toTitleCase(item[CFG.fields.name] || "");
        var rating = item[CFG.fields.rating] || "ND";
        var star = item[CFG.fields.star] || "";
        var destination = item[CFG.fields.destination] || "";
        var url = item[CFG.fields.url] || "#";
        var brand = item[CFG.fields.brand] || "";
        var sku = item.sku || item[CFG.fields.groupId] || "";
        var strId = item._strId || "";

        return ''
            + '<div class="card-${dyVariationId} dy-recommendation-product-${dyVariationId}"'
            + ' data-dy-product-id="' + escapeHtml(sku) + '"'
            + ' data-dy-strategy-id="' + escapeHtml(strId) + '">'
            + '  <img src="' + escapeHtml(image) + '" class="card-image" />'
            + '  <div class="logo" data-brand="' + escapeHtml(brand) + '">' + escapeHtml(brand) + '</div>'
            + '  <div class="card-content-${dyVariationId}">'
            + '    <div class="card-info-${dyVariationId}"><h2 class="card-title-${dyVariationId}">' + escapeHtml(name) + '</h2></div>'
            + '    <div class="rating-row"><div class="stars" data-star="' + escapeHtml(star) + '"></div>'
            + '    <div class="score"><span class="score-value">' + escapeHtml(rating) + '</span></div></div>'
            + '    <div class="location-${dyVariationId}">'
            + '      <svg xmlns="http://www.w3.org/2000/svg" style="width:16px;height:16px" width="20" height="20" viewBox="0 0 20 20" fill="#FFFFFF"><path d="M9.99972 1C13.3087 1 16 3.69125 16 7.00028C16 9.70816 13.9293 12.67 12.2651 15.0496C11.2996 16.4299 10.3885 17.737 10.3874 18.3492C10.3874 18.5611 10.2182 18.7457 10.0053 18.7457H10.0003C9.78844 18.7457 9.61597 18.5755 9.6132 18.3636V18.3514C9.60488 17.7425 8.70262 16.4527 7.74768 15.0879C6.07736 12.7022 4 9.73201 4 7.00028C4 3.69125 6.6907 1 9.99972 1ZM9.99972 1.77416C7.11826 1.77416 4.7736 4.11881 4.7736 7.00028C4.7736 9.48856 6.77333 12.3473 8.38098 14.6443C9.04866 15.5992 9.63205 16.4321 9.99584 17.1303C10.3602 16.4233 10.953 15.5765 11.6301 14.606C13.2322 12.3151 15.2258 9.46361 15.2258 7.00028C15.2258 4.11881 12.8812 1.77416 9.99972 1.77416ZM9.99972 4.61569C11.3872 4.61569 12.5168 5.74421 12.5168 7.13171C12.5168 8.5192 11.3872 9.64883 9.99972 9.64883C8.61223 9.64883 7.4826 8.5192 7.4826 7.13171C7.4826 5.74421 8.61223 4.61569 9.99972 4.61569ZM9.99972 5.38985C9.03868 5.38985 8.25787 6.17122 8.25787 7.13171C8.25787 8.09275 9.03813 8.87412 9.99972 8.87412C10.9613 8.87412 11.7416 8.09275 11.7416 7.13171C11.7416 6.17177 10.9613 5.38985 9.99972 5.38985Z" fill="#FFFFFF"/></svg>'
            + '      <div>' + escapeHtml(destination) + '</div>'
            + '    </div>'
            + '    <a target="_blank" rel="noopener noreferrer" class="url-button" href="' + escapeHtml(url) + '" style="text-decoration:auto">'
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
            return '<div class="dy-skeleton-card-${dyVariationId}">'
                + '<div class="dy-skeleton-shimmer-${dyVariationId}"></div>'
                + '<div class="dy-skeleton-content-${dyVariationId}">'
                + '<div class="dy-skeleton-line-${dyVariationId} w-70"></div>'
                + '<div class="dy-skeleton-line-${dyVariationId} w-45"></div>'
                + '<div class="dy-skeleton-line-${dyVariationId} w-55"></div>'
                + '<div class="dy-skeleton-button-${dyVariationId} w-100"></div>'
                + '</div></div>';
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
        wrapper.querySelectorAll('.card-${dyVariationId}').forEach(function (card) { renderRatingRow(card); });
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

    function registerTrackingElements() {
        var wrapper = container.querySelector('.dy-recommendations__slider-wrapper');
        if (!wrapper || !state.byStrategy) return;

        container.querySelectorAll('.dy-tracking-wrapper').forEach(function (el) {
            el.parentNode.removeChild(el);
        });

        var firstStrategy = null;
        for (var i = 0; i < state.byStrategy.length; i++) {
            if (state.byStrategy[i].length > 0) {
                firstStrategy = state.byStrategy[i];
                break;
            }
        }
        if (!firstStrategy) return;

        var first = firstStrategy[0];
        wrapper.setAttribute('data-dy-widget-id', first._wId);
        wrapper.setAttribute('data-dy-feed-id', first._fId);

        if (typeof DYO !== 'undefined' && DYO.recommendations && DYO.recommendations.registerElements) {
            DYO.recommendations.registerElements(wrapper);
        }
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
        return '<label class="dy-multiselect-option-${dyVariationId}" style="cursor:pointer;display:flex;align-items:center;gap:6px;padding:4px 0;width:100%;">'
            + '<input type="checkbox" value="' + escapeHtml(value) + '" data-group="star" ' + checked + '>'
            + '<span style="flex:1;">' + escapeHtml(getStarLabel(value)) + '</span></label>';
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
        var groupId = getServiceGroupDomId("grp-", group);
        var isOpen = hasSearch ? true : !!state.openSerGroups[groupId];
        var bodyClass = isOpen ? "dy-group-body" : "dy-group-body hidden";
        var arrow = isOpen ? "&minus;" : "&plus;";
        html += '<div class="dy-group">'
            + '<div class="dy-group-header" data-group="' + escapeHtml(groupId) + '">'
            + '<span>' + escapeHtml(group) + '</span><span class="arrow">' + arrow + '</span></div>'
            + '<div class="' + bodyClass + '" id="' + escapeHtml(groupId) + '">';
        groups[group].forEach(function (code) {
            var checked = selectedValues.indexOf(code) !== -1 ? "checked" : "";
            html += '<label class="dy-multiselect-option-${dyVariationId}" style="cursor:pointer;display:flex;align-items:center;gap:6px;padding:4px 0;width:100%;">'
                + '<input type="checkbox" value="' + escapeHtml(code) + '" data-group="ser" ' + checked + '>'
                + '<span style="flex:1;">' + escapeHtml(getServiceLabel(code)) + '</span></label>';
        });
        html += '</div></div>';
    });
    containerEl.innerHTML = html || '<div class="dy-multiselect-empty-${dyVariationId}">Nessun servizio</div>';
}

    function renderMultiSelectOptions(groupKey, values, selectedValues, emptyLabel) {
    if (groupKey === "ser") { renderServiceOptions(values, selectedValues); return; }
    if (groupKey === "star") { renderStarOptions(values, selectedValues); return; }
    var containerEl = container.querySelector('[data-options="' + groupKey + '"]');
    if (!containerEl) return;
    if (!values || !values.length) {
        containerEl.innerHTML = '<div class="dy-multiselect-empty-${dyVariationId}">' + escapeHtml(emptyLabel) + '</div>';
        return;
    }
    var html = values.map(function (code) {
        var checked = selectedValues.indexOf(code) !== -1 ? "checked" : "";
        return '<label class="dy-multiselect-option-${dyVariationId}" style="cursor:pointer;display:flex;align-items:center;gap:6px;padding:4px 0;width:100%;">'
            + '<input type="checkbox" value="' + escapeHtml(code) + '" data-group="' + groupKey + '" ' + checked + '>'
            + '<span style="flex:1;">' + escapeHtml(getKeywordLabel(code)) + '</span></label>';
    }).join('');
    containerEl.innerHTML = html;
}

    // FIX 3: renderMobileOptions per "ser" ora genera accordion chiusi per gruppo,
    // con toggle gestito via delegazione eventi sul pannello mobile.
    function renderMobileOptions(groupKey, values, selectedValues) {
        var containerEl = container.querySelector('[data-mobile-options="' + groupKey + '"]');
        if (!containerEl) return;
        if (!values || !values.length) {
            containerEl.innerHTML = '<div style="font-size:13px;color:#7b808c;padding:8px 0">Nessuna opzione disponibile</div>';
            return;
        }

        var html = '';

        if (groupKey === 'ser') {
            var groups = groupServices(values);
            var searchTerm = String(state.searchSer || '').trim().toLowerCase();

            Object.keys(groups).forEach(function (group) {
                var codes = groups[group];
                if (!codes.length) return;

                if (searchTerm) {
                    codes = codes.filter(function (c) {
                        return getServiceLabel(c).toLowerCase().indexOf(searchTerm) !== -1;
                    });
                    if (!codes.length) return;
                }

                // FIX 3: ogni gruppo inizia chiuso (a meno che la ricerca non sia attiva)
                var groupKey2 = getServiceGroupDomId('mob-ser-grp-', group);
                var isOpen = searchTerm ? true : !!state.openMobileSerGroups[groupKey2];

                html += '<div class="dy-mob-ser-group" data-mob-ser-group="' + escapeHtml(groupKey2) + '">'
                    + '<div class="dy-mob-ser-group-header" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0 10px 7px;cursor:pointer;font-size:16px;font-weight:600;color:#002D72;letter-spacing:0.5px;border-bottom:1px solid #eef1f5;">'
                    + '<span>' + escapeHtml(group) + '</span>'
                    + '<span class="dy-mob-ser-arrow" style="font-size:18px;font-weight:300;color:#002d72;line-height:1">' + (isOpen ? '&minus;' : '&plus;') + '</span>'
                    + '</div>'
                    + '<div class="dy-mob-ser-group-body"' + (isOpen ? '' : ' style="display:none"') + '>';

                codes.forEach(function (code) {
                    var checked = selectedValues.indexOf(code) !== -1 ? "checked" : "";
                    html += '<label style="display:flex;align-items:center;gap:8px;padding:7px 0;cursor:pointer;font-size:16px;color:#000000">'
                        + '<input type="checkbox" value="' + escapeHtml(code) + '" data-group="ser" data-mobile="1" ' + checked + '>'
                        + '<span>' + escapeHtml(getServiceLabel(code)) + '</span>'
                        + '</label>';
                });

                html += '</div></div>';
            });

            containerEl.innerHTML = html || '<div style="font-size:13px;color:#7b808c;padding:8px 0">Nessun servizio trovato</div>';

            // Stile checkbox
            containerEl.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
                applyCbStyle(cb);
            });
            return;
        }

        values.forEach(function (code) {
            var checked = selectedValues.indexOf(code) !== -1 ? "checked" : "";
            var label = (groupKey === 'star') ? escapeHtml(getStarLabel(code)) : escapeHtml(getKeywordLabel(code));
           html += '<label style="display:flex;align-items:center;gap:8px;padding:7px 0;cursor:pointer;font-size:16px;color:#000000">'
                + '<input type="checkbox" value="' + escapeHtml(code) + '" data-group="' + groupKey + '" data-mobile="1" ' + checked + '>'
                + '<span>' + label + '</span></label>';
        });

        containerEl.innerHTML = html;

        containerEl.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
            applyCbStyle(cb);
        });
    }

    function applyCbStyle(cb) {
        cb.style.cssText = 'appearance:none;-webkit-appearance:none;width:20px;height:20px;min-width:18px;border:1px solid #808588002d72;border-radius:4px;background:' + (cb.checked ? '#002d72' : '#fff') + ';cursor:pointer;position:relative;margin:0;flex-shrink:0;';
        cb.addEventListener('change', function () {
            cb.style.background = cb.checked ? '#002d72' : '#fff';
        });
    }

    function refreshMobileOptions() {
        var availableStars = getAvailableStars(state.allItems, { tag: state.selectedTag, tig: state.selectedTig, ser: state.selectedSer });
        var availableTags = getAvailableKeywordCodesByGroup(state.allItems, "TAG", { star: state.selectedStar, tag: [], tig: state.selectedTig, ser: state.selectedSer });
        var availableTigs = getAvailableKeywordCodesByGroup(state.allItems, "TIG", { star: state.selectedStar, tag: state.selectedTag, tig: [], ser: state.selectedSer });
        var availableSers = getVisibleKeywordCodesByGroup(state.allItems, "SER", { star: state.selectedStar, tag: state.selectedTag, tig: state.selectedTig, ser: [] }, state.searchSer);
        renderMobileOptions('star', availableStars, state.selectedStar);
        renderMobileOptions('tag', availableTags, state.selectedTag);
        renderMobileOptions('tig', availableTigs, state.selectedTig);
        renderMobileOptions('ser', availableSers, state.selectedSer);
    }

    // FIX 1: renderActiveChips ora usa solo i chip senza il bottone "Rimuovi i filtri"
    // perché quello è già nel DOM originale e gestito tramite delegazione.
    function renderActiveChips() {
        var chipsContainer = container.querySelector('.dy-active-chips-${dyVariationId}');
        if (!chipsContainer) return;

        var allSelected = [];
        state.selectedStar.forEach(function (v) { allSelected.push({ group: 'star', value: v, label: getStarLabel(v) }); });
        state.selectedTag.forEach(function (v) { allSelected.push({ group: 'tag', value: v, label: getKeywordLabel(v) }); });
        state.selectedTig.forEach(function (v) { allSelected.push({ group: 'tig', value: v, label: getKeywordLabel(v) }); });
        state.selectedSer.forEach(function (v) { allSelected.push({ group: 'ser', value: v, label: getServiceLabel(v) }); });

        if (!allSelected.length) {
            chipsContainer.classList.add('hidden');
            // FIX 1: svuota solo i chip, lasciando il bottone reset intatto
            var chips = chipsContainer.querySelectorAll('.dy-chip-${dyVariationId}');
            chips.forEach(function (c) { c.parentNode.removeChild(c); });
            return;
        }

        chipsContainer.classList.remove('hidden');

        // FIX 1: ricostruisce solo i chip; il bottone "Rimuovi i filtri" è già nel DOM
        // e viene aggiornato via updateResetButtonState(), non riscritto.
        var existingChips = chipsContainer.querySelectorAll('.dy-chip-${dyVariationId}');
        existingChips.forEach(function (c) { c.parentNode.removeChild(c); });

        var resetBtn = chipsContainer.querySelector('.dy-filter-reset-${dyVariationId}');

        var html = allSelected.map(function (item) {
            return '<span class="dy-chip-${dyVariationId}">'
                + '<span>' + escapeHtml(item.label) + '</span>'
                + '<button type="button" class="dy-chip-remove-${dyVariationId}" data-chip-group="' + escapeHtml(item.group) + '" data-chip-value="' + escapeHtml(item.value) + '" aria-label="Rimuovi ' + escapeHtml(item.label) + '">&#x2715;</button>'
                + '</span>';
        }).join('');

        // Inserisce i chip prima del bottone reset (se presente), altrimenti in fondo
        if (resetBtn) {
            resetBtn.insertAdjacentHTML('beforebegin', html);
        } else {
            chipsContainer.insertAdjacentHTML('beforeend', html);
        }
    }

    function updateResetButtonState() {
        // FIX 1: cerca il bottone ovunque nel container (funziona anche se è dentro .dy-active-chips)
        container.querySelectorAll('.dy-filter-reset-${dyVariationId}').forEach(function (resetBtn) {
            var hasFilters = state.selectedStar.length > 0 || state.selectedTag.length > 0
                || state.selectedTig.length > 0 || state.selectedSer.length > 0;
            if (hasFilters) {
                resetBtn.classList.remove('dy-filter-reset-inactive-${dyVariationId}');
                resetBtn.classList.add('dy-filter-reset-active-${dyVariationId}');
            } else {
                resetBtn.classList.remove('dy-filter-reset-active-${dyVariationId}');
                resetBtn.classList.add('dy-filter-reset-inactive-${dyVariationId}');
            }
        });
    }

    function updateMultiSelectTrigger(group, selectedValues, emptyLabel) {
        var root = container.querySelector('.dy-multiselect-${dyVariationId}[data-filter-group="' + group + '"]');
        if (!root) return;
        var textEl = root.querySelector('.dy-multiselect-trigger-text-${dyVariationId}');
        if (!textEl) return;
        textEl.textContent = getMultiselectSummary(selectedValues, emptyLabel);
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
        container.querySelectorAll('.dy-multiselect-dropdown-${dyVariationId}').forEach(function (el) { el.classList.add('hidden'); });
        state.activeDropdownGroup = "";
        resetAllTriggerIcons();
    }

    function refreshFiltersAndProducts() {
        var emptyState = container.querySelector('.dy-empty-state-${dyVariationId}');
        var sliderEl = container.querySelector('.dy-recommendations__slider-${dyVariationId}');

        var availableStars = getAvailableStars(state.allItems, { tag: state.selectedTag, tig: state.selectedTig, ser: state.selectedSer });
        var availableTags = getAvailableKeywordCodesByGroup(state.allItems, "TAG", { star: state.selectedStar, tag: [], tig: state.selectedTig, ser: state.selectedSer });
        var availableTigs = getAvailableKeywordCodesByGroup(state.allItems, "TIG", { star: state.selectedStar, tag: state.selectedTag, tig: [], ser: state.selectedSer });
        var availableSers = getVisibleKeywordCodesByGroup(state.allItems, "SER", { star: state.selectedStar, tag: state.selectedTag, tig: state.selectedTig, ser: [] }, state.searchSer);

        state.selectedStar = state.selectedStar.filter(function (v) { return availableStars.indexOf(v) !== -1; });
        state.selectedTag = state.selectedTag.filter(function (v) { return availableTags.indexOf(v) !== -1; });
        state.selectedTig = state.selectedTig.filter(function (v) { return availableTigs.indexOf(v) !== -1; });
        state.selectedSer = state.selectedSer.filter(function (v) {
            return getAvailableKeywordCodesByGroup(state.allItems, "SER", { star: state.selectedStar, tag: state.selectedTag, tig: state.selectedTig, ser: [] }).indexOf(v) !== -1;
        });

        renderMultiSelectOptions("star", availableStars, state.selectedStar, "Nessuna stella");
        renderMultiSelectOptions("tag", availableTags, state.selectedTag, "Nessuna caratteristica");
        renderMultiSelectOptions("tig", availableTigs, state.selectedTig, "Nessuna tipologia");
        renderMultiSelectOptions("ser", availableSers, state.selectedSer, "Nessun servizio");

        updateMultiSelectTrigger("star", state.selectedStar, "Tutte le stelle");
        updateMultiSelectTrigger("tag", state.selectedTag, "Tutte le caratteristiche");
        updateMultiSelectTrigger("tig", state.selectedTig, "Tutte le tipologie");
        updateMultiSelectTrigger("ser", state.selectedSer, "Tutti i servizi");

        refreshMobileOptions();
        renderActiveChips();
        updateResetButtonState();

        state.filteredItems = filterItems(state.allItems, { star: state.selectedStar, tag: state.selectedTag, tig: state.selectedTig, ser: state.selectedSer });

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
            if (activeRoot) openDropdown(activeRoot);
        }

        renderProducts(state.filteredItems);
    }

    function fetchStrategy(strategyId) {
        return new Promise(function (resolve) {
            DYO.recommendationWidgetData(strategyId, { maxProducts: CFG.maxProductsPerStrategy }, function (err, data) {
                if (err) { resolve([]); return; }
                var wId = data.wId;
                var fId = data.fId;
                resolve(extractItems(data, wId, fId, strategyId));
            });
        });
    }
    function fetchAllStrategies() {
        return Promise.all(CFG.strategyIds.map(function (strategyId) { return fetchStrategy(strategyId); }))
            .then(function (results) { return deduplicateAcrossStrategies(results); });
    }

    var ICON_OPEN = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.164063 9.78774L6.59181 3.43262C6.81625 3.2108 7.18375 3.2108 7.40819 3.43262L13.8359 9.78774C13.9427 9.89318 14 10.0332 14 10.1771C14 10.3211 13.9427 10.4611 13.8359 10.5665L13.7563 10.6321C13.5319 10.7857 13.2191 10.7634 13.0196 10.5665L7 4.61387L0.980437 10.5665C0.756 10.7883 0.3885 10.7883 0.164063 10.5665C-0.0546875 10.3499 -0.0546874 10.0043 0.164063 9.78774Z" fill="#002d72"/></svg>';
    var ICON_CLOSED = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.8359 4.21226L7.40819 10.5674C7.18375 10.7892 6.81625 10.7892 6.59181 10.5674L0.164062 4.21226C0.0573125 4.10682 0 3.96682 0 3.82289C0 3.67895 0.0573125 3.53895 0.164062 3.43351L0.243687 3.36789C0.468125 3.21432 0.780937 3.23664 0.980437 3.43351L7 9.38614L13.0196 3.43351C13.244 3.2117 13.6115 3.2117 13.8359 3.43351C14.0547 3.65007 14.0547 3.9957 13.8359 4.21226Z" fill="#002d72"/></svg>';

function updateTriggerIcon(root, forceOpen) {
    var dropdown = root.querySelector('.dy-multiselect-dropdown-${dyVariationId}');
    var iconEl = root.querySelector('.dy-trigger-icon-${dyVariationId}');
    if (!iconEl) return;
    var isOpen = (forceOpen !== undefined) ? forceOpen : (dropdown && !dropdown.classList.contains('hidden'));
    iconEl.innerHTML = isOpen ? ICON_OPEN : ICON_CLOSED;
}


function openDropdown(root) {
    var dropdown = root.querySelector('.dy-multiselect-dropdown-${dyVariationId}');
    if (!dropdown) return;
    container.querySelectorAll('.dy-multiselect-dropdown-${dyVariationId}').forEach(function (el) {
        if (el !== dropdown) el.classList.add('hidden');
    });
    container.querySelectorAll('.dy-multiselect-${dyVariationId}').forEach(function (r) {
        if (r !== root) updateTriggerIcon(r, false);
    });
    dropdown.classList.remove('hidden');
    state.activeDropdownGroup = root.getAttribute('data-filter-group') || "";
    updateTriggerIcon(root, true);  // ← passa true esplicitamente
    var input = root.querySelector('.dy-multiselect-search-${dyVariationId}');
    if (input) input.focus();
}


function closeAllDropdowns() {
    container.querySelectorAll('.dy-multiselect-dropdown-${dyVariationId}').forEach(function (el) { el.classList.add('hidden'); });
    state.activeDropdownGroup = "";
    container.querySelectorAll('.dy-multiselect-${dyVariationId}').forEach(function (root) {
        updateTriggerIcon(root, false);  // ← passa false esplicitamente
    });
}

    function resetAllTriggerIcons() {
        container.querySelectorAll('.dy-multiselect-${dyVariationId}').forEach(function (root) { updateTriggerIcon(root); });
    }

    function hasActiveFilters() {
        return state.selectedStar.length > 0 ||
            state.selectedTag.length > 0 ||
            state.selectedTig.length > 0 ||
            state.selectedSer.length > 0;
    }

    function getSelectedFilterLabels() {
        return {
            Stelle: state.selectedStar.map(getStarLabel),
            Caratteristiche: state.selectedTag.map(getKeywordLabel),
            "Tipologia Hotel": state.selectedTig.map(getKeywordLabel),
            Servizi: state.selectedSer.map(getServiceLabel)
        };
    }

    function resetAllFilters() {
        state.selectedStar = [];
        state.selectedTag = [];
        state.selectedTig = [];
        state.selectedSer = [];
        state.searchSer = "";
        state.openSerGroups = {};
        state.openMobileSerGroups = {};
        container.querySelectorAll('.dy-multiselect-search-${dyVariationId}').forEach(function (input) { input.value = ""; });
        var mobileSearch = container.querySelector('.dy-mobile-search-ser-${dyVariationId}');
        if (mobileSearch) mobileSearch.value = "";
        refreshFiltersAndProducts();
        closeAllDropdowns();
    }

    function preventSwiperInterference() {
        var filtersDesktop = container.querySelector('.dy-filters-desktop-${dyVariationId}');
        var filtersMobile = container.querySelector('.dy-filters-mobile-${dyVariationId}');
        var chipsContainer = container.querySelector('.dy-active-chips-${dyVariationId}');

        [filtersDesktop, filtersMobile, chipsContainer].forEach(function (el) {
            if (!el) return;
            
    ['touchstart', 'touchmove', 'touchend'].forEach(function (eventType) {
         el.addEventListener(eventType, function (e) {
            e.stopPropagation();
              }, { passive: false });
              });
            });
        }

    function initEvents() {
        preventSwiperInterference();
        container.querySelectorAll('.dy-multiselect-${dyVariationId}').forEach(function (root) {
    var iconEl = root.querySelector('.dy-trigger-icon-${dyVariationId}');
    if (iconEl) iconEl.innerHTML = ICON_CLOSED;
});
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
                    updateTriggerIcon(root);
                });
            }

            if (searchInput) {
                searchInput.addEventListener('input', function () {
                    if (group === 'ser') state.searchSer = this.value;
                    refreshFiltersAndProducts();
                    openDropdown(root);
                });
                searchInput.addEventListener('click', function (e) { e.stopPropagation(); });
            }
        });

        container.addEventListener('change', function (e) {
            var checkbox = e.target;
            if (!checkbox || checkbox.tagName !== 'INPUT' || checkbox.type !== 'checkbox') return;
            if (checkbox.getAttribute('data-mobile') === '1') return;
            var option = checkbox.closest('.dy-multiselect-option-${dyVariationId}');
            if (!option) return;
            var group = checkbox.getAttribute('data-group');
            var value = checkbox.value;
            if (group === 'star') state.selectedStar = toggleArrayValue(state.selectedStar, value);
            if (group === 'tag') state.selectedTag = toggleArrayValue(state.selectedTag, value);
            if (group === 'tig') state.selectedTig = toggleArrayValue(state.selectedTig, value);
            if (group === 'ser') state.selectedSer = toggleArrayValue(state.selectedSer, value);
            refreshFiltersAndProducts();
            var multiselectRoot = checkbox.closest('.dy-multiselect-${dyVariationId}');
            if (multiselectRoot) openDropdown(multiselectRoot);
        });

        // FIX 1: delegazione per il bottone "Rimuovi i filtri" nei chip
        // cattura click su qualsiasi .dy-filter-reset dentro il container,
        // compresi quelli ricreati dinamicamente
        container.addEventListener('click', function (e) {
            var resetBtn = e.target.closest('.dy-filter-reset-${dyVariationId}');
            if (!resetBtn) return;
            if (resetBtn.classList.contains('dy-filter-reset-inactive-${dyVariationId}')) return;
            resetAllFilters();
        });

        container.addEventListener('click', function (e) {
            var resetSingle = e.target.closest('.dy-multiselect-reset-${dyVariationId}');
            if (!resetSingle) return;
            e.stopPropagation();
            var group = resetSingle.getAttribute('data-reset-group');
            if (group === 'star') state.selectedStar = [];
            if (group === 'tag') state.selectedTag = [];
            if (group === 'tig') state.selectedTig = [];
            if (group === 'ser') {
                state.selectedSer = [];
                state.searchSer = "";
                state.openSerGroups = {};
                var searchInput = container.querySelector('.dy-multiselect-${dyVariationId}[data-filter-group="ser"] .dy-multiselect-search-${dyVariationId}');
                if (searchInput) searchInput.value = "";
            }
            refreshFiltersAndProducts();
            var root = container.querySelector('.dy-multiselect-${dyVariationId}[data-filter-group="' + group + '"]');
            if (root) openDropdown(root);
        });

        container.addEventListener('click', function (e) {
            var header = e.target.closest('.dy-group-header');
            if (!header) return;
            e.stopPropagation();
            if (String(state.searchSer || "").trim()) return;
            var targetId = header.getAttribute('data-group');
            var body = document.getElementById(targetId);
            var arrow = header.querySelector('.arrow');
            if (!body || !arrow) return;
            if (body.classList.contains('hidden')) {
                body.classList.remove('hidden');
                arrow.innerHTML = '&minus;';
                state.openSerGroups[targetId] = true;
            } else {
                body.classList.add('hidden');
                arrow.innerHTML = '&plus;';
                state.openSerGroups[targetId] = false;
            }
        });

        document.addEventListener('click', function (e) {
            var clickedOnTrigger = !!e.target.closest('.dy-multiselect-trigger-${dyVariationId}');
            var clickedInsideDropdown = !!e.target.closest('.dy-multiselect-dropdown-${dyVariationId}');
            if (!clickedOnTrigger && !clickedInsideDropdown) closeAllDropdowns();
        });

        container.addEventListener('click', function (e) {
            var chipRemove = e.target.closest('.dy-chip-remove-${dyVariationId}');
            if (!chipRemove) return;
            var group = chipRemove.getAttribute('data-chip-group');
            var value = chipRemove.getAttribute('data-chip-value');
            if (group === 'star') state.selectedStar = state.selectedStar.filter(function (v) { return v !== value; });
            if (group === 'tag') state.selectedTag = state.selectedTag.filter(function (v) { return v !== value; });
            if (group === 'tig') state.selectedTig = state.selectedTig.filter(function (v) { return v !== value; });
            if (group === 'ser') state.selectedSer = state.selectedSer.filter(function (v) { return v !== value; });
            refreshFiltersAndProducts();
        });

        // FIX 2: toggle icona mobile corretto — l'SVG del filtro non ha la classe
        // "dy-mobile-icon-filter-..." nel markup originale. Si fa riferimento diretto
        // agli SVG figli del bottone toggle tramite indice/ordine.
        document.addEventListener('click', function (e) {
            var mobileBar = e.target.closest('.dy-mobile-filter-bar-${dyVariationId}');
            if (!mobileBar) return;

            var mobilePanel = container.querySelector('.dy-mobile-filter-panel-${dyVariationId}');
            if (mobilePanel) mobilePanel.classList.toggle('hidden');

            var isOpen = mobilePanel && !mobilePanel.classList.contains('hidden');

            // FIX 2: seleziona i due SVG figli del toggle button per indice
            var toggleBtn = container.querySelector('.dy-mobile-filter-toggle-${dyVariationId}');
            if (toggleBtn) {
                var svgs = toggleBtn.querySelectorAll('svg');
                if (svgs.length >= 2) {
                    // svgs[0] = icona filtri (righe), svgs[1] = freccia chevron
                    svgs[0].classList.toggle('hidden', isOpen);
                    svgs[1].classList.toggle('hidden', !isOpen);
                }
            }
        });

        document.addEventListener('click', function (e) {
            var sectionHeader = e.target.closest('.dy-mobile-section-header-${dyVariationId}');
            if (!sectionHeader) return;
            var section = sectionHeader.closest('.dy-mobile-section-${dyVariationId}');
            if (!section) return;
            var body = section.querySelector('.dy-mobile-section-body-${dyVariationId}');
            var icon = sectionHeader.querySelector('.dy-mobile-section-icon-${dyVariationId}');
            if (!body || !icon) return;
            if (body.classList.contains('hidden')) {
                body.classList.remove('hidden');
                icon.textContent = '-';
                icon.classList.add('dy-mobile-section-icon-open-${dyVariationId}');
                sectionHeader.classList.add('open');
            } else {
                body.classList.add('hidden');
                icon.textContent = '\u002B';
                icon.classList.remove('dy-mobile-section-icon-open-${dyVariationId}');
                sectionHeader.classList.remove('open');
            }
        });

        container.addEventListener('change', function (e) {
            var checkbox = e.target;
            if (!checkbox || checkbox.tagName !== 'INPUT' || checkbox.type !== 'checkbox') return;
            if (checkbox.getAttribute('data-mobile') !== '1') return;
            var group = checkbox.getAttribute('data-group');
            var value = checkbox.value;
            if (group === 'star') state.selectedStar = toggleArrayValue(state.selectedStar, value);
            if (group === 'tag') state.selectedTag = toggleArrayValue(state.selectedTag, value);
            if (group === 'tig') state.selectedTig = toggleArrayValue(state.selectedTig, value);
            if (group === 'ser') state.selectedSer = toggleArrayValue(state.selectedSer, value);
            checkbox.style.background = checkbox.checked ? '#002d72' : '#fff';
            refreshFiltersAndProducts();
        });

        // FIX 3: delegazione click per accordion gruppi servizi mobile
        container.addEventListener('click', function (e) {
            var groupHeader = e.target.closest('.dy-mob-ser-group-header');
            if (!groupHeader) return;
            var groupWrapper = groupHeader.closest('.dy-mob-ser-group');
            if (!groupWrapper) return;
            var groupKey2 = groupWrapper.getAttribute('data-mob-ser-group');
            var body = groupWrapper.querySelector('.dy-mob-ser-group-body');
            var arrow = groupHeader.querySelector('.dy-mob-ser-arrow');
            if (!body) return;
            var isNowOpen = body.style.display === 'none' || body.style.display === '';
            if (isNowOpen) {
                body.style.display = 'block';
                if (arrow) arrow.innerHTML = '&minus;';
                state.openMobileSerGroups[groupKey2] = true;
            } else {
                body.style.display = 'none';
                if (arrow) arrow.innerHTML = '&plus;';
                state.openMobileSerGroups[groupKey2] = false;
            }
        });

        var mobileSearchSer = container.querySelector('.dy-mobile-search-ser-${dyVariationId}');
        if (mobileSearchSer) {
            mobileSearchSer.addEventListener('input', function () {
                state.searchSer = this.value;
                refreshMobileOptions();
            });
        }

        container.addEventListener('click', function (e) {
            var mobileResetGroup = e.target.closest('.dy-mobile-reset-group-${dyVariationId}');
            if (!mobileResetGroup) return;
            var group = mobileResetGroup.getAttribute('data-reset-group');
            if (group === 'star') state.selectedStar = [];
            if (group === 'tag') state.selectedTag = [];
            if (group === 'tig') state.selectedTig = [];
            if (group === 'ser') {
                state.selectedSer = [];
                state.searchSer = "";
                state.openMobileSerGroups = {};
                var mobileSearch = container.querySelector('.dy-mobile-search-ser-${dyVariationId}');
                if (mobileSearch) mobileSearch.value = "";
            }
            refreshFiltersAndProducts();
        });

        var mobileResetAll = container.querySelector('.dy-mobile-reset-all-${dyVariationId}');
        if (mobileResetAll) {
            mobileResetAll.addEventListener('click', function () { resetAllFilters(); });
        }
    }

    function initSlider() {
        var SWIPER_JS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.4.6/js/swiper.js';
        return appendJSFile(SWIPER_JS_URL).then(function () { swiperReady = true; });
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
        if (str[0].length >= 5) str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1' + integrSeperator);
        if (str[1] && str[1].length >= 5) str[1] = str[1].replace(/(\d{3})/g, '$1 ');
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
        var settings = [
            { el: '.dy-recommendations-slider-pagination', data: { 'dy-hide--d': !ENABLE_PAGINATION_DESKTOP, 'dy-hide--t': !ENABLE_PAGINATION_TABLET, 'dy-hide--m': !ENABLE_PAGINATION_MOBILE } },
            { el: '.dy-recommendations-slider-arrows', data: { 'dy-hide--d': !ENABLE_ARROWS_DESKTOP, 'dy-hide--t': !ENABLE_ARROWS_TABLET, 'dy-hide--m': !ENABLE_ARROWS_MOBILE } }
        ];
        settings.forEach(function (item) {
            var el = container.querySelector(item.el);
            if (!el) return;
            for (var key in item.data) { if (item.data[key]) el.classList.add(key); }
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

        // FIX 4 (nuovo)
        // Su mobile mostriamo 1 card + un peek del ~15% della card successiva,
        // tutto entro i margini del container (margin: 0 30px → 60px totali).
        var availableWidth = window.innerWidth - 60; // 30px margine per lato dal container
        var cardWidth = 318;
        // quante card intere entrano + 0.15 di peek, mai più di availableWidth/cardWidth
        var slidesPerViewMobile = Math.min(
            availableWidth / cardWidth,
            Math.floor(availableWidth / cardWidth) + 0.15
        );
        var slidesPerView = window.innerWidth < 1140
            ? Math.max(1.15, slidesPerViewMobile)
            : 3.4;

        return {
            freeMode: true,
            touchStartPreventDefault: false,
            loop: ENABLE_LOOP,
            loopAdditionalSlides: 0,
            autoplay: ENABLE_AUTOPLAY && { delay: AUTOPLAY_SPEED },
            spaceBetween: 15,
            slidesPerView: slidesPerView,
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
                renderBullet: function (index, className) { return '<div class="' + className + '"></div>'; }
            },
            a11y: { notificationClass: 'dy-recommendations-slider--aria-notification' },
            slideClass: 'dy-recommendation-product-${dyVariationId}',
            wrapperClass: 'dy-recommendations__slider-wrapper',
            containerModifierClass: 'dy-recommendations__slider-${dyVariationId}'
        };
    }

    function appendJSFile(url) {
        return DYO.Q.Promise(function (resolve, reject) {
            if (typeof define === 'function' && define.amd) {
                require([url], function (swiper) { window.Swiper = swiper; resolve(); });
                return;
            }
            if (window.Swiper) { resolve(); return; }
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
        updateResetButtonState();
        renderSkeletonCards();
        fetchAllStrategies().then(function (result) {
            state.allItems = result.allItems;
            state.byStrategy = result.byStrategy;
            state.initialLoadDone = true;
            refreshFiltersAndProducts();
            registerTrackingElements();
        });
    }

    initSlider().then(boot);

    document.addEventListener('click', function (e) {
        var button = e.target.closest('.url-button');
        if (button && container.contains(button)) {
            if (window.DY && DY.API) {
                if (hasActiveFilters()) {
                    DY.API('event', {
                        name: 'click_RTCards_AfterFilter',
                        properties: getSelectedFilterLabels()
                    });
                }
                DY.API('event', { name: 'clickCTAcarosello_${dyExperienceId}' });
            }
        }
    });
})();
