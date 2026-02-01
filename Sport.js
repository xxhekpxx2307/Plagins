(function () {
    'use strict';

    console.log('[Sports Menu] Плагін завантажено');

    const waitForLampa = setInterval(() => {
        if (window.Lampa && Lampa.Listener && Lampa.Activity && Lampa.Template && typeof $ !== 'undefined') {
            clearInterval(waitForLampa);
            initialize();
        }
    }, 300);

    function initialize() {
        console.log('[Sports Menu] Lampa знайдено, ініціалізація меню');

        // Слухаємо подію ініціалізації головного меню
        Lampa.Listener.follow('menu', function (e) {
            // Перевіряємо, що це ініціалізація основного меню
            if (e.type === 'init' && e.component === 'main') {
                // Знаходимо блок "Каталог" або основний список меню
                // В різних версіях Lampa це може бути .menu__list або .menu__catalog
                let menu_container = $('.menu__list', e.object.render());
                if (!menu_container.length) {
                    menu_container = $('.menu__catalog', e.object.render());
                }
                if (!menu_container.length) {
                    menu_container = $('.menu__body', e.object.render()); // запасний варіант
                }

                // Перевіряємо, чи вже не додано наш пункт (щоб не дублювався)
                if (menu_container.length && !$('#sports_custom_item').length) {
                    const sports_menu_item = $(
                        '<div class="menu__item selector" id="sports_custom_item">' +
                            '<div class="menu__icon"></div>' +  // іконка (можна замінити на ⚽ або іншу з font Lampa)
                            '<div class="menu__name">Спортивні</div>' +
                        '</div>'
                    );

                    // При кліку відкриваємо кастомну активність з фільтром
                    sports_menu_item.on('hover:enter', function () {
                        Lampa.Activity.push({
                            component: 'category',
                            category:  'sports_custom',
                            title:     'Спортивні фільми та серіали',
                            url:       'catalog/sports',
                            // Фільтр по жанрах (працює в багатьох джерелах: cub, tmdb тощо)
                            genres:    'sport,sports,спорт,спортивний',
                            // Додаткові параметри, якщо потрібно
                            types:     'movie,serial',
                            page:      1
                        });
                    });

                    // Додаємо в кінець списку або після певного пункту
                    menu_container.append(sports_menu_item);

                    console.log('[Sports Menu] Пункт "Спортивні" додано в меню');
                }
            }
        });
    }

})();
