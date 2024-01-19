// action Constants
const INC = "increment",
    DEC = "decrement",
    UPDATE = "update_state",
    RESET = "reset_state",
    DELETE = "delete_state";

// Initial state - no change here
const initialState = [
    {
        id: 0,
        value: 0,
    },
];

// action creators
const increment = (value, id) => {
    return {
        type: INC,
        id: id,
        payload: parseInt(value),
    };
};

const decrement = (value, id) => {
    return {
        type: DEC,
        id: id,
        payload: parseInt(value),
    };
};

const updateState = (newMatchState) => {
    return {
        type: UPDATE,
        id: null,
        payload: newMatchState,
    };
};

const resetState = () => {
    return {
        type: RESET,
        id: null,
        payload: 0,
    };
};

const deleteState = (id) => {
    return {
        type: DELETE,
        id: id,
        payload: null,
    };
};

// reducer function - returns a new state

function scoreReducer(state = initialState, action) {
    if (action.type === INC) {
        for (let i = 0; i < state.length; i++) {
            if (state[i].id === action.id) {
                const copyState = JSON.parse(JSON.stringify(state));
                copyState[i].value = state[i].value + action.payload;
                return copyState;
            }
        }
    } else if (action.type === DEC) {
        for (let i = 0; i < state.length; i++) {
            if (state[i].id === action.id) {
                const copyState = JSON.parse(JSON.stringify(state));
                const decValue = state[i].value - action.payload;

                copyState[i].value = decValue >= 0 ? decValue : 0;
                return copyState;
            }
        }
    } else if (action.type === UPDATE) {
        const copyState = JSON.parse(JSON.stringify(state));
        copyState.push(action.payload);
        return copyState;
    } else if (action.type === RESET) {
        const copyState = JSON.parse(JSON.stringify(state));
        for (let i = 0; i < copyState.length; i++) {
            copyState[i].value = action.payload;
        }
        return copyState
    } else if (action.type === DELETE) {
        let copyState = JSON.parse(JSON.stringify(state));
        copyState = copyState.filter((item) => item.id !== action.id);
        console.log(copyState);
        return copyState;
    } else {
        return state;
    }
}

// creat redux store
const store = Redux.createStore(scoreReducer);
const render = () => {
    const currentState = store.getState();
    for (let i = 0; i < currentState?.length; i++) {
        const addElement = document.getElementById(`res-${currentState[i].id}`);
        addElement.innerText = currentState[i].value;
    }
};
render();
store.subscribe(render);

// action dispatch,s
function incrementFn(element) {
    if (event.key === "Enter") {
        const elementStringId = element.id;
        const elementId = parseInt(elementStringId[elementStringId.length - 1]);
        element.value ? store.dispatch(increment(element.value, elementId)) : null;
        element.value = "";
        
    }
}

function decrementFn(element) {
    if (event.key === "Enter") {
        const elementStringId = element.id;
        const elementId = parseInt(elementStringId[elementStringId.length - 1]);

        store.dispatch(decrement(element.value, elementId));
        element.value = "";
    }
}

// delete single match
function deleteMatchFn(id) {
    const singleContainer = document.getElementById(id);
    const allMatchContainer = document.getElementById("all-matches");
    if (allMatchContainer && singleContainer) {
        store.dispatch(deleteState(parseInt(id)));
        allMatchContainer.removeChild(singleContainer);
    }
}

// reset value function

function resetAll() {
    store.dispatch(resetState())
}

// adding new  another match function
let i = 1;
function addAnotherMatch() {
    const allMatchesContainer = document.getElementById("all-matches");

    var newSingleMatch = `<div id= ${i} class="match">
    <div class="wrapper">
        <button onclick="deleteMatchFn(${i})" class="lws-delete">
            <img src="./image/delete.svg" alt="" />
        </button>
        <h3 class="lws-matchName">Match ${i + 1}</h3>
    </div>
    <div class="inc-dec">
        <form  onsubmit="return formValidation()" class="incrementForm">
            <h4>Increment</h4>
            <input
                onkeydown="incrementFn(this) "
                id= inc${i}
                type="number"
                name="increment"
                class="lws-increment"
            />
        </form>
        <form  onsubmit="return formValidation()" class="decrementForm">
            <h4>Decrement</h4>
            <input
                onkeydown="decrementFn(this)"
                id = dec-${i}
                type="number"
                name="decrement"
                class="lws-decrement"
            />
        </form>
    </div>
    <div  class="numbers">
        <h2 id=res-${i} class="lws-singleResult"></h2>
    </div>
</div>`;

    allMatchesContainer.insertAdjacentHTML("beforeend", newSingleMatch);

    const newMatchState = {
        id: i,
        value: 0,
    };
    i++;
    
    store.dispatch(updateState(newMatchState));
    // increging i++------
}

// form  validation control

function formValidation() {
    return false;
}
