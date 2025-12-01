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
});
