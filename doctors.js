import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// коллекция
const doctorsRef = collection(db, "doctors");

// ➕ ДОБАВИТЬ ВРАЧА
window.addDoctor = async function () {
  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const birth = document.getElementById("birth").value;

  if (!name || !surname) {
    alert("Толтур!");
    return;
  }

  try {
    await addDoc(doctorsRef, {
      name,
      surname,
      birth
    });

    alert("Сакталды ✅");

    document.getElementById("name").value = "";
    document.getElementById("surname").value = "";
    document.getElementById("birth").value = "";

    loadDoctors();
  } catch (e) {
    console.error("Ката:", e);
    alert("Firebase иштеген жок ❌");
  }
};

// ❌ ВРАЧ ӨЧҮРҮҮ
window.deleteDoctor = async function(id){
  if(!confirm("Чын эле өчүрөсүзбү?")) return;

  await deleteDoc(doc(db, "doctors", id));

  alert("Өчүрүлдү ✅");

  loadDoctors();
};

// 📥 ЖҮКТӨӨ
async function loadDoctors() {
  const list = document.getElementById("list");

  if (!list) return;

  list.innerHTML = "";

  const snapshot = await getDocs(doctorsRef);

  snapshot.forEach(docSnap => {

    const d = docSnap.data();

    const div = document.createElement("div");

    div.style.background = "#1e293b";
    div.style.padding = "10px";
    div.style.margin = "10px";
    div.style.borderRadius = "10px";

    div.innerHTML = `
      <b>${d.name} ${d.surname}</b><br>
      📅 ${d.birth}<br><br>

      <button
        onclick="deleteDoctor('${docSnap.id}')"
        style="
          background:red;
          color:white;
          border:none;
          padding:6px 10px;
          border-radius:8px;
          cursor:pointer;
        ">
        ❌ Удалить
      </button>
    `;

    list.appendChild(div);

  });
}

// 🚀 старт
loadDoctors();