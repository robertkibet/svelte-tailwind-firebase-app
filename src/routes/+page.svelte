<script lang="ts">
	import type { Todo } from '$lib/types';

	let todos: Todo[] = [];
	let task = '';

	const addTodo = () => {
		const todo: Todo = {
			id: todos.length + 1,
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

	$: console.table(todos);
</script>

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
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
        "
/>
<button
	on:click={addTodo}
	class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
	>Button</button
>

<!-- check todo length -->
{#if todos.length > 0}
	<ol class="list-decimal">
		<!-- loop through todos -->
		{#each todos as todo}
			<li class:complete={todo.isComplete}>{todo.task}</li>
		{/each}
	</ol>
{:else}
	<p>No todos</p>
{/if}

<style>
	.complete {
		text-decoration: line-through;
	}
</style>
