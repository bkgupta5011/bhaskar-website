// main.js - common interactions for TheFitBhaskar.in

// Toggle mobile navigation
const navToggle = () => {
  const nav = document.querySelector(".nav-links");
  if (nav) nav.classList.toggle("show");
};

// Wire up hamburger click
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".hamburger");
  if (burger) {
    burger.addEventListener("click", navToggle);
  }

  // Smooth scroll for in-page links that start with "#"
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Mini BMI teaser on home (index)
  const miniBmiForm = document.querySelector("#mini-bmi-form");
  if (miniBmiForm) {
    miniBmiForm.addEventListener("submit", e => {
      e.preventDefault();
      const h = parseFloat(miniBmiForm.querySelector("[name='height']")?.value || "0");
      const w = parseFloat(miniBmiForm.querySelector("[name='weight']")?.value || "0");
      const output = document.querySelector("#mini-bmi-output");
      if (!h || !w) {
        output.textContent = "Please enter height and weight.";
        return;
      }
      const bmi = w / Math.pow(h / 100, 2);
      output.innerHTML = `BMI (approx): ${bmi.toFixed(1)}. For full tools, visit <a href="tools.html">Tools page</a>.`;
    });
  }

  // Full BMI calculator on tools page
  const bmiForm = document.querySelector("#bmi-form");
  if (bmiForm) {
    bmiForm.addEventListener("submit", e => {
      e.preventDefault();
      const h = parseFloat(bmiForm.height.value);
      const w = parseFloat(bmiForm.weight.value);
      const bmiVal = document.querySelector("#bmi-value");
      const bmiCat = document.querySelector("#bmi-category");
      if (!h || !w) {
        bmiVal.textContent = "Please enter valid height and weight.";
        bmiCat.textContent = "";
        return;
      }
      const bmi = w / Math.pow(h / 100, 2);
      bmiVal.textContent = bmi.toFixed(1);
      let category = "Normal";
      if (bmi < 18.5) category = "Underweight";
      else if (bmi < 25) category = "Normal";
      else if (bmi < 30) category = "Overweight";
      else category = "Obese";
      bmiCat.textContent = category;
    });
  }

  // Calorie estimator
  const calorieForm = document.querySelector("#calorie-form");
  if (calorieForm) {
    calorieForm.addEventListener("submit", e => {
      e.preventDefault();
      const weight = parseFloat(calorieForm.weight.value);
      const goal = calorieForm.goal.value;
      const output = document.querySelector("#calorie-output");
      if (!weight) {
        output.textContent = "Enter a valid weight.";
        return;
      }
      // Simple placeholder logic; adjust as needed
      const maintain = weight * 30;
      let suggestion = `${maintain - 200} - ${maintain + 150} kcal (maintain)`;
      if (goal === "lose") suggestion = `${maintain - 400} - ${maintain - 200} kcal (lose)`;
      if (goal === "gain") suggestion = `${maintain + 200} - ${maintain + 400} kcal (gain)`;
      output.textContent = suggestion;
    });
  }

  // Water intake suggestion
  const waterForm = document.querySelector("#water-form");
  if (waterForm) {
    waterForm.addEventListener("submit", e => {
      e.preventDefault();
      const weight = parseFloat(waterForm.weight.value);
      const output = document.querySelector("#water-output");
      if (!weight) {
        output.textContent = "Enter a valid weight.";
        return;
      }
      const liters = (weight * 0.033).toFixed(2);
      output.textContent = `${liters} liters (approx) per day.`;
    });
  }

  // Contact form validation (demo only)
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();
      if (!name || !email || !subject || !message) {
        alert("Please fill in all fields.");
        return;
      }
      alert("Form submitted (demo only).");
      contactForm.reset();
    });
  }

  // Diet page: live Google Sheet table
  const foodTableBody = document.querySelector("#food-tbody");
  if (foodTableBody) {
    const searchInput = document.querySelector("#food-search");
    const stateFilter = document.querySelector("#state-filter");
    const refreshBtn = document.querySelector("#refresh-sheet");
    const statusEl = document.querySelector("#sheet-status");
    const chipCalories = document.querySelector("#chip-calories");
    const chipProtein = document.querySelector("#chip-protein");
    const chipCarbs = document.querySelector("#chip-carbs");
    const chipFat = document.querySelector("#chip-fat");
    const chipFibre = document.querySelector("#chip-fibre");

    const sheetId = "1ySzTGIRSipjieOl38WXnVHk-LCmVGKlq3YEx22kEgxE";
    const sheetName = "Food";
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${encodeURIComponent(sheetName)}&tqx=out:json`;

    let foodData = [];

    const parseGvizJson = raw => {
      // gviz returns JS function wrapper; we strip it to get JSON
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start === -1 || end === -1) return null;
      try {
        const json = JSON.parse(raw.substring(start, end + 1));
        return json?.table?.rows || [];
      } catch (err) {
        console.error("Sheet parse error", err);
        return null;
      }
    };

    const renderChips = entry => {
      chipCalories.textContent = entry?.calories || "—";
      chipProtein.textContent = entry?.protein || "—";
      chipCarbs.textContent = entry?.carbs || "—";
      chipFat.textContent = entry?.fat || "—";
      chipFibre.textContent = entry?.fibre || "—";
    };

    const renderTable = rows => {
      if (!rows.length) {
        foodTableBody.innerHTML = `<tr><td colspan="9">No matches. Try a different keyword.</td></tr>`;
        renderChips(null);
        return;
      }
      const safeText = val => (val === null || val === undefined ? "" : val);
      foodTableBody.innerHTML = rows
        .map(
          row => `<tr>
            <td>${safeText(row.food)}</td>
            <td>${safeText(row.state)}</td>
            <td>${safeText(row.calories)}</td>
            <td>${safeText(row.protein)}</td>
            <td>${safeText(row.carbs)}</td>
            <td>${safeText(row.fat)}</td>
            <td>${safeText(row.fibre)}</td>
            <td>${safeText(row.other)}</td>
            <td><a class="btn btn-secondary btn-ghost" href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(row.food + ' food')}" target="_blank" rel="noopener">View</a></td>
          </tr>`
        )
        .join("");
      renderChips(rows[0]);
    };

    const applyFilters = () => {
      const q = (searchInput?.value || "").toLowerCase().trim();
      const state = stateFilter?.value || "";
      const filtered = foodData.filter(item => {
        const matchesQuery = q ? item.food.toLowerCase().includes(q) || (item.other || "").toLowerCase().includes(q) : true;
        const matchesState = state ? item.state === state : true;
        return matchesQuery && matchesState;
      });
      renderTable(filtered.slice(0, 150)); // safety limit for UI
      if (statusEl) statusEl.textContent = `Showing ${Math.min(filtered.length, 150)} of ${filtered.length} foods from Google Sheet.`;
    };

    const fetchSheet = async () => {
      if (statusEl) statusEl.textContent = "Loading data from Google Sheet…";
      try {
        const res = await fetch(sheetUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const rows = parseGvizJson(text);
        if (!rows) throw new Error("Could not parse sheet data");
        foodData = rows
          .map(r => {
            const c = r.c || [];
            return {
              food: c[0]?.v || "",
              state: c[1]?.v || "",
              calories: c[2]?.v || "",
              protein: c[3]?.v || "",
              carbs: c[4]?.v || "",
              fat: c[5]?.v || "",
              fibre: c[6]?.v || "",
              other: c[7]?.v || ""
            };
          })
          .filter(item => item.food);
        applyFilters();
        if (statusEl) statusEl.textContent = `Connected. Last pulled ${new Date().toLocaleTimeString()}.`;
      } catch (err) {
        console.error(err);
        foodTableBody.innerHTML = `<tr><td colspan="8">Could not load sheet. Check sharing or refresh.</td></tr>`;
        if (statusEl) statusEl.textContent = "Error loading sheet. Check link/sharing and try again.";
        renderChips(null);
      }
    };

    // Wire events
    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (stateFilter) stateFilter.addEventListener("change", applyFilters);
    if (refreshBtn) refreshBtn.addEventListener("click", fetchSheet);

    // Initial load
    fetchSheet();
  }
});
