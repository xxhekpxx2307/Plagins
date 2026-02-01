(function () {
    'use strict';

    /**
     * Sports Menu Item
     * Адаптовано для додавання одного пункту "Спортивні" в бічне меню
     * Базується на логіці STUDIOS MASTER (Syvyj)
     */

    var SPORTS_CONFIG = {
        title: 'Спортивні',
        icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.05-7.44 7-7.93V17.93zm2-13.86c3.94.49 7 3.85 7 7.93s-3.05 7.44-7 7.93V4.07z"/></svg>', // проста іконка м'яча/спорту
        component: 'sports_category',
        // параметри для discover-запиту
        url: 'discover/movie', // або 'discover/tv' або 'discover/all'
        params: {
            with_genres: '99',                    // 99 = Documentary, бо спорт часто там
            with_keywords: '150904, 725',         // 150904 = sports, 725 = sport (TMDB keywords)
            sort_by: 'popularity.desc',
            vote_count: { gte: 10 },              // щоб не було зовсім пустого
            'primary_release_date.lte': '{current_date}'
        }
    };

    // -----------------------------------------------------------------
    // Компонент для перегляду (якщо потрібно відкривати список)
    // -----------------------------------------------------------------

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
                _this.build(json);
            }, this.empty.bind(this));
        };

        comp.nextPageReuest = function (obj, resolve, reject) {
            network.silent(buildUrl(obj.page), resolve, reject);
        };

        return comp;
    }

    // -----------------------------------------------------------------
    // Додавання кнопки в меню
    // -----------------------------------------------------------------

    function addSportsMenuButton() {
        var menu = $('.menu .menu__list').eq(0);
        if (!menu.length) return;

        // Уникаємо дублювання
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
        console.log('[Sports Menu] Пункт "Спортивні" додано в меню');
    }

    // -----------------------------------------------------------------
    // Запуск плагіна
    // -----------------------------------------------------------------

    function startPlugin() {
        if (window.plugin_sports_menu_ready) return;
        window.plugin_sports_menu_ready = true;

        // Реєструємо компонент
        Lampa.Component.add('sports_category', SportsCategory);

        // Додаємо кнопку
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

        // Повторна перевірка (на випадок динамічного меню)
        setInterval(tryAdd, 3000);
    }

     startPlugin();
})();
