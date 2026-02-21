const categoryModal = document.getElementById('categoryModal');
const deleteModal = document.getElementById('deleteModal');
const categoryForm = document.getElementById('categoryForm');
const modalInput = document.querySelector('.modalInput');
const modalTitle = document.getElementById('modalTitle');
const tableBody = document.getElementById('categoryTableBody');
const createBtn = document.querySelector('.create-btn');
const confirmDeleteBtn = document.getElementById('confirmDelete');

let editingRow = null; 
let rowToDelete = null; 

// --- CREATE MODALINI AÇ ---
createBtn.onclick = () => {
    editingRow = null;
    modalTitle.innerText = "Create New Category";
    modalInput.value = "";
    categoryModal.showModal();
};

// --- TABLE ÜZƏRİNDƏ KLİKLƏR (EDIT & DELETE) ---
tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;

    // DELETE MODALI
    if (e.target.classList.contains('delete-btn')) {
        rowToDelete = row;
        deleteModal.showModal();
    }

    // EDIT MODALI
    if (e.target.classList.contains('edit-btn')) {
        editingRow = row;
        modalTitle.innerText = "Edit Category";
        modalInput.value = row.cells[1].innerText;
        categoryModal.showModal();
    }
});

// --- SİLMƏNİ TƏSDİQLƏ ---
confirmDeleteBtn.onclick = () => {
    if (rowToDelete) {
        // Gələcəkdə burada API istəyi olacaq: const id = rowToDelete.cells[0].innerText;
        rowToDelete.remove();
        rowToDelete = null;
        deleteModal.close();
    }
};

// --- FORM SUBMIT (CREATE & UPDATE) ---
categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = modalInput.value.trim();
    if (!value) return;

    if (editingRow) {
        // Redaktə rejimi
        editingRow.cells[1].innerText = value;
    } else {
        // Yeni yaratma rejimi
        const newId = tableBody.rows.length + 1;
        const newRow = `
            <tr>
                <th scope="row">${newId}</th>
                <td>${value}</td>
                <td class="operation">
                    <i class="fa-solid fa-pen-to-square edit-btn"></i>
                    <i class="fa-solid fa-trash delete-btn"></i>
                </td>
            </tr>`;
        tableBody.insertAdjacentHTML('beforeend', newRow);
    }

    categoryModal.close();
});