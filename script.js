const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("active");
});

document.querySelectorAll("#mainNav a").forEach(link => {
    link.addEventListener("click", () => mainNav.classList.remove("active"));
});

document.querySelectorAll("[data-scroll]").forEach(button => {
    button.addEventListener("click", () => {
        const target = document.querySelector(button.dataset.scroll);
        if (target) target.scrollIntoView({ behavior: "smooth" });
    });
});


/* ==========================
   INDICADOR LATERAL
========================== */

const slides = [...document.querySelectorAll(".slide")];
const indexItems = [...document.querySelectorAll(".side-index span")];

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = slides.indexOf(entry.target);
            indexItems.forEach(item => item.classList.remove("active"));
            if (indexItems[index]) indexItems[index].classList.add("active");
        }
    });
}, { threshold: 0.45 });

slides.forEach(slide => observer.observe(slide));

indexItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        slides[index].scrollIntoView({ behavior: "smooth" });
    });
});


/* ==========================
   MODAIS
========================== */

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalClose = document.getElementById("modalClose");

const modalData = {
    sobre: {
        title: "SOBRE O PROJETO",
        text: "O Atleta em Foco é uma proposta de plataforma web educativa voltada à disseminação de informações sobre saúde, nutrição, hidratação, recuperação, prevenção de lesões e hábitos saudáveis. A proposta utiliza HTML, CSS e JavaScript para construir uma experiência digital intuitiva."
    },
    antes: {
        title: "ANTES DO TREINO",
        text: "Este espaço pode receber orientações e conteúdos selecionados pela equipe do projeto sobre preparação alimentar e cuidados prévios à atividade física."
    },
    durante: {
        title: "DURANTE O TREINO",
        text: "Este módulo pode apresentar informações educativas relacionadas à hidratação, percepção corporal e cuidados durante a prática esportiva."
    },
    depois: {
        title: "DEPOIS DO TREINO",
        text: "Este espaço pode reunir informações sobre recuperação, alimentação pós-atividade e descanso, sempre utilizando referências confiáveis."
    }
};

document.querySelectorAll("[data-modal]").forEach(button => {
    button.addEventListener("click", () => {
        const data = modalData[button.dataset.modal];

        if (!data) return;

        modalTitle.textContent = data.title;
        modalText.textContent = data.text;
        modal.classList.add("show");
    });
});

function closeModal() {
    modal.classList.remove("show");
}

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
});


/* ==========================
   HIDRATAÇÃO
========================== */

let water = 0;
const waterGoal = 2000;

function updateWater() {
    document.getElementById("waterValue").textContent = water;

    const percent = Math.min((water / waterGoal) * 100, 100);
    document.getElementById("waterBar").style.width = percent + "%";
}

document.querySelectorAll(".water-add").forEach(button => {
    button.addEventListener("click", () => {
        water += Number(button.dataset.water);
        if (water > waterGoal) water = waterGoal;
        updateWater();
    });
});

document.getElementById("waterReset").addEventListener("click", () => {
    water = 0;
    updateWater();
});


/* ==========================
   RECUPERAÇÃO
========================== */

const recoveryChecks = document.querySelectorAll(".recovery-check");
const recoveryScore = document.getElementById("recoveryScore");

recoveryChecks.forEach(check => {
    check.addEventListener("change", () => {
        const total = [...recoveryChecks].filter(item => item.checked).length;
        recoveryScore.textContent = total;
    });
});


/* ==========================
   MAPA CORPORAL
========================== */

const bodyInfo = document.getElementById("bodyInfo");

const bodyCare = {
    "Cabeça e pescoço": "Atenção à postura, preparação e sinais de desconforto. Em caso de sintomas, procure orientação profissional.",
    "Ombros": "A preparação adequada e o controle da carga de treino são importantes para o cuidado com a região.",
    "Joelhos": "Aquecimento, técnica e respeito aos limites individuais são aspectos importantes da prevenção.",
    "Tornozelos": "Mobilidade, preparação e atenção ao terreno podem fazer parte dos cuidados preventivos."
};

document.querySelectorAll(".body-part").forEach(button => {
    button.addEventListener("click", () => {
        const part = button.dataset.part;

        bodyInfo.innerHTML = `
            <strong>${part.toUpperCase()}</strong>
            <span>${bodyCare[part]}</span>
        `;
    });
});


/* ==========================
   CALCULADORA DE DESEMPENHO
========================== */

const calculateButton = document.getElementById("calculate");

calculateButton.addEventListener("click", function () {

    // Pegar os valores dos campos
    const ageInput = document.getElementById("age").value;
    const weightInput = document.getElementById("weight").value;
    const heightInput = document.getElementById("height").value;
    const activityInput = document.getElementById("activity").value;

    // Aceita ponto ou vírgula
    const age = parseFloat(ageInput.replace(",", "."));
    const weight = parseFloat(weightInput.replace(",", "."));
    const heightCm = parseFloat(heightInput.replace(",", "."));
    const activity = parseFloat(activityInput);

    const resultBox = document.getElementById("resultBox");

    // Verificação dos dados
    if (
        isNaN(age) ||
        isNaN(weight) ||
        isNaN(heightCm) ||
        age <= 0 ||
        weight <= 0 ||
        heightCm <= 0
    ) {

        resultBox.classList.add("show");

        document.getElementById("imcResult").textContent = "ERRO";
        document.getElementById("basalResult").textContent = "—";
        document.getElementById("dailyResult").textContent = "PREENCHA";

        return;
    }

    // Converter altura de centímetros para metros
    const heightM = heightCm / 100;

    // ==========================
    // CÁLCULO DO IMC
    // ==========================

    const imc = weight / (heightM * heightM);

    // ==========================
    // METABOLISMO BASAL
    // ==========================

    const basal =
        (10 * weight) +
        (6.25 * heightCm) -
        (5 * age) +
        5;

    // ==========================
    // GASTO DIÁRIO ESTIMADO
    // ==========================

    const daily = basal * activity;

    // ==========================
    // MOSTRAR RESULTADOS
    // ==========================

    document.getElementById("imcResult").textContent =
        imc.toFixed(1).replace(".", ",");

    document.getElementById("basalResult").textContent =
        Math.round(basal) + " kcal";

    document.getElementById("dailyResult").textContent =
        Math.round(daily) + " kcal";

    resultBox.classList.add("show");
});