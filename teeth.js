// 🔥 FIREBASE
import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
// 📦 ГЛОБАЛ
let total = 0;
const totalSpan = document.getElementById("total");

// 👤 ПАЦИЕНТ ЖҮКТӨӨ
async function loadPatients() {
  const snapshot = await getDocs(collection(db, "patients"));
  const select = document.getElementById("patient");

  select.innerHTML = "";

  snapshot.forEach(docSnap => {
    const d = docSnap.data();
    const option = document.createElement("option");
    option.value = d.name;
    option.innerText = d.name;
    select.appendChild(option);
  });
}

// 🦷 ТИШТЕРДИ ЖАСОО
function createTeeth() {
  const top = document.getElementById("topTeeth");
  const bottom = document.getElementById("bottomTeeth");

  top.innerHTML = "";
  bottom.innerHTML = "";

  for (let i = 1; i <= 16; i++) {
    const el = createTooth(i);
    top.appendChild(el);
  }

  for (let i = 17; i <= 32; i++) {
    const el = createTooth(i);
    bottom.appendChild(el);
  }
}

// 🦷 БИР ТИШ
function createTooth(num) {
  const el = document.createElement("div");

  el.className = "tooth";

  el.innerHTML = "🦷";

  el.onclick = () => handleTooth(num, el);

  return el;
}

// 🦷 ТИШ БАСЫЛДЫ
async function handleTooth(tooth, el) {

  const price = parseInt(
    document.getElementById("action").value
  );

  const patient =
    document.getElementById("patient").value;

  const actionText =
    document.getElementById("action")
    .selectedOptions[0].text;

  // 🎨 ТИШТИ ӨЗГӨРТҮҮ
  if(actionText.includes("Удалить")){
    el.innerHTML = "❌";
    el.className = "tooth deleted";
  }
  else if(actionText.includes("Коронка")){
    el.innerHTML = "👑";
    el.className = "tooth crown";
  }
  else if(actionText.includes("Пломба")){
    el.innerHTML = "🟢";
    el.className = "tooth filling";
  }
  else if(actionText.includes("Брекет")){
    el.innerHTML = "🔩";
    el.className = "tooth bracket";
  }

  // Эски жазууну өчүрүү
  const q = query(
    collection(db, "teeth"),
    where("patient", "==", patient),
    where("tooth", "==", tooth)
  );

  const oldDocs = await getDocs(q);

  for (const item of oldDocs.docs) {
    await deleteDoc(doc(db, "teeth", item.id));
  }

  // Жаңы сактоо
  await addDoc(collection(db, "teeth"), {
    tooth,
    action: actionText,
    price,
    patient,
    date: new Date()
  });

  await loadIncome();
}

// 💰 ПАЦИЕНТ БОЮНЧА СУММА
async function loadIncome() {

  const patient =
    document.getElementById("patient").value;

  const snapshot =
    await getDocs(collection(db, "teeth"));

  let total = 0;

  snapshot.forEach(docSnap => {

    const d = docSnap.data();

    if (d.patient === patient) {
      total += Number(d.price || 0);
    }

  });

  document.getElementById("total").innerText = total;
}
// 🎨 БАЗАДАН БОЁО
async function paintTeethFromDB() {
  const snapshot = await getDocs(collection(db, "teeth"));

  snapshot.forEach(docSnap => {

    const d = docSnap.data();
    const actionText = d.action || "";

    const el = document.querySelectorAll(".tooth")[d.tooth - 1];

    if (!el) return;

    el.classList.remove(
      "deleted",
      "crown",
      "filling",
      "canal",
      "bracket"
    );

    if (actionText.includes("Удалить")) {
      el.innerHTML = "❌";
    }
    else if (actionText.includes("Коронка")) {
      el.innerHTML = "👑";
    }
    else if (actionText.includes("Пломба")) {
      el.innerHTML = "🟢";
    }
    else if (actionText.includes("Канал")) {
      el.innerHTML = "🦷";
    }
    else if (actionText.includes("Брекет")) {
      el.innerHTML = "🔩";
    }

  });
}

// 📄 PDF
async function downloadPDF() {

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const patient = document.getElementById("patient").value;

  pdf.setFontSize(18);
  pdf.text("DENTAL CLINIC", 65, 15);

  let y = 30;

  pdf.setFontSize(12);
  pdf.text("Patient: " + patient, 10, y);

  y += 10;

  pdf.text(
    "Date: " +
    new Date().toLocaleDateString(),
    10,
    y
  );

  y += 15;

  pdf.setFontSize(14);
  pdf.text("Treatment Plan", 10, y);

  y += 10;

  const snapshot = await getDocs(
    collection(db, "teeth")
  );

  let totalSum = 0;
  let count = 1;

  snapshot.forEach(docSnap => {

    const d = docSnap.data();

    if (d.patient !== patient) return;

    const line =
      count +
      ". Tooth " +
      d.tooth +
      " - " +
      d.action +
      " - " +
      d.price +
      " som";

    pdf.text(line, 10, y);

    y += 8;

    totalSum += Number(d.price || 0);

    count++;
  });

  y += 10;

  pdf.setFontSize(14);

  pdf.text(
    "Total: " + totalSum + " som",
    10,
    y
  );

  y += 20;

  pdf.setFontSize(12);

  pdf.text(
    "Doctor Signature: ____",
    10,
    y
  );

  pdf.save(
    patient + "_Dental_Report.pdf"
  );
}

// 🗑️ DELETE
async function deleteLast() {
  const snapshot = await getDocs(collection(db, "teeth"));

  let lastId = null;

  snapshot.forEach(docSnap => {
    lastId = docSnap.id;
  });

  if (lastId) {
    await deleteDoc(doc(db, "teeth", lastId));
    alert("Өчүрүлдү");
    location.reload();
  }
}

// 📊 ГРАФИК
async function drawChart() {
  const snapshot = await getDocs(collection(db, "teeth"));

  const map = {};

  snapshot.forEach(docSnap => {
    const d = docSnap.data();

    const date = d.date
      ? new Date(d.date.seconds * 1000).toLocaleDateString()
      : "Unknown";

    if (!map[date]) map[date] = 0;

    map[date] += d.price;
  });

  const labels = Object.keys(map);
  const data = Object.values(map);

  const ctx = document.getElementById("incomeChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Доход",
        data: data
      }]
    }
  });
}

// 🔄 АВТО ОБНОВЛЕНИЕ
document.getElementById("patient").onchange = () => {
  loadIncome();
};

// 🚀 СТАРТ
loadPatients();
createTeeth();
loadIncome();
// paintTeethFromDB();
drawChart();
window.downloadPDF = downloadPDF;
window.deleteLast = deleteLast;