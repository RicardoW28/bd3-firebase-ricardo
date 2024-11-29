import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp, collection, getDocs, deleteDoc, doc } from "firebase/firestore"; 

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "bd3-firebase-ricardo.firebaseapp.com",
    projectId: "bd3-firebase-ricardo",
    storageBucket: "bd3-firebase-ricardo.appspot.com",
    messagingSenderId: "985361419591",
    appId: "1:985361419591:web:b0b67bafb9adbc3cfc1062",
    measurementId: "G-MGKQLB289Z"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Selecionar a lista de alunos e o formulário
const studentList = document.querySelector('#student-list');
const form = document.querySelector('#add-student-form');

// Função para renderizar a lista de alunos
function renderList(doc) {
    let li = document.createElement('li');
    let nome = document.createElement('span');
    let dataNascimento = document.createElement('span');
    let categoria = document.createElement('span');
    let deleteBtn = document.createElement('button');

    nome.textContent = doc.data().nome;
    dataNascimento.textContent = doc.data().data_nascimento.toDate().toLocaleDateString(); // Formata a data
    categoria.textContent = doc.data().categoria;
    deleteBtn.textContent = 'Excluir';
    deleteBtn.setAttribute('data-id', doc.id);

    li.appendChild(nome);
    li.appendChild(dataNascimento);
    li.appendChild(categoria);
    li.appendChild(deleteBtn);

    studentList.appendChild(li);

    // Adiciona evento para excluir o registro
    deleteBtn.addEventListener('click', async (e) => {
        try {
            await deleteDoc(doc(db, 'BD3-NoSQL-Firestore', e.target.getAttribute('data-id')));
            li.remove(); // Remove o item da lista
            alert('Aluno excluído com sucesso!');
        } catch (error) {
            console.error("Erro ao excluir aluno: ", error);
            alert('Erro ao excluir aluno!');
        }
    });
}

// Função para carregar os alunos do Firestore
async function loadStudents() {
    try {
        const snapshot = await getDocs(collection(db, 'BD3-NoSQL-Firestore'));
        studentList.innerHTML = ''; // Limpa a lista atual antes de adicionar novos alunos
        snapshot.forEach(doc => {
            renderList(doc); // Renderiza cada documento
        });
    } catch (error) {
        console.error("Erro ao obter documentos: ", error);
        alert('Erro ao carregar os alunos!');
    }
}

// Carregar alunos ao iniciar a página
loadStudents();

// Função para adicionar aluno
async function addStudent(nome, dataNascimento, categoria) {
    try {
        await db.collection('BD3-NoSQL-Firestore').add({
            nome: nome,
            data_nascimento: Timestamp.fromDate(new Date(dataNascimento)), 
            categoria: categoria
        });
        console.log('Aluno adicionado com sucesso!');
        loadStudents(); // Recarrega a lista de alunos após adicionar um novo
    } catch (error) {
        console.error("Erro ao adicionar aluno: ", error);
        alert('Erro ao adicionar aluno!');
    }
}

// Evento de envio do formulário para adicionar aluno
form.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const nome = form['nome'].value;
    const dataNascimento = form['data_nascimento'].value;
    const categoria = form['categoria'].value;

    addStudent(nome, dataNascimento, categoria); 

    form.reset(); // Limpa os campos do formulário após adicionar
});
