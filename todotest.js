// Função para criar uma instância do modelo Todo
const createTodoModel = function () {
    return {
        state: {
            todoId: `${Math.round(Math.random()*10)}${Date.now()}`,
            items: [],
            text: ''
        },
        present: function (action, state) {
            // Lógica para evoluir o estado com base na ação
            switch (action.type) {
                case 'ADD_TODO':
                    const newItem = {
                        text: action.payload.text,
                        id: Date.now()
                    };
                    this.state.items.push(newItem);
                    this.state.text = '';
                    break;
                // Adicione outros casos conforme necessário
            }

            // Notificar a função de controle de estado para atualizar a representação
            state(this.state);
        }
    };
};

// Função para criar uma instância do controle de estado do Todo
const createTodoState = function (modelState, renderFunction, mountNode) {
    return function (modelState) {
        const stateRepresentation = TodoApp({ modelState });
        renderFunction(stateRepresentation, mountNode);
    };
};

const createTodoAdd = function (model, state) {
    intent(`addTodo${model.state.todoId}`, function (event) {
        event.preventDefault();
        const text = value(model.state.todoId);
        model.present({ type: 'ADD_TODO', payload: { text } }, state);
        return false;
    })
}

// Função para criar uma instância do TodoApp
const createTodoApp = function (mountNode) {
    return function () {
        // Criação de uma instância do modelo Todo
        const todoModel = createTodoModel();
        // Criação de uma instância da função de controle de estado do Todo
        const todoState = createTodoState(todoModel, render, mountNode);

        createTodoAdd(todoModel, todoState);

        // Inicialização do estado (pode ser usado para inicializar o estado se necessário)
        todoModel.present({ type: 'INIT' }, todoState);

        return {
            model: todoModel,
            state: todoState
        }
    };
};

// Função de Renderização Genérica
const render = function (stateRepresentation, mountNode) {
    const node = document.getElementById(mountNode);
    if (node) {
        node.innerHTML = stateRepresentation;
    }
};

// Função para criar a representação do componente TodoList
const TodoList = function ({ items, onclick }) {
    return `
        <ul>
            ${items.map(item => `<li key="${item.id}" ${(onclick) ? `onclick="${onclick}(${item.id})"` : ``}>${item.text}</li>`)}
        </ul>`;
};

let intent = function (i, f) {
    window[i || '_'] = f
}

// Função para criar a representação do componente TodoApp
const TodoApp = function ({ modelState }) {
    console.log("todoApp:", modelState)
    let addtriggerName = `addTodo${modelState.todoId}`
    return `
        <div>
            <h4>TODO</h4>
            <form onsubmit="${addtriggerName}(event)">
            <input id="${modelState.todoId}" value="${modelState.text}">
            <button>Add</button>
            </form>
            ${(modelState.items !== undefined)
            ? TodoList({ items: modelState.items })
            : `<h4>Lista vazia</h4>`
        }
        </div>`;
};

// Função auxiliar para obter o valor de um elemento pelo ID
const value = function (el) {
    console.log("el:", el)
    return document.getElementById(el).value;
};

// Criando instâncias independentes do TodoApp para elementos específicos
createTodoApp('app1')();
createTodoApp('app3')();
createTodoApp('app2')();
