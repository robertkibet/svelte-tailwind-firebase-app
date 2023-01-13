<script lang="ts">
	import { Check, Trash } from 'svelte-heros-v2';
	import type { Todo } from '$lib/types';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let todos: Todo[] = [];
	let task = '';

	const addTodo = () => {
		const todo: Todo = {
			id: crypto.randomUUID(),
			task: task,
			isComplete: false,
			createdAt: new Date()
		};
		// check if todo exists
		if (task === '') return;

		const exists = todos.find(
			(todo) => todo.task.toLocaleLowerCase().trim() === task.toLocaleLowerCase().trim()
		);
		if (exists) return;

		todos = [todo, ...todos];
		// clear input
		task = '';
	};

	const markAsComplete = (id: string) => {
		todos = todos.map((todo) => {
			if (todo.id === id) {
				todo.isComplete = !todo.isComplete;
			}
			return todo;
		});
	};

	const removeTodo = (id: string) => {
		todos = todos.filter((todo) => todo.id !== id);
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

	$: console.table(todos);
</script>

{#if browser}
	<input
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
		on:click={addTodo}
		class="inline-block px-6 py-2.5 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
		>Button</button
	>

	<div>
		<!-- check todo length -->
		{#if todos.length > 0}
			<div class="flex flex-col gap-2">
				<!-- loop through todos -->
				<h5 class="text-center">Tasks</h5>

				{#each todos as todo}
					<div
						class="flex flex-row justify-between border-b-orange-300 border-b-2 p-2 h-12 border-r-2 cursor-pointer hover:drop-shadow-lg hover:bg-gray-100
                        {todo.isComplete ? 'complete' : ''}"
					>
						<span>{todo.task}</span>
						<span class="flex flex-row justify-between gap-4">
							<!-- if iscompleted -->
							{#if !todo.isComplete}
								<button
									type="button"
									on:click={() => markAsComplete(todo.id)}
									class="flex justify-center items-center rounded-full w-8 h-8 shadow-md hover:shadow-lg hover:border-green-700 hover:border-2 focus:shadow-lg focus:outline-none active:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
								>
									<Check variation="outline" class="outline-none" />
								</button>
							{/if}
							<button
								type="button"
								on:click={() => removeTodo(todo.id)}
								class="flex justify-center items-center rounded-full w-8 h-8 shadow-md hover:shadow-lg hover:border-green-700 hover:border-2 focus:shadow-lg focus:outline-none active:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
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

	<style>
		.complete {
			text-decoration: line-through;
		}
	</style>
{/if}
