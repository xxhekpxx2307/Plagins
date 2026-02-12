categories: [
    // Найпопулярніші дорами взагалі (корейська + китайська + японська + інші) — без аніме
    {
        "title": "Популярні дорами зараз",
        "url": "discover/tv",
        "params": {
            "with_original_language": "ko|zh|ja",
            "with_genres": "18",
            "without_genres": "16",                  // ← виключення анімації
            "sort_by": "popularity.desc",
            "vote_count.gte": "30"
        }
    },

    // Новинки корейських дорам — без аніме
    {
        "title": "Нові корейські дорами",
        "url": "discover/tv",
        "params": {
            "with_original_language": "ko",
            "with_genres": "18",
            "without_genres": "16",
            "sort_by": "first_air_date.desc",
            "first_air_date.lte": "{current_date}",
            "vote_count.gte": "3"
        }
    },

    // Топ за рейтингом (найкращі дорами) — без аніме
    {
        "title": "Найкращі дорами (високий рейтинг)",
        "url": "discover/tv",
        "params": {
            "with_original_language": "ko|zh|ja",
            "with_genres": "18",
            "without_genres": "16",
            "sort_by": "vote_average.desc",
            "vote_average.gte": "7.8",
            "vote_count.gte": "200"
        }
    },

    // Топ корейських дорам — без аніме
    {
        "title": "Топ корейських дорам",
        "url": "discover/tv",
        "params": {
            "with_original_language": "ko",
            "with_genres": "18",
            "without_genres": "16",
            "sort_by": "vote_average.desc",
            "vote_average.gte": "8.0",
            "vote_count.gte": "500"
        }
    },

    // Романтичні дорами — без аніме
    {
        "title": "Романтичні дорами",
        "url": "discover/tv",
        "params": {
            "with_original_language": "ko|zh|ja",
            "with_genres": "18,10749",
            "without_genres": "16",
            "sort_by": "popularity.desc"
        }
    },

    // Історичні та фентезі дорами — без аніме
    {
        "title": "Історичні та фентезі дорами",
        "url": "discover/tv",
        "params": {
            "with_original_language": "ko|zh|ja",
            "with_genres": "10765,37",
            "without_genres": "16",
            "sort_by": "popularity.desc"
        }
    },

    // Китайські дорами (C-drama) — без аніме
    {
        "title": "Китайські дорами (C-drama)",
        "url": "discover/tv",
        "params": {
            "with_original_language": "zh",
            "with_genres": "18",
            "without_genres": "16",
            "sort_by": "popularity.desc",
            "vote_count.gte": "20"
        }
    },

    // Японські дорами (J-drama) — без аніме
    {
        "title": "Японські дорами (J-drama)",
        "url": "discover/tv",
        "params": {
            "with_original_language": "ja",
            "with_genres": "18",
            "without_genres": "16",
            "sort_by": "popularity.desc"
        }
    },

    // Дорами на Viki / Rakuten — без аніме
    {
        "title": "Дорами на Viki / Rakuten",
        "url": "discover/tv",
        "params": {
            "with_watch_providers": "126",
            "watch_region": "UA",
            "without_genres": "16",
            "sort_by": "popularity.desc"
        }
    },

    // ───── Нові пункти для китайських донхуа ─────

    {
        "title": "Нові китайські донхуа",
        "url": "discover/tv",
        "params": {
            "with_original_language": "zh",
            "with_genres": "16",                     // Animation
            "sort_by": "first_air_date.desc",
            "first_air_date.lte": "{current_date}",
            "vote_count.gte": "5"                    // щоб показувати свіжі, навіть з малою кількістю голосів
        }
    },

    {
        "title": "Топ китайських донхуа",
        "url": "discover/tv",
        "params": {
            "with_original_language": "zh",
            "with_genres": "16",
            "sort_by": "vote_average.desc",
            "vote_average.gte": "7.5",
            "vote_count.gte": "100"                  // більш-менш популярні та оцінені
        }
    }
]
