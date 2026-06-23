import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 📁 коллекциялар
const patientsRef = collection(db, "patients");
const doctorsRef = collection(db, "doctors");

// 🔽 ВРАЧТАРДЫ ЖҮКТӨӨ (dropdown)
async function loadDoctors() {
  const select = document.getElementById("doctor");
  if (!select) return;

  select.innerHTML = "";

  const snapshot = await getDocs(doctorsRef);

  snapshot.forEach(docSnap => {
    const d = docSnap.data();

    const option = document.createElement("option");
    option.value = d.name + " " + d.surname;
    option.textContent = d.name + " " + d.surname;

    select.appendChild(option);
  });
}

// ➕ ПАЦИЕНТ КОШУУ
window.addPatient = async function () {
  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const birth = document.getElementById("birth").value;
  const doctor = document.getElementById("doctor").value;

  if (!name || !surname) {
    alert("Толук толтур!");
    return;
  }

  await addDoc(patientsRef, {
    name,
    surname,
    birth,
    doctor,
    created: new Date()
  });

  alert("Сакталды ✅");

  // тазалоо
  document.getElementById("name").value = "";
  document.getElementById("surname").value = "";
  document.getElementById("birth").value = "";

  loadPatients();
};

// 📥 ПАЦИЕНТТЕРДИ ЧЫГАРУУ
async function loadPatients() {
  const list = document.getElementById("list");
  if (!list) return;

  list.innerHTML = "";

  const snapshot = await getDocs(patientsRef);

  snapshot.forEach(docSnap => {
    const d = docSnap.data();

    const div = document.createElement("div");
    div.style.background = "#1e293b";
    div.style.padding = "10px";
    div.style.margin = "10px";
    div.style.borderRadius = "10px";

    div.innerHTML = `
      <b>${d.name} ${d.surname}</b><br>
      📅 ${d.birth}<br>
      👨‍⚕️ Врач: ${d.doctor}<br>
      <button onclick="deletePatient('${docSnap.id}')">❌ Удалить</button>
    `;

    list.appendChild(div);
  });
}

// ❌ УДАЛИТЬ
window.deletePatient = async function (id) {
  await deleteDoc(doc(db, "patients", id));
  loadPatients();
}

document.getElementById("search").addEventListener("input", function () {
  const val = this.value.toLowerCase();
  const items = document.querySelectorAll("#list div");

  items.forEach(el => {
    el.style.display = el.innerText.toLowerCase().includes(val)
      ? "block"
      : "none";
  });
});

// 🚀 СТАРТ
loadDoctors();
loadPatients();