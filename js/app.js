'use strict';

const opendialog = () =>
	document.getElementById('dialog').classList.add('active');

const closedialog = () => {
	clearFields();
	document.getElementById('dialog').classList.remove('active');
};

const getLocalStorage = () =>
	JSON.parse(localStorage.getItem('db_contacts')) ?? [];
const setLocalStorage = (dbClient) =>
	localStorage.setItem('db_contacts', JSON.stringify(dbClient));

// CRUD - create read update delete
const deleteClient = (index) => {
	const dbClient = readClient();
	dbClient.splice(index, 1);
	setLocalStorage(dbClient);
};

const updateClient = (index, client) => {
	const dbClient = readClient();
	dbClient[index] = client;
	setLocalStorage(dbClient);
};

const readClient = () => getLocalStorage();

const createClient = (client) => {
	const dbClient = getLocalStorage();
	dbClient.push(client);
	setLocalStorage(dbClient);
};

const isValidFields = () => {
	return document.getElementById('form').reportValidity();
};

//Interação com o layout

const clearFields = () => {
	const fields = document.querySelectorAll('.dialog-field');
	fields.forEach((field) => (field.value = ''));
	document.getElementById('nome').dataset.index = 'new';
	document.querySelector('.dialog-header>h2').textContent = 'Novo Contato';
};

const saveClient = () => {
	if (isValidFields()) {
		const client = {
			nome: document.getElementById('nome').value,
			email: document.getElementById('email').value,
			celular: document.getElementById('celular').value,
		};
		const index = document.getElementById('nome').dataset.index;
		if (index == 'new') {
			createClient(client);
			updateTable();
			closedialog();
		} else {
			updateClient(index, client);
			updateTable();
			closedialog();
		}
	}
};

const createRow = (client, index) => {
	const newRow = document.createElement('tr');
	newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `;
	document.querySelector('#tableClient>tbody').appendChild(newRow);
};

const clearTable = () => {
	const rows = document.querySelectorAll('#tableClient>tbody tr');
	rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
	const dbClient = readClient();
	clearTable();
	dbClient.forEach(createRow);
};

const fillFields = (client) => {
	document.getElementById('nome').value = client.nome;
	document.getElementById('email').value = client.email;
	document.getElementById('celular').value = client.celular;
	document.getElementById('nome').dataset.index = client.index;
};

const editClient = (index) => {
	const client = readClient()[index];
	client.index = index;
	fillFields(client);
	document.querySelector(
		'.dialog-header>h2'
	).textContent = `Editando ${client.nome}`;
	opendialog();
};

const editDelete = (event) => {
	if (event.target.type == 'button') {
		const [action, index] = event.target.id.split('-');

		if (action == 'edit') {
			editClient(index);
		} else {
			const client = readClient()[index];
			const response = confirm(
				`Deseja realmente excluir o contato ${client.nome}`
			);
			if (response) {
				deleteClient(index);
				updateTable();
			}
		}
	}
};

updateTable();

// Eventos
document
	.getElementById('cadastrarContato')
	.addEventListener('click', opendialog);

document.getElementById('dialogClose').addEventListener('click', closedialog);

document.getElementById('salvar').addEventListener('click', saveClient);

document
	.querySelector('#tableClient>tbody')
	.addEventListener('click', editDelete);

document.getElementById('cancelar').addEventListener('click', closedialog);
