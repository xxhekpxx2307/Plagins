(function () {
    'use strict';

    // ЗМІНИ ДЛЯ УСУНЕННЯ КОНФЛІКТУ
    const PLUGIN_NAMESPACE = 'qual9ua';
    const CLASS_QUALITY    = 'qual9ua_quality';
    const GLOBAL_FLAG_NAME = 'qual9ua_UA_Quality_Active';
    const LOG_PREFIX       = "[qual9ua_UA]";

    // Polyfills
    if (typeof AbortController === 'undefined') {
        window.AbortController = function () {
            this.signal = { aborted: false, addEventListener: function(e, cb) { if (e==='abort') this._onabort=cb; } };
            this.abort = function () { this.signal.aborted = true; if (typeof this.signal._onabort==='function') this.signal._onabort(); };
        };
    }
    if (!window.performance || !window.performance.now) {
        window.performance = { now: function () { return new Date().getTime(); } };
    }

    // CONFIG & LOG
    var ENABLE_LOGGING = true;

    var SURS_QUALITY = {
        log: function (msg) {
            if (ENABLE_LOGGING) console.log(LOG_PREFIX + " " + msg);
        }
    };

    // Іконки
    var UA_FLAG_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" style="width:1.3em;height:1.3em;vertical-align:middle;margin-right:4px;"><path d="M31,8c0-2.209-1.791-4-4-4H5c-2.209,0-4,1.791-4,4v9H31V8Z" fill="#2455b2"/><path d="M5,28H27c2.209,0,4-1.791,4-4v-8H1v8c0,2.209,1.791,4,4,4Z" fill="#f9da49"/></svg>';
    var GREEN_ARROW = '<span style="margin:0 4px;color:#2ecc71;font-size:1.1em;vertical-align:middle;">⬆️</span>';

    // СТИЛІ
    var style = document.createElement('style');
    style.textContent = [
        '.full-start__status.' + CLASS_QUALITY + ' { padding: 0.1em 0.3em; font-weight: bold; margin-left: 0.8em; display: inline-flex; align-items: center; background: transparent !important; text-shadow: none !important; }',
        '.' + CLASS_QUALITY + ' span { white-space: nowrap; }',
        '.' + CLASS_QUALITY + ' .q_4k_text     { color: #50c878; }',
        '.' + CLASS_QUALITY + ' .q_1080_text   { color: #007bff; }',
        '.' + CLASS_QUALITY + ' .q_720_text    { color: #ffc107; }',
        '.' + CLASS_QUALITY + ' .q_sd_text     { color: #9e9e9e; }',
        '.' + CLASS_QUALITY + ' .q_cam_text    { color: #ff5252; }',
        '.' + CLASS_QUALITY + ' .seeds_info    { margin-left:3px; font-size:0.8em; opacity:0.8; font-weight:normal; color:#fff; }'
    ].join('\n');
    document.head.appendChild(style);
}

     // parseQualityFromText та getQualityStyle — без змін (встав сюди свої функції)
    function parseQualityFromText(text) {
        if (!text) return 0;
        var t = text.toLowerCase();
        if (/\b(ts|tc|telesync|camrip|cam|hdtc|dvdscr)\b/i.test(t)) return -1;
        if (/\b(2160p|4k|uhd|ultra hd)\b/i.test(t)) return 2160;
        if (/\b(1080p|fhd|full hd|1080i|bdremux|remux)\b/i.test(t)) return 1080;
        if (/\b(720p|hd|720i)\b/i.test(t)) return 720;
        if (/\b(bdrip|brrip|bluray|blu-ray)\b/i.test(t)) return 1079;
        if (/\b(dvdrip|dvd|dvdr|dvd9|dvd5)\b/i.test(t)) return 481;
        if (/\b(480p|360p|sd|hdtv|webrip|web-dl|rip|mkv|avi)\b/i.test(t)) return 480;
        return 0;
    }

    function getQualityStyle(qVal) {
        if (qVal === -1) return { text: 'CAM',   css: 'q_cam_text' };
        if (qVal >= 2160) return { text: '4K',   css: 'q_4k_text' };
        if (qVal >= 1080) return { text: '1080p',css: 'q_1080_text' };
        if (qVal === 1079)return { text: 'BD',   css: 'q_1080_text' };
        if (qVal >= 720)  return { text: '720p', css: 'q_720_text' };
        if (qVal === 481) return { text: 'DVD',  css: 'q_sd_text' };
        if (qVal > 0)     return { text: 'SD',   css: 'q_sd_text' };
        return { text: '??', css: 'q_sd_text' };
    }

    // fetchWithProxy — встав сюди свою функцію (без змін)
function fetchWithProxy(url, callback) {
        var currentProxy = 0;
        var called = false;

        function tryNext() {
            if (currentProxy >= PROXY_LIST.length) {
                if (!called) { called = true; callback(new Error('Fail')); }
                return;
            }
            var pUrl = PROXY_LIST[currentProxy] + encodeURIComponent(url);
            var controller = new AbortController();
            var tid = setTimeout(function() { controller.abort(); }, PROXY_TIMEOUT);

            fetch(pUrl, { signal: controller.signal }).then(function(r) { return r.text(); }).then(function(d) {
                clearTimeout(tid);
                if (!called) { called = true; callback(null, d); }
            }).catch(function() {
                clearTimeout(tid);
                currentProxy++;
                tryNext();
            });
        }
        fetch(url).then(function(r) { return r.text(); }).then(function(d) {
            if (!called) { called = true; callback(null, d); }
        }).catch(function() { tryNext(); });
}
    // searchUaDual — встав сюди свою функцію (без змін)
    function searchUaDual(card, callback) {
        var year = (card.release_date || '').substring(0, 4);
        var title = card.original_title || card.title;
        if (!title || !year) return callback(null);

        var url = JACRED_PROTOCOL + JACRED_URL + '/api/v1.0/torrents?search=' + encodeURIComponent(title) + '&year=' + year;

        fetchWithProxy(url, function(err, data) {
            if (err || !data) return callback(null);
            try {
                var json = JSON.parse(data);
                if (!Array.isArray(json)) return callback(null);

                var uaRegex = /(?:^|[\s\.\-\/\(\[])(ukr|ua|ukrainian|укр|україн|toloka|mazepa|hurtom|uafilm|бабай|гуртом)(?:$|[\s\.\-\/\)\]])/i;
                var uaList = [];

                json.forEach(function(item) {
                    var fullInfo = (item.title + " " + (item.details || "") + " " + (item.tracker || "")).toLowerCase();
                    if (uaRegex.test(fullInfo)) {
                        uaList.push({
                            val: parseQualityFromText(item.title),
                            seeds: parseInt(item.seeders || item.seeds || 0),
                            title: item.title
                        });
                    }
                });

                if (uaList.length > 0) {
                    // Знаходимо найкращу якість
                    var bestQual = uaList.slice().sort(function(a,b){ return b.val - a.val; })[0];
                    // Знаходимо за сидами
                    var mostPop = uaList.slice().sort(function(a,b){ return b.seeds - a.seeds; })[0];

                    callback({ best: bestQual, popular: mostPop, hasUa: true });
                } else {
                    callback({ hasUa: false });
                }
            } catch(e) { callback(null); }
        });
    }

    // createHtml та injectUI
    function createHtml(item) {
        var meta = getQualityStyle(item.val);
        return '<span class="' + meta.css + '">' + meta.text + '</span>';
    }

    function injectUI(data, render) {
        if (!render) return;
        var rateLine = $('.full-start-new__rate-line', render);
        $('.' + CLASS_QUALITY, render).remove();

        if (!data || !data.hasUa) {
            rateLine.append('<div class="full-start__status ' + CLASS_QUALITY + '" style="color:#666">UA 🚫</div>');
            return;
        }

        var container = $('<div class="full-start__status ' + CLASS_QUALITY + '"></div>');
        var html = UA_FLAG_SVG + createHtml(data.best);

        if (data.popular) {
            html += GREEN_ARROW + createHtml(data.popular);
            if (data.popular.seeds > 0) {
                html += '<span class="seeds_info">(' + data.popular.seeds + ')</span>';
            }
        }

        container.html(html);
        rateLine.append(container);
    }

    function startProcess(movie, render) {
        if (!movie || movie.number_of_seasons || movie.first_air_date) return;

        $('.' + CLASS_QUALITY, render).remove();
        var ph = $('<div class="full-start__status ' + CLASS_QUALITY + '" style="opacity:0.5">...</div>');
        $('.full-start-new__rate-line', render).append(ph);

        searchUaDual(movie, function(result) {
            ph.remove();
            injectUI(result, render);
        });
    }

    // INIT
    function init() {
        if (window[GLOBAL_FLAG_NAME]) return;
        window[GLOBAL_FLAG_NAME] = true;

        SURS_QUALITY.log("UA Quality (BD/DVD) Loaded – namespace: " + PLUGIN_NAMESPACE);

        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                startProcess(e.data.movie, e.object.activity.render());
            }
        });
    }

    var waitLampa = setInterval(function() {
        if (typeof Lampa !== 'undefined' && Lampa.Listener) {
            clearInterval(waitLampa);
            init();
        }
    }, 500);

})();
