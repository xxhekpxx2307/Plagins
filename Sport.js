(function () {
    'use strict';

    /**
     * Sports Category (Keyword-based, бо жанру Sport в TMDB немає)
     * Адаптовано під STUDIOS MASTER логіку
     */

    var SPORTS_CONFIG = {
        title: 'Спортивні',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 2 L14 8 L21 9 L16 14 L17 21 L12 18 L7 21 L8 14 L3 9 L10 8 Z"/></svg>', // іконка м'яча
        component: 'sports_category',
        url: 'discover/movie', // або 'discover/tv' / 'discover/all' — спробуй різні
        params: {
            with_keywords: '6075|333328|209476|192345|161643|725', // sports, sport, boxing, football (soccer) team, sport competition, athletic
            sort_by: 'popularity.desc',
            vote_count: { gte: 5 },
            vote_average: { gte: 5.5 },
            'primary_release_date.lte': '{current_date}',
            include_adult: false
        }
    };

    // Компонент для відображення списку
    function SportsCategory(object) {
        var comp = new Lampa.InteractionCategory(object);
        var network = new Lampa.Reguest();

        function buildUrl(page) {
            var params = [];
            params.push('api_key=' + Lampa.TMDB.key());
            params.push('language=' + Lampa.Storage.get('language', 'uk'));
            params.push('page=' + page);

            Object.keys(object.params || {}).forEach(function (key) {
                var val = object.params[key];
                if (val === '{current_date}') {
                    var d = new Date();
                    val = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
                }
                params.push(key + '=' + val);
            });

            return Lampa.TMDB.api(object.url + '?' + params.join('&'));
        }

        comp.create = function () {
            var _this = this;
            network.silent(buildUrl(1), function (json) {
                if (json && json.results && json.results.length === 0) {
                    console.warn('[Sports] Порожній результат — можливо, спробуйте discover/tv або all');
                }
                _this.build(json);
            }, function (err) {
                console.error('[Sports] Помилка запиту:', err);
                _this.empty();
            });
        };

        comp.nextPageReuest = function (obj, resolve, reject) {
            network.silent(buildUrl(obj.page), resolve, reject);
        };

        return comp;
    }

    // Додавання кнопки в меню (та сама логіка, що в STUDIOS MASTER)
    function addSportsMenuButton() {
        var menu = $('.menu .menu__list').eq(0);
        if (!menu.length) return;

        if (menu.find('.menu__item[data-action="sports_action"]').length) return;

        var btn = $(
            '<li class="menu__item selector" data-action="sports_action">' +
                '<div class="menu__ico">' + SPORTS_CONFIG.icon + '</div>' +
                '<div class="menu__text">' + SPORTS_CONFIG.title + '</div>' +
            '</li>'
        );

        btn.on('hover:enter', function () {
            Lampa.Activity.push({
                title: SPORTS_CONFIG.title,
                component: SPORTS_CONFIG.component,
                url: SPORTS_CONFIG.url,
                params: SPORTS_CONFIG.params,
                page: 1
            });
        });

        menu.append(btn);
        console.log('[Sports Menu] Пункт "Спортивні" додано');
    }

    // Запуск
    function startPlugin() {
        if (window.plugin_sports_fixed_ready) return;
        window.plugin_sports_fixed_ready = true;

        Lampa.Component.add('sports_category', SportsCategory);

        function tryAdd() {
            if (window.appready && $('.menu .menu__list').eq(0).length) {
                addSportsMenuButton();
            }
        }

        if (window.appready) {
            tryAdd();
        } else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type === 'ready') tryAdd();
            });
        }

        setInterval(tryAdd, 3000);
    }

    s tartPlugin();
})();
