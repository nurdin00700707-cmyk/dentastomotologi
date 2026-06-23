import { db } from "../firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 💰 доход
async function loadIncome() {
  const snapshot = await getDocs(collection(db, "teeth"));

  let sum = 0;
  let days = {};

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  snapshot.forEach(docSnap => {
    const d = docSnap.data();

    sum += Number(d.price || 0);

    if (!d.date) return;

    const dateObj = new Date(d.date.seconds * 1000);

    // акыркы 7 күн гана
    if (dateObj < sevenDaysAgo) return;

    const date = dateObj.toLocaleDateString();

    if (!days[date]) days[date] = 0;

    days[date] += Number(d.price || 0);
  });

  document.getElementById("income").innerText = sum;

  drawChart(days);
}

// 📊 график
function drawChart(days){
  const ctx = document.getElementById("chart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(days),
      datasets: [{
        label: "Доход",
        data: Object.values(days)
      }]
    }
  });
}

// 👤 пациент
async function loadPatients() {
  const snapshot = await getDocs(collection(db, "patients"));
  document.getElementById("patients").innerText = snapshot.size;
}

// 👨‍⚕️ врач
async function loadDoctors() {
  const snapshot = await getDocs(collection(db, "doctors"));
  document.getElementById("doctors").innerText = snapshot.size;
}

// 🚀 старт
loadIncome();
loadPatients();
loadDoctors();