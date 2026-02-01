(function () {
    'use strict';

    console.log('[Sports Collection] Плагін завантажено');

    const waitForLampa = setInterval(() => {
        if (window.Lampa && Lampa.Component && Lampa.Manifest && Lampa.Utils) {
            clearInterval(waitForLampa);
            initialize();
        }
    }, 300);

    function initialize() {
        console.log('[Sports Collection] Lampa ініціалізовано');

        // ──────────────── Налаштування ────────────────
        const COLLECTION_TITLE = 'Спортивні фільми';
        const COLLECTION_ID    = 'sports_movies_custom';
        const GENRES_TO_MATCH  = ['спорт', 'sport', 'sports', 'спортивний', 'бокс', 'футбол', 'хокей', 'теніс', 'біатлон', 'олімпійські ігри'];

        // ──────────────── Функція фільтрації ────────────────
        function isSports(movie) {
            if (!movie) return false;

            const genres = (movie.genres || '').toLowerCase();
            const title  = (movie.title || movie.name || '').toLowerCase();
            const orig   = (movie.original_title || movie.original_name || '').toLowerCase();

            // Перевіряємо жанр
            if (GENRES_TO_MATCH.some(g => genres.includes(g))) return true;

            // Додатково перевіряємо назву (якщо жанр не вказано)
            if (GENRES_TO_MATCH.some(g => title.includes(g) || orig.includes(g))) return true;

            return false;
        }

        // ──────────────── Створюємо колекцію ────────────────
        Lampa.Collections.add({
            id: COLLECTION_ID,
            title: COLLECTION_TITLE,
            icon: '',           // іконка (можна змінити)
            background: '#1e3a8a', // колір фону картки
            type: 'movie',         // або 'all', якщо хочеш і серіали
            loader: function (page, resolve, reject) {
                // Тут можна підтягнути з Cub або TMDB, але для простоти — фільтруємо популярне
                Lampa.Api.query(
                    'popular',
                    { page: page, types: 'movie' },
                    (json) => {
                        if (json && json.results) {
                            const filtered = json.results.filter(isSports);
                            resolve({ results: filtered, total: filtered.length });
                        } else {
                            reject('Немає даних');
                        }
                    },
                    (error) => reject(error)
                );
            }
        });

        console.log('[Sports Collection] Колекція "' + COLLECTION_TITLE + '" додана');
    }

})();