(() => {
    'use strict';

    const $ = (id) => document.getElementById(id);

    // ---------- Data ----------
    const RECIPES = [
        {
            id: 'quinoa-bowl', emoji: '🥗', title: 'Mediterranean Quinoa Bowl',
            desc: 'Healthy bowl with quinoa, vegetables, and tahini dressing',
            img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&auto=format&fit=crop',
            rating: 4.5, reviews: 156, prep: 20, cook: 35, servings: 2, level: 'Easy', cuisine: 'Mediterranean',
            ingredients: ['1 cup quinoa', '1 cucumber, diced', '1 cup cherry tomatoes', '1/2 cup kalamata olives', '1/2 cup feta cheese', '3 tablespoons tahini', '1 lemon, juiced', 'Fresh parsley'],
            steps: ['Rinse the quinoa and cook it in 2 cups of water for 15 minutes.', 'Chop the cucumber and halve the tomatoes.', 'Whisk tahini with lemon juice and a little water until smooth.', 'Assemble the bowl, top with feta and olives and drizzle with the dressing.'],
            nutrition: { calories: '480 kcal', protein: '18g', carbs: '50g', fat: '20g', fiber: '10g', sodium: '540mg' },
            tips: ['Toast the dry quinoa for 2 minutes before boiling for a nuttier flavor.', 'Let the quinoa cool slightly so the vegetables stay crisp.', 'Add grilled chicken or chickpeas for extra protein.']
        },
        {
            id: 'margherita-pizza', emoji: '🍕', title: 'Margherita Pizza',
            desc: 'Classic Italian pizza with fresh mozzarella and basil',
            img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&auto=format&fit=crop',
            rating: 4.6, reviews: 328, prep: 30, cook: 20, servings: 2, level: 'Intermediate', cuisine: 'Italian',
            ingredients: ['1 pizza dough ball', '1/2 cup tomato sauce', '200g fresh mozzarella', 'Fresh basil leaves', '2 tablespoons olive oil', 'Pinch of sea salt'],
            steps: ['Preheat the oven to its highest setting with a baking stone or tray inside.', 'Stretch the dough into a round and spread the tomato sauce over it.', 'Tear the mozzarella over the sauce and drizzle with olive oil.', 'Bake for 8 to 10 minutes until the crust is golden, then top with fresh basil.'],
            nutrition: { calories: '580 kcal', protein: '24g', carbs: '68g', fat: '22g', fiber: '4g', sodium: '920mg' },
            tips: ['Use a very hot oven for a crisp, blistered crust.', 'Pat the mozzarella dry so the pizza does not get soggy.', 'Add the basil after baking to keep it fresh and green.']
        },
        {
            id: 'bbq-pulled-pork', emoji: '🍖', title: 'BBQ Pulled Pork',
            desc: 'Slow-cooked tender pork in smoky barbecue sauce',
            img: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=900&auto=format&fit=crop',
            rating: 4.7, reviews: 412, prep: 15, cook: 240, servings: 4, level: 'Easy', cuisine: 'American',
            ingredients: ['1kg pork shoulder', '1 cup BBQ sauce', '1/2 cup apple cider vinegar', '2 tablespoons brown sugar', '1 tablespoon paprika', '1 tablespoon garlic powder', 'Burger buns', 'Coleslaw for serving'],
            steps: ['Mix paprika, garlic powder and brown sugar, then rub all over the pork.', 'Place the pork in a slow cooker with the vinegar and half of the BBQ sauce.', 'Cook on low for 8 hours until the meat falls apart.', 'Shred the pork, toss with the remaining sauce and serve on buns with coleslaw.'],
            nutrition: { calories: '620 kcal', protein: '48g', carbs: '52g', fat: '22g', fiber: '3g', sodium: '1180mg' },
            tips: ['Choose a pork shoulder with a good fat cap for juicier meat.', 'Let the meat rest 15 minutes before shredding.', 'Toast the buns lightly for extra crunch.', 'Leftovers make great tacos or nachos.']
        },
        {
            id: 'carbonara', emoji: '🍝', title: 'Creamy Spaghetti Carbonara',
            desc: 'Classic Roman pasta with eggs, cheese and crispy pancetta',
            img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=900&auto=format&fit=crop',
            rating: 4.8, reviews: 234, prep: 15, cook: 20, servings: 4, level: 'Easy', cuisine: 'Italian',
            ingredients: ['400g spaghetti', '150g pancetta', '4 large eggs', '1 cup grated Pecorino Romano', 'Freshly ground black pepper', 'Salt for the pasta water'],
            steps: ['Boil the spaghetti in salted water until al dente.', 'Fry the pancetta until crisp.', 'Whisk the eggs with the cheese and pepper.', 'Toss hot pasta with the pancetta, then add the egg mixture off the heat, loosening with pasta water.'],
            nutrition: { calories: '520 kcal', protein: '28g', carbs: '62g', fat: '18g', fiber: '3g', sodium: '680mg' },
            tips: ['Use room-temperature eggs for a smoother sauce.', 'Always mix the eggs off the heat to avoid scrambling.', 'Save a cup of pasta water before draining.']
        }
    ];

    const NUTRITION_META = [
        ['calories', 'Calories', 'fa-fire', '#f97316'],
        ['protein', 'Protein', 'fa-drumstick-bite', '#ef4444'],
        ['carbs', 'Carbohydrates', 'fa-bread-slice', '#f59e0b'],
        ['fat', 'Fat', 'fa-droplet', '#eab308'],
        ['fiber', 'Fiber', 'fa-leaf', '#22c55e'],
        ['sodium', 'Sodium', 'fa-cubes', '#3b82f6']
    ];

    // ---------- Storage ----------
    const store = {
        get(key, fallback) {
            try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
        },
        set(key, value) {
            try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
        }
    };

    let saved = store.get('wfd-saved', []);
    let recent = store.get('wfd-recent', []);
    let viewed = store.get('wfd-viewed', 0);
    let current = null;

    // ---------- Helpers ----------
    const byId = (id) => RECIPES.find((r) => r.id === id);
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    let toastTimer;
    function toast(msg) {
        const el = $('toastMsg');
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
    }

    // ---------- Render ----------
    function setImage(r) {
        const el = $('recipeImg');
        el.classList.remove('no-photo');
        el.textContent = '';
        el.style.backgroundImage = '';
        const probe = new Image();
        probe.onload = () => { el.style.backgroundImage = `url("${r.img}")`; };
        probe.onerror = () => { el.classList.add('no-photo'); el.textContent = r.emoji; };
        probe.src = r.img;
    }

    function renderRecipe(r) {
        current = r;
        setImage(r);

        $('recipeRating').textContent = r.rating;
        $('recipeReviews').textContent = r.reviews;
        $('recipePrep').textContent = `${r.prep} min`;
        $('recipeCook').textContent = `${r.cook} min`;
        $('recipeServings').textContent = `${r.servings} people`;

        const level = $('recipeLevel');
        level.textContent = r.level;
        level.className = 'level-tag ' + r.level.toLowerCase();
        $('recipeCuisine').textContent = r.cuisine;
        $('recipeTitle').textContent = r.title;
        $('recipeDesc').textContent = r.desc;

        $('timeAlert').classList.toggle('d-none', r.prep + r.cook <= 45);

        $('ingredientList').innerHTML = r.ingredients
            .map((t, i) => `<li><span class="num">${i + 1}</span><span>${esc(t)}</span></li>`).join('');

        $('stepList').innerHTML = r.steps
            .map((t, i) => `<li><span class="num">${i + 1}</span><span>${esc(t)}</span></li>`).join('');

        $('nutritionList').innerHTML = NUTRITION_META.map(([key, label, icon, color]) => `
            <div class="col-md-6"><div class="nutrition-card">
                <i class="fa-solid ${icon} n-icon" style="color:${color};background-color:${color}22"></i>
                <span class="n-label">${label}</span>
                <strong>${esc(r.nutrition[key])}</strong>
            </div></div>`).join('');

        $('tipList').innerHTML = r.tips
            .map((t) => `<li><i class="fa-solid fa-lightbulb"></i><span>${esc(t)}</span></li>`).join('');

        updateSaveBtn();
    }

    function resetTab() {
        const first = document.querySelector('#recipeTabs .nav-link');
        if (first && window.bootstrap) bootstrap.Tab.getOrCreateInstance(first).show();
    }

    function showRecipe(r, opts = {}) {
        renderRecipe(r);
        if (!opts.keepTab) resetTab();

        recent = [r.id, ...recent.filter((id) => id !== r.id)].slice(0, 8);
        viewed += 1;
        store.set('wfd-recent', recent);
        store.set('wfd-viewed', viewed);
        renderPanels();
    }

    function randomRecipe() {
        const pool = RECIPES.filter((r) => !current || r.id !== current.id);
        return pool[Math.floor(Math.random() * pool.length)] || RECIPES[0];
    }

    // ---------- Save / Share ----------
    function updateSaveBtn() {
        const btn = $('saveBtn');
        const isSaved = !!current && saved.includes(current.id);
        btn.classList.toggle('saved', isSaved);
        btn.setAttribute('aria-pressed', String(isSaved));
    }

    function toggleSave() {
        if (!current) return;
        if (saved.includes(current.id)) {
            saved = saved.filter((id) => id !== current.id);
            toast('Removed from saved recipes');
        } else {
            saved = [current.id, ...saved];
            toast('Recipe saved!');
        }
        store.set('wfd-saved', saved);
        updateSaveBtn();
        renderPanels();
    }

    async function shareRecipe() {
        if (!current) return;
        const data = { title: current.title, text: `${current.title} - ${current.desc}`, url: location.href };
        try {
            if (navigator.share) {
                await navigator.share(data);
            } else {
                await navigator.clipboard.writeText(`${data.text} ${data.url}`);
                toast('Link copied to clipboard');
            }
        } catch { /* share cancelled */ }
    }

    // ---------- Panels ----------
    function listHtml(ids, emptyText) {
        const items = ids.map(byId).filter(Boolean);
        if (!items.length) return `<li class="panel-empty">${emptyText}</li>`;
        return items.map((r) => `
            <li><button type="button" data-id="${r.id}" data-bs-dismiss="offcanvas">
                <span style="font-size:1.6rem">${r.emoji}</span>
                <span><strong>${esc(r.title)}</strong><small>${esc(r.cuisine)} · ${r.prep + r.cook} min</small></span>
            </button></li>`).join('');
    }

    function renderPanels() {
        $('savedList').innerHTML = listHtml(saved, 'No saved recipes yet.');
        $('recentList').innerHTML = listHtml(recent, 'Nothing viewed yet.');
        $('statSaved').textContent = saved.length;
        $('statViewed').textContent = viewed;
        const badge = $('savedCount');
        badge.textContent = saved.length;
        badge.classList.toggle('d-none', saved.length === 0);
    }

    // ---------- Events ----------
    $('anotherBtn').addEventListener('click', () => showRecipe(randomRecipe()));
    $('saveBtn').addEventListener('click', toggleSave);
    $('shareBtn').addEventListener('click', shareRecipe);

    ['savedList', 'recentList'].forEach((id) => {
        $(id).addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-id]');
            if (btn) showRecipe(byId(btn.dataset.id));
        });
    });

    $('clearSaved').addEventListener('click', () => {
        saved = [];
        store.set('wfd-saved', saved);
        updateSaveBtn();
        renderPanels();
        toast('Saved recipes cleared');
    });

    $('clearRecent').addEventListener('click', () => {
        recent = [];
        viewed = 0;
        store.set('wfd-recent', recent);
        store.set('wfd-viewed', viewed);
        renderPanels();
        toast('Recent history cleared');
    });

    // ---------- Init ----------
    renderPanels();
    showRecipe(RECIPES[0], { keepTab: true });
})();