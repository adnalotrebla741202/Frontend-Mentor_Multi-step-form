const steps = document.querySelectorAll(".step");
const indicators = document.querySelectorAll(".step-indicator");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");

const plans = document.querySelectorAll(".plan");
const billing = document.getElementById("billing");
const billingLabels = document.querySelectorAll(".billing-label");
const addonOptions = document.querySelectorAll(".addon-option");
const changePlanBtn = document.getElementById("changePlanBtn");

let currentStep = 0;
let yearly = false;

/* ===== NAVIGATION ===== */
function showStep(index) {
  steps.forEach(s => s.classList.remove("active"));
  indicators.forEach(i => i.classList.remove("active"));

  steps[index].classList.add("active");

  if (index === 4) {
    indicators[3].classList.add("active");
  } else {
    indicators[index].classList.add("active");
  }

  backBtn.style.display = index === 0 || index === 4 ? "none" : "inline-block";
  nextBtn.style.display = index === 4 ? "none" : "inline-block";
  nextBtn.textContent = index === 3 ? "Confirm" : "Next Step";

  if (index === 3) buildSummary();
}

/* ===== STEP 1 VALIDATION ===== */
function validateStep1() {
  const step1 = steps[0];
  const inputs = step1.querySelectorAll("input");

  let valid = true;
  clearErrors(step1);

  const nameInput = inputs[0];
  const emailInput = inputs[1];
  const phoneInput = inputs[2];

  // Nombre completo
  if (nameInput.value.trim().split(/\s+/).length < 2) {
    showError(
      nameInput,
      "Please enter your full name (first and last name)."
    );
    valid = false;
  }

  // Email válido y no termina en punto
  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.endsWith(".")) {
    showError(emailInput, "Enter a valid email address.");
    valid = false;
  }

  // Teléfono mínimo 10 dígitos
  const digits = phoneInput.value.replace(/\D/g, "");
  if (digits.length < 10) {
    showError(
      phoneInput,
      "Phone number must contain at least 10 digits."
    );
    valid = false;
  }

  return valid;
}

function showError(input, message) {
  input.style.borderColor = "hsl(354, 84%, 57%)";

  let error = input.parentElement.querySelector(".input-error");
  if (!error) {
    error = document.createElement("div");
    error.className = "input-error";
    error.style.color = "hsl(354, 84%, 57%)";
    error.style.fontSize = "12px";
    error.style.marginTop = "4px";
    error.style.textAlign = "right";
    input.parentElement.appendChild(error);
  }

  error.textContent = message;
}

function clearErrors(step) {
  step.querySelectorAll(".input-error").forEach(e => e.remove());
  step.querySelectorAll("input").forEach(i => (i.style.borderColor = ""));
}

/* ===== PLAN SELECTION ===== */
plans.forEach(plan => {
  plan.onclick = () => {
    plans.forEach(p => p.classList.remove("active"));
    plan.classList.add("active");
  };
});

/* ===== BILLING ===== */
billing.onchange = () => {
  yearly = billing.checked;

  billingLabels.forEach(l => l.classList.remove("active"));
  billingLabels[yearly ? 1 : 0].classList.add("active");

  plans.forEach(plan => {
    const price = yearly ? plan.dataset.yearly : plan.dataset.monthly;
    plan.querySelector(".price").textContent =
      yearly ? `$${price}/yr` : `$${price}/mo`;
    plan.classList.toggle("yearly", yearly);
  });

  addonOptions.forEach(addon => {
    const price = yearly ? addon.dataset.yearly : addon.dataset.monthly;
    addon.querySelector(".addon-price").textContent =
      yearly ? `+$${price}/yr` : `+$${price}/mo`;
  });
};

/* ===== STEP 4 SUMMARY ===== */
function buildSummary() {
  const selectedPlan = document.querySelector(".plan.active");
  const planName = selectedPlan.querySelector("h3").textContent;
  const planPrice = yearly
    ? selectedPlan.dataset.yearly
    : selectedPlan.dataset.monthly;

  document.querySelector(".summary-plan-left strong").textContent =
    `${planName} (${yearly ? "Yearly" : "Monthly"})`;

  document.querySelector(".summary-price").textContent =
    `$${planPrice}/${yearly ? "yr" : "mo"}`;

  const addonsBox = document.querySelector(".summary-addons");
  addonsBox.innerHTML = "";

  let total = Number(planPrice);

  addonOptions.forEach(addon => {
    if (addon.querySelector("input").checked) {
      const name = addon.querySelector("strong").textContent;
      const price = yearly ? addon.dataset.yearly : addon.dataset.monthly;
      total += Number(price);

      const div = document.createElement("div");
      div.innerHTML = `<span>${name}</span><span>+$${price}/${yearly ? "yr" : "mo"}</span>`;
      addonsBox.appendChild(div);
    }
  });

  document.querySelector(".summary-total span").textContent =
    `Total (per ${yearly ? "year" : "month"})`;

  document.querySelector(".summary-total strong").textContent =
    `$${total}/${yearly ? "yr" : "mo"}`;
}

/* ===== BUTTONS ===== */
nextBtn.onclick = () => {
  if (currentStep === 0 && !validateStep1()) return;

  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
};

backBtn.onclick = () => {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
};

changePlanBtn.onclick = () => {
  currentStep = 1;
  showStep(currentStep);
};

showStep(currentStep);