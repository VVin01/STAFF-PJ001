// Staff Data (sample)
let staffData = [
  {
    id: "1",
    name: "John Doe",
    position: "CEO",
    branch: "Head Office",
    joinDate: "2020-01-01",
    contact: "09xxxx",
    photo: "https://i.ibb.co/G4QSW2Rv/IMG-0549.jpg",
    parentId: null
  },
  {
    id: "2",
    name: "Alice",
    position: "HR Manager",
    parentId: "1",
    photo: "",
    branch: "",
    contact: "",
    joinDate: ""
  },
  {
    id: "3",
    name: "Bob",
    position: "IT Manager",
    parentId: "1",
    photo: "",
    branch: "",
    contact: "",
    joinDate: ""
  }
];

function renderTree() {
  const container = document.getElementById('treeContainer');
  container.innerHTML = '';
  const rootNodes = staffData.filter(s => !s.parentId);
  const ul = document.createElement('ul');
  rootNodes.forEach(r => ul.appendChild(createNode(r)));
  container.appendChild(ul);
}

function createNode(staff) {
  const li = document.createElement('li');
  const node = document.createElement('div');
  node.className = 'node';
  node.onclick = () => openEditModal(staff.id);

  node.innerHTML = `
    <img src="${staff.photo || 'https://via.placeholder.com/60'}" />
    <span>${staff.name}</span>
    <small>${staff.position}</small>
  `;

  li.appendChild(node);

  const children = staffData.filter(s => s.parentId === staff.id);
  if (children.length > 0) {
    const ul = document.createElement('ul');
    children.forEach(child => ul.appendChild(createNode(child)));
    li.appendChild(ul);
  }

  return li;
}

function openCreateModal() {
  document.getElementById("staffForm").reset();
  document.getElementById("staffId").value = "";
  document.getElementById("staffModal").style.display = "block";
}

function openEditModal(id) {
  const staff = staffData.find(s => s.id === id);
  document.getElementById("staffId").value = staff.id;
  document.getElementById("name").value = staff.name;
  document.getElementById("position").value = staff.position;
  document.getElementById("branch").value = staff.branch || "";
  document.getElementById("joinDate").value = staff.joinDate || "";
  document.getElementById("contact").value = staff.contact || "";
  document.getElementById("photo").value = staff.photo || "";
  document.getElementById("parentId").value = staff.parentId || "";
  document.getElementById("staffModal").style.display = "block";
}

function closeModal() {
  document.getElementById("staffModal").style.display = "none";
}

document.getElementById("staffForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const id = document.getElementById("staffId").value;
  const newStaff = {
    id: id || Date.now().toString(),
    name: document.getElementById("name").value,
    position: document.getElementById("position").value,
    branch: document.getElementById("branch").value,
    joinDate: document.getElementById("joinDate").value,
    contact: document.getElementById("contact").value,
    photo: document.getElementById("photo").value,
    parentId: document.getElementById("parentId").value || null
  };

  if (id) {
    const index = staffData.findIndex(s => s.id === id);
    staffData[index] = newStaff;
  } else {
    staffData.push(newStaff);
  }

  closeModal();
  renderTree();
});

function deleteStaff() {
  const id = document.getElementById("staffId").value;
  if (!id) return;

  // Delete staff and its children recursively
  function deleteRecursive(staffId) {
    const index = staffData.findIndex(s => s.id === staffId);
    if (index !== -1) {
      const children = staffData.filter(s => s.parentId === staffId);
      children.forEach(child => deleteRecursive(child.id));
      staffData.splice(index, 1);
    }
  }

  deleteRecursive(id);
  closeModal();
  renderTree();
}

window.onload = renderTree;