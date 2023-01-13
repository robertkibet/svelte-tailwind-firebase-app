<script>
	import '../app.css';
</script>

<!-- nav with border bottom -->
<nav class="flex justify-between border-b border-slate-200 pb-4">
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
