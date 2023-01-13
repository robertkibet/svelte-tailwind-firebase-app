<script lang="ts">
	import { initializeApp, type FirebaseApp } from 'firebase/app';
	import {
		addDoc,
		collection,
		doc,
		Firestore,
		getFirestore,
		onSnapshot,
		setDoc
	} from 'firebase/firestore';

	import { Check, Trash } from 'svelte-heros-v2';
	import type { Todo } from '$lib/types';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import { firebaseConfig } from '$lib/firebaseConfig';

	let firebaseApp: FirebaseApp;
	let db: Firestore;
	let todos: Todo[] = [];
	let task = '';
	let loading = true;

	if (browser) {
		firebaseApp = initializeApp(firebaseConfig);
		db = getFirestore(firebaseApp);

		const collectionRef = collection(db, 'SVELTE_TODO_DEMO');

		onSnapshot(collectionRef, (querySnapshot) => {
			loading = true;
			let firebaseTodos: Todo[] = [];
			querySnapshot.forEach((doc) => {
				const todo: Todo = { ...(doc.data() as Todo), id: doc.id };
				firebaseTodos = [todo, ...firebaseTodos];
			});

			loading = false;
			todos = firebaseTodos
				.filter((todo) => !todo.isDeleted)
				.filter((todo) => todo.task)
				.sort((a: Todo, b: Todo) => {
					if (a.createdAt > b.createdAt) return -1;
					if (a.createdAt < b.createdAt) return 1;
					return 0;
				});
		});
	}

	const addTodo = async () => {
		const todo: Todo = {
			id: crypto.randomUUID(),
			task: task,
			isComplete: false,
			createdAt: new Date(),
			isDeleted: false
		};
		// check if todo exists
		if (task === '') return;

		const exists = todos.find(
			(todo) =>
				todo.task.toLocaleLowerCase().trim() === task.toLocaleLowerCase().trim() && !todo.isDeleted
		);
		if (exists) return;

		// add todo to firebase
		await addDoc(collection(db, 'SVELTE_TODO_DEMO'), todo);

		// clear input
		task = '';
	};

	const markAsComplete = (id: string) => {
		const todo = todos.find((todo) => todo.id === id);
		if (!todo) return;

		todo.isComplete = !todo.isComplete;

		setDoc(doc(db, 'SVELTE_TODO_DEMO', id), todo);
	};

	const removeTodo = (id: string) => {
		const todo = todos.find((todo) => todo.id === id);
		if (!todo) return;

		setDoc(doc(db, 'SVELTE_TODO_DEMO', id), { ...todo, isDeleted: true, isComplete: true });
	};

	onMount(() => {
		const input = document.querySelector('input');
		if (!input) return;

		const toggleInputEnterKey = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				addTodo();
			}
		};
		input.addEventListener('keyup', toggleInputEnterKey);

		return () => {
			input.removeEventListener('keyup', toggleInputEnterKey);
		};
	});
</script>

{#if browser}
	<div class="flex justify-center">
		<div class="max-w-7xl w-full bg-white shadow-md rounded-md px-4 py-2.5 pb-10 min-h-[300px]">
			<div class="flex flex-row justify-between items-center gap-2">
				<input
					data-todos="todo-input"
					type="text"
					placeholder="Add a task"
					bind:value={task}
					class="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none
        "
				/>
				<button
					data-todos="add-todo"
					on:click={addTodo}
					class="inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs min-w-fit leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
					>Add Todo</button
				>
			</div>

			<div>
				{#if loading}
					<div class="flex justify-center items-center h-12">
						<div
							class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-6 w-6 mb-4"
						/>
					</div>
				{:else if todos.length > 0}
					<div class="flex flex-col gap-2" data-todos="todos">
						<!-- loop through todos -->
						<h5 class="text-center font-bold text-lg pt-2 pb-2">Tasks</h5>

						{#each todos as todo}
							<div
								class="flex flex-row justify-between border-b-orange-300 border-b-2 p-2 h-12 border-r-2 cursor-pointer hover:drop-shadow-lg hover:bg-gray-100
                        {todo.isComplete ? 'complete' : ''}"
								data-todos="todo-item"
							>
								<span data-todos="task">{todo.task}</span>
								<span class="flex flex-row justify-between gap-4">
									<!-- if iscompleted -->
									{#if !todo.isComplete}
										<button
											type="button"
											title="Mark as complete"
											on:click={() => markAsComplete(todo.id)}
											class="flex justify-center items-center rounded-full w-8 h-8 shadow-md hover:shadow-lg hover:border-green-700 hover:border-2 focus:shadow-lg focus:outline-none active:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
										>
											<Check variation="outline" class="outline-none" />
										</button>
									{/if}
									<button
										type="button"
										on:click={() => removeTodo(todo.id)}
										title="Remove task"
										class="flex justify-center items-center rounded-full w-8 h-8 shadow-md hover:shadow-lg hover:border-red-700 hover:border-2 focus:shadow-lg focus:outline-none active:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
									>
										<Trash variation="outline" class="outline-none" />
									</button>
								</span>
							</div>
						{/each}
					</div>
				{:else}
					<div class="flex flex-row justify-center">
						<h5>No tasks yet. Add a task to get started.</h5>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<style>
		.complete {
			text-decoration: line-through;
		}
	</style>
{/if}
