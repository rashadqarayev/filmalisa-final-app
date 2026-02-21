// Elementləri seçirik
const actorModal = document.getElementById('actorModal');
const deleteModal = document.getElementById('deleteModal');
const actorForm = document.getElementById('actorForm');
const modalTitle = document.getElementById('modalTitle');
const createBtn = document.querySelector('.create-btn');
const tableBody = document.getElementById('actorsTableBody');
const confirmDeleteBtn = document.getElementById('confirmDelete');

let rowToDelete = null; // Silinəcək sətri müvəqqəti yadda saxlamaq üçün

// --- MODAL AÇMA (CREATE) ---
createBtn.addEventListener('click', () => {
    modalTitle.innerText = "Create New Actor";
    actorForm.reset(); 
    document.getElementById('actorId').value = ""; // ID-ni sıfırla (Edit olmadığını bildirmək üçün)
    actorModal.showModal();
});

// --- CƏDVƏL ƏMƏLİYYATLARI (EDIT VƏ DELETE) ---
tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;

    // SİLMƏ MODALINI AÇ
    if (e.target.classList.contains('delete-btn')) {
        rowToDelete = row;
        deleteModal.showModal();
    }

    // REDAKTƏ MODALINI AÇ
    if (e.target.classList.contains('edit-btn')) {
        modalTitle.innerText = "Edit Actor";
        
        const id = row.cells[0].innerText;
        const name = row.cells[1].innerText;
        const surname = row.cells[2].innerText;
        const imgUrl = row.querySelector('img').src;

        document.getElementById('actorId').value = id;
        document.getElementById('actorName').value = name;
        document.getElementById('actorSurname').value = surname;
        document.getElementById('actorImage').value = imgUrl;

        actorModal.showModal();
    }
});

// --- SİLMƏNİ TƏSDİQLƏ ---
confirmDeleteBtn.addEventListener('click', () => {
    if (rowToDelete) {
        rowToDelete.remove();
        rowToDelete = null;
        deleteModal.close();
    }
});

// --- FORM SUBMIT (ADD / UPDATE) ---
actorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('actorId').value;
    const name = document.getElementById('actorName').value;
    const surname = document.getElementById('actorSurname').value;
    const imgUrl = document.getElementById('actorImage').value;

    if (id) {
        // Redaktə (Update) rejimi
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            if (row.cells[0].innerText === id) {
                row.cells[1].innerText = name;
                row.cells[2].innerText = surname;
                row.querySelector('img').src = imgUrl;
            }
        });
    } else {
        // Yeni əlavə etmək (Create) rejimi
        const newId = tableBody.rows.length + 1;
        const newRow = `
            <tr>
                <th scope="row">${newId}</th>
                <td>${name}</td>
                <td>${surname}</td>
                <td><img src="${imgUrl}" alt="actor" class="actor-image" /></td>
                <td class="operation">
                    <i class="fa-solid fa-pen-to-square edit-btn"></i>
                    <i class="fa-solid fa-trash delete-btn"></i>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', newRow);
    }

    actorModal.close();
});