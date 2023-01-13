<script>
	import '../app.css';
</script>

<nav class="flex justify-between">
	<a
		href="/"
		class="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900"
		>TODO App</a
	>
	<a
		href="/about"
		class="font-medium px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900"
		>Learn more</a
	>
</nav>

<slot />
